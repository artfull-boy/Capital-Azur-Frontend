import React, { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Icon, Text } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"
import Cookies from "js-cookie"

export const ThemeChanger = ({ projectThemeCookie }) => {
	const { t } = useI18n()
	const [mounted, setMounted] = useState(false)
	const [openSwitcher, setOpenSwitcher] = useState(false)
	const { theme, setTheme, systemTheme } = useTheme()
	const wrapperRef = useRef(null)
	// eslint-disable-next-line no-unused-vars
	const [actualTheme, setActualTheme] = useState(theme || projectThemeCookie)

	useEffect(() => {
		setMounted(true)

		const updateThemeBasedOnSystem = () => {
			// Directly use systemTheme if 'system' is selected, otherwise use the set theme
			const newTheme = theme === "system" ? systemTheme : theme
			setActualTheme(newTheme)

			// Setting cookie with the selected theme
			Cookies.set("projectThemeCookie", newTheme)
		}

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
		mediaQuery.addEventListener("change", updateThemeBasedOnSystem) // Update theme when system preference changes
		updateThemeBasedOnSystem() // Also update on component mount

		return () => mediaQuery.removeEventListener("change", updateThemeBasedOnSystem)
	}, [theme, systemTheme])

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setOpenSwitcher(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	/* This is a specific request to purge cache from inginx to fix images caching during switching themes ( it takes 1 min for cached images to be replaced with new ones, So the solution is to purge nginx cache to fix this problem ) */
	const switchTheme = async (theme) => {
		setTheme(theme)
		/* eslint-disable no-restricted-globals */
		try {
			const response = await fetch(`/*`, {
				method: "PURGE",
			})

			if (!response.ok) {
				console.error("Error:", response.statusText)
			}
		} catch (error) {
			console.warn("No Cache to purge, Ignore !")
		}
	}

	if (!mounted) {
		return null
	}

	return (
		<div className="fixed bottom-20 right-7 z-50" ref={wrapperRef}>
			<button
				onClick={() => setOpenSwitcher(!openSwitcher)}
				className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-primary bg-primary-200 text-white hover:bg-primary"
				aria-label={t("Nx:toggle theme switcher")}
			>
				<Icon id="light" className="h-5 w-5" />
			</button>
			{openSwitcher && (
				<div className="absolute -top-[130px] right-0 overflow-hidden rounded-lg border-2 bg-white shadow-md ring-1 ring-gray-300">
					<Text
						className={vclsx(
							"animate flex cursor-pointer items-center justify-start gap-2 text-nowrap p-2 !text-sm font-semibold",
							theme === "light"
								? "bg-primary-500 text-white"
								: "bg-white hover:bg-gray-400 hover:text-white"
						)}
						onClick={() => {
							switchTheme("light")
						}}
					>
						<Icon id="light" className="h-5 w-5" />
						{t("Nx:Light Mode")}
					</Text>
					<Text
						className={vclsx(
							"animate flex cursor-pointer items-center justify-start gap-2 text-nowrap p-2 !text-sm font-semibold",
							theme === "dark"
								? "bg-primary-500 text-white"
								: "bg-white hover:bg-gray-400 hover:text-white"
						)}
						onClick={() => {
							switchTheme("dark")
						}}
					>
						<Icon id="moon" className="h-5 w-5" />
						{t("Nx:Dark Mode")}
					</Text>
					<Text
						className={vclsx(
							"animate flex cursor-pointer items-center justify-start gap-2 text-nowrap p-2 !text-sm font-semibold",
							theme === "system"
								? "bg-primary-500 text-white"
								: "bg-white hover:bg-gray-400 hover:text-white"
						)}
						onClick={() => {
							switchTheme("system")
						}}
					>
						<Icon id="laptop" className="h-5 w-5" />
						{t("Nx:System")}
					</Text>
				</div>
			)}
		</div>
	)
}
