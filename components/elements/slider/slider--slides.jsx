import { vclsx } from "@vactorynext/core/utils"

export const SliderSlides = ({ children, className = "", ...props }) => {
	return (
		<div className={vclsx("keen-slider__slide", className)} {...props}>
			{children}
		</div>
	)
}
