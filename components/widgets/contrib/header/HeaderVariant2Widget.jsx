import { useRouter } from "next/router"
import { Fragment, useState, useEffect, useRef } from "react"
import Helmet from "react-helmet"

import { useNode, useI18n, useMenu, useHeader, useAccount } from "@vactorynext/core/hooks"
import { dlPush, getEnabledLanguages } from "@vactorynext/core/lib"
import { Menu, Transition } from "@headlessui/react"
import { Avatar, Icon, Link, Button, Text, AutocompleteSearchOverlay, Image } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_header:variant2",
}

const languages = getEnabledLanguages({
	withLabels: true,
})

const UserInfo = () => {
	const { t } = useI18n()
	const { signOut, loginUrl, profile, isAuthenticated } = useAccount()

	if (isAuthenticated) {
		return <UserMenu data={profile} signOut={signOut} />
	}

	return (
		<>
			<Link
				href={loginUrl}
				className="inline-block rounded-md border border-black bg-white px-4 py-2 text-base font-medium text-black hover:border-gray-500 hover:bg-gray-500 hover:text-white tabDown:hidden"
			>
				{t("Nx:Sign in")}
			</Link>
			<Link href={loginUrl} className="tabUp:hidden" aria-label="login">
				<Icon
					id="user-circle"
					width="20px"
					height="20px"
					className="h-6 w-6 text-black"
				/>
			</Link>
		</>
	)
}

