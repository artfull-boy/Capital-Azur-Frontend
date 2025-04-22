import { useAccount, useUpdateEffect, useI18n } from "@vactorynext/core/hooks"
import React, { useState } from "react"
import { drupal } from "@vactorynext/core/drupal"
import { normalizeNodes } from "./normalizer"
import {
	Container,
	Link,
	Wysiwyg,
	Pagination,
	LoadingOverlay,
	Icon,
	Input,
	Button,
	Heading,
} from "@/ui"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"

const SearchV2Results = ({
	items,
	items_found,
	itemsPerPage,
	q,
	page,
	internal_extra,
}) => {
	const [inputs, setInputs] = useState({
		keyword: q || "",
		posts: items || [],
		totalPosts: parseInt(items_found) || 0,
		pager: page || 1,
		isLoading: false,
	})

	const router = useRouter()
	const { profile } = useAccount()
	const locale = router.locale
	const { t } = useI18n()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			keyword: q || "",
		},
	})

	const onSubmit = (data) => {
		setInputs((prev) => ({
			...prev,
			pager: 1,
			keyword: data?.keyword || "",
		}))
	}

	const handlePageChange = (pid) => {
		setInputs((prev) => ({
			...prev,
			pager: pid,
		}))
	}

	const updateURLHistory = () => {
		// Update URL history.
		let url = `${internal_extra.translations[locale]}?page=:page&q=:keyword`
		url = url.replace(":itemsPerPage", itemsPerPage)
		url = url.replace(":page", inputs.pager)
		url = url.replace(":keyword", inputs.keyword)
		return url
	}

	// Shallow URL is used to update history URL.
	const [shallowUrl, setShallowUrl] = useState(updateURLHistory())

	const fetchData = async () => {
		const controller = new AbortController()
		setInputs((prev) => ({
			...prev,
			isLoading: true,
		}))

		try {
			const offset = (inputs.pager - 1) * itemsPerPage
			const response = await drupal.fetch(
				`${locale}/api/index/default_content_index?filter[langcode]=${locale}&page[limit]=${itemsPerPage}&page[offset]=${offset}&filter[fulltext]=${inputs.keyword}`,
				{
					withAuth: true,
					headers: {
						"X-Auth-Provider": profile?.provider,
					},
					signal: controller.signal,
				}
			)
			const data = await response.json()
			setInputs((prev) => ({
				...prev,
				posts: normalizeNodes(data?.data),
				totalPosts: data?.meta?.count || 0,
			}))

			// setPosts(data?.resources || [])
			// setTotalPosts(parseInt(data?.count) || 0)
		} catch (err) {
			console.error(err)
		} finally {
			// setIsLoading(false)
			setInputs((prev) => ({
				...prev,
				isLoading: false,
			}))
		}

		return () => controller.abort()
	}

	useUpdateEffect(() => {
		fetchData()
		setShallowUrl(updateURLHistory())
	}, [inputs.pager, inputs.keyword])

	// Update page url using shallow.
	useUpdateEffect(() => {
		window.history.pushState(null, null, shallowUrl)
	}, [shallowUrl])

	return (
		<Container>
			{/* <Heading level={2} variant={2} className="mb-5">
				{node.title}
			</Heading> */}
			<div>
				<form
					className="mx-auto mt-8 flex max-w-xl items-start"
					onSubmit={handleSubmit(onSubmit)}
				>
					<Input
						variant="search"
						{...register("keyword", { required: t("Nx:Keyword is required") })}
						prefix={
							<Icon id="search" className="h-4 w-4 text-gray active:text-gray"></Icon>
						}
						hasError={errors?.keyword}
						errorMessage={errors?.keyword?.message}
						placeholder={t("Nx:What are you searching for ?")}
					/>

					<Button type="submit" variant="primary" className="ml-2">
						{t("Nx:Submit")}
					</Button>
				</form>

				{inputs.totalPosts > 0 && (
					<p className="my-5 text-right">
						{t("Nx:Total results found")} {inputs.totalPosts}.
					</p>
				)}

				{inputs.keyword.length > 0 && inputs.totalPosts <= 0 && !inputs.isLoading && (
					<h2>{t("Nx:Aucun résultat n'a été trouvé !")}</h2>
				)}
			</div>
			<div className="my-10 flow-root">
				<LoadingOverlay active={inputs.isLoading} spinner={true}>
					<ul>
						{inputs.posts.map((post, index) => (
							<li
								key={index}
								className="mb-5 flex flex-col rounded-md p-5 shadow-md lg:flex-row lg:content-center lg:justify-between"
							>
								<div className="relative mb-2 focus-within:ring-2 focus-within:ring-primary-500">
									<Heading variant={5}>
										{/* Extend touch target to entire panel */}
										<span className="absolute inset-0" aria-hidden="true" />
										{post.title}
									</Heading>
									<Wysiwyg
										className="mt-1 line-clamp-2 text-base text-gray-600"
										html={post.excerpt}
									/>
								</div>
								{post.url && (
									<Link href={post.url || "#."} variant="permalink">
										{t("Nx:Lire plus")}
									</Link>
								)}
							</li>
						))}
					</ul>
				</LoadingOverlay>
			</div>

			{parseInt(inputs.totalPosts) > parseInt(itemsPerPage) && (
				<div className="px-4 pb-4 sm:px-6 lg:px-8 lg:pb-8">
					<Pagination
						baseUrl={shallowUrl.replace(/page=\d+/, "page={page}")}
						pageSize={itemsPerPage}
						current={inputs.pager}
						total={inputs.totalPosts}
						onChange={(page) => handlePageChange(page)}
						id="search-v2-pagination"
					/>
				</div>
			)}
		</Container>
	)
}

export async function getServerSideProps(data, context) {
	const { session, locale } = data.props
	const { q, pager = 1 } = context.query

	let items = []
	let items_found = 0
	const itemsPerPage = 10
	if (q) {
		try {
			const offset = (pager - 1) * itemsPerPage
			const response = await drupal.fetch(
				`${locale}/api/index/default_content_index?filter[langcode]=${locale}&page[limit]=${itemsPerPage}&page[offset]=${offset}&filter[fulltext]=${q}`,
				{
					withAuth: () => (session?.accessToken ? `Bearer ${session.accessToken}` : ""),
					headers: {
						"X-Auth-Provider": session?.provider || "",
					},
				}
			)
			const data = await response.json()
			items = normalizeNodes(data?.data)
			items_found = data?.meta?.count || 0
		} catch (error) {
			console.error("[search]", error)
			// Do nothing.
		}
	}

	data.props.items = items
	data.props.items_found = items_found
	data.props.itemsPerPage = itemsPerPage
	data.props.q = q || ""
	data.props.page = pager

	return data
}

export default SearchV2Results
