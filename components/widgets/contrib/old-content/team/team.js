import { React, useState } from "react"
import { Icon } from "@vactory/ui/icon"
import { Link } from "@vactory/ui/link"
import { useKeenSlider } from "keen-slider/react"
import { useRTLDirection } from "@vactorynext/core/hooks"
import { Image } from "@/ui"

const Team = ({
	items = [],
	isRtl = false,
	initialSLide = 0,
	enableArrows = true,
	enableDots = true,
}) => {
	const isRTLDirection = useRTLDirection()
	const [currentSlide, setCurrentSlide] = useState(0)
	const [loaded, setLoaded] = useState(false)

	const [sliderRef, instanceRef] = useKeenSlider({
		initial: initialSLide,
		rtl: isRTLDirection,
		slideChanged(s) {
			setCurrentSlide(s.track.details.rel)
		},
		created() {
			setLoaded(true)
		},
		breakpoints: {
			"(max-width: 968px)": {
				slides: { perView: 4, spacing: 5 },
			},
			"(max-width: 768px)": {
				slides: { perView: 3, spacing: 5 },
				disableNaviagtion: true,
			},
			"(max-width: 500px)": {
				slides: { perView: 2, spacing: 10 },
			},
		},
		slides: { perView: 6 },
	})

	// To activate Arrows and Dots, Set to true if N° of displayer slides are less than total N° of slides
	let activateNavigation =
		loaded &&
		instanceRef.current.options.slides.perView < instanceRef.current.slides.length

	// Arrows JSX
	const SliderArrow = (props) => {
		return (
			<>
				{props.left && (
					<Icon
						id="chevron-left"
						aria-hidden="true"
						onClick={props.onClick}
						className="rtl-icon absolute -left-2 top-1/4 h-8 w-8 -translate-y-2/4 cursor-pointer"
					/>
				)}
				{!props.left && (
					<Icon
						id="chevron-right"
						aria-hidden="true"
						onClick={props.onClick}
						className="rtl-icon absolute -right-2 top-1/4 h-8 w-8 -translate-y-2/4 cursor-pointer"
					/>
				)}
			</>
		)
	}

	return (
		<div className="flex flex-col items-center">
			<div ref={sliderRef} className="keen-slider">
				{items.map((item) => {
					return (
						<div
							className="keen-slider__slide flex flex-1 flex-col items-center"
							key={item.id}
						>
							<Image
								src={item.image}
								alt={item.alt}
								width="80px"
								height="80px"
								className="mb-4 rounded-full"
							/>
							<p className="mb-3 text-center font-semibold">{item.name}</p>
							<p className="text-center text-xs text-gray-500">{item.role}</p>
						</div>
					)
				})}
			</div>

			{/* Arrows */}
			{enableArrows && activateNavigation && (
				<>
					<SliderArrow
						left
						onClick={(e) =>
							e.stopPropagation() ||
							(isRtl ? instanceRef.current?.next() : instanceRef.current?.prev())
						}
						disabled={currentSlide === 0}
					/>

					<SliderArrow
						onClick={(e) =>
							e.stopPropagation() ||
							(isRtl ? instanceRef.current?.prev() : instanceRef.current?.next())
						}
						disabled={
							currentSlide === instanceRef.current.track.details.slides.length - 1
						}
					/>
				</>
			)}

			{/* Dots */}
			{/* if Rtl iS NOT active */}
			{enableDots && activateNavigation && !isRtl && (
				<div className="slider-dots">
					{[
						...Array(
							instanceRef.current.slides.length -
								instanceRef.current.options.slides.perView +
								1
						).keys(),
					].map((idx) => {
						return (
							<button
								key={idx}
								onClick={() => {
									instanceRef.current?.moveToIdx(idx)
								}}
								className={
									"mx-1 my-0 h-2 w-2 cursor-pointer rounded-full bg-gray-300 p-1" +
									(currentSlide === idx ? " bg-gray-800" : "")
								}
							></button>
						)
					})}
				</div>
			)}
			{/* if Rtl IS active */}
			{enableDots && activateNavigation && isRtl && (
				<div className="slider-dots">
					{[
						...Array(
							instanceRef.current.slides.length -
								instanceRef.current.options.slides.perView +
								1
						).keys(),
					]
						.reverse()
						.map((idx) => {
							return (
								<button
									key={idx}
									onClick={() => {
										instanceRef.current?.moveToIdx(idx)
									}}
									className={
										"mx-1 my-0 h-2 w-2 cursor-pointer rounded-full bg-gray-300 p-1" +
										(currentSlide === idx ? " bg-gray-800" : "")
									}
								></button>
							)
						})}
				</div>
			)}

			{/* CTA */}
			<Link className="mt-5 block" target="_blank">
				Voir plus
			</Link>
		</div>
	)
}

export default Team