const Header = ({
	mainMenu,
	logo,
	switchLocation,
	showAccount,
	showOverlay,
	isSearchOverlayVisible,
}) => {
	const { t } = useI18n()
	const router = useRouter()
	const locale = router.locale
	const navigation = useMenu(mainMenu)

	// if true, show mobile menu
	const [showMobileList, setShowMobileList] = useState(false)

	// Functionality to handle showing the sub menus
	const [showSubMenu, setShowSubMenu] = useState(null)

	// To hide/animate the header
	const { headerState } = useHeader(100)

	// Menu container red
	const menuRef = useRef(null)

	// CAssociated with the use effect below, true if we clicked on the element, false if we clicked outside of it
	const [hideSubmenuOnOutsideClick, setHideSubmenuOnOutsideClick] = useState(true)

	// To check if we clicked outside or inside the an element, Returns true if we cliked on the element or its children, else it returns false
	useEffect(() => {
		function handleClickOutside(event) {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setHideSubmenuOnOutsideClick(false)
			} else {
				setHideSubmenuOnOutsideClick(true)
			}
		}
		// Bind the event listener
		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [menuRef])

	//Prevent body scrolling on mobile header open & search overlay
	useEffect(() => {
		showMobileList || isSearchOverlayVisible
			? document.body.classList.add("overflow-y-hidden")
			: document.body.classList.remove("overflow-y-hidden")
	}, [showMobileList, isSearchOverlayVisible])

	return (
		<header
			className={vclsx(
				"left-0 z-[90] w-full transition-all duration-500 tabDown:fixed tabDown:top-0 tabDown:bg-white",
				headerState === "top"
					? "absolute top-0"
					: headerState === "bypassing_header"
						? "absolute -top-[125px] shadow"
						: headerState === "scroll_down_after_header"
							? "absolute -top-[125px] bg-white shadow"
							: headerState === "scroll_top"
								? "fixed top-0 bg-white shadow"
								: "absolute top-0"
			)}
		>
			<Helmet
				bodyAttributes={{
					class: "tabDown:pt-[98px]",
				}}
			/>
			<a
				className="absolute left-0 top-0 m-2.5 block h-0 w-0 -translate-y-16 overflow-hidden whitespace-nowrap bg-primary-500 p-2.5 text-white transition focus:h-auto focus:w-auto focus:translate-y-0"
				href="#main-content"
			>
				{t("Nx:Skip to main content")}
			</a>
			<nav className="mx-auto max-w-7xl px-4 tabUp:px-12" aria-label="Top">
				<div className="flex w-full items-center justify-between py-6">
					<div className="flex items-center">
						<Icon
							id={showMobileList ? "x-solid" : "burger-menu"}
							className="mr-2 h-5 w-5 cursor-pointer text-black tabUp:hidden"
							onClick={() =>
								showMobileList ? setShowMobileList(false) : setShowMobileList(true)
							}
						/>
						<Link href={`/${locale}`}>
							<Text as="span" className="sr-only">
								Factory
							</Text>
							{logo.src && (
								<Image className="h-10 w-auto" {...logo} alt={logo.alt} priority="high" />
							)}
						</Link>
						{/* Desktop Menu Level 1 */}
						<ul className="ml-10 flex space-x-8 tabDown:hidden" ref={menuRef}>
							{navigation.map((link, i) => (
								<li className="relative" key={i}>
									{link.below ? (
										<Text
											as="span"
											key={link.id}
											id={link.options.attributes.id}
											className="flex cursor-pointer items-center text-base font-medium text-black hover:text-primary-500"
											onClick={() =>
												showSubMenu == i ? setShowSubMenu(null) : setShowSubMenu(i)
											}
										>
											{link.title}
											<Icon id="chevron-down" className="ml-1 h-2 w-2" />
										</Text>
									) : (
										<Link
											key={link.id}
											id={link.options.attributes.id}
											href={link.url}
											className="text-base font-medium text-black hover:text-primary-500"
											onClick={() => setShowSubMenu(null)}
										>
											{link.title}
										</Link>
									)}
									{/* Desktop Menu Level 2 */}
									{link.below && hideSubmenuOnOutsideClick && (
										<ul
											className={vclsx(
												"absolute left-0 top-[62px] min-w-[150px] max-w-[300px] bg-white",
												showSubMenu == i ? "block" : "hidden"
											)}
										>
											{link.below.map((submenu, i) => {
												return (
													<li key={i}>
														<Link
															key={submenu.id}
															href={submenu.url}
															id={submenu.options.attributes.id}
															className="block whitespace-nowrap px-4 py-3 text-base font-medium text-black hover:bg-gray-500 hover:text-white"
															onClick={() => setShowSubMenu(null)}
														>
															{submenu.title}
														</Link>
													</li>
												)
											})}
										</ul>
									)}
								</li>
							))}
						</ul>
					</div>
					<div className="flex items-center space-x-2">
						{switchLocation == 1 && <SwitchLocale />}
						{showAccount == 1 && <UserInfo />}
						<Button
							className="border-0 bg-transparent text-black"
							onClick={() => {
								showOverlay()
							}}
						>
							<Icon id="search" className="h-5 w-5" />
						</Button>
					</div>
				</div>
				<div
					className={vclsx(
						"fixed top-[89px] flex h-full w-full flex-col items-start overflow-y-scroll bg-white p-5 transition-all duration-300 tabUp:hidden",
						showMobileList ? "left-0" : "-left-full"
					)}
				>
					{/* Mobile Menu Level 1 */}
					<ul>
						{navigation.map((link, i) => (
							<li className="relative mb-5 last:mb-0" key={i}>
								{link.below ? (
									<Text
										as="span"
										key={link.id}
										id={`${link?.options?.attributes?.id}-mobile`}
										className="hover:text-gray-5000 relative mb-2 inline-block text-2xl font-medium text-black before:absolute before:bottom-0 before:left-0 before:w-8 before:border-b before:content-['']"
									>
										{link.title}
									</Text>
								) : (
									<Link
										key={link.id}
										id={`${link?.options?.attributes?.id}-mobile`}
										href={link.url}
										className="hover:text-gray-5000 relative mb-2 inline-block text-2xl font-medium text-black before:absolute before:bottom-0 before:left-0 before:w-8 before:border-b before:content-['']"
										onClick={() => setShowMobileList(false)}
									>
										{link.title}
									</Link>
								)}
								{/* Mobile Menu Level 2 */}
								{link.below && (
									<ul>
										{link.below.map((submenu, i) => {
											return (
												<li className="mb-3 pl-5 last:mb-0" key={i}>
													<Link
														key={submenu.id}
														href={submenu.url}
														id={`${submenu?.options?.attributes?.id}-mobile`}
														className="text-lg font-medium text-black hover:text-gray-500"
														onClick={() => setShowMobileList(false)}
													>
														{submenu.title}
													</Link>
												</li>
											)
										})}
									</ul>
								)}
							</li>
						))}
					</ul>
				</div>
			</nav>
		</header>
	)
}

