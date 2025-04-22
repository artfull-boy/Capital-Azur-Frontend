import {
	removeQueryParamValue,
	useDataHandling,
	useListingLayout,
	UseListingFilter,
	getDefaultUrl,
} from "@vactorynext/core/lib"

import React, { useEffect, useState } from "react"
import { NewsCard } from "./NewsCard"
import { normalizedMixedNodes } from "./normalizer"
import {
	Pagination,
	Container,
	Button,
	LoadingOverlay,
	EmptyBlock,
	LayoutSwitcher,
	SelectNative,
} from "@/ui"
import { useForm } from "react-hook-form"
import { useCollectionFetcher, useUpdateEffect } from "@vactorynext/core/hooks"
import { PublicationCard } from "../publication/PublicationCard"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_news:cross-bundles",
}

const MixedContentWidget = ({ data }) => {
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
		current_page_alias,
		defaultPageLimit,
		context,
		pager,
		setPager,
		filters,
		setFilters,
		loaded,
	} = useDataHandling(data)

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

	const defaultSortEver = "desc"
	const defaultSort = router?.query?.sort || defaultSortEver // @todo: query?.sort must be in asc,desc range
	const [sortedValue, setSortedValue] = useState(defaultSort)

	const firstQuerySeparator = pager === 1 ? "?" : "&"
	const secondQuerySeparator =
		pager !== 1 && sortedValue === "desc" && listingLayout === "grid" ? "?" : "&"
	const nodeAliasPath = `${current_page_alias}?page={page}${firstQuerySeparator}sort={sort}${secondQuerySeparator}display={display}`

	const defaultUrl = getDefaultUrl(
		nodeAliasPath,
		{
			sort: sortedValue === defaultSort ? "" : sortedValue,
			display: listingLayout === "grid" ? "" : listingLayout,
		},
		[],
		context
	)

	// Shallow URL is used to update history URL.
	const [shallowUrl, setShallowUrl] = useState(defaultUrl)
	// Shallow URL for paginations element's href
	const [paginationShallowUrl, setPaginationShallowUrl] = useState(defaultUrl)

	// Fill filter form with default values.
	const { handleSubmit, reset, control } = useForm({
		defaultValues: {
			sort: defaultSort,
		},
	})

	// Fetch data based on params filters.
	const collection = useCollectionFetcher({
		type: "node",
		bundle: "",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	// Format nodes.
	const posts = normalizedMixedNodes(collection.posts)

	// Submit filter form.
	const submitFilterForm = (data) => {
		setSortedValue(data?.sort)
		setPager(1)
	}

	/**
	 * Reset filter form.
	 */
	const resetFilterForm = () => {
		reset({
			sort: "desc",
		})
		setPager(1)
		setSortedValue("desc")
	}

	const updatePrettyPath = () => {
		// Update pretty path URL.

		let newNodeAliasPath = nodeAliasPath

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
	}, [sortedValue, pager, listingLayout])

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
							<div
								className={vclsx(
									"mx-auto gap-5",
									listingLayout === "grid"
										? "grid md:grid-cols-2 lg:grid-cols-3"
										: "flex flex-col"
								)}
							>
								{posts.map((post) => (
									<React.Fragment key={post.id}>
										{post?.type === "node--vactory_news" && (
											<NewsCard {...post} listingLayout={listingLayout} />
										)}
										{post?.type === "node--vactory_publication" && (
											<PublicationCard {...post} />
										)}
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
							id="mixed-content-pagination"
						/>
					</Container>
				)}
			</div>
		</div>
	)
}

export default MixedContentWidget
