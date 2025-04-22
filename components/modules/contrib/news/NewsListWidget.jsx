import {
	generateTermsSlugFromIds,
	generateIdsFromTermsSlug,
	removeQueryParamValue,
	useDataHandling,
	generateDefaultValues,
	useListingLayout,
	UseListingFilter,
	dlPush,
	getDefaultUrl,
} from "@vactorynext/core/lib"

import { useEffect, useState } from "react"
import { NewsCard } from "./NewsCard"
import { normalizeNodes } from "./normalizer"
import {
	Pagination,
	Container,
	Button,
	LoadingOverlay,
	EmptyBlock,
	LayoutSwitcher,
	SelectNative,
	ParentTransition,
	ChildTransition,
	FilterWrapper,
} from "@/ui"
import { useForm } from "react-hook-form"
import { useCollectionFetcher, useUpdateEffect } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"
import { motion } from "framer-motion"

export const config = {
	id: "vactory_news:list",
}

const NewsListWidget = ({ data }) => {
	// Switch Layer functionality
	const { listingLayout, switchLayout } = useListingLayout()
	const [showFilters, setshowFilters] = useState(false)

	/**
	 * Custom hook for handling various data-related functionalities,
	 * including pagination, filters, translation, and context.
	 **/
	const {
		scrollRefPagination,
		t,
		router,
		systemRoute,
		current_page_alias,
		defaultPageLimit,
		context,
		pager,
		setPager,
		filters,
		setFilters,
		loaded,
	} = useDataHandling(data)

	// Generate default values for theme
	const allThematic = generateDefaultValues(
		"vactory_news_theme",
		t("Toutes les thématiques"),
		context
	)

	const node_has_views_count =
		data?.components?.[0]?.collection?.optional_data?.node_has_views_count

	// Static Sorting list
	let sortingList = [
		{
			id: "desc",
			value: "desc",
			slug: "desc",
			label: t("Trier du plus récent au plus ancien"),
		},
		{
			id: "asc",
			value: "asc",
			slug: "asc",
			label: t("Trier du plus ancien au plus récent"),
		},
	]

	if (node_has_views_count) {
		sortingList = [
			...sortingList,
			{
				id: "popularite",
				value: "popularite",
				slug: "popularite",
				label: t("Trier par les plus populaires"),
			},
		]
	}

	// Extract term slug from node alias and convert it to term id.
	const defaultTheme = generateIdsFromTermsSlug(
		systemRoute?._query?.theme,
		context.terms.vactory_news_theme,
		allThematic.id
	)
	const defaultSortEver = "desc"
	const defaultSort = router?.query?.sort || defaultSortEver // @todo: query?.sort must be in asc,desc range
	const [selectedTheme, setSelectedTheme] = useState(defaultTheme)
	const [sortedValue, setSortedValue] = useState(defaultSort)

	const firstQuerySeparator = pager === 1 ? "?" : "&"
	const secondQuerySeparator =
		pager !== 1 && sortedValue === "desc" && listingLayout === "grid" ? "?" : "&"

	const nodeAliasPath = `${current_page_alias}/{theme}?page={page}${firstQuerySeparator}sort={sort}${secondQuerySeparator}display={display}`

	const defaultUrl = getDefaultUrl(
		nodeAliasPath,
		{
			theme: selectedTheme === allThematic.id ? allThematic.id : selectedTheme,
			sort: sortedValue === defaultSort ? "" : sortedValue,
			display: listingLayout === "grid" ? "" : listingLayout,
		},
		[selectedTheme],
		context
	)

	// Shallow URL is used to update history URL.
	const [shallowUrl, setShallowUrl] = useState(defaultUrl)

	// Shallow URL for paginations element's href
	const [paginationShallowUrl, setPaginationShallowUrl] = useState(defaultUrl)

	// Fill filter form with default values.
	const { handleSubmit, reset, control } = useForm({
		defaultValues: {
			theme: defaultTheme,
			sort: defaultSort,
		},
	})

	// Fetch data based on params filters.
	const collection = useCollectionFetcher({
		type: "node",
		bundle: "vactory_news",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	// Format nodes.
	const posts = normalizeNodes(collection.posts)

	// Submit filter form.
	const submitFilterForm = (data) => {
		// get the value of the selected filter
		const selectedTheme = context.terms?.vactory_news_theme.find((theme) => {
			return theme.id === data?.theme
		})

		// trigger data layer event when changing the theme filter
		dlPush("filter_select", {
			Thématique: selectedTheme.label,
			"Type contenu": "Actualités",
		})

		if (showFilters) {
			setshowFilters(false)
		}

		setSelectedTheme(data?.theme)
		setSortedValue(data?.sort)
		setPager(1)
	}

	/**
	 * Reset filter form.
	 */
	const resetFilterForm = () => {
		reset({
			theme: allThematic.id,
			sort: "desc",
		})

		if (showFilters) {
			setshowFilters(false)
		}

		setPager(1)
		setSelectedTheme(allThematic.id)
		setSortedValue("desc")
	}

	const updatePrettyPath = () => {
		// Update pretty path URL.
		let newNodeAliasPath =
			selectedTheme === allThematic.id
				? nodeAliasPath.replace("/{theme}", "")
				: nodeAliasPath.replace(
						"{theme}",
						generateTermsSlugFromIds(
							selectedTheme,
							context.terms.vactory_news_theme,
							allThematic.id
						)
					)
		/* if (pager <= 1) {
			newNodeAliasPath = removeQueryParamValue(newNodeAliasPath, "page={page}")
		} */
		newNodeAliasPath = newNodeAliasPath.replace("{page}", pager)

		if (listingLayout === "grid") {
			newNodeAliasPath = removeQueryParamValue(newNodeAliasPath, "display={display}")
		}
		newNodeAliasPath = newNodeAliasPath.replace("{display}", listingLayout)

		newNodeAliasPath =
			sortedValue === defaultSortEver
				? removeQueryParamValue(newNodeAliasPath, "sort={sort}")
				: newNodeAliasPath.replace("{sort}", sortedValue)

		setShallowUrl(
			pager === 1
				? newNodeAliasPath.replace(/[?&]page=1\b/, "").replace("&sort", "?sort")
				: newNodeAliasPath.replace(/[?&]page=1\b/, "")
		)
		setPaginationShallowUrl(newNodeAliasPath)
	}

	useUpdateEffect(() => {
		updatePrettyPath()

		setFilters((prev) => {
			let filters = {
				...prev,
			}

			if (!selectedTheme || selectedTheme === allThematic.id) {
				// try to delete previously set theme filters.
				delete filters?.filter?.theme
			} else {
				// Add a theme filter.
				filters.filter.theme = {
					condition: {
						path: "field_vactory_news_theme.drupal_internal__tid",
						operator: "=",
						value: selectedTheme,
					},
				}
			}

			// Update pager.
			filters.page = {
				...filters.page,
				offset: (pager - 1) * (filters?.page?.limit || defaultPageLimit),
			}

			// Update sort.
			if (sortedValue == "popularite") {
				filters.sort = {
					"sort-popularite": {
						direction: "DESC",
						path: "field_node_count_view",
					},
				}
			} else {
				filters.sort = {
					"sort-vactory-date": {
						path: "field_vactory_date",
						direction: sortedValue,
					},
				}
			}

			return filters
		})
	}, [selectedTheme, sortedValue, pager, listingLayout])

	// Update page url using shallow.
	useUpdateEffect(() => {
		router.push(shallowUrl, undefined, { shallow: true })
	}, [shallowUrl])

	// Reset filters and pagination when route changes
	useEffect(() => {
		current_page_alias == `/${router.locale + router.asPath}` && resetFilterForm()
	}, [router])

	return (
		<div ref={scrollRefPagination}>
			<form onSubmit={handleSubmit(submitFilterForm)}>
				<FilterWrapper showFilters={showFilters} setshowFilters={setshowFilters}>
					<div className="mb-6 flex flex-col gap-5">
						<UseListingFilter
							filters={[
								{
									type: "select",
									componentType: SelectNative,
									name: "theme",
									id: "theme",
									label: t("Thématique"),
									variant: "filter",
									list: context.terms?.vactory_news_theme,
									position: 1,
								},
								{
									type: "select",
									componentType: SelectNative,
									name: "sort",
									id: "sort",
									label: t("Filtrer par date"),
									variant: "filter",
									list: sortingList,
									position: 2,
								},
							]}
							control={control}
						/>
					</div>
					<div className="flex flex-row items-center justify-center gap-4">
						<Button id="news-submit" type="submit" variant="primary">
							{t("Appliquer")}
						</Button>
						<Button
							id="news-reset"
							type="button"
							onClick={resetFilterForm}
							variant="secondary"
						>
							{t("Renitialiser")}
						</Button>
					</div>
				</FilterWrapper>
				<div className="hidden flex-col space-y-4 md:flex md:flex-row md:space-x-4 md:space-y-0">
					<UseListingFilter
						filters={[
							{
								type: "select",
								componentType: SelectNative,
								name: "theme",
								id: "theme",
								label: t("Thématique"),
								variant: "filter",
								list: context.terms?.vactory_news_theme,
								position: 1,
							},
							{
								type: "select",
								componentType: SelectNative,
								name: "sort",
								id: "sort",
								label: t("Filtrer par date"),
								variant: "filter",
								list: sortingList,
								position: 2,
							},
						]}
						control={control}
					/>

					<div className="flex flex-row items-center justify-center gap-4">
						<Button id="news-submit" type="submit" variant="primary">
							{t("Appliquer")}
						</Button>
						<Button
							id="news-reset"
							type="button"
							onClick={resetFilterForm}
							variant="secondary"
						>
							{t("Renitialiser")}
						</Button>
					</div>
				</div>
			</form>
			<div
				className={vclsx(
					"animate",
					loaded ? "visible opacity-100" : "invisible opacity-0"
				)}
			>
				{/* Layout Switcher
				<LayoutSwitcher listingLayout={listingLayout} switchLayout={switchLayout} /> */}

				<LoadingOverlay active={collection.isLoading} spinner={true}>
					<div className="relative pb-4 pt-4 lg:pb-10 lg:pt-10">
						{posts.length > 0 ? (
							<motion.div
								variants={ParentTransition}
								initial={"initial"}
								className={vclsx(
									"mx-auto gap-5",
									listingLayout === "grid"
										? "grid md:grid-cols-2 lg:grid-cols-3"
										: "flex flex-col"
								)}
								key={posts.reduce((prev, curr) => prev + curr.id, "")}
							>
								{posts.map((post, index) => (
									<motion.div
										key={post.id}
										variants={ChildTransition(index)}
										initial="initial" // Set initial state for each child
										whileInView="animate" // Animate this child when it comes into view
										viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of the element is in view, only once
									>
										<NewsCard {...post} listingLayout={listingLayout} />
									</motion.div>
								))}
							</motion.div>
						) : (
							<EmptyBlock />
						)}
					</div>
				</LoadingOverlay>
				{parseInt(collection.count) >
					parseInt(filters?.page?.limit || defaultPageLimit) && (
					<Container className="px-4 pb-4 sm:px-6 lg:px-8 lg:pb-8">
						<Pagination
							baseUrl={`${paginationShallowUrl.replace(/page=\d+/, "page={page}")}`}
							contentRef={scrollRefPagination}
							pageSize={filters?.page?.limit || defaultPageLimit}
							current={pager}
							total={collection.count}
							isLoading={!collection.isLoading}
							onChange={(page) => setPager(page)}
							id="news-pagination"
						/>
					</Container>
				)}
			</div>
		</div>
	)
}

export default NewsListWidget
