import { useUpdateEffect, useCollectionFetcher } from "@vactorynext/core/hooks"
import React, { useEffect, useState } from "react"
import { normalizeNodes } from "../normalizer"
import {
	Pagination,
	Container,
	Button,
	LoadingOverlay,
	EmptyBlock,
	Input,
	SelectNative,
	ParentTransition,
	ChildTransition,
	FilterWrapper,
} from "@/ui"
import { useForm } from "react-hook-form"
import {
	generateTermsSlugFromIds,
	generateIdsFromTermsSlug,
	removeQueryParamValue,
	generateDefaultValues,
	useDataHandling,
	UseListingFilter,
	getDefaultUrl,
} from "@vactorynext/core/lib"
import { ForumCard } from "../components/forumCard"
import { motion } from "framer-motion"

export const config = {
	id: "vactory_forums:list_with_filters",
}

const ForumListWithFiltersWidget = ({ data }) => {
	const [showFilters, setshowFilters] = useState(false)
	/**
	 * Custom hook for handling various data-related functionalities,
	 * including pagination, filters, translation, and context.
	 **/
	const {
		scrollRefPagination,
		t,
		router,
		current_page_alias,
		defaultPageLimit,
		context,
		pager,
		setPager,
		filters,
		setFilters,
		loaded,
	} = useDataHandling(data)

	// Generate default values for themes
	const allThematic = generateDefaultValues(
		"vactory_forums_thematic",
		t("Nx:tout les Thématiques"),
		context
	)

	// Extract term slug from node alias and convert it to term id.
	const defaultTheme = generateIdsFromTermsSlug(
		router?.query?.theme,
		context.terms.vactory_forums_thematic,
		allThematic.id
	)

	// Static Sorting list
	const sortingList = [
		{
			id: "desc",
			value: "desc",
			slug: "desc",
			label: t("Nx:Trier du plus récent au plus ancien"),
		},
		{
			id: "asc",
			value: "asc",
			slug: "asc",
			label: t("Nx:Trier du plus ancien au plus récent"),
		},
	]

	// Static state list
	const stateList = [
		{ id: "all", value: "all", slug: "all", label: t("Nx:Status") },
		{ id: "1", value: "1", slug: "1", label: t("Nx:Ouverte") },
		{ id: "0", value: "0", slug: "0", label: t("Nx:Fermée") },
	]

	const defaultSortEver = "desc"
	const defaultSort = router?.query?.sort || defaultSortEver // @todo: query?.sort must be in asc,desc range

	const defaultStatusEver = "all"
	const defaultStatus = router?.query?.status || defaultStatusEver

	const defaultSearchInputEver = ""
	const defaultSearchInput = router?.query?.search || defaultSearchInputEver

	const [selectedTheme, setSelectedTheme] = useState(defaultTheme)
	const [sortedValue, setSortedValue] = useState(defaultSort)
	const [selectedStatus, setSelectedStatus] = useState(defaultStatus)
	const [searchInput, setSearchInput] = useState(defaultSearchInput)

	const firstQuerySeparator = pager === 1 ? "?" : "&"
	const secondQuerySeparator = pager !== 1 && sortedValue === "desc" ? "?" : "&"
	const nodeAliasPath = `${current_page_alias}/{theme}${firstQuerySeparator}search={search}${secondQuerySeparator}status={status}&page={page}&sort={sort}`

	const defaultUrl = getDefaultUrl(
		nodeAliasPath,
		{
			theme: selectedTheme === allThematic.id ? allThematic.id : selectedTheme,
			search: searchInput === defaultSearchInputEver ? "" : searchInput,
			status: selectedStatus === defaultStatusEver ? "" : selectedStatus,
			sort: sortedValue === defaultSortEver ? "" : sortedValue,
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
			status: defaultStatus,
			searchInput: defaultSearchInput,
		},
	})
	// Fetch data based on params filters.
	const collection = useCollectionFetcher({
		type: "node",
		bundle: "vactory_forum",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	// Format nodes.
	const posts = normalizeNodes(collection.posts)

	// Submit filter form.
	const submitFilterForm = (data) => {
		setSelectedTheme(data?.theme)
		setSortedValue(data?.sort)
		setSearchInput(data?.searchInput)
		setSelectedStatus(data?.status)
		setPager(1)
		if (showFilters) {
			setshowFilters(false)
		}
	}

	/**
	 * Reset filter form.
	 */
	const resetFilterForm = () => {
		reset({
			theme: allThematic.id,
			sort: defaultSortEver,
			status: defaultStatusEver,
			searchInput: defaultSearchInputEver,
		})
		if (showFilters) {
			setshowFilters(false)
		}
		setPager(1)
		setSelectedTheme(allThematic.id)
		setSortedValue(defaultSortEver)
		setSelectedStatus(defaultStatusEver)
		setSearchInput(defaultSearchInputEver)
	}

	const updatePrettyPath = () => {
		// Update pretty path URL.
		let newNodeAliasPath = nodeAliasPath.replace(
			"{theme}",
			generateTermsSlugFromIds(
				selectedTheme,
				context.terms.vactory_forums_thematic,
				allThematic.id
			)
		)

		/* if (pager <= 1) {
			newNodeAliasPath = removeQueryParamValue(newNodeAliasPath, "page={page}")
		} */

		newNodeAliasPath = newNodeAliasPath.replace("{page}", pager)

		newNodeAliasPath =
			sortedValue === defaultSortEver
				? removeQueryParamValue(newNodeAliasPath, "sort={sort}")
				: newNodeAliasPath.replace("{sort}", sortedValue)

		newNodeAliasPath =
			searchInput === defaultSearchInputEver
				? removeQueryParamValue(newNodeAliasPath, "search={search}")
				: newNodeAliasPath.replace("{search}", searchInput)

		newNodeAliasPath =
			selectedStatus === defaultStatusEver
				? removeQueryParamValue(newNodeAliasPath, "status={status}")
				: newNodeAliasPath.replace("{status}", selectedStatus)

		setShallowUrl(
			/* pager === 1
				? newNodeAliasPath.replace(/[?&]page=1\b/, "").replace("&sort", "?sort")
				: newNodeAliasPath.replace(/[?&]page=1\b/, "") */
			newNodeAliasPath.replace(/[?&]page=1\b/, "")
		)
		setPaginationShallowUrl(newNodeAliasPath)
	}

	useUpdateEffect(() => {
		updatePrettyPath()

		setFilters((prev) => {
			let filters = {
				...prev,
			}

			// Selected Theme.
			if (!selectedTheme || selectedTheme === "all") {
				// try to delete previously set theme filters.
				delete filters?.filter?.theme
			} else {
				// Add a theme filter.
				filters.filter.theme = {
					condition: {
						path: "field_vactory_forums_thematic.drupal_internal__tid",
						operator: "=",
						value: selectedTheme,
					},
				}
			}

			// Selected Status.
			if (!selectedStatus || selectedStatus === "all") {
				// try to delete previously set theme filters.
				delete filters?.filter?.status
			} else {
				// Add a theme filter.
				filters.filter.status = {
					condition: {
						path: "field_vactory_forum_status",
						operator: "=",
						value: selectedStatus,
					},
				}
			}

			// Search Input.
			if (!searchInput || searchInput === "") {
				// try to delete previously set theme filters.
				delete filters?.filter?.searchInput
			} else {
				// Add a theme filter.
				filters.filter.searchInput = {
					condition: {
						path: "title",
						operator: "CONTAINS",
						value: searchInput,
					},
				}
			}

			// Update pager.
			filters.page = {
				...filters.page,
				offset: (pager - 1) * (filters?.page?.limit || defaultPageLimit),
			}
			// Update sort.
			filters.sort = {
				...filters.sort,
				"sort-created": {
					path: "created",
					direction: sortedValue,
				},
			}

			return filters
		})
	}, [selectedTheme, sortedValue, pager, selectedStatus, searchInput])

	// Updating pretty path at first load
	useEffect(() => updatePrettyPath(), [loaded])

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
									type: "text",
									componentType: Input,
									name: "searchInput",
									id: "searchInput",
									placeholder: t("Nx:What are you searching for ?"),
									position: 1,
								},
								{
									type: "select",
									componentType: SelectNative,
									name: "theme",
									id: "theme",
									label: t("Nx:Thématique"),
									variant: "filter",
									list: context.terms?.vactory_forums_thematic,
									position: 2,
								},
								{
									type: "select",
									componentType: SelectNative,
									name: "status",
									id: "status",
									label: t("Nx:Status"),
									variant: "filter",
									list: stateList,
									position: 3,
								},
								{
									type: "select",
									componentType: SelectNative,
									name: "sort",
									id: "sort",
									label: t("Nx:Filtrer par date"),
									variant: "filter",
									list: sortingList,
									position: 4,
								},
							]}
							control={control}
						/>
					</div>
					<div className="flex flex-col gap-4 md:flex-row">
						<Button id="forum-submit" type="submit" variant="primary">
							{t("Nx:Appliquer")}
						</Button>
						<Button
							id="forum-reset"
							type="button"
							onClick={resetFilterForm}
							variant="secondary"
						>
							{t("Nx:Renitialiser")}
						</Button>
					</div>
				</FilterWrapper>
				<Container className="hidden md:block">
					<div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
						<UseListingFilter
							filters={[
								{
									type: "text",
									componentType: Input,
									name: "searchInput",
									id: "searchInput",
									placeholder: t("Nx:What are you searching for ?"),
									position: 1,
								},
								{
									type: "select",
									componentType: SelectNative,
									name: "theme",
									id: "theme",
									label: t("Nx:Thématique"),
									variant: "filter",
									list: context.terms?.vactory_forums_thematic,
									position: 2,
								},
								{
									type: "select",
									componentType: SelectNative,
									name: "status",
									id: "status",
									label: t("Nx:Status"),
									variant: "filter",
									list: stateList,
									position: 3,
								},
								{
									type: "select",
									componentType: SelectNative,
									name: "sort",
									id: "sort",
									label: t("Nx:Filtrer par date"),
									variant: "filter",
									list: sortingList,
									position: 4,
								},
							]}
							control={control}
						/>
						<div className="flex flex-col gap-4 md:flex-row">
							<Button id="forum-submit" type="submit" variant="primary">
								{t("Nx:Appliquer")}
							</Button>
							<Button
								id="forum-reset"
								type="button"
								onClick={resetFilterForm}
								variant="secondary"
							>
								{t("Nx:Renitialiser")}
							</Button>
						</div>
					</div>
				</Container>
			</form>
			<LoadingOverlay active={collection.isLoading} spinner={true}>
				<div className="relative pb-4 pt-4 lg:pb-10 lg:pt-10">
					<Container>
						{posts.length > 0 ? (
							<motion.div
								variants={ParentTransition}
								initial={"initial"}
								className="flex flex-col gap-5"
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
										<ForumCard {...post} />
									</motion.div>
								))}
							</motion.div>
						) : (
							<EmptyBlock />
						)}
					</Container>
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
						id="forum-list-pagination"
					/>
				</Container>
			)}
		</div>
	)
}

export default ForumListWithFiltersWidget
