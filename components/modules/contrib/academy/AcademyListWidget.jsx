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
import { normalizeNodes } from "./normalizer"
import {
	PaginationV2,
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
import { AcademyCard } from "./AcademyCard"
import { motion } from "framer-motion"

export const config = {
	id: "vactory_academy:list",
}

const AcademyListWidget = ({ data }) => {
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

	// Generate default values for themes
	const allThemes = generateDefaultValues(
		"vactory_academy_themes",
		t("Nx:Tout les themes"),
		context
	)

	// Extract term slug from node alias and convert it to term id.
	const defaultTheme = generateIdsFromTermsSlug(
		systemRoute?._query?.theme,
		context.terms.vactory_academy_themes,
		allThemes.id
	)

	const [selectedTheme, setSelectedTheme] = useState(defaultTheme)
	const nodeAliasPath = `${current_page_alias}/{theme}?page={page}`

	// generating a shallow url based on filters values
	const defaultUrl = getDefaultUrl(
		nodeAliasPath,
		{
			theme: selectedTheme === allThemes.id ? allThemes.id : selectedTheme,
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
		},
	})

	// Fetch data based on params filters.
	const collection = useCollectionFetcher({
		type: "node",
		bundle: "vactory_academy",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	// Format nodes.
	const posts = normalizeNodes(collection.posts)

	// Submit filter form.
	const submitFilterForm = (data) => {
		const selectedTheme = context.terms?.vactory_academy_themes.find((theme) => {
			return theme.id === data?.theme
		})
		dlPush("filtre_select", {
			Thématique: selectedTheme?.label || "all",
			"Type contenu": "Academy",
		})
		if (showFilters) {
			setshowFilters(false)
		}
		setSelectedTheme(data?.theme)
		setPager(1)
	}

	/**
	 * Reset filter form.
	 */
	const resetFilterForm = () => {
		reset({
			theme: allThemes.id,
		})
		if (showFilters) {
			setshowFilters(false)
		}
		setPager(1)
		setSelectedTheme(allThemes.id)
	}

	const updatePrettyPath = () => {
		// Update pretty path URL.
		let newNodeAliasPath = nodeAliasPath.replace(
			"{theme}",
			generateTermsSlugFromIds(
				selectedTheme,
				context.terms.vactory_academy_themes,
				allThemes.id
			)
		)

		/* if (pager <= 1) {
			newNodeAliasPath = removeQueryParamValue(newNodeAliasPath, "page={page}")
		} */
		newNodeAliasPath = newNodeAliasPath.replace("{page}", pager)

		// remove "all" from the url if all filters values is 'all'
		newNodeAliasPath =
			Object.keys(context.terms).length === countOccurrences([selectedTheme], ["all", ""])
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

			if (!selectedTheme || selectedTheme === "all") {
				// try to delete previously set theme filters.
				delete filters?.filter?.theme
			} else {
				// Add a theme filter.
				filters.filter.theme = {
					condition: {
						path: "field_vactory_theme.drupal_internal__tid",
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
	}, [selectedTheme, pager])

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
									type: "select",
									componentType: SelectNative,
									name: "theme",
									id: "theme",
									label: t("Nx:Thématique"),
									variant: "filter",
									list: context.terms?.vactory_academy_themes,
									position: 1,
								},
							]}
							control={control}
						/>
					</div>
					<div className="flex flex-row items-center justify-center gap-4">
						<Button id="academy-submit" type="submit" variant="primary">
							{t("Nx:Appliquer")}
						</Button>
						<Button
							id="academy-reset"
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
								name: "theme",
								id: "theme",
								label: t("Nx:Thématique"),
								variant: "filter",
								list: context.terms?.vactory_academy_themes,
								position: 1,
							},
						]}
						control={control}
					/>
					<div className="flex flex-row items-center justify-center gap-4">
						<Button id="academy-submit" type="submit" variant="primary">
							{t("Nx:Appliquer")}
						</Button>
						<Button
							id="academy-reset"
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
							initial={"initial"}
							className="mx-auto grid gap-5 md:grid-cols-2 lg:grid-cols-3"
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
									<AcademyCard {...post} />
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
					<PaginationV2
						baseUrl={`${paginationShallowUrl.replace(/page=\d+/, "page={page}")}`}
						contentRef={scrollRefPagination}
						pageSize={filters?.page?.limit || defaultPageLimit}
						current={pager}
						total={collection.count}
						isLoading={!collection.isLoading}
						onChange={(page) => setPager(page)}
						id="academy-list-pagination"
					/>
				</Container>
			)}
		</div>
	)
}

export default AcademyListWidget
