import React, { useContext, forwardRef } from "react"

import { ThemeContext } from "@vactory/ui/theme-context"
import { Icon } from "@vactory/ui/icon"
import { vclsx } from "@vactorynext/core/utils"
// import { Button } from "@vactory/ui/button"

const IconLeft = () => <Icon id="chevron-left" width="50" height="50" />

const IconRight = () => <Icon id="chevron-right" width="50" height="50" />

export const Arrows = forwardRef(
	(
		{
			onClick,
			className = "",
			variant,
			left,
			right,
			iconLeft = <IconLeft />,
			iconRight = <IconRight />,
			...props
		},
		ref
	) => {
		const { slider } = useContext(ThemeContext)
		return (
			<button
				onClick={onClick}
				ref={ref}
				className={vclsx(
					className,
					slider[variant].arrows.wrapper,
					left && slider[variant].arrows.left,
					right && slider[variant].arrows.right
				)}
				{...props}
			>
				{left && iconLeft && iconLeft}
				{right && iconRight && iconRight}
			</button>
		)
	}
)
