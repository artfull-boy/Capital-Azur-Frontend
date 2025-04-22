import React from "react"
import { useI18n } from "@vactorynext/core/hooks"
import Head from "next/head"
import { writeToDrupalLogger } from "../../../../pages/_error"

const ErrorNode = ({ systemRoute, currentPath }) => {
	const { status } = systemRoute
	const { t } = useI18n()

	const messages = {
		404: t("Not found"),
		403: t("Access denied"),
		401: t("Unauthorized"),
		500: t("An error occurred on server"),
	}
	let message = t("An error occurred on client")

	const titles = {
		404: t("Not found"),
		403: t("Access denied"),
		401: t("Unauthorized"),
		500: t("An error occurred on server"),
	}
	let title = t("An error occurred on client")

	if (status && messages[status]) {
		message = messages[status]
	}

	if (status && titles[status]) {
		title = titles[status]
	}

	// Sent error details to Drupal logger.
	const stack = systemRoute?.error?.stack
	const errMessage = systemRoute?.error?.message
	const statusCode = systemRoute?.error?.statusCode
	writeToDrupalLogger(errMessage, stack, statusCode, currentPath)

	return (
		<div>
			<Head>
				<title>{title}</title>
			</Head>
			<div className="flex min-h-full flex-col bg-white pb-12 pt-16">
				<main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
					<div className="py-16">
						<div className="text-center">
							<p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
								{status}
							</p>
							<h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
								{message}
							</h1>
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}

export const config = {
	id: "error_page",
	params: {},
}

export default ErrorNode
