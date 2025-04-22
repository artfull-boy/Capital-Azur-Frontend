import {
	generateTermsSlugFromIds,
	generateIdsFromTermsSlug,
	removeQueryParamValue,
	generateDefaultValues,
	useDataHandling,
	UseListingFilter,
	dlPush,
	getDefaultUrl,
} from "@vactorynext/core/lib"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { normalizeNodes } from "./normalizer"
import {
	Pagination,
	Container,
	Button,
	LoadingOverlay,
	EmptyBlock,
	SelectNative,
} from "@/ui"
import { useUpdateEffect, useCollectionFetcher } from "@vactorynext/core/hooks"
import { PublicationCard } from "./PublicationCard"

export const config = {
	id: "vactory_publication:list",
}

const PublicationListWidget = ({ data }) => {
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

	// Generate default values for themes
	const allThematic = generateDefaultValues(
		"vactory_publication_theme",
		t("Nx:Toutes les thématiques"),
		context
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

	// Extract term slug from node alias and convert it to term id.
	const defaultTheme = generateIdsFromTermsSlug(
		systemRoute?._query?.theme,
		context.terms.vactory_publication_theme,
		allThematic.id
	)
	const defaultSortEver = "desc"
	const defaultSort = router?.query?.sort || defaultSortEver // @todo: query?.sort must be in asc,desc range
	const [selectedTheme, setSelectedTheme] = useState(defaultTheme)
	const [sortedValue, setSortedValue] = useState(defaultSort)

	const firstQuerySeparator = pager === 1 ? "?" : "&"
	const nodeAliasPath = `${current_page_alias}/{theme}?page={page}${firstQuerySeparator}sort={sort}`

	const defaultUrl = getDefaultUrl(
		nodeAliasPath,
		{
			theme: selectedTheme === allThematic.id ? allThematic.id : selectedTheme,
			sort: sortedValue === defaultSort ? "" : sortedValue,
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
		bundle: "vactory_publication",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	// Format nodes.
	const posts = normalizeNodes(collection.posts)

	// Submit filter form.
	const submitFilterForm = (data) => {
		const selectedTheme = context.terms?.vactory_publication_theme.find((theme) => {
			return theme.id === data?.theme
		})
		setSelectedTheme(data?.theme)
		setSortedValue(data?.sort)
		dlPush("filtre_select", {
			Thématique: selectedTheme.label,
			"Type contenu": "Publication",
		})
		setPager(1)
	}

	/**
	 * Reset filter form.
	 */
	const resetFilterForm = () => {
		reset({
			theme: allThematic.id,
			sort: defaultSortEver,
		})
		setPager(1)
		setSelectedTheme(allThematic.id)
		setSortedValue(defaultSortEver)
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
							context.terms.vactory_publication_theme,
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
						path: "field_vactory_publication_theme.drupal_internal__tid",
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
			filters.sort = {
				...filters.sort,
				"sort-vactory-date": {
					...filters.sort["sort-vactory-date"],
					direction: sortedValue,
				},
			}

			return filters
		})
	}, [selectedTheme, sortedValue, pager])

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
								list: context.terms?.vactory_publication_theme,
								position: 1,
							},
							{
								type: "select",
								componentType: SelectNative,
								name: "sort",
								id: "sort",
								label: t("Nx:Filtrer par date"),
								variant: "filter",
								list: sortingList,
								position: 2,
							},
						]}
						control={control}
					/>
					<div className="flex flex-row items-center justify-center gap-4">
						<Button id="publication-submit" type="submit" variant="primary">
							{t("Nx:Appliquer")}
						</Button>
						<Button
							id="publiction-reset"
							type="button"
							onClick={resetFilterForm}
							variant="secondary"
						>
							{t("Nx:Renitialiser")}
						</Button>
					</div>
				</div>
			</form>

			<LoadingOverlay active={collection.isLoading} spinner={true}>
				<div className="relative pb-4 pt-4 lg:pb-10 lg:pt-10">
					{posts.length > 0 ? (
						<div className="mx-auto grid gap-5 md:grid-cols-2 lg:grid-cols-3">
							{posts.map((post) => (
								<React.Fragment key={post.id}>
									<PublicationCard {...post} />
								</React.Fragment>
							))}
						</div>
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
						id="publication-pagination"
					/>
				</Container>
			)}
		</div>
	)
}

export default PublicationListWidget
