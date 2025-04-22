import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import get from "lodash.get"
import { Pagination, Container, Button, LoadingOverlay, EmptyBlock } from "@/ui"
import { useI18n, useUpdateEffect } from "@vactorynext/core/hooks"
import { drupal } from "@vactorynext/core/drupal"
import { deserialise } from "kitsu-core"
import { normalizeNodes } from "./normalizer"
import { getGlossaryFilter, getLetters } from "./normalizerLetters"
import { GlossaryItem } from "./GlossaryItem"
import { getDefaultUrl, useDataHandling } from "@vactorynext/core/lib"

export const config = {
	id: "vactory_glossary:list",
}

const GlossaryListWidget = ({ data }) => {
	const glossaryContainer = useRef()
	const { current_page_alias, context, loaded } = useDataHandling(data)
	const { t } = useI18n()
	const router = useRouter()
	const locale = router.locale
	const response = deserialise(get(data, "components.0.collection.data", {}))
	const normalizedNodes = normalizeNodes(response.data)
	const [posts, setPosts] = useState(normalizedNodes)
	const [isLoading, setIsLoading] = useState(false)

	// Pagination.
	const [count, setCount] = useState(response.meta.count)
	let params = get(data, "components.0.collection.filters", {})

	// Extract letter from node alias only once on first load.
	const defaultLetter = router?.query?.slug?.[1] || "all"
	const defaultpage = router?.query?.page || 1
	const [filters, setFilters] = useState({
		letter: defaultLetter,
		pager: defaultpage,
	})

	// Letters.
	const letters = getLetters(locale)
	const nodeAliasPath = `${current_page_alias}/{theme}?page={page}`

	const defaultUrl = getDefaultUrl(
		nodeAliasPath,
		{
			theme: filters.letter === "all" ? "all" : filters.letter,
			page: filters.pager,
		},
		filters.letter,
		context
	)

	// Shallow URL is used to update history URL.
	const [shallowUrl, setShallowUrl] = useState(defaultUrl)

	const fetchData = async () => {
		const controller = new AbortController()
		let filtersGlossary = {}
		if (filters.letter !== "all") {
			filtersGlossary = getGlossaryFilter(filters.letter)
		}

		setIsLoading(true)
		try {
			const response = await drupal.getEntityCollection("node", "vactory_glossary", {
				locale: locale,
				params: {
					...params,
					page: {
						...params.page,
						offset: (filters.pager - 1) * params?.page?.limit,
					},
					...filtersGlossary,
				},
				signal: controller.signal,
			})
			setPosts(normalizeNodes(deserialise(response)?.data || []))
			setCount(response.meta.count)
		} catch (err) {
			console.error(err)
		} finally {
			setIsLoading(false)
		}
		return () => controller.abort()
	}

	const handlePageChange = (pid) => {
		setFilters((old) => ({ ...old, pager: pid }))
	}

	const updatePrettyPath = () => {
		// Update pretty path URL.
		let newNodeAliasPath =
			filters.letter === "all"
				? nodeAliasPath.replace("/{theme}", "")
				: nodeAliasPath.replace("{theme}", filters.letter)
		newNodeAliasPath = newNodeAliasPath.replace("{page}", filters.pager)

		setShallowUrl(newNodeAliasPath.replace(/[?&]page=1\b/, ""))
	}

	useUpdateEffect(() => {
		updatePrettyPath()
		fetchData()
	}, [filters])

	// Reset filter.
	const resetHandler = () => {
		setFilters(() => ({
			letter: "all",
			pager: 1,
		}))
	}

	const handleLettreChange = (letter) => {
		setFilters(() => ({
			letter: letter,
			pager: 1,
		}))
	}

	// Initialize pretty path on first load
	useEffect(() => {
		updatePrettyPath()
		fetchData()
	}, [loaded])

	// Update page URL using shallow routing.
	useUpdateEffect(() => {
		router.push(shallowUrl, undefined, { shallow: true })
	}, [shallowUrl])

	return (
		<div ref={glossaryContainer}>
			<Container>
				<div className="my-4 flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
					<div className="flex flex-wrap items-center justify-center gap-2">
						{letters?.map((letter) => (
							<Button
								key={letter}
								className={`flex h-[44px] w-[44px] items-center justify-center rounded-md !px-0 `}
								variant={`${letter == filters.letter ? "primary" : "secondary"}`}
								onClick={() => handleLettreChange(letter)}
							>
								{letter}
							</Button>
						))}
					</div>

					<div className="flex flex-col items-center gap-4 md:flex-row">
						<Button onClick={resetHandler} variant="secondary">
							{t("Renitialiser")}
						</Button>
					</div>
				</div>
			</Container>
			<LoadingOverlay active={isLoading} spinner={true}>
				<div className="relative px-4 pb-4 pt-4 sm:px-6 lg:px-8 lg:pb-10 lg:pt-10">
					{posts.length > 0 ? (
						<div className="mx-auto grid gap-5 lg:grid-cols-1 lg:gap-8">
							{posts.map((post) => (
								<React.Fragment key={post.id}>
									<GlossaryItem {...post} />
									<hr className="border border-gray-50 rounded-lg"/>
								</React.Fragment>
							))}
						</div>
					) : (
						<EmptyBlock />
					)}
				</div>
			</LoadingOverlay>
			<Container className="px-4 pb-4 sm:px-6 lg:px-8 lg:pb-8">
				{parseInt(count) > parseInt(params?.page?.limit) && (
					<Pagination
						contentRef={glossaryContainer}
						pageSize={params?.page?.limit}
						current={filters.pager}
						total={count}
						onChange={(page) => handlePageChange(page)}
						id="glossary-pagination"
					/>
				)}
			</Container>
		</div>
	)
}

export default GlossaryListWidget
