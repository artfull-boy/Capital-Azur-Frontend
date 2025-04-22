import { deserialise } from "kitsu-core"
import get from "lodash.get"
import { useRouter } from "next/router"
import React from "react"
import { Form } from "@/form"
import { useAccount, useI18n } from "@vactorynext/core/hooks"
import { Link, Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
import AccountEditPasswordPage from "./AccountEditPassword"
import { AccountEmprunt } from "./AccountEmprunt"

export const config = {
	id: "vactory_decoupled_espace_prive:account",
	lazy: true,
}

const AccountWidget = ({ data }) => {
	const webform_id = get(data, "components.0.webform.id", null)
	const elements = get(data, "components.0.webform.elements", null)
	let style = get(data, "components.0.webform.style", {})
	let buttons = get(data, "components.0.webform.buttons", {})
	const user = deserialise(get(data, "components.0.user.data", {}))
	const user_data = user.data ?? {}
	const account = user_data[0] ?? {}
	const { isAuthenticated, updateUserSession, profile } = useAccount()
	const router = useRouter()
	const currentRoute = router.query?.p || "account"
	const has_password = profile?.user?.has_password
	const showEditPassword = currentRoute === "password" && has_password
	const showEditAccount =
		currentRoute === "account" || (currentRoute === "password" && !has_password)
	if (!isAuthenticated) {
		return null
	}

	return (
		<ProfileLayout>
			{showEditAccount && (
				<Form
					webformId={webform_id}
					schema={elements}
					styles={style}
					buttons={buttons}
					confirmeSubmit={async () => {
						await updateUserSession()
					}}
					reset={false}
				/>
			)}
			{showEditPassword && <AccountEditPasswordPage account={account} />}
			{currentRoute === "emprunt" && <AccountEmprunt />}
		</ProfileLayout>
	)
}

const ProfileLayout = ({ children }) => {
	const router = useRouter()
	const { accountUrl, profile } = useAccount()
	const { t } = useI18n()
	// const locale = router.locale
	const currentRoute = router.query?.p || "account"

	let navigation = [
		{
			name: "Account",
			href: accountUrl,
			icon: "user-circle",
			current: currentRoute === "account",
		},

		{
			name: t("Biometerie"),
			href: `${accountUrl}?p=emprunt`,
			icon: "fingerprint",
			current: currentRoute === "emprunt",
		},
	]

	if (profile?.user?.has_password) {
		navigation = [
			...navigation,
			{
				name: "Password",
				href: `${accountUrl}?p=password`,
				icon: "key",
				current: currentRoute === "password",
			},
		]
	}

	return (
		<div className="bg-gray-100">
			<div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
				<div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
					<aside className="px-2 py-6 sm:px-6 lg:col-span-3 lg:px-0 lg:py-0">
						<nav className="space-y-1">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className={vclsx(
										item.current
											? "bg-gray-50 text-primary-700 hover:bg-white hover:text-primary-700"
											: "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
										"group flex items-center rounded-md px-3 py-2 text-sm font-medium"
									)}
									aria-current={item.current ? "page" : undefined}
								>
									<Icon
										id={item.icon}
										className={vclsx(
											item.current
												? "text-primary-500 group-hover:text-primary-500"
												: "text-gray-400 group-hover:text-gray-500",
											"-ml-1 mr-3 h-6 w-6 flex-shrink-0"
										)}
										aria-hidden="true"
									/>
									<span className="truncate">{item.name}</span>
								</Link>
							))}
						</nav>
					</aside>

					<div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">{children}</div>
				</div>
			</div>
		</div>
	)
}

export default AccountWidget
