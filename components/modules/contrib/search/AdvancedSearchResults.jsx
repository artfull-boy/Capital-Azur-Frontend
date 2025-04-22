import { useAccount, useUpdateEffect, useI18n } from "@vactorynext/core/hooks"
import React, { useState, useRef } from "react"
import { drupal } from "@vactorynext/core/drupal"
import { normalizeNodes } from "./normalizer"
import { Link, Pagination, LoadingOverlay, Icon, Input, Button } from "@/ui"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"

const itemsPerPage = 15

const AdvancedSearchResults = ({ nodes, facetsItems, items_found }) => {
	const ref = useRef()
	const router = useRouter()
	const locale = router.locale
	const { profile } = useAccount()
	const [results, setResults] = useState(normalizeNodes(nodes))
	const [facets, setFacets] = useState(facetsItems)
	const [isLoading, setIsLoading] = useState(false)
	const { t } = useI18n()
	const [filters, setFilters] = useState({
		facets: {},
		page: 1,
		count: items_found,
	})
	const { register, handleSubmit, reset } = useForm()

	const fetchData = async () => {
		const controller = new AbortController()
		const facets = Object.keys(filters?.facets)
		let query = ""
		let i = 0
		for (let facet of facets) {
			if (filters?.facets[facet] !== "") {
				if (facet === "fulltext") {
					query += `&filter[fulltext]=${filters?.facets[facet]}`
				} else {
					query += `&f[${i}]=${facet}:${filters?.facets[facet]}`
					i++
				}
			}
		}
		try {
			setIsLoading(true)
			const offset = (filters.page - 1) * itemsPerPage
			const response = await drupal.fetch(
				`${locale}/api/index/default_content_index?filter[langcode]=${locale}&page[limit]=${itemsPerPage}&page[offset]=${offset}${query}`,
				{
					withAuth: true,
					headers: {
						"X-Auth-Provider": profile?.provider,
					},
					signal: controller.signal,
				}
			)
			const data = await response.json()
			setResults(normalizeNodes(data?.data))
			setFilters((prev) => ({
				...prev,
				count: data?.meta?.count,
			}))
			setFacets(data?.meta?.facets)
		} catch (err) {
			console.error(err)
		} finally {
			setIsLoading(false)
		}
	}

	const onSubmit = (data) => {
		setFilters((prev) => ({
			...prev,
			facets: data,
			page: 1,
		}))
	}

	const onReset = () => {
		reset({
			fulltext: "",
		})
		setFilters((prev) => ({
			...prev,
			facets: {},
			page: 1,
		}))
	}

	useUpdateEffect(() => {
		fetchData()
	}, [filters.page, filters.facets])

	const handlePageChange = (pid) => {
		setFilters((prev) => ({
			...prev,
			page: pid,
		}))
	}

	const handleChangeFacet = (event, id) => {
		const value = event.target.value
		const oldFacets = filters?.facets
		oldFacets[id] = value
		setFilters((prev) => ({
			...prev,
			facets: {
				...prev.facets,
				...oldFacets,
			},
			page: 1,
		}))
	}
	return (
		<LoadingOverlay active={isLoading} spinner={true}>
			<div className="mt-4 flex gap-4 p-4" ref={ref}>
				<form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
					<Input
						variant="search"
						{...register("fulltext", {})}
						prefix={
							<Icon id="search" className="h-4 w-4 text-gray active:text-gray"></Icon>
						}
						placeholder={t("Nx:What are you searching for ?")}
					/>
					{facets?.map((facet) => (
						<div key={facet.id} className="mb-4 rounded-md border p-4">
							<p className="mb-2 mt-0 text-base">{facet.label}</p>
							<div className="grid grid-flow-row gap-2">
								<label
									htmlFor={`${facet.id}--any`}
									className="flex items-center text-base"
								>
									<input
										type="radio"
										id={`${facet.id}--any`}
										name={facet.path}
										className="mr-2"
										value=""
										onClick={(event) => handleChangeFacet(event, facet.id)}
										checked={
											filters?.facets[facet.id] === "" ||
											filters?.facets[facet.id] === undefined
												? true
												: false
										}
										{...register(facet.id, {})}
									/>
									Any
								</label>

								{facet?.terms?.map((term) => (
									<label
										key={term.url}
										htmlFor={`${facet.id}--${term.values.value}`}
										className="flex items-center text-sm"
									>
										<input
											type="radio"
											id={`${facet.id}--${term.values.value}`}
											name={facet.path}
											value={term.values.value}
											className="mr-2"
											checked={
												filters?.facets[facet.id] === term.values.value ? true : false
											}
											onClick={(event) => handleChangeFacet(event, facet.id)}
											defaultChecked={term.values.active}
											{...register(facet.id, {})}
										/>
										{term.values.label}{" "}
										<span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs">
											{term.values.count}
										</span>
									</label>
								))}
							</div>
						</div>
					))}
					<Button disables={isLoading} type="submit" variant="primary" className="ml-2">
						{t("Nx:Submit")}
					</Button>
					<Button
						disables={isLoading}
						onClick={onReset}
						type="button"
						variant="secondary"
						className="ml-2"
					>
						{t("Nx:Reset")}
					</Button>
				</form>
				{!results.length ? (
					<p className="text-sm" data-cy="search-no-results">
						No results found.
					</p>
				) : (
					<div className="grow">
						{filters?.count > 0 && (
							<p className="my-5 text-right">
								{t("Nx:Total results found")} {filters.count}.
							</p>
						)}
						<ul className="divide-y divide-gray-200">
							{results.map((node, i) => (
								<li
									key={i}
									className="relative bg-white px-4 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-600 hover:bg-gray-50"
								>
									<Link key={node.nid} href={node?.url || "#."}>
										<div className="flex justify-between">
											<span className="absolute inset-0" aria-hidden="true" />
											<p className="truncate text-sm text-gray-500">{node?.title}</p>

											<time
												dateTime={node?.date}
												className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
											>
												{node?.date}
											</time>
										</div>
										<p className="line-clamp-2 text-sm text-gray-600">{node?.excerpt}</p>
									</Link>
								</li>
							))}
						</ul>
						{parseInt(filters.count) > parseInt(itemsPerPage) && (
							<div className="px-4 pb-4 sm:px-6 lg:px-8 lg:pb-8">
								<Pagination
									// baseUrl={shallowUrl.replace(/pager=\d/, "pager={page}")}
									contentRef={ref}
									pageSize={itemsPerPage}
									current={filters.page}
									total={filters.count}
									onChange={(page) => handlePageChange(page)}
									id="advanced-search-pagination"
								/>
							</div>
						)}
					</div>
				)}
			</div>
		</LoadingOverlay>
	)
}

export async function getServerSideProps(data) {
	const { session, locale } = data.props
	let items = []
	let items_found = 0
	let facets = []

	try {
		const response = await drupal.fetch(
			`${locale}/api/index/default_content_index?filter[langcode]=${locale}&page[limit]=${itemsPerPage}`,
			{
				withAuth: () => (session?.accessToken ? `Bearer ${session.accessToken}` : ""),
				headers: {
					"X-Auth-Provider": session?.provider || "",
				},
			}
		)
		const data = await response.json()
		items = data?.data
		items_found = data?.meta?.count
		facets = data?.meta?.facets
	} catch (error) {
		// do nothing
	}

	data.props.nodes = items
	data.props.items_found = items_found
	data.props.itemsPerPage = itemsPerPage
	data.props.page = 1
	data.props.facetsItems = facets

	return data
}

export default AdvancedSearchResults
