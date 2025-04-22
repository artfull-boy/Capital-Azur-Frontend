import { vclsx } from "@vactorynext/core/utils"

export const SliderThumbs = ({ children, className = "", ...props }) => {
	return (
		<div
			className={vclsx("keen-slider__slide keen-slider__thumbs", className)}
			{...props}
		>
			{children}
		</div>
	)
}
