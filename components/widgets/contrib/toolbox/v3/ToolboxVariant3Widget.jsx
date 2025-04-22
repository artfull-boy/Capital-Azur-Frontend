import get from "lodash.get"
import React from "react"

import { Tooltip, Link, Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:36",
}

export const ToolBoxItem = ({ props }) => {
	return (
		<>
			<Tooltip
				className={"upToTablet:hidden"}
				position={"leftCenter"}
				text={props.cta.title}
			>
				<Link
					id={props.cta.id}
					href={props.cta.href}
					target={props.cta.target}
					rel={props.cta.rel}
					className={vclsx(
						props.cta.className,
						"flex flex-col items-center justify-center bg-black/90 p-2 hover:bg-error-500 focus:bg-error-500 onlyDesktop:rounded-bl-md onlyDesktop:rounded-tl-md onlyDesktop:shadow-[-5px_6px_19px_-1px_#b6bec9]"
					)}
				>
					<span className={vclsx("inline-flex items-center px-3 py-3")}>
						<Icon id={props.icon} className="h-7 w-7 text-white" />
					</span>
					<span className={vclsx("text-white onlyDesktop:hidden")}>
						{props.titleMobile}
					</span>
				</Link>
			</Tooltip>
		</>
	)
}

export const ToolboxButton = ({ props }) => {
	return (
		<>
			<Link
				id={props.cta.id}
				href={props.cta.href}
				target={props.cta.target}
				rel={props.cta.rel}
				className={vclsx(
					props.cta.className,
					"flex items-center justify-center rounded-bl-md rounded-tl-md border border-success-300 bg-success-300 px-6 py-4 text-center text-white shadow-[-5px_6px_19px_-1px_#b6bec9] hover:bg-white hover:text-black"
				)}
			>
				{/* <span className={vclsx("inline-flex items-center h-[50px] w-[50px] py-3 px-3")}>
					<Icon id={props.icon} className="w-5 h-5" />
				</span> */}
				<span className="inline-block w-[8px] whitespace-pre-wrap break-words">
					{props.cta.title}
				</span>
			</Link>
		</>
	)
}

const ToolBoxContainer = ({ data }) => {
	const props = {
		items: data?.components?.map((item) => ({
			isButton: get(item, "active_button", false),
			icon: get(item, "idIcon", ""),
			titleMobile: get(item, "label", ""),
			cta: {
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
			<div className="onlyDesktop:fixed onlyDesktop:right-0 onlyDesktop:top-[200px] onlyDesktop:z-30 onlyDesktop:flex onlyDesktop:flex-col onlyDesktop:items-end">
				<ul className="upToTablet:fixed upToTablet:bottom-0 upToTablet:left-0 upToTablet:right-0 upToTablet:flex">
					{props.items.map((item, index) => {
						if (!item.isButton) {
							return (
								<li
									key={index}
									className={"onlyDesktop:mb-4 upToTablet:shrink-0 upToTablet:grow"}
								>
									<ToolBoxItem props={item} />
								</li>
							)
						}
					})}
				</ul>
				<ul className="upToTablet:fixed upToTablet:right-0 upToTablet:top-[200px] upToTablet:z-30 upToTablet:flex upToTablet:flex-col upToTablet:items-end">
					{props.items.map((item, index) => {
						if (item.isButton) {
							return (
								<li key={index} className={"my-10"}>
									<ToolboxButton props={item} />
								</li>
							)
						}
					})}
				</ul>
			</div>
		</>
	)
}

export default ToolBoxContainer
