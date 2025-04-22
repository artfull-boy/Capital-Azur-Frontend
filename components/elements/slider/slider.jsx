import { useState, useEffect } from "react"
import { useKeenSlider } from "keen-slider/react"

import { useRTLDirection } from "@vactorynext/core/hooks"
import { defaultSliderPluginFun, vclsx } from "@vactorynext/core/utils"

import { SliderArrows } from "./slider--arrows"
import { SliderDots } from "./slider--dots"

import { sliderTheme } from "./theme"

import "keen-slider/keen-slider.min.css"

export const Slider = ({
	sliderSettings,
	sliderPlugins = [],
	children,
	className = "",
	variant = "default",
	onCurrentSlideChange,
	arrowIconNext,
	arrowIconPrev,
}) => {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [loaded, setLoaded] = useState(false)
	const isRTLDirection = useRTLDirection()

	let defaultSliderPlugins = defaultSliderPluginFun(sliderPlugins)

	const defaultSliderSettings = {
		rtl: isRTLDirection,
		loop: true,
		disabled: false,
		centred: false,
		initial: 0,
		slides: {
			origin: "auto",
			number: null,
			perView: 1,
			spacing: 16,
		},
		mode: "snap",
		rubberband: true,
		renderMode: "precision",
		defaultAnimation: { duration: 500 },
		vertical: false,
		opacity: false,
		breakpoints: {
			"(min-width: 768px)": {
				slides: {
					origin: "auto",
					number: null,
					perView: 2,
					spacing: 20,
				},
			},
			"(min-width: 992px)": {
				slides: {
					origin: "auto",
					number: null,
					perView: 3,
					spacing: 20,
				},
			},
		},
		slideChanged(Slider) {
			setCurrentSlide(Slider.track.details.rel)
		},
		created() {
			setLoaded(true)
		},
		...sliderSettings,
	}

	const arrowsSettings = {
		hideArrowMobile: sliderSettings?.arrows?.hideArrowMobile || false,
		hideArrowTablet: sliderSettings?.arrows?.hideArrowTablet || false,
		hideArrowDesktop: sliderSettings?.arrows?.hideArrowDesktop || false,
	}

	const [sliderRef, instanceRef] = useKeenSlider(
		defaultSliderSettings,
		defaultSliderPlugins
	)

	useEffect(() => {
		if (typeof onCurrentSlideChange === "function") {
			onCurrentSlideChange(currentSlide)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentSlide])

	return (
		<div className={vclsx("relative", sliderTheme[variant].wrapper)}>
			<div
				ref={sliderRef}
				className={vclsx(
					"keen-slider",
					sliderTheme[variant].slider,
					className,
					loaded ? "" : "flex-col"
				)}
			>
				{children}
			</div>

			{loaded && instanceRef.current && (
				<SliderDots
					instanceRef={instanceRef}
					currentSlide={currentSlide}
					variant={variant}
				/>
			)}

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
