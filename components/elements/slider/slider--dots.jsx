import { vclsx } from "@vactorynext/core/utils"
import { sliderTheme } from "./theme"

export const SliderDots = ({ instanceRef, currentSlide, className, variant }) => {
	return (
		<div className={vclsx("dots", sliderTheme[variant].dots.wrapper, className)}>
			{[...Array(instanceRef?.current?.track?.details?.slides.length).keys()].map(
				(idx) => {
					return (
						<button
							key={idx}
							onClick={() => {
								instanceRef.current?.moveToIdx(idx)
							}}
							aria-label="Slider navigation"
							className={vclsx(
								sliderTheme[variant].dots.dot,
								currentSlide == idx
									? sliderTheme[variant].dots.dotActive
									: sliderTheme[variant].dots.dotNotActive
							)}
						/>
					)
				}
			)}
		</div>
	)
}
