import { useAccount, useUpdateEffect, useI18n } from "@vactorynext/core/hooks"
import React, { useState, useEffect, useRef } from "react"
import { drupal } from "@vactorynext/core/drupal"
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

const SearchResults = ({ items, items_found, itemsPerPage, q, page, internal_extra }) => {
	const router = useRouter()
	const locale = router.locale

	const scrollRefPagination = useRef()

	const [inputs, setInputs] = useState({
		keyword: q || "",
		posts: items || [],
		totalPosts: parseInt(items_found) || 0,
		pager: page || 1,
		isLoading: false,
		currentQueryFromUrl: router.query.q,
	})

	// To handle re-searching from SearchOverlay while you are in Search Results page
	const [inputValue, setInputValue] = useState(router.query.q)
	// To handle re-searching from SearchOverlay while you are in Search Results page
	useEffect(() => {
		if (inputs.currentQueryFromUrl !== router.query.q) {
			setInputs((prev) => ({ ...prev, keyword: router.query.q, pager: 1 }))
			setInputValue(router.query.q)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.q, q])

	const { profile } = useAccount()
	const { t } = useI18n()
	/* const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			keyword: q || "",
		},
	}) */

	const onSubmit = (e) => {
		e.preventDefault()
		setInputs((prev) => ({
			...prev,
			pager: 1,
			keyword: inputValue || "",
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
			const response = await drupal.fetch(
				`${locale}/api/search?pager=${inputs.pager}&q=${inputs.keyword}`,
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
				posts: data?.resources || [],
				totalPosts: parseInt(data?.count) || 0,
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
		router.push(shallowUrl, undefined, { shallow: true })
	}, [shallowUrl])

	return (
		<div ref={scrollRefPagination}>
			<Container>
				<form className="mt-8 flex max-w-xl items-start">
					<Input
						variant="search"
						className=" h-12 w-full border border-gray-300 bg-white px-4 py-7"
						hasError={inputValue?.length === 0}
						errorMessage={t("Keyword is required")}
						placeholder={t("Insights")}
						onChange={(e) => setInputValue(e.target.value)}
						value={inputValue}
					/>

					<Button
						type="submit"
						variant="primary"
						className="ml-2 h-12 px-6 py-7 font-bold uppercase"
						onClick={(e) => onSubmit(e)}
					>
						{t("Submit")}
					</Button>
				</form>

				{inputs.totalPosts > 0 && (
					<p className="my-5 text-right">
						{t("Total results found")} {inputs.totalPosts}.
					</p>
				)}

				{inputs?.keyword?.length > 0 && inputs.totalPosts <= 0 && !inputs.isLoading && (
					<h2>{t("Aucun résultat n'a été trouvé !")}</h2>
				)}

				<div className="my-10 flow-root">
					<LoadingOverlay active={inputs.isLoading} spinner={true}>
						<ul>
							{inputs.posts.map((post) => (
								<li
									key={post.url}
									className="group mb-5 flex cursor-pointer flex-col gap-5 rounded-md  bg-white p-5 lg:flex-row lg:content-center lg:items-center lg:justify-between lg:px-6 lg:py-8"
								>
									<Link href={post.url}>
										<div className="relative mb-2 focus-within:ring-2 focus-within:ring-primary-500">
											<Heading
												variant={5}
												className="transition-all duration-300 ease-in-out group-hover:text-primary"
											>
												{/* Extend touch target to entire panel */}
												<span className="absolute inset-0" aria-hidden="true" />
												{post.title}
											</Heading>
											{/* <Wysiwyg
											className="mt-1 line-clamp-2 text-base text-gray-600"
											html={post.excerpt}
										/> */}
										</div>
										<Link href={post.url} variant="permalink" className="shrink-0">
											{t("Lire plus")}
										</Link>
									</Link>
								</li>
							))}
						</ul>
					</LoadingOverlay>
				</div>

				{parseInt(inputs.totalPosts) > parseInt(itemsPerPage) && (
					<div className="px-4 pb-4 sm:px-6 lg:px-8 lg:pb-8">
						<Pagination
							baseUrl={shallowUrl.replace(/page=\d+/, "page={page}")}
							contentRef={scrollRefPagination}
							pageSize={itemsPerPage}
							current={inputs.pager}
							total={inputs.totalPosts}
							onChange={(page) => handlePageChange(page)}
							id="search-results-pagination"
						/>
					</div>
				)}
			</Container>
		</div>
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
			const response = await drupal.fetch(`${locale}/api/search?pager=${pager}&q=${q}`, {
				withAuth: () => (session?.accessToken ? `Bearer ${session.accessToken}` : ""),
				headers: {
					"X-Auth-Provider": session?.provider || "",
				},
			})
			const data = await response.json()
			items = data?.resources || []
			items_found = data?.count || 0
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

export default SearchResults
