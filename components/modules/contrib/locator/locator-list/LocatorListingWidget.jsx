import React, { useState } from "react"
//import { deserialise } from "kitsu-core"
import { vclsx } from "@vactorynext/core/utils"

import { useForm } from "react-hook-form"
import { useCollectionFetcher, useUpdateEffect } from "@vactorynext/core/hooks"

import {
	generateTermsSlugFromIds,
	generateIdsFromTermsSlug,
	removeQueryParamValue,
	useDataHandling,
	generateDefaultValues,
	//useListingLayout,
	UseListingFilter,
	dlPush,
	getDefaultUrl,
} from "@vactorynext/core/lib"

import {
	Text,
	Link,
	Wysiwyg,
	Button,
	SelectNative,
	LoadingOverlay,
	Pagination,
	Icon,
	EmptyBlock,
} from "@/ui"

export const config = {
	id: "vactory_locator:locator-list",
}

function generateGoogleMapsLink(placeName, latitude, longitude) {
	const encodedPlaceName = encodeURIComponent(placeName)
	const encodedCoords = `${latitude},${longitude}`
	return `https://www.google.com/maps/search/?api=1&query=${encodedPlaceName}%20${encodedCoords}`
}

const StoreLocatoreWidget = ({ data }) => {
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
	} = useDataHandling(data)

	// Generate default values for theme
	const allCities = generateDefaultValues("locator_city", t("Toutes les Ville"), context)

	//if(true) return <div>test</div>

	// Extract term slug from node alias and convert it to term id.
	const defaultCity = generateIdsFromTermsSlug(
		systemRoute?._query?.city,
		context.terms.locator_city,
		allCities.id
	)

	const [selectedCity, setSelectedCity] = useState(defaultCity)
	const nodeAliasPath = `${current_page_alias}/{city}?page={page}`

	const defaultUrl = getDefaultUrl(
		nodeAliasPath,
		{
			city: selectedCity === allCities.id ? allCities.id : selectedCity,
		},
		[selectedCity],
		context
	)

	// Shallow URL is used to update history URL.
	const [shallowUrl, setShallowUrl] = useState(defaultUrl)

	// Shallow URL for paginations element's href
	const [paginationShallowUrl, setPaginationShallowUrl] = useState(defaultUrl)

	// Fill filter form with default values.
	const { handleSubmit, reset, control } = useForm({
		defaultValues: {
			city: defaultCity,
		},
	})

	// Fetch data based on params filters.
	const collection = useCollectionFetcher({
		type: "locator_entity",
		bundle: "vactory_locator",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		params: filters,
	})

	const posts = collection.posts

	// Submit filter form.
	const submitFilterForm = (data) => {
		// get the value of the selected filter
		const selectedCity = context.terms?.locator_city.find((city) => {
			return city.id === data?.city
		})

		// trigger data layer event when changing the theme filter
		dlPush("filter_select", {
			city: selectedCity.label,
			"Type contenu": "Locator",
		})

		setSelectedCity(data?.city)
		setPager(1)
	}

	/**
	 * Reset filter form.
	 */
	const resetFilterForm = () => {
		reset({
			city: allCities.id,
		})
		setPager(1)
		setSelectedCity(allCities.id)
	}

	useUpdateEffect(() => {
		// Update pretty path URL.

		let locatorAliasPath =
			selectedCity === allCities.id
				? nodeAliasPath.replace("/{city}", "")
				: nodeAliasPath.replace(
						"{city}",
						generateTermsSlugFromIds(
							selectedCity,
							context.terms.locator_city,
							allCities.id
						)
					)
		if (pager <= 1) {
			locatorAliasPath = removeQueryParamValue(locatorAliasPath, "page={page}")
		}
		locatorAliasPath = locatorAliasPath.replace("{page}", pager)

		setShallowUrl(locatorAliasPath)

		setPaginationShallowUrl(locatorAliasPath)

		setFilters((prev) => {
			let filters = {
				...prev,
			}

			if (!selectedCity || selectedCity === allCities.id) {
				// try to delete previously set theme filters.
				delete filters?.filter?.city
			} else {
				// Add a theme filter.

				filters.filter = {
					city: {
						condition: {
							path: "field_locator_city.tid",
							operator: "IN",
							value: selectedCity,
						},
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
	}, [selectedCity, pager])

	// Update page url using shallow.
	useUpdateEffect(() => {
		router.push(shallowUrl, undefined, { shallow: true })
	}, [shallowUrl])

	return (
		<div ref={scrollRefPagination}>
			<form onSubmit={handleSubmit(submitFilterForm)} className="mb-8">
				<div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
					<UseListingFilter
						filters={[
							{
								type: "select",
								componentType: SelectNative,
								name: "city",
								id: "city",
								label: t("Nx:ville"),
								//variant: "filter",
								list: context.terms?.locator_city,
								position: 1,
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
							variant="green"
						>
							{t("Nx:Renitialiser")}
						</Button>
					</div>
				</div>
			</form>
			<LoadingOverlay active={collection.isLoading} spinner={true}>
				{posts?.length === 0 && <EmptyBlock />}
				{posts?.length > 0 && (
					<div className="_h-[553px] overflow-y-scroll">
						<ul>
							{posts.map((post, i) => (
								<li
									key={post.id}
									className={vclsx(
										"relative flex flex-col gap-3 border-b border-gray-200 px-4 py-5 hover:bg-primary-50",
										i == 0 && "border-t"
									)}
								>
									<Text className="font-bold">
										<a
											href={generateGoogleMapsLink(
												post.name,
												post.field_locator_info.lat,
												post.field_locator_info.lon
											)}
											target="_blank"
										>
											{/* Extend touch target to entire panel */}
											<span className="absolute inset-0" aria-hidden="true" />
											{post.name}
										</a>
									</Text>
									{post.field_locator_city?.name && (
										<Text className="text-sm">
											<Text as="span" className="text-sm font-semibold">
												{t("Nx:Ville")}
											</Text>
											: {post.field_locator_city.name}
										</Text>
									)}
									{post.field_locator_email && (
										<Text className="text-sm">
											<Text as="span" className="text-sm font-semibold">
												{t("Nx:Email")}
											</Text>
											: {post.field_locator_email}
										</Text>
									)}
									{post.field_locator_phone && (
										<Text className="text-sm">
											<Text as="span" className="text-sm font-semibold">
												{t("Nx:Tel")}
											</Text>
											: {post.field_locator_phone}
										</Text>
									)}
									{post.field_locator_fax && (
										<Text className="text-sm">
											<Text as="span" className="text-sm font-semibold">
												{t("Nx:Fax")}
											</Text>
											: {post.field_locator_fax}
										</Text>
									)}
									{post.field_locator_autre && (
										<Text className="text-sm">
											<Text as="span" className="text-sm font-semibold">
												{t("Nx:Horaires")}
											</Text>
											: {post.field_locator_autre}
										</Text>
									)}
									{post.field_locator_description && (
										<Text className="text-sm" as="div">
											<Text as="span" className="text-sm font-semibold">
												{t("Nx:Adresse")}
											</Text>
											:{" "}
											<Wysiwyg
												className="mt-1 text-sm"
												html={post.field_locator_description}
											/>
										</Text>
									)}

									<div>
										<Link
											href={generateGoogleMapsLink(
												post.name,
												post.field_locator_info.lat,
												post.field_locator_info.lon
											)}
											className="inline-flex"
											variant="permalink"
											target="_blank"
										>
											{t("Nx:Voir sur la map")}
											<Icon
												id="arrow-right"
												className="rtl-icon"
												width="20"
												height="20"
											/>
										</Link>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}
			</LoadingOverlay>
			{parseInt(collection.count) >
				parseInt(filters?.page?.limit || defaultPageLimit) && (
				<div className="px-4 py-6 pb-4 sm:px-6 lg:px-8 lg:pb-8">
					<Pagination
						baseUrl={`${paginationShallowUrl.replace(/page=\d+/, "page={page}")}`}
						contentRef={scrollRefPagination}
						pageSize={filters?.page?.limit || defaultPageLimit}
						current={pager}
						total={collection.count}
						isLoading={!collection.isLoading}
						onChange={(page) => setPager(page)}
						id="locator-pagination"
					/>
				</div>
			)}
		</div>
	)
}

export default StoreLocatoreWidget
