import React, { useEffect } from "react"
import get from "lodash.get"
import { Wysiwyg } from "@/ui"
import { Link } from "@/ui"
import { Form } from "@/form"
import { dlPush } from "@vactorynext/core/lib"
import { useAccount } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_decoupled_espace_prive:signup",
	lazy: true,
}

/**
 * Delete nested key inside object.
 */
function deleteNestedKey(obj, keyToDelete) {
	for (let prop in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, prop)) {
			if (prop === keyToDelete) {
				delete obj[prop]
			} else if (typeof obj[prop] === "object") {
				deleteNestedKey(obj[prop], keyToDelete)
			}
		}
	}
}

export const AccountRegisterWidget = ({ data }) => {
	const webform_id = get(data, "components.0.webform.id", null)
	const elements = get(data, "components.0.webform.elements", null)
	let style = get(data, "components.0.webform.style", {})
	let buttons = get(data, "components.0.webform.buttons", {})
	const title = get(data, "extra_field.title", null)
	const description = get(data, "extra_field.intro.value.#text", null)
	const link = get(data, "extra_field.link.url", null)
	const link_label = get(data, "extra_field.link.title", null)
	const user_registration_password = get(
		data,
		"components.0.singup_config.user_registration_password",
		"with-pass"
	)
	const { isAuthenticated } = useAccount()

	// Password is not required when Drupal register_pending_approval is on.
	if (user_registration_password === "default") {
		deleteNestedKey(elements, "pass")
	}

	if (style !== "") {
		style = JSON.parse(style)
	}

	if (buttons !== "") {
		buttons = JSON.parse(buttons)
	}

	useEffect(() => {
		// trigger data layer event when visiting a a register form
		dlPush("Affichage formulaire inscription")
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (isAuthenticated) {
		return <h1>Already logged in</h1>
	}

	return (
		<div className="overflow-hidden rounded-lg border border-gray-100 bg-white text-black shadow">
			<div className="p-6">
				<div className="mb-6">
					{title && (
						<h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
							{title}
						</h2>
					)}
					{description && (
						<div className="mx-auto mt-3 sm:mt-4">
							<Wysiwyg html={description} />
						</div>
					)}
				</div>
				{elements && (
					<Form
						webformId={webform_id}
						schema={elements}
						styles={style}
						buttons={buttons}
					/>
				)}

				{link && (
					<div className="mt-12 flex justify-center">
						<Link
							href={link}
							className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
						>
							{link_label}
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}

export default AccountRegisterWidget
