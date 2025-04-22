import PropTypes from "prop-types"
import React, { forwardRef } from "react"

import { vclsx } from "@vactorynext/core/utils"

// import { Icon } from "../icon/Icon"
import { Link } from "../link/Link"
import { button } from "./theme"

const CustomButton = ({
	children,
	icon,
	// eslint-disable-next-line no-unused-vars
	isAmp = false,
	...props
}) => {
	return (
		<button {...props}>
			{icon && icon}
			{children}
		</button>
	)
}

const Button = forwardRef(
	(
		{
			children,
			type = "button",
			className = "px-[33px] py-[15px] rounded-[8px]",
			variant = "primary",
			size = "normal",
			pill,
			outline = false,
			disabled = false,
			onClick,
			icon,
			href = null,
			target = null,
			isAmp = false,
			isExternal,
			...props
		},
		ref
	) => {
		const Button = href ? (isExternal ? "a" : Link) : CustomButton
		return (
			<Button
				ref={ref}
				rel={href && target === "_blank" ? "noopener" : null}
				disabled={disabled}
				type={href ? null : type}
				onClick={onClick}
				href={href}
				target={target}
				isAmp={isAmp}
				className={vclsx(
					button.base,
					button.size[size],
					!outline ? button.variant[variant] : button.outlineVariant[variant],
					pill && button.pill,
					disabled && button.disabled,
					icon && button.icon,
					className
				)}
				{...props}
			>
				{icon && icon}
				{children}
			</Button>
		)
	}
)

Button.propTypes = {
	children: PropTypes.node.isRequired,
	submit: PropTypes.oneOf(["submit", "button"]),
	/** demo description */
	className: PropTypes.string,
	pill: PropTypes.bool,
	outline: PropTypes.bool,
	disabled: PropTypes.bool,
}

export { Button }
