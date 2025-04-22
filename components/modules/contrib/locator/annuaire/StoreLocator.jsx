import {
	Container,
	Link,
	Wysiwyg,
	Pagination,
	LoadingOverlay,
	Button,
	AutocompleteApi,
	Text,
} from "@/ui"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

import { drupal } from "@vactorynext/core/drupal"
import { useAccount, useUpdateEffect, useI18n } from "@vactorynext/core/hooks"
import { query } from "@vactorynext/core/lib"
import { vclsx } from "@vactorynext/core/utils"

import GmapStore from "../Gmap/Gmap-locator"
import { config } from "../CategoriesList"
import CategoryFilter from "./CategoryFilter"
import LocatorBoxSeo, { LocatorBoxSeoInit } from "./LocatorBoxSeo"

const StoreLocator = ({
	items,
	items_found,
	itemsPerPage,
	category,
	categories,
	page,
	locality,
	internal_extra,
	initialGrouping,
}) => {
	const [inputs, setInputs] = useState({
		category: category || "",
		locality: locality || "",
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
		control,
		formState: { errors },
	} = useForm({
		defaultValues: {
			category: category || "",
			locality: locality || "",
		},
	})

	const onSubmit = (data) => {
		setInputs((prev) => ({
			...prev,
			pager: 1,
			category: data?.category || "",
			locality: data?.locality || "",
		}))
		// setPager(1)
		// setKeyword(data?.keyword || "")
	}

	const handlePageChange = (pid) => {
		// setPager(pid)
		setInputs((prev) => ({
			...prev,
			pager: pid,
			// keyword: data?.keyword || ""
		}))
	}

	const updateURLHistory = () => {
		// Update URL history.
		let url = `${window.location.origin}${internal_extra.translations[locale]}?pager=:pager`

		url = enhanceUrl(url)
		url = url.replace(":pager", inputs.pager)
		// url = url.replace(":category", inputs.category)
		// url = url.replace(":locality", inputs.locality)
		window.history.pushState(null, null, url)
	}

	const enhanceUrl = (url) => {
		if (inputs.category) {
			url = `${url}&category=${inputs.category}`
		}
		if (inputs.locality) {
			url = `${url}&locality=${inputs.locality}`
		}
		return url
	}

	const fetchData = async () => {
		const controller = new AbortController()
		// setIsLoading(true)
		setInputs((prev) => ({
			...prev,
			isLoading: true,
		}))

		try {
			let endpoint = `${locale}/api/store-locator?pager=${inputs.pager}`
			endpoint = enhanceUrl(endpoint)
			const response = await drupal.fetch(`${endpoint}`, {
				withAuth: true,
				headers: {
					"X-Auth-Provider": profile?.provider,
				},
				signal: controller.signal,
			})
			const data = await response.json()
			setInputs((prev) => ({
				...prev,
				posts: data?.resources || [],
				totalPosts: parseInt(data?.count) || 0,
				isLoading: false,
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
		updateURLHistory()
	}, [inputs.pager, inputs.category, inputs.locality])

	return (
		<Container>
			<LoadingOverlay active={inputs.isLoading} spinner={true}>
				<div className="flex flex-col-reverse border border-gray-50 md:max-h-[800px] md:flex-row">
					<div className="flex flex-col gap-3 py-4 md:max-w-sm">
						<form className="flex flex-col gap-2 px-4" onSubmit={handleSubmit(onSubmit)}>
							<CategoryFilter
								{...register("category", {})}
								categories={categories}
								control={control}
							/>

							<AutocompleteApi
								{...register("locality", {})}
								endpoint={`${locale}/api/cities.json`}
								hasError={errors?.locality}
								control={control}
								queryName="city"
								defaultValue={inputs.locality}
								errorMessage={errors?.locality?.message}
								label={t("Nx:locality")}
							/>

							<Button type="submit" variant="primary" className="justify-center">
								{t("Nx:Submit")}
							</Button>
						</form>
						<div>
							<Text className="mb-2 px-4">
								{t("Agences à")}
								<Text as="span" className="font-medium">
									{" "}
									{inputs.locality}
								</Text>
							</Text>
							{inputs.totalPosts > 0 && (
								<Text variant="small" className="px-4">
									{t("Nx:Total results found")}
									<Text as="span" className="text-sm font-bold">
										{" " + inputs.totalPosts}
									</Text>
								</Text>
							)}

							{inputs.category.length > 0 &&
								inputs.totalPosts <= 0 &&
								!inputs.isLoading && (
									<Text variant="small" className="px-4">
										{t("Nx:Aucun résultat n'a été trouvé !")}
									</Text>
								)}
						</div>
						<div className="h-[553px] overflow-y-scroll">
							<ul>
								{inputs.posts.map((post, i) => (
									<li
										key={post.id}
										className={vclsx(
											"relative border-b border-gray-50 px-4 py-2 hover:bg-primary-50",
											i == 0 && "border-t"
										)}
									>
										<Text className="font-bold">
											<Link href={post.url}>
												{/* Extend touch target to entire panel */}
												<span className="absolute inset-0" aria-hidden="true" />
												{post.name} : {post.field_locator_category}
											</Link>
										</Text>
										<Text className="text-sm">
											<Text as="span" className="text-sm font-semibold">
												{t("Nx:Email")}
											</Text>
											: {post.field_locator_email}
										</Text>
										<Text className="text-sm">
											<Text as="span" className="text-sm font-semibold">
												{t("Nx:Tel")}
											</Text>
											: {post.field_locator_phone}
										</Text>
										<Text className="text-sm">
											<Text as="span" className="text-sm font-semibold">
												{t("Nx:Fax")}
											</Text>
											: {post.field_locator_fax}
										</Text>
										<Text className="text-sm">
											<Text as="span" className="text-sm font-semibold">
												{t("Nx:Horaires")}
											</Text>
											: {post.field_locator_autre}
										</Text>
										<Wysiwyg
											className="mt-1 text-sm"
											html={post.field_locator_description}
										/>

										{/* <Link href={post.field_locator_path_alias} variant="permalink">
											{t("Nx:Lire plus")}
										</Link> */}
									</li>
								))}
							</ul>
						</div>

						{parseInt(inputs.totalPosts) > parseInt(itemsPerPage) && (
							<Pagination
								variant="small"
								pageSize={itemsPerPage}
								current={inputs.pager}
								total={inputs.totalPosts}
								onChange={(page) => handlePageChange(page)}
								id="store-locator-pagination"
							/>
						)}
					</div>
					{inputs.totalPosts > 0 && (
						<GmapStore
							items={inputs?.posts}
							mapApikey={process.env.GOOGLE_MAPS_KEY}
							marker={"./Gmap/images/marker.png"}
						/>
					)}
				</div>
			</LoadingOverlay>

			<div className="mt-10">
				<LocatorBoxSeo city={inputs.locality} seoGrouping={initialGrouping} />
			</div>
		</Container>
	)
}

const fetchCategories = async (data) => {
	const { session, locale } = data.props

	try {
		const q = query(config?.params || [])
		const endpoint = `${locale}/api/taxonomy_term/locator_category?${q}`
		const response = await drupal.fetch(`${endpoint}`, {
			withAuth: () => (session?.accessToken ? `Bearer ${session.accessToken}` : ""),
			headers: {
				"X-Auth-Provider": session?.provider || "",
			},
		})
		let data = await response.json()
		data = data ? drupal.deserialize(data)?.data : []
		return data
	} catch (error) {
		// Do nothing.
	}
}

const fetchInitialLocator = async (data, context) => {
	const { session, locale } = data.props
	const { category, locality, pager = 1 } = context.query

	let items = []
	let items_found = 0
	let endpoint = `${locale}/api/store-locator?pager=${pager}`
	if (category) {
		endpoint = `${endpoint}&category=${category}`
	}
	if (locality) {
		endpoint = `${endpoint}&locality=${locality}`
	}

	try {
		const response = await drupal.fetch(`${endpoint}`, {
			withAuth: () => (session?.accessToken ? `Bearer ${session.accessToken}` : ""),
			headers: {
				"X-Auth-Provider": session?.provider || "",
			},
		})
		const data = await response.json()
		items = data?.resources || []
		items_found = data?.count || 0
		return [items, items_found]
	} catch (error) {
		// Do nothing.
	}
}

export async function getServerSideProps(data, context) {
	const { category, locality, pager = 1 } = context.query
	const itemsPerPage = 10
	let items = []
	let items_found = 0

	const [categories, locatorItems, initialSeoBox] = await Promise.all([
		fetchCategories(data),
		fetchInitialLocator(data, context),
		LocatorBoxSeoInit(data, context),
	])
	items = locatorItems[0]
	items_found = locatorItems[1]

	data.props.items = items
	data.props.items_found = items_found
	data.props.itemsPerPage = itemsPerPage
	data.props.category = category || ""
	data.props.locality = locality || ""
	data.props.page = pager
	data.props.categories = categories || []
	data.props.initialGrouping = initialSeoBox || []

	return data
}

export default StoreLocator
