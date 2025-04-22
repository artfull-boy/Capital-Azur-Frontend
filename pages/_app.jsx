import {
	Close,
	Badge,
	Navigation,
	Content,
	styles,
} from "../components/modules/contrib/tour"
import { FlagBagProvider, useFlags } from "@vactory/console/client"
import dynamic from "next/dynamic"
import "react-json-view-lite/dist/index.css"
import { ScreenStats } from "@/ui"
import { Inter, Cairo, Montserrat } from "next/font/google"
import {
	usePageViewTracking,
	useThemeObserver,
	useDocumentClasses,
	usePwaFirstVisit,
	useCookieConsent,
	useUtmParameters,
	useNProgress,
	useAppConfig,
	AppHead,
	AppProviders,
} from "@vactorynext/core/config-client"
import { TourContextProvider } from "@vactorynext/core/context"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const inter = Inter({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	display: "swap",
	subsets: ["latin"],
})

const cairo = Cairo({
	weight: ["200", "300", "400", "500", "600", "700"],
	display: "swap",
	subsets: ["latin", "arabic"],
})

const monstserrat = Montserrat({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	display: "swap",
	subsets: ["latin"]})

const OneSignalPushNotificationInitializer = dynamic(
	() =>
		import("../components/modules/contrib/onesignal/onesignal").then(
			(mod) => mod.OneSignalPushNotificationInitializer
		),
	{ ssr: false }
)

const Layout = ({ getLayout, Component, pageProps, theme }) => {
	return getLayout(<Component {...pageProps} />, theme)
}

export default function App({ Component, pageProps }) {
	// Retrieves app configuration values: isAmp indicates if the page is in AMP mode, theme is the current theme, and getLayout is a function to get the layout for the component.
	const { isAmp, theme, getLayout } = useAppConfig({
		Component,
		pageProps,
		toast,
	})

	// Pass the color to the NProgress with important sign '!', default is !bg-primary
	useNProgress("!bg-primary")

	// Setup effects
	// Track page views for analytics
	usePageViewTracking()

	// Handle theme changes and trigger page reload when theme changes
	useThemeObserver()

	// Set body and html classes from document properties
	useDocumentClasses(pageProps?.document)

	// Track first visit to PWA version and send analytics
	usePwaFirstVisit()

	// Handle cookie consent and send analytics when marketing cookies accepted
	useCookieConsent()

	// Store and manage UTM parameters for campaign tracking
	useUtmParameters()

	return (
		<>
			{/* Font family configuration based on locale */}
			{pageProps.locale === "ar" ? (
				<style jsx global>{`
					:root {
						--rtl-font-family: ${monstserrat.style.fontFamily};
					}
				`}</style>
			) : (
				<style jsx global>{`
					:root {
						--sans-font-family: ${monstserrat.style.fontFamily};
					}
				`}</style>
			)}

			{/* Flag management provider wrapper */}
			<FlagBagProvider value={pageProps?.flags || {}}>
				<div id="theme-selector" data-theme={pageProps?.node?._theme} />

				{/* Analytics and meta components */}
				<AppHead
					pageProps={pageProps}
					isAmp={isAmp}
					/* Below is an example on how to pass custom meta tags, link tags and script tags */
					customTags={
						{
							/* meta: { author: "Void" },
						link: [{ rel: "canonical", href: "https://yoursite.com" }],
						script: [
							{
								type: "application/ld+json",
								dangerouslySetInnerHTML: {
									__html: JSON.stringify({
										"@context": "https://schema.org",
										"@type": "Organization",
										name: "YourCompany",
									}),
								},
							},
						], */
						}
					}
				>
					{/* Any other custom head elements */}
				</AppHead>

				{/* Main app providers wrapper */}
				<AppProviders
					pageProps={pageProps}
					useFlags={useFlags}
					ToastContainer={ToastContainer}
					extraProviders={[
						{
							component: TourContextProvider,
							props: {
								components: {
									Badge,
									Close,
									Navigation,
									Content,
								},
								styles: styles,
							},
						},
					]}
				>
					{/* Main content with layout */}
					<Layout
						getLayout={getLayout}
						Component={Component}
						pageProps={pageProps}
						theme={theme}
					>
						<Component {...pageProps} />
					</Layout>

					{/* Additional functionality */}
					<OneSignalPushNotificationInitializer />
				</AppProviders>

				{/* Utility components */}
				<ScreenStats />
			</FlagBagProvider>
		</>
	)
}
