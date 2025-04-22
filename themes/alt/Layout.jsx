import { BlocksController } from "@vactorynext/core/blocks"
import { NodePageProvider } from "@vactorynext/core/context"
import { GlobalVideoModal, BackToTop, Icon, ThemeChanger, Container } from "@/ui"
// import { motion } from "framer-motion"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { useAccount } from "@vactorynext/core/hooks"
import { dlPush } from "@vactorynext/core/lib"
import { Widgets as WidgetsAmp } from "@/runtime/widgets-amp"
import { Widgets } from "@/runtime/widgets"

import "./theme.css"
import { useAmp } from "next/amp"

export function Layout({ children, ...props }) {
	/* const { layoutId } = useContext(AnimationContext)

	const motionVariants = {
		key: layoutId, // layout id to block the screen for 1s
		exit: { x: 0, transition: { duration: 1 } },
	} */

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
			{/* <motion.div {...motionVariants}> */}
			<NodePageProvider node={props?.node || {}} systemRoute={props?.systemRoute || {}}>
				<div id="header-region">
					<BlocksController
						region="top"
						runtimeWidgets={Widgets}
						runtimeWidgetsAmp={WidgetsAmp}
						ContainerComponent={Container}
						isAmp={isAmp}
					/>
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
					<BlocksController
						region="bottom"
						runtimeWidgets={Widgets}
						runtimeWidgetsAmp={WidgetsAmp}
						ContainerComponent={Container}
						isAmp={isAmp}
					/>
				</div>
				<GlobalVideoModal
					closeIcon={<Icon className="h-5 w-5" id="x" />}
					expenderIcon={<Icon className="h-5 w-5" id="arrows-expand" />}
					minimizerIcon={<Icon className="h-5 w-5" id="minus" />}
				/>
				<BackToTop />
				<ThemeChanger />
			</NodePageProvider>
			{/* </motion.div> */}
		</>
	)
}
