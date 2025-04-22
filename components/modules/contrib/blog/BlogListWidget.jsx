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
import { BlogCard } from "./BlogCard"
import { normalizeNodes } from "./normalizer"
import {
	Container,
	Pagination,
	LoadingOverlay,
	EmptyBlock,
	Button,
	SelectNative,
	ParentTransition,
	ChildTransition,
	FilterWrapper,
} from "@/ui"
import { useUpdateEffect, useCollectionFetcher } from "@vactorynext/core/hooks"
import { motion } from "framer-motion"

export const config = {
	id: "vactory_blog:list",
}

const BlogListWidget = ({ data }) => {
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

	// Generate default values for categories and Tags
	const allCategories = generateDefaultValues(
		"vactory_blog_categories",
		t("Nx:tout les Categories"),
		context
	)
	const allTags = generateDefaultValues(
		"vactory_blog_tags",
		t("Nx:tout les tags"),
		context
	)

	// Extract term slug from node alias and convert it to term id.
	const defaultCategory = generateIdsFromTermsSlug(
		systemRoute?._query?.theme,
		context.terms.vactory_blog_categories,
		allCategories.id
	)

	const defaultTag = generateIdsFromTermsSlug(
		systemRoute?._query?.tag,
		context.terms.vactory_blog_tags,
		allTags.id
	)

	const [selectedCategory, setSelectedCategory] = useState(defaultCategory)
	const [selectedTag, setSelectedTag] = useState(defaultTag)
	const nodeAliasPath = `${current_page_alias}/{theme}/{tag}?page={page}`

	const defaultUrl = getDefaultUrl(
		nodeAliasPath,
		{
			theme: selectedCategory === allCategories.id ? allCategories.id : selectedCategory,
			tag: selectedTag === allTags.id ? allTags.id : selectedTag,
		},
		[selectedCategory, selectedTag],
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
			tag: defaultTag,
		},
	})

	// Fetch data based on params filters.
	const collection = useCollectionFetcher({
		type: "node",
		bundle: "vactory_blog",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	// Format nodes.
	const posts = normalizeNodes(collection.posts)

	// Submit filter form.
	const submitFilterForm = (data) => {
		const selectedTheme = context.terms?.vactory_blog_categories.find((theme) => {
			return theme.id === data?.theme
		})
		const selectedTag = context.terms.vactory_blog_tags.find((theme) => {
			return theme.id === data?.tag
		})
		if (showFilters) {
			setshowFilters(false)
		}
		setSelectedCategory(data?.theme)
		setSelectedTag(data?.tag)
		dlPush("filtre_select", {
			Thématique: selectedTheme?.label || "all",
			Tag: selectedTag?.label || "all",
			"Type contenu": "Blog",
		})
		setPager(1)
	}

	/**
	 * Reset filter form.
	 */
	const resetFilterForm = () => {
		reset({
			theme: allCategories.id,
			tag: allTags.id,
		})
		if (showFilters) {
			setshowFilters(false)
		}
		setPager(1)
		setSelectedCategory(allCategories.id)
		setSelectedTag(allTags.id)
	}

	const updatePrettyPath = () => {
		// Update pretty path URL.
		let newNodeAliasPath = nodeAliasPath
			.replace(
				"{theme}",
				generateTermsSlugFromIds(
					selectedCategory,
					context.terms.vactory_blog_categories,
					allCategories.id
				)
			)
			.replace(
				"{tag}",
				generateTermsSlugFromIds(selectedTag, context.terms.vactory_blog_tags, allTags.id)
			)

		/* if (pager <= 1) {
			newNodeAliasPath = removeQueryParamValue(newNodeAliasPath, "page={page}")
		} */
		newNodeAliasPath = newNodeAliasPath.replace("{page}", pager)

		// remove "all" from the url if all filters values is 'all'
		newNodeAliasPath =
			Object.keys(context.terms).length ===
			countOccurrences([selectedCategory, selectedTag], ["all", ""])
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

			if (!selectedCategory || selectedCategory === allCategories.id) {
				// try to delete previously set theme filters.
				delete filters?.filter?.theme
			} else {
				// Add a theme filter.
				filters.filter.theme = {
					condition: {
						path: "field_blog_category.drupal_internal__tid",
						operator: "=",
						value: selectedCategory,
					},
				}
			}

			if (!selectedTag || selectedTag === allTags.id) {
				// try to delete previously set theme filters.
				delete filters?.filter?.tag
			} else {
				// Add a theme filter.
				filters.filter.tag = {
					condition: {
						path: "field_blog_tags.drupal_internal__tid",
						operator: "=",
						value: selectedTag,
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
	}, [selectedCategory, selectedTag, pager])

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
					<div className="flex flex-col gap-6">
						<UseListingFilter
							filters={[
								{
									type: "select",
									componentType: SelectNative,
									name: "theme",
									id: "theme",
									label: t("Nx:Catégories"),
									variant: "filter",
									list: context.terms?.vactory_blog_categories,
									position: 1,
								},
								{
									type: "select",
									componentType: SelectNative,
									name: "tag",
									id: "tag",
									label: t("Nx:Tags"),
									variant: "filter",
									list: context.terms?.vactory_blog_tags,
									position: 2,
								},
							]}
							control={control}
						/>
					</div>
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
				</FilterWrapper>
				<div className="hidden flex-col space-y-4 md:flex md:flex-row md:space-x-4 md:space-y-0">
					<UseListingFilter
						filters={[
							{
								type: "select",
								componentType: SelectNative,
								name: "theme",
								id: "theme",
								label: t("Nx:Catégories"),
								variant: "filter",
								list: context.terms?.vactory_blog_categories,
								position: 1,
							},
							{
								type: "select",
								componentType: SelectNative,
								name: "tag",
								id: "tag",
								label: t("Nx:Tags"),
								variant: "filter",
								list: context.terms?.vactory_blog_tags,
								position: 2,
							},
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
									<BlogCard {...post} />
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
						id="blog-pagination"
					/>
				</Container>
			)}
		</div>
	)
}

export default BlogListWidget
