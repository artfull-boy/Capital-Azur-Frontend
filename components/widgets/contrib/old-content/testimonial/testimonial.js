import { React, useState } from "react"
import { useKeenSlider } from "keen-slider/react"
import { useRTLDirection } from "@vactorynext/core/hooks"
import { Image } from "@/ui"

const Testimonial = ({
	items = [],
	isRtl = false,
	initialSLide = 0,
	enableDots = true,
}) => {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [loaded, setLoaded] = useState(false)
	const isRTLDirection = useRTLDirection()

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
			"(max-width: 768px)": {
				slides: { perView: 2, spacing: 10 },
			},
			"(max-width: 500px)": {
				slides: { perView: 1, spacing: 10 },
			},
		},
		slides: { perView: 3, spacing: 10 },
	})

	// To activate Dots, Set to true if N° of displayed slides are less than the total N° of slides
	let activateNavigation =
		loaded &&
		instanceRef.current.options.slides.perView < instanceRef.current.slides.length

	return (
		<div className="flex flex-col items-center">
			<div ref={sliderRef} className="keen-slider">
				{items.map((item) => {
					return (
						<div
							className="keen-slider__slide flex flex-1 flex-col items-center bg-primary-50 px-[42px] py-[37px] md:items-start"
							key={item.id}
						>
							<div className="mb-[38px] flex flex-col items-center md:flex-row">
								{item.image && (
									<Image
										src={item.image}
										alt={item.alt}
										width="81px"
										height="81px"
										className="mb-[30px] rounded-full md:mb-0 md:mr-[30px]"
									/>
								)}
								<div>
									<p className="mb-2 text-center text-[18px] font-bold md:text-start md:text-[20px]">
										{item.name}
									</p>
									<p className="text-center text-[16px] text-gray-500 md:text-start">
										{item.role}
									</p>
								</div>
							</div>
							<p className="text-[14px] text-gray-500">{`" ${item.description} "`}</p>
						</div>
					)
				})}
			</div>

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
		</div>
	)
}

export default Testimonial
