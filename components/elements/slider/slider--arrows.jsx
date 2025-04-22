import React, { forwardRef } from "react"
import { Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
import { sliderTheme } from "./theme"

const IconPrev = () => <Icon id="chevron-left" width="28" height="28" />

const IconNext = () => <Icon id="chevron-right" width="28" height="28" />

export const SliderArrows = forwardRef(
	(
		{
			arrowsSettings,
			onClick,
			className = "",
			variant,
			prev,
			next,
			arrowIconNext = <IconNext />,
			arrowIconPrev = <IconPrev />,
			...props
		},
		ref
	) => {
		return (
			<button
				onClick={onClick}
				ref={ref}
				className={vclsx(
					className,
					"rtl-icon",
					sliderTheme[variant].arrows.button,
					prev && sliderTheme[variant].arrows.prev,
					next && sliderTheme[variant].arrows.next,
					arrowsSettings.hideArrowMobile ? "onlyMobile:hidden" : null,
					arrowsSettings.hideArrowTablet ? "onlyTablet:hidden" : null,
					arrowsSettings.hideArrowDesktop ? "onlyDesktop:hidden" : null
				)}
				aria-label="navigation arrow"
				{...props}
			>
				{prev && arrowIconPrev}
				{next && arrowIconNext}
			</button>
		)
	}
)
