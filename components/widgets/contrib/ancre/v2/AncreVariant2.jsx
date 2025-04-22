import { useState } from "react"
import { Link } from "react-scroll"
import { Waypoint } from "react-waypoint"

import { Text } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const VactoryAncre = ({ navigation }) => {
	const [shouldStick, setShouldStick] = useState(false)

	const handleAncreEnter = () => {
		setShouldStick(false)
	}

	const handleAncreLeave = () => {
		setShouldStick(true)
	}

	/* To Fix react-scroll bug, Sometimes it's not reaching the targeted paragraph (1px less) */
	const additionalScroll = () => {
		// We are using setTimeOut to wait for react-scroll's scrolling to end ( Which takes 1000ms ), and then after 50ms we scroll for additional 2px to fix the bug we are facing
		setTimeout(() => {
			window.scrollTo(0, window.scrollY + 2)
		}, 1050)
	}

	// Determening the active id
	const [activeId, setActiveId] = useState("")

	return (
		<div className="hidden lg:block">
			<Waypoint onEnter={handleAncreEnter} onLeave={handleAncreLeave} />
			<div
				className={`${vclsx(
					"fixed top-1/2 z-50 flex w-7 -translate-y-1/2 flex-col items-center gap-2 rounded-2xl bg-white py-2 shadow-lg transition-all duration-500",
					shouldStick ? "right-2" : "-right-10"
				)}`}
			>
				{navigation.map((item) => {
					return (
						<Link
							key={item.id}
							activeClass="border-2 !border-error-500 before:content-[''] before:absolute before:w-[6px] before:h-[6px] before:bg-error-500 before:rounded-full before:top-1/2 before:left-1/2 before:-translate-y-1/2 before:-translate-x-1/2"
							to={item.id}
							spy
							smooth
							hashSpy={true}
							className="group relative h-4 w-4 cursor-pointer rounded-full border border-gray-700 transition-all duration-500 hover:border-2 hover:border-error-500"
							isDynamic={true}
							duration={1000}
							onClick={additionalScroll}
							onSetActive={(e) => setActiveId(e)}
							href="#."
						>
							<Text
								as="span"
								variant="body2"
								className={vclsx(
									"absolute -top-[4px] right-8 w-max rounded-xl bg-error-500 px-3 py-[2px] text-[10px] uppercase text-white shadow-md transition-all duration-500 after:absolute after:-right-[1px] after:top-1/2 after:h-[6px] after:w-[6px] after:-translate-y-1/2 after:rotate-45 after:bg-error-500 after:content-['']",
									item.id === activeId
										? "opacity-1 visible"
										: "invisible opacity-0 group-hover:visible group-hover:opacity-60",
									shouldStick ? "" : "invisible opacity-0"
								)}
							>
								{item.name}
							</Text>
						</Link>
					)
				})}
			</div>
		</div>
	)
}
