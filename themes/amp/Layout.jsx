import { BlocksController } from "@vactorynext/core/blocks"
import { NodePageProvider } from "@vactorynext/core/context"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { useAccount } from "@vactorynext/core/hooks"
import { dlPush } from "@vactorynext/core/lib"
import Head from "next/head"
import { Widgets as WidgetsAmp } from "@/runtime/widgets-amp"
import { Widgets } from "@/runtime/widgets"
import css from "./theme.css"
import { Container } from "@/ui"
import { useAmp } from "next/amp"
import "./theme.css"

export function Layout({ children, ...props }) {
	const router = useRouter()
	const { isAuthenticated } = useAccount()
	const isAmp = useAmp()

	useEffect(() => {
		// Push data layer that shows the infos about the visited page
		const checkPageStatus = (url) => {
			let displayMode = "browser tab"
			if (window.matchMedia("(display-mode: standalone)").matches) {
				displayMode = "standalone"
			}
			dlPush("Statut de connexion", {
				Connecté: isAuthenticated,
				"Visite PWA": displayMode === "standalone" ? true : false,
				url: url,
			})
		}
		checkPageStatus(router.asPath)
	}, [router.asPath, isAuthenticated])

	return (
		<>
			<Head>
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
					rel="stylesheet"
				/>
				<style
					amp-custom=""
					dangerouslySetInnerHTML={{
						__html: css
							.toString()
							.replace(/\/\*# sourceMappingURL=.*\*\//g, "")
							.replace(/\/\*# sourceURL=.*\*\//g, "")
							.replace(/\/\*@ sourceURL=.*?\*\//g, ""),
					}}
				/>
			</Head>
			<div className="mx-auto max-w-4xl">
				<NodePageProvider node={props?.node || {}} systemRoute={props?.systemRoute || {}}>
					<div id="header-region">
						<BlocksController
							region="header"
							runtimeWidgets={Widgets}
							runtimeWidgetsAmp={WidgetsAmp}
							ContainerComponent={Container}
							isAmp={isAmp}
						/>
					</div>
					<BlocksController
						region="bridge"
						runtimeWidgets={Widgets}
						runtimeWidgetsAmp={WidgetsAmp}
						ContainerComponent={Container}
						isAmp={isAmp}
					/>
					<main id="main-content">{children}</main>
					<div id="footer-region">
						<BlocksController
							region="footer"
							runtimeWidgets={Widgets}
							runtimeWidgetsAmp={WidgetsAmp}
							ContainerComponent={Container}
							isAmp={isAmp}
						/>
					</div>
				</NodePageProvider>
			</div>
		</>
	)
}
