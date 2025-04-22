import React from "react"
import Head from "next/head"
import { useI18n } from "@vactorynext/core/hooks"
import logo from "/public/logo.png"
import maintenanceBanner from "/public/assets/img/under-maintenance.png"
import { Image } from "@/ui"
import { writeToDrupalLogger } from "../../../../pages/_error"

const MaintenanceNode = ({ systemRoute, error, currentPath }) => {
	const { t } = useI18n()

	// Sent error details to Drupal logger.
	const stack1 = systemRoute?.error?.stack
	const stack2 = error?.stack
	const errMessage1 = systemRoute?.error?.message
	const errMessage2 = error?.message
	const statusCode1 = systemRoute?.error?.statusCode
	const statusCode2 = error?.statusCode
	writeToDrupalLogger(
		errMessage1 ? errMessage1 : errMessage2,
		stack1 ? stack1 : stack2,
		statusCode1 ? statusCode1 : statusCode2,
		currentPath
	)

	return (
		<>
			<Head>
				<title>{t("Under Maintenance")}</title>
			</Head>
			<div className="relative flex min-h-[100vh] items-center justify-center">
				<Image
					src={maintenanceBanner?.src}
					width={maintenanceBanner?.width}
					height={maintenanceBanner?.height}
					alt={t("Under Maintenance")}
					title={t("Under Maintenance")}
				/>
				<section className="relative z-10 max-w-screen-md bg-white/95 px-10 py-10 text-center shadow-lg">
					<div className="relative mx-auto mb-5 aspect-[524/138] max-h-[80px]">
						<Image
							src={logo?.src}
							width={logo?.width}
							height={logo?.height}
							alt={t("vactory")}
						/>
					</div>
					<h1 className="mb-5 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:mb-6 xl:text-6xl">
						{t("Under Maintenance")}
					</h1>
					<p className="font-light text-gray-500 md:text-lg xl:text-xl">
						{t("We are performing scheduled maintenance.")}
					</p>
				</section>
			</div>
		</>
	)
}

export const config = {
	id: "maintenance_page",
	params: {},
}

export default MaintenanceNode
