import {
	generateTermsSlugFromIds,
	generateIdsFromTermsSlug,
	countOccurrences,
	generateDefaultValues,
	useDataHandling,
	UseListingFilter,
	dlPush,
	getDefaultUrl,
} from "@vactorynext/core/lib"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import {
	Pagination,
	Container,
	Button,
	LoadingOverlay,
	EmptyBlock,
	SelectNative,
	ParentTransition,
	ChildTransition,
	FilterWrapper,
} from "@/ui"
import { useUpdateEffect, useCollectionFetcher } from "@vactorynext/core/hooks"
import { normalizeNodes } from "./normalizer"
import { MediathequeCard } from "./MediathequeCard"
export const config = {
	id: "vactory_mediatheque:list",
}

const MediathequeListWidget = ({ data }) => {
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
	const [showFilters, setshowFilters] = useState(false)

	// Generate default values for years, types, and themes
	const allYears = generateDefaultValues("medium_year", t("Nx:tout les Années"), context)
	const allTypes = generateDefaultValues(
		"mediatheque_types",
		t("Nx:Tout les types"),
		context
	)
	const allThemes = generateDefaultValues(
		"mediatheque_theme_albums",
		t("Nx:Tout les themes"),
		context
	)

	// Extract term slug from node alias and convert it to term id.
	const defaultYear = generateIdsFromTermsSlug(
		systemRoute?._query?.year,
		context.terms.medium_year,
		allYears.id
	)

	const defaultType = generateIdsFromTermsSlug(
		systemRoute?._query?.type,
		context.terms.mediatheque_types,
		allTypes.id
	)

	const defaultTheme = generateIdsFromTermsSlug(
		systemRoute?._query?.theme,
		context.terms.mediatheque_theme_albums,
		allThemes.id
	)

	const [selectedYear, setSelectedYear] = useState(defaultYear)
	const [selectedType, setSelectedType] = useState(defaultType)
	const [selectedTheme, setSelectedTheme] = useState(defaultTheme)
	const nodeAliasPath = `${current_page_alias}/{year}/{type}/{theme}?page={page}`

	// generating a shallow url based on filters values
	const defaultUrl = getDefaultUrl(
		nodeAliasPath,
		{
			year: selectedYear === allYears.id ? allYears.id : selectedYear,
			type: selectedType === allTypes.id ? allTypes.id : selectedType,
			theme: selectedTheme === allThemes.id ? allThemes.id : selectedTheme,
		},
		[selectedYear, selectedType, selectedTheme],
		context
	)

	// Shallow URL is used to update history URL.
	const [shallowUrl, setShallowUrl] = useState(defaultUrl)
	// Shallow URL for paginations element's href
	const [paginationShallowUrl, setPaginationShallowUrl] = useState(defaultUrl)

	// Fill filter form with default values.
	const { handleSubmit, reset, control } = useForm({
		defaultValues: {
			year: defaultYear,
			type: defaultType,
			theme: defaultTheme,
		},
	})

	// Fetch data based on params filters.
	const collection = useCollectionFetcher({
		type: "node",
		bundle: "vactory_mediatheque",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	// Format nodes.
	const posts = normalizeNodes(collection.posts)

	// Submit filter form.
	const submitFilterForm = (data) => {
		const selectedTheme = context.terms.mediatheque_theme_albums.find((theme) => {
			return theme.id === data?.theme
		})
		const selectedYear = context.terms.medium_year.find((theme) => {
			return theme.id === data?.year
		})
		const selectedType = context?.terms.mediatheque_types.find((theme) => {
			return theme.id === data?.type
		})
		if (showFilters) {
			setshowFilters(false)
		}
		setSelectedYear(data?.year)
		setSelectedType(data?.type)
		setSelectedTheme(data?.theme)

		dlPush("filtre_select", {
			Thématique: selectedTheme?.label || "all",
			Annee: selectedYear?.label || "all",
			Type: selectedType?.label || "all",
			"Type contenu": "Mediatheque",
		})

		setPager(1)
	}

	/**
	 * Reset filter form.
	 */
	const resetFilterForm = () => {
		reset({
			year: allYears.id,
			type: allTypes.id,
			theme: allThemes.id,
		})
		if (showFilters) {
			setshowFilters(false)
		}
		setPager(1)
		setSelectedYear(allYears.id)
		setSelectedType(allTypes.id)
		setSelectedTheme(allThemes.id)
	}

	const updatePrettyPath = () => {
		// Update pretty path URL.
		let newNodeAliasPath = nodeAliasPath
			.replace(
				"{year}",
				generateTermsSlugFromIds(selectedYear, context.terms.medium_year, allYears.id)
			)
			.replace(
				"{type}",
				generateTermsSlugFromIds(
					selectedType,
					context.terms.mediatheque_types,
					allTypes.id
				)
			)
			.replace(
				"{theme}",
				generateTermsSlugFromIds(
					selectedTheme,
					context.terms.mediatheque_theme_albums,
					allThemes.id
				)
			)

		/* if (pager <= 1) {
			newNodeAliasPath = removeQueryParamValue(newNodeAliasPath, "page={page}")
		} */
		newNodeAliasPath = newNodeAliasPath.replace("{page}", pager)

		// remove "all" from the url if all filters values is 'all'
		newNodeAliasPath =
			Object.keys(context.terms).length ===
			countOccurrences([selectedYear, selectedType, selectedTheme], ["all", ""])
				? newNodeAliasPath.replaceAll("/all", "")
				: newNodeAliasPath

		setShallowUrl(newNodeAliasPath.replace(/[?&]page=1\b/, ""))
		setPaginationShallowUrl(newNodeAliasPath)
	}

	useUpdateEffect(() => {
		updatePrettyPath()

		setFilters((prev) => {
			let filters = {
				...prev,
			}

			if (!selectedYear || selectedYear === "all") {
				// try to delete previously set theme filters.
				delete filters?.filter?.year
			} else {
				// Add a theme filter.
				filters.filter.year = {
					condition: {
						path: "field_medium_year.drupal_internal__tid",
						operator: "=",
						value: selectedYear,
					},
				}
			}

			if (!selectedType || selectedType === "all") {
				// try to delete previously set theme filters.
				delete filters?.filter?.type
			} else {
				// Add a theme filter.
				filters.filter.type = {
					condition: {
						path: "field_mediatheque_type.drupal_internal__tid",
						operator: "=",
						value: selectedType,
					},
				}
			}

			if (!selectedTheme || selectedTheme === "all") {
				// try to delete previously set theme filters.
				delete filters?.filter?.theme
			} else {
				// Add a theme filter.
				filters.filter.theme = {
					condition: {
						path: "field_mediatheque_theme.drupal_internal__tid",
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

			return filters
		})
	}, [selectedYear, selectedType, selectedTheme, pager])

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
					<div className="flex flex-col gap-4">
						<UseListingFilter
							filters={[
								{
									type: "select",
									componentType: SelectNative,
									name: "year",
									id: "year",
									label: t("Nx:Année"),
									variant: "filter",
									list: context.terms?.medium_year,
									position: 1,
								},
								{
									type: "select",
									componentType: SelectNative,
									name: "type",
									id: "type",
									label: t("Nx:Types"),
									variant: "filter",
									list: context.terms?.mediatheque_types,
									position: 2,
								},
								{
									type: "select",
									componentType: SelectNative,
									name: "theme",
									id: "theme",
									label: t("Nx:Thématique"),
									variant: "filter",
									list: context.terms?.mediatheque_theme_albums,
									position: 3,
								},
							]}
							control={control}
						/>
					</div>
					<div className="flex flex-row items-center justify-center gap-4">
						<Button id="mediatheque-submit" type="submit" variant="primary">
							{t("Nx:Appliquer")}
						</Button>
						<Button
							id="mediatheque-reset"
							type="button"
							onClick={resetFilterForm}
							variant="secondary"
						>
							{t("Nx:Renitialiser")}
						</Button>
					</div>
				</FilterWrapper>
				<div className="hidden flex-col space-y-4 md:flex md:flex-row md:space-x-4 md:space-y-0">
					<UseListingFilter
						filters={[
							{
								type: "select",
								componentType: SelectNative,
								name: "year",
								id: "year",
								label: t("Nx:Année"),
								variant: "filter",
								list: context.terms?.medium_year,
								position: 1,
							},
							{
								type: "select",
								componentType: SelectNative,
								name: "type",
								id: "type",
								label: t("Nx:Types"),
								variant: "filter",
								list: context.terms?.mediatheque_types,
								position: 2,
							},
							{
								type: "select",
								componentType: SelectNative,
								name: "theme",
								id: "theme",
								label: t("Nx:Thématique"),
								variant: "filter",
								list: context.terms?.mediatheque_theme_albums,
								position: 3,
							},
						]}
						control={control}
					/>
					<div className="flex flex-row items-center justify-center gap-4">
						<Button id="mediatheque-submit" type="submit" variant="primary">
							{t("Nx:Appliquer")}
						</Button>
						<Button
							id="mediatheque-reset"
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
						<motion.div
							variants={ParentTransition}
							initial="initial"
							className="mx-auto grid gap-5 md:grid-cols-2 lg:grid-cols-3"
							id="mediatheque-listing"
							data-pager={pager}
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
									<MediathequeCard {...post} id={`mediatheque-card-${post.id}`} />
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
						id="mediatheques-pagination"
					/>
				</Container>
			)}
		</div>
	)
}

export default MediathequeListWidget

// mediatheque_theme_albums
// mediatheque_types
// medium_year
