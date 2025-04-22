import get from "lodash.get"
import React, { useState, useRef } from "react"

import { Link, Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:90",
}

const ToolBoxContainer = ({ data }) => {
	const [isActive, setIsActive] = useState(false)
	const toolboxRef = useRef(null)

	function clickOutsideToolbox(ref) {
		function handleClickOutsideToolbox(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				setIsActive(false)
			}
		}
		if (typeof window !== "undefined") {
			// Bind the event listener
			document.addEventListener("mousedown", handleClickOutsideToolbox)
		}
		return () => {
			if (typeof window !== "undefined") {
				// Unbind the event listener on clean up
				document.removeEventListener("mousedown", handleClickOutsideToolbox)
			}
		}
	}

	const handlClick = (e) => {
		e.preventDefault()
		setIsActive(!isActive)
		clickOutsideToolbox(toolboxRef)
	}

	const handlClose = (e) => {
		e.preventDefault()
		setIsActive(false)
	}

	const props = {
		button: {
			title: get(data, "extra_field.title", ""),
			icon: get(data, "extra_field.icon", ""),
		},
		items: data?.components?.map((item) => ({
			icon: get(item, "icon", null),
			link: {
				href: get(item, "link.url", ""),
				title: get(item, "link.title", ""),
				id: get(item, "link.attributes.id", ""),
				className: get(item, "link.attributes.class", ""),
				target: get(item, "link.attributes.target", ""),
				rel: get(item, "link.attributes.rel", ""),
			},
		})),
	}

	return (
		<>
			<nav
				ref={toolboxRef}
				className={vclsx(
					"fixed bottom-16 left-1/2 z-50 flex h-[52px] -translate-x-1/2 overflow-hidden rounded-[100px] bg-white shadow-lg onlyMobile:h-[46px]"
				)}
			>
				<button
					onClick={(e) => handlClick(e)}
					className={vclsx(
						"relative z-50 flex cursor-pointer items-center space-x-2 border-0 bg-primary px-5 py-1 text-left text-white shadow outline-none"
					)}
				>
					{props.button.icon && (
						<Icon id={props.button.icon} className="h-5 w-5 fill-current" />
					)}
					{props.button.title && (
						<span
							className={vclsx(
								"max-w-[60px] text-xs font-semibold",
								isActive && "onlyMobile:hidden onlyMobile:opacity-0"
							)}
						>
							{props.button.title}
						</span>
					)}
				</button>
				<ul
					className={vclsx(
						"m-0 flex max-h-[52px] max-w-0 list-none justify-center space-x-2 overflow-hidden bg-white p-0 transition-all duration-500 onlyMobile:max-h-[46px]",
						isActive && "!max-w-[800px] !px-2"
					)}
				>
					{props.items.map((item, index) => {
						return (
							<li key={index} className="flex-1">
								<Link
									{...item.link}
									href={item.link.href}
									className={vclsx(
										item.link.className,
										"cursor-pointe flex h-full scale-[0.6] flex-col items-center justify-center space-y-1 border-0 bg-transparent px-1 py-1 text-center text-primary transition duration-500 hover:bg-primary hover:text-white",
										isActive && "!scale-100"
									)}
									id={item.link.id}
								>
									<Icon id={item.icon} className="h-4 w-4 fill-current" />
									<span className={"text-[8px] font-semibold onlyMobile:hidden"}>
										{item.link.title}
									</span>
								</Link>
							</li>
						)
					})}
				</ul>
				<button
					onClick={(e) => handlClose(e)}
					className={vclsx(
						"flex w-0 cursor-pointer items-center justify-center self-stretch overflow-hidden border-0 bg-primary text-white outline-none transition-all delay-300 duration-500",
						isActive && "!w-[50px] onlyMobile:!w-[40px]"
					)}
				>
					<Icon id={"x"} className="h-4 w-4 fill-current onlyMobile:h-3 onlyMobile:w-3" />
				</button>
			</nav>
		</>
	)
}

export default ToolBoxContainer
