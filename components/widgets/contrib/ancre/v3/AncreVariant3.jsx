import { useEffect, useState } from "react"
import { Link } from "react-scroll"
import { Waypoint } from "react-waypoint"

import { Text, Heading, Button } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const VactoryAncre = ({ data }) => {
	const [fixeTop, setfixeTop] = useState(false)
	const [fixeBottom, setfixeBottom] = useState(false)
	useEffect(() => {
		//! check that "vactory-paragrphs-wrapper" class exists first then continue
		const mainElement = document.querySelector(".vactory-paragrphs-wrapper")
		if (mainElement) {
			const mainHeight = mainElement.offsetHeight
			window.addEventListener("scroll", () => {
				if (window.scrollY > 300) {
					if (window.scrollY < mainHeight) {
						setfixeTop(true)
						setfixeBottom(false)
					} else {
						setfixeTop(false)
						setfixeBottom(true)
					}
				} else {
					setfixeTop(false)
				}
			})
		}
	}, [])

	// /* To Fix react-scroll bug, Sometimes it's not reaching the targeted paragraph (1px less) */
	const additionalScroll = () => {
		// We are using setTimeOut to wait for react-scroll's scrolling to end ( Which takes 1000ms ), and then after 50ms we scroll for additional 2px to fix the bug we are facing
		setTimeout(() => {
			window.scrollTo(0, window.scrollY + 2)
		}, 1050)
	}

	// Determening the active id
	const [activeId, setActiveId] = useState("")
	const link_attributes = {
		id: data.btn?.id,
		target: data.btn?.target,
		rel: data.btn?.rel,
		className: data.btn?.class,
	}
	return (
		<div className="hidden lg:block">
			<Waypoint />
			<div
				className={`${vclsx(
					"mt-9 flex w-[300px] flex-col gap-2 rounded-md bg-error-500 p-3 transition-all duration-500",
					fixeTop && "fixed top-0",
					fixeBottom && "absolute bottom-10"
				)}`}
			>
				<Heading level={6} className="text-white">
					{data.title}
				</Heading>
				<div className="mb-3">
					{data.navigation.map((item) => {
						return (
							<div
								className="group relative mb-4 flex items-center last:mb-0"
								key={item.id}
							>
								<Link
									activeClass="active"
									to={item.id}
									spy
									smooth
									hashSpy={true}
									className={vclsx(
										"group relative h-4 w-4 cursor-pointer rounded-full border border-white before:absolute before:left-1/2 before:top-1/2 before:h-4 before:w-4 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:content-['']",
										item.id === activeId ? "before:bg-white" : "before:bg-white/[.3]"
									)}
									isDynamic={true}
									duration={1000}
									offset={30}
									onClick={additionalScroll}
									onSetActive={(e) => setActiveId(e)}
									href="#."
								></Link>
								<Text
									as="span"
									variant="body2"
									className={vclsx(
										"-top-[4px] right-8 px-3 py-[2px] text-[14px] before:absolute before:left-[7px] before:top-5 before:h-[26px] before:w-[2px] before:bg-white/[.4] before:content-[''] group-last:before:h-0",
										item.id === activeId ? "text-white" : "text-white/[.8]"
									)}
								>
									{item.name}
								</Text>
							</div>
						)
					})}
				</div>
				<Button
					href={data.btn?.url}
					className={`${vclsx("btn-sm ", data.btn?.class)}`}
					{...link_attributes}
					variant="white"
				>
					{data.btn?.title}
				</Button>
			</div>
		</div>
	)
}
