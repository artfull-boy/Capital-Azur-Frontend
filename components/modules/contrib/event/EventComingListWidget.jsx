import {
	generateTermsSlugFromIds,
	generateIdsFromTermsSlug,
	countOccurrences,
	removeQueryParamValue,
	useDataHandling,
	generateDefaultValues,
	useListingLayout,
	UseListingFilter,
	dlPush,
	getDefaultUrl,
} from "@vactorynext/core/lib"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { EventCard } from "./EventCard"
import { normalizeNodes } from "./normalizer"
import {
	Container,
	Pagination,
	LoadingOverlay,
	EmptyBlock,
	Button,
	LayoutSwitcher,
	SelectNative,
	ChildTransition,
	ParentTransition,
} from "@/ui"
import { useUpdateEffect, useCollectionFetcher } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"
import { motion } from "framer-motion"

export const config = {
	id: "vactory_event:list-coming",
}

const EventComingListWidget = ({ data }) => {
	// Switch Layer functionality
	const { listingLayout, switchLayout } = useListingLayout()

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

	// Generate default values for categories and cities
	const allCategories = generateDefaultValues(
		"vactory_event_category",
		t("Nx:tout les thematique"),
		context
	)
	const allCities = generateDefaultValues(
		"vactory_event_citys",
		t("Nx:tout les villes"),
		context
	)

	// Extract term slug from node alias and convert it to term id.
	const defaultCategory = generateIdsFromTermsSlug(
		systemRoute?._query?.theme,
		context.terms.vactory_event_category,
		allCategories.id
	)

	const defaultCity = generateIdsFromTermsSlug(
		systemRoute?._query?.city,
		context.terms.vactory_event_citys,
		allCities.id
	)

	const node_has_views_count =
		data?.components?.[0]?.collection?.optional_data?.node_has_views_count

	const defaultSort = "none"
	const sortingList = [
		{
			id: "none",
			value: "none",
			slug: "none",
			label: t("Nx:Sort"),
		},
		{
			id: "popularite",
			value: "popularite",
			slug: "popularite",
			label: t("Nx:Trier par les plus populaires"),
		},
	]

	const [selectedCategory, setSelectedCategory] = useState(defaultCategory)
	const [selectedCity, setSelectedCity] = useState(defaultCity)
	const [sortedValue, setSortedValue] = useState(defaultSort)
	const firstQuerySeparator = pager === 1 ? "?" : "&"
	const secondQuerySeparator =
		pager !== 1 && sortedValue === "desc" && listingLayout === "grid" ? "?" : "&"

	const nodeAliasPath = `${current_page_alias}/{theme}/{city}?page={page}${firstQuerySeparator}display={display}${secondQuerySeparator}sort={sort}`

	const defaultUrl = getDefaultUrl(
		nodeAliasPath,
		{
			theme: selectedCategory === allCategories.id ? allCategories.id : selectedCategory,
			city: selectedCity === allCities.id ? allCities.id : selectedCity,
			sort: sortedValue === defaultSort ? "" : sortedValue,
			display: listingLayout === "grid" ? "" : listingLayout,
		},
		[selectedCategory, selectedCity],
		context
	)

	// Shallow URL is used to update history URL.
	const [shallowUrl, setShallowUrl] = useState(defaultUrl)
	// Shallow URL for paginations element's href
	const [paginationShallowUrl, setPaginationShallowUrl] = useState(defaultUrl)

	// Fill filter form with default values.
	const { handleSubmit, reset, control } = useForm({
		defaultValues: {
			theme: defaultCategory,
			city: defaultCity,
			sort: defaultSort,
		},
	})

	// Fetch data based on params filters.
	const collection = useCollectionFetcher({
		type: "node",
		bundle: "vactory_event",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	// Format nodes.
	const posts = normalizeNodes(collection.posts)

	// Submit filter form.
	const submitFilterForm = (data) => {
		const selectedTheme = context.terms?.vactory_event_category.find((theme) => {
			return theme.id === data?.theme
		})
		const selectedCity = context.terms?.vactory_event_citys.find((theme) => {
			return theme.id === data?.city
		})
		setSelectedCategory(data?.theme)
		setSelectedCity(data?.city)
		setSortedValue(data?.sort)
		dlPush("filtre_select", {
			Thématique: selectedTheme?.label || "all",
			Ville: selectedCity?.label || "all",
			"Type contenu": "Evenement",
		})
		setPager(1)
	}

	/**
	 * Reset filter form.
	 */
	const resetFilterForm = () => {
		reset({
			theme: allCategories.id,
			city: allCities.id,
			sort: defaultSort,
		})
		setPager(1)
		setSelectedCategory(allCategories.id)
		setSelectedCity(allCities.id)
		setSortedValue(defaultSort)
	}

	const updatePrettypath = () => {
		// Update pretty path URL.
		let newNodeAliasPath = nodeAliasPath
			.replace(
				"{theme}",
				generateTermsSlugFromIds(
					selectedCategory,
					context.terms.vactory_event_category,
					allCategories.id
				)
			)
			.replace(
				"{city}",
				generateTermsSlugFromIds(
					selectedCity,
					context.terms.vactory_event_citys,
					allCities.id
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

		if (sortedValue === defaultSort) {
			newNodeAliasPath = removeQueryParamValue(newNodeAliasPath, "sort={sort}")
		}
		newNodeAliasPath = newNodeAliasPath.replace("{sort}", sortedValue)

		// remove "all" from the url if all filters values is 'all'
		newNodeAliasPath =
			Object.keys(context.terms).length ===
			countOccurrences([selectedCategory, selectedCity], ["all", ""])
				? newNodeAliasPath.replaceAll("/all", "")
				: newNodeAliasPath

		setShallowUrl(
			pager === 1
				? newNodeAliasPath.replace(/[?&]page=1\b/, "").replace("&sort", "?sort")
				: newNodeAliasPath.replace(/[?&]page=1\b/, "")
		)
		setPaginationShallowUrl(newNodeAliasPath)
	}

	useUpdateEffect(() => {
		updatePrettypath()

		setFilters((prev) => {
			let filters = {
				...prev,
			}

			if (!selectedCategory || selectedCategory === allCategories.id) {
				// try to delete previously set theme filters.
				delete filters?.filter?.theme
			} else {
				// Add a theme filter.
				filters.filter.theme = {
					condition: {
						path: "field_vactory_taxonomy_1.drupal_internal__tid",
						operator: "=",
						value: selectedCategory,
					},
				}
			}

			if (!selectedCity || selectedCity === allCities.id) {
				// try to delete previously set theme filters.
				delete filters?.filter?.city
			} else {
				// Add a theme filter.
				filters.filter.city = {
					condition: {
						path: "field_vactory_taxonomy_2.drupal_internal__tid",
						operator: "=",
						value: selectedCity,
					},
				}
			}
			if (sortedValue == "popularite") {
				filters.sort = {
					"sort-popularite": {
						direction: "DESC",
						path: "field_node_count_view",
					},
				}
			} else {
				filters.sort = context?.filters?.sort
			}

			// Update pager.
			filters.page = {
				...filters.page,
				offset: (pager - 1) * (filters?.page?.limit || defaultPageLimit),
			}

			return filters
		})
	}, [selectedCategory, selectedCity, pager, listingLayout, sortedValue])

	// Updating pretty path at first load
	useEffect(() => updatePrettypath(), [loaded])

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
				<div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
					<UseListingFilter
						filters={[
							{
								type: "select",
								componentType: SelectNative,
								name: "theme",
								id: "theme",
								label: t("Nx:Thématique"),
								variant: "filter",
								list: context.terms?.vactory_event_category,
								position: 1,
							},
							{
								type: "select",
								componentType: SelectNative,
								name: "city",
								id: "city",
								label: t("Nx:Cities"),
								variant: "filter",
								list: context.terms?.vactory_event_citys,
								position: 2,
							},
							...(node_has_views_count
								? [
										{
											type: "select",
											componentType: SelectNative,
											name: "sort",
											id: "sort",
											label: t("Nx:Sort"),
											variant: "filter",
											list: sortingList,
											position: 3,
										},
									]
								: []),
						]}
						control={control}
					/>
					<div className="flex flex-row items-center justify-center gap-4">
						<Button id="news-submit" type="submit" variant="primary">
							{t("Nx:Appliquer")}
						</Button>
						<Button
							id="news-reset"
							type="button"
							onClick={resetFilterForm}
							variant="secondary"
						>
							{t("Nx:Renitialiser")}
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
				{/* Layout Switcher */}
				<LayoutSwitcher listingLayout={listingLayout} switchLayout={switchLayout} />

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
										<EventCard {...post} listingLayout={listingLayout} />
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
							pageSize={filters?.page?.limit || defaultPageLimit}
							contentRef={scrollRefPagination}
							current={pager}
							total={collection.count}
							onChange={(page) => setPager(page)}
							id="event-coming-pagination"
						/>
					</Container>
				)}
			</div>
		</div>
	)
}

export default EventComingListWidget
