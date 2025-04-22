import { useKeenSlider } from "keen-slider/react"
import React, { useState } from "react"

import { SliderArrows } from "@/ui"
import { useRTLDirection } from "@vactorynext/core/hooks"
import { thumbnailPlugin, vclsx } from "@vactorynext/core/utils"

import "keen-slider/keen-slider.min.css"

export const ThumbSlider = ({
	sliderSettings,
	thumbsSliderSettings,
	sliderClassName,
	thumbSliderClassName,
	slides,
	thumbs,
	variant = "default",
	arrowIconNext,
	arrowIconPrev,
}) => {
	const arrowsSettings = {
		hideArrowMobile: sliderSettings?.arrows?.hideArrowMobile || false,
		hideArrowTablet: sliderSettings?.arrows?.hideArrowTablet || false,
		hideArrowDesktop: sliderSettings?.arrows?.hideArrowDesktop || false,
	}

	// const [currentSlide, setCurrentSlide] = useState(0)
	const [loaded, setLoaded] = useState(false)
	const isRTLDirection = useRTLDirection()

	const [sliderRef, instanceRef] = useKeenSlider({
		rtl: isRTLDirection,
		loop: sliderSettings?.loop || true,
		disabled: sliderSettings?.disabled || false,
		centred: sliderSettings?.centred || false,
		initial: sliderSettings?.initial || 0,
		slides: {
			origin: sliderSettings?.slides?.origin || "auto",
			number: sliderSettings?.slides?.number || null,
			perView: sliderSettings?.slides?.perView || 1,
			spacing: sliderSettings?.slides?.spacing || 10,
		},
		defaultAnimation: {
			duration: sliderSettings?.defaultAnimation?.duration || 500,
		},
		rubberband: sliderSettings?.rubberband || true,
		renderMode: sliderSettings?.renderMode || "precision",
		vertical: sliderSettings?.vertical || false,
		opacity: sliderSettings?.opacity || false,
		breakpoints: sliderSettings?.breakpoints || null,

		// slideChanged(Slider) {
		// 	setCurrentSlide(Slider.track.details.rel)
		// },
		created() {
			setLoaded(true)
		},
	})
	const [thumbnailRef] = useKeenSlider(
		{
			rtl: isRTLDirection,
			loop: thumbsSliderSettings?.loop || true,
			disabled: thumbsSliderSettings?.disabled || false,
			centred: thumbsSliderSettings?.centred || false,
			initial: thumbsSliderSettings?.initial || 0,
			slides: {
				origin: thumbsSliderSettings?.slides?.origin || "auto",
				number: thumbsSliderSettings?.slides?.number || null,
				perView: thumbsSliderSettings?.slides?.perView || 1,
				spacing: thumbsSliderSettings?.slides?.spacing || 10,
			},
			defaultAnimation: {
				duration: thumbsSliderSettings?.defaultAnimation?.duration || 500,
			},
			rubberband: thumbsSliderSettings?.rubberband || true,
			renderMode: thumbsSliderSettings?.renderMode || "precision",
			vertical: thumbsSliderSettings?.vertical || false,
			opacity: thumbsSliderSettings?.opacity || false,
			breakpoints: thumbsSliderSettings?.breakpoints || null,
		},
		[thumbnailPlugin(instanceRef)]
	)

	return (
		<div className="relative">
			<div ref={sliderRef} className={vclsx("keen-slider", sliderClassName)}>
				{slides}
			</div>

			<div
				ref={thumbnailRef}
				className={vclsx("keen-slider thumbnail", thumbSliderClassName)}
			>
				{thumbs}
			</div>

			{loaded && instanceRef.current && (
				<>
					<SliderArrows
						prev
						arrowsSettings={arrowsSettings}
						onClick={() => instanceRef.current?.prev()}
						variant={variant}
						arrowIconPrev={arrowIconPrev}
					/>

					<SliderArrows
						next
						arrowsSettings={arrowsSettings}
						onClick={() => instanceRef.current?.next()}
						variant={variant}
						arrowIconNext={arrowIconNext}
					/>
				</>
			)}
		</div>
	)
}
