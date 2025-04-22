import { default as NextLink } from "next/link"
import PropTypes from "prop-types"
import React, { forwardRef } from "react"
import { link } from "./theme"
import { vclsx } from "@vactorynext/core/utils"

//import { AnimationContext } from "@vactorynext/core/context"
//import { v4 as uuidv4 } from "uuid"

// https://github.com/makeswift/makeswift/blob/main/packages/runtime/src/components/shared/Link/index.tsx
const Link = forwardRef(
	(
		{
			href = "#.",
			children,
			className = "",
			variant = "default",
			onClick = null,
			// title = "",
			// pageTransition = false,
			isAmp = false,
			target = "_self",
			...rest
		},
		ref
	) => {
		// const { setPageTransition, setUpcomingRoute, setLayoutId } = useContext(AnimationContext)

		const handleClick = () => {
			// setPageTransition(pageTransition)
			// setUpcomingRoute(title)
			// setLayoutId(uuidv4()) // generate new id to block the screen until the page transition layer finition it's animation
			if (onClick !== null) {
				onClick()
			}
		}
		const linkhref = isAmp
			? href.includes("?")
				? href + "&amp=1"
				: href + "?amp=1"
			: href
		return (
			<NextLink
				href={linkhref}
				ref={ref}
				rel={target === "_blank" ? "noopener" : null}
				target={target}
				className={vclsx(className, link[variant])}
				onClick={handleClick}
				{...rest}
			>
				{children}
			</NextLink>
		)
	}
)

Link.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	href: PropTypes.string.isRequired,
	isAmp: PropTypes.bool,
}

export { Link }
