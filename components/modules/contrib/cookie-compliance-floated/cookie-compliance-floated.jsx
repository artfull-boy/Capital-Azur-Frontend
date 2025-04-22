import React, { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { dlPush } from "@vactorynext/core/lib"
import clsx from "clsx"
import { Link, Wysiwyg, Icon } from "@/ui"
import { motion } from "framer-motion"
import { Disclosure, Switch } from "@headlessui/react"
import { useI18n } from "@vactorynext/core/hooks"

export const CookieComplianceFloated = ({
	body,
	actionLabel,
	declineLabel,
	show = false,
	cookieLifeTime = 300,
	privacyPolicy = {},
}) => {
	const { t } = useI18n()
	const cookieName = "CookieConsent"
	const cookieStored = Cookies.get(cookieName)

	const [showCookie, setShowCookie] = useState(show)
	const [allCookie, setAllCookie] = useState(false)
	const [cookieSettings, setCookieSettings] = useState({
		analytics: false,
		marketing: false,
		preferences: false,
	})

	const handleToggle = () => {
		setShowCookie(!showCookie)
	}

	const updateCookieSettings = (newSettings) => {
		setCookieSettings((prevSettings) => ({ ...prevSettings, ...newSettings }))
	}

	const handleAccept = () => {
		Cookies.set(
			cookieName,
			JSON.stringify({ necessary: true, ...cookieSettings }, { expires: cookieLifeTime })
		)
		dlPush("cookie_consent_given", { necessary: true, ...cookieSettings })
		setShowCookie(false)
	}

	const handleDecline = () => {
		Cookies.set(
			cookieName,
			JSON.stringify(
				{ necessary: true, analytics: false, marketing: false, preferences: false },
				{ expires: cookieLifeTime }
			)
		)
		dlPush("cookie_consent_given", {
			necessary: true,
			analytics: false,
			marketing: false,
			preferences: false,
		})
		setAllCookie(false)
		setShowCookie(false)
	}

	const handleSetAllCookie = (e) => {
		setCookieSettings((prevSettings) => ({
			...prevSettings,
			analytics: e,
			marketing: e,
			preferences: e,
		}))
	}

	useEffect(() => {
		if (Cookies.get(cookieName) === undefined) {
			setShowCookie(true)
		}
	}, [])

	useEffect(() => {
		if (Object.values(cookieSettings).every((value) => value)) {
			setAllCookie(true)
		} else {
			setAllCookie(false)
		}
	}, [cookieSettings])

	useEffect(() => {
		if (cookieStored) {
			const cookieObject = JSON.parse(cookieStored)
			setCookieSettings(cookieObject)
		}
	}, [cookieStored])

	// useEffect(() => {
	// 	setCookieSettings((prevSettings) => ({
	// 		...prevSettings,
	// 		analytics: allCookie,
	// 		marketing: allCookie,
	// 		preferences: allCookie,
	// 	}))
	// }, [allCookie])

	/* if (!isClient()) {
		return null
	} */

	return (
		<>
			<div className="fixed bottom-5 left-5 z-50">
				<motion.div
					initial={{ opacity: 0, x: "-130%" }}
					animate={{ opacity: showCookie ? 1 : 0, x: showCookie ? 0 : "-130%" }}
					transition={{ duration: 0.7 }}
					className="cookie-consent fixed bottom-16 left-5 z-50 w-full max-w-[94vw] sm:max-w-[420px]"
				>
					<div className="rounded border border-primary-200 bg-white shadow-xl">
						<div className="max-h-[75vh] overflow-y-auto overflow-x-hidden px-4 py-4">
							{body && <Wysiwyg html={body} className="prose text-sm" />}
							{privacyPolicy.href && privacyPolicy.title && (
								<Link
									{...privacyPolicy}
									className={clsx(
										privacyPolicy.className,
										"inline-block text-sm text-gray-300 underline"
									)}
								>
									{privacyPolicy.title}
								</Link>
							)}
							<div className="mt-4">
								<Disclosure>
									<Disclosure.Button className="flex w-full items-center justify-between space-x-2 rounded-lg border border-gray-300 bg-transparent px-2 py-2 text-left hover:bg-gray-300">
										{t("Nx:Show piracy settings:")}
										<Icon id={"chevron-down"} className={"h-4 w-4"} />
									</Disclosure.Button>
									<Disclosure.Panel className="">
										<div className="flex items-center justify-between px-4 py-2">
											<span>{t("Nx:Accept All cookies")}</span>
											<Switch
												checked={allCookie}
												onChange={(e) => {
													setAllCookie(e)
													handleSetAllCookie(e)
												}}
												className={`${
													allCookie ? "bg-primary-600" : "bg-gray-200"
												} relative inline-flex h-6 w-11 items-center rounded-full`}
											>
												<span className="sr-only">{t("Nx:Accept All cookies")}</span>
												<span
													className={`${
														allCookie ? "translate-x-6" : "translate-x-1"
													} inline-block h-4 w-4 transform rounded-full bg-white transition`}
												/>
											</Switch>
										</div>

										<div className="overflow-hidden rounded-lg border-2 border-gray-300">
											<div className="flex items-center justify-between border-b border-gray-300 px-4 py-2">
												<span>{t("Nx:Accept analytics cookies")}</span>
												<Switch
													checked={cookieSettings.analytics}
													onChange={() =>
														updateCookieSettings({ analytics: !cookieSettings.analytics })
													}
													className={`${
														cookieSettings.analytics ? "bg-primary-600" : "bg-gray-200"
													} relative inline-flex h-6 w-11 items-center rounded-full`}
												>
													<span className="sr-only">
														{t("Nx:Accept analytics cookies")}
													</span>
													<span
														className={`${
															cookieSettings.analytics ? "translate-x-6" : "translate-x-1"
														} inline-block h-4 w-4 transform rounded-full bg-white transition`}
													/>
												</Switch>
											</div>

											<div className="flex items-center justify-between border-b border-gray-300 px-4 py-2">
												<span>{t("Nx:Accept marketing cookies")}</span>
												<Switch
													checked={cookieSettings.marketing}
													onChange={() =>
														updateCookieSettings({ marketing: !cookieSettings.marketing })
													}
													className={`${
														cookieSettings.marketing ? "bg-primary-600" : "bg-gray-200"
													} relative inline-flex h-6 w-11 items-center rounded-full`}
												>
													<span className="sr-only">
														{t("Nx:Accept marketing cookies")}
													</span>
													<span
														className={`${
															cookieSettings.marketing ? "translate-x-6" : "translate-x-1"
														} inline-block h-4 w-4 transform rounded-full bg-white transition`}
													/>
												</Switch>
											</div>

											<div className="flex items-center justify-between px-4 py-2">
												<span>{t("Nx:Accept preferences cookies")}</span>
												<Switch
													checked={cookieSettings.preferences}
													onChange={() =>
														updateCookieSettings({
															preferences: !cookieSettings.preferences,
														})
													}
													className={`${
														cookieSettings.preferences ? "bg-primary-600" : "bg-gray-200"
													} relative inline-flex h-6 w-11 items-center rounded-full`}
												>
													<span className="sr-only">
														{t("Nx:Accept preferences cookies")}
													</span>
													<span
														className={`${
															cookieSettings.preferences
																? "translate-x-6"
																: "translate-x-1"
														} inline-block h-4 w-4 transform rounded-full bg-white transition`}
													/>
												</Switch>
											</div>
										</div>
									</Disclosure.Panel>
								</Disclosure>
							</div>
						</div>

						<div className="relative mt-4 flex w-full items-stretch justify-center">
							<button
								onClick={handleAccept}
								className={"btn btn_primary btn-sm shrink grow basis-full rounded-none"}
							>
								{actionLabel}
							</button>

							{declineLabel && (
								<button
									onClick={handleDecline}
									className={"btn btn_danger btn-sm shrink grow basis-full rounded-none"}
								>
									{declineLabel}
								</button>
							)}
						</div>
					</div>
				</motion.div>

				<button
					onClick={handleToggle}
					className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary-500"
					aria-label="cookie layer"
				>
					{showCookie ? (
						<Icon id="x" className="h-4 w-4 text-white" />
					) : (
						<Icon id="cookies" className="h-4 w-4 text-white" />
					)}
				</button>
			</div>
		</>
	)
}
