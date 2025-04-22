import React, { useState } from "react"
import { drupal } from "@vactorynext/core/drupal"
import { Link, LoadingOverlay, Heading } from "@/ui"

import { useAccount, useUpdateEffect, useI18n } from "@vactorynext/core/hooks"
import { useRouter } from "next/router"

const LocatorBoxSeo = ({ city, seoGrouping }) => {
	const [grouping, setGrouping] = useState(seoGrouping || [])
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const { profile } = useAccount()
	const locale = router.locale
	const { t } = useI18n()

	const fetchGrouping = async () => {
		const controller = new AbortController()
		setIsLoading(true)

		try {
			let endpoint = `${locale}/api/store-locator/grouping`
			if (city) {
				endpoint = `${endpoint}?city=${city}`
			}
			const response = await drupal.fetch(`${endpoint}`, {
				withAuth: true,
				headers: {
					"X-Auth-Provider": profile?.provider,
				},
				signal: controller.signal,
			})
			const data = await response.json()

			setIsLoading(false)
			setGrouping(data?.resources || [])
		} catch (err) {
			console.error(err)
		} finally {
			setIsLoading(false)
		}

		return () => controller.abort()
	}

	useUpdateEffect(() => {
		fetchGrouping()
	}, [city])

	return (
		<>
			<div className="borderborder-gray-200 flex flex-col items-center justify-center bg-white">
				<LoadingOverlay active={isLoading} spinner={true}>
					<div className="flex flex-col justify-between p-4 leading-normal">
						<Heading level={4} variant="4" className="mb-8">
							{t("Nx:You may wanna check")}
						</Heading>
						{grouping.map((item) => {
							const url = `${router.pathname}?locality=${item.name}`
							const label = t(`Agences à ${item.name}`)
							return (
								<div key={item.tid}>
									{item.name && (
										<Link href={url} className="block">
											<>
												{item.name && (
													<Heading
														level="5"
														variant="cardTitle"
														className="mb-[18px] hover:text-primary-500"
													>
														{label}
													</Heading>
												)}
											</>
										</Link>
									)}
								</div>
							)
						})}
					</div>
				</LoadingOverlay>
			</div>
		</>
	)
}

export const LocatorBoxSeoInit = async (data, context) => {
	const { session, locale } = data.props
	const { city } = context.query

	let items = []
	let endpoint = `${locale}/api/store-locator/grouping`
	if (city) {
		endpoint = `${endpoint}&city=${city}`
	}

	try {
		const response = await drupal.fetch(`${endpoint}`, {
			withAuth: () => (session?.accessToken ? `Bearer ${session.accessToken}` : ""),
			headers: {
				"X-Auth-Provider": session?.provider || "",
			},
		})
		const data = await response.json()
		items = data?.resources || []
		return items
	} catch (error) {
		// Do nothing.
	}
	data.props.seoGrouping = items || []
}

export default LocatorBoxSeo
