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

	return (
		<div className="relative hidden pb-[90px] pt-[48px] lg:block">
			<Waypoint onEnter={handleAncreEnter} onLeave={handleAncreLeave} />
			<div
				className={`${vclsx(
					"mx-auto flex min-h-[45px] flex-row justify-center rounded-lg border border-gray-100 bg-primary-25 p-1 shadow-lg w-fit ",
					shouldStick
						? "fixed left-0 right-0 top-8 z-30 mx-auto"
						: "absolute left-0 right-0 top-1/2 mx-auto -translate-y-1/2"
				)}`}
			>
				{navigation.map((item) => {
					return (
						<Link
							key={item.id}
							activeClass="bg-primary-500 rounded !text-white"
							to={item.id}
							spy
							smooth
							hashSpy={true}
							className="flex cursor-pointer items-center justify-center p-1
							px-7 text-center text-black font-semibold hover:bg-primary-500 hover:text-white transition-all duration-300 ease-in-out rounded-lg"
							isDynamic={true}
							duration={1000}
							onClick={additionalScroll}
						>
							<Text as="span" variant="body2">
								{item.name}
							</Text>
						</Link>
					)
				})}
			</div>
		</div>
	)
}