const SwitchLocale = () => {
	const router = useRouter()
	const locale = router.locale
	const { path_18n } = useNode()
	const menuButtonRef = useRef(null)
	// trigger data layer event when switching language
	const handleLangSwitch = (language) => {
		dlPush("Sélection langue", {
			Langue: language.code,
		})
		menuButtonRef?.current?.click()
	}

	// Filter out the current locale from the languages
	const availableLanguages = languages.filter(
		(language) => path_18n[language.code] && language.code !== locale
	)
	// Don't show the locale switcher if no other languages are available
	if (availableLanguages.length === 0) return null

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full items-center justify-center rounded-md bg-black bg-opacity-10 px-3 py-2 text-sm font-medium text-black hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 tabUp:px-4">
					{locale.toUpperCase()}
					<Icon
						id="chevron-down"
						className="-mr-1 ml-2 h-2 w-2 text-black hover:text-primary-100"
						aria-hidden="true"
					/>
				</Menu.Button>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 z-10 mt-2 w-20 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="px-1 py-1 ">
						{availableLanguages.map((language) => {
							const url = path_18n[language.code]
							if (!url) return null
							return (
								<Menu.Item key={language.code} as="div">
									{({ active }) => {
										return (
											<a
												onClick={() => {
													handleLangSwitch(language)
												}}
												locale={false}
												href={url}
												className={`${
													active ? "bg-primary-500 text-white" : "text-gray-900"
												} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
											>
												{/* {active ? (
										<EditActiveIcon className="w-5 h-5 mr-2" aria-hidden="true" />
									) : (
										<EditInactiveIcon className="w-5 h-5 mr-2" aria-hidden="true" />
									)} */}
												{language.label}
											</a>
										)
									}}
								</Menu.Item>
							)
						})}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	)
}

const UserMenu = ({ data, signOut }) => {
	const router = useRouter()
	const { locale } = router

	const userNavigation = [
		{ name: "Settings", href: `/${locale}/user/profile` },
		{ name: "Sign out", href: "#.", onClick: signOut },
	]

	return (
		<Menu as="div" className="relative ml-4 inline-block flex-shrink-0">
			<div>
				<Menu.Button className="flex rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
					<Text as="span" className="sr-only">
						Open user menu
					</Text>
					{data.user?.avatar ? (
						<Avatar src={data.user.avatar} size="normal" alt="Me" />
					) : (
						<Avatar variant="placeholder" size="normal" />
					)}
				</Menu.Button>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute	right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<Menu.Item>
							<Text as="span" className="block px-4 py-2 text-sm font-bold text-gray-900">
								{data.user.full_name}
							</Text>
						</Menu.Item>
					</div>
					<div className="py-1">
						{userNavigation.map((item) => (
							<Menu.Item key={item.name}>
								{({ active }) => (
									<Link href={item?.href} passHref>
										<Link
											onClick={item?.onClick}
											className={vclsx(
												active ? "bg-gray-100 text-gray-900" : "text-gray-700",
												"block rounded-md px-4 py-2 text-sm"
											)}
										>
											{item.name}
										</Link>
									</Link>
								)}
							</Menu.Item>
						))}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	)
}

const HeaderContainer = ({ data }) => {
	const props = {
		mainMenu: data?.extra_field?.use_menu,
		logo: {
			src: data?.extra_field?.header_logo?.[0]?._default || null,
			width: data?.extra_field?.header_logo?.[0]?.meta?.width,
			height: data?.extra_field?.header_logo?.[0]?.meta?.height,
			alt: data?.extra_field?.header_logo?.[0]?.meta?.alt,
		},
		switchLocation: data?.extra_field?.show_language_dropdown,
		showAccount: data?.extra_field?.show_account,
	}

	const [isSearchOverlayVisible, setIsSearchOverlayVisible] = useState(false)
	const handleShowOverlay = () => {
		setIsSearchOverlayVisible(true)
	}

	useEffect(() => {
		document.addEventListener("keyup", (e) => {
			if (e.key === "Escape") {
				setIsSearchOverlayVisible(false)
			}
		})
	}, [isSearchOverlayVisible])

	return (
		<>
			<Header
				{...props}
				showOverlay={handleShowOverlay}
				isSearchOverlayVisible={isSearchOverlayVisible}
			/>
			<AutocompleteSearchOverlay
				show={isSearchOverlayVisible}
				onClose={() => {
					setIsSearchOverlayVisible(false)
				}}
			></AutocompleteSearchOverlay>
		</>
	)
}

export default HeaderContainer
