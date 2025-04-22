import { React, useState } from "react"
import { useMedia, useRTLDirection } from "@vactorynext/core/hooks"
import { useKeenSlider } from "keen-slider/react"
import { Image } from "@/ui"

const MediathequeList = ({ items, setChosenVideo, chosenVideo, enableDots }) => {
	// Check if the screen is Mobile
	const isMobile = useMedia("(max-width: 768px)")
	const isRTLDirection = useRTLDirection()
	const [loaded, setLoaded] = useState(false)
	const [currentSlide, setCurrentSlide] = useState(0)

	const [sliderRef, instanceRef] = useKeenSlider({
		rtl: isRTLDirection,
		slideChanged(s) {
			setCurrentSlide(s.track.details.rel)
		},
		created() {
			setLoaded(true)
		},
		breakpoints: {
			"(max-width: 768px)": {
				slides: { perView: 3, spacing: 5 },
				disableNaviagtion: true,
			},
			"(max-width: 500px)": {
				slides: { perView: 2, spacing: 10 },
			},
		},
		slides: { perView: 3 },
	})

	// To activate Dots, Set to true if N° of displayed slides are less than the total N° of slides
	let activateNavigation =
		loaded &&
		instanceRef.current.options.slides.perView < instanceRef.current.slides.length

	return (
		<>
			<div
				className={`flex overflow-y-scroll md:max-h-[460px] md:flex-col ${
					isMobile && "keen-slider"
				}`}
				ref={sliderRef}
			>
				{items.map((item) => {
					return (
						<div
							key={item.id}
							className={`flex min-h-[105px] cursor-pointer flex-col rounded-lg last:mb-0 md:mb-3 md:flex-row ${
								chosenVideo.id == item.id ? "bg-gray-200" : ""
							} ${isMobile && "keen-slider__slide"}`}
							onClick={() => setChosenVideo(item)}
							onKeyDown={(e) => e.key === "Enter" && setChosenVideo(item)}
							role="button"
							tabIndex={0}
						>
							<div className="h-[100px] overflow-hidden rounded-lg md:h-auto md:w-2/5">
								<Image
									className="lazyload h-full w-full object-cover"
									src={item.thumbnail}
									alt=""
								/>
							</div>
							<div className="p-2 md:ml-3 md:w-3/5">
								<h3 className="mb-1 text-[12px] font-semibold md:text-[14px]">
									{item.title.length > 40
										? item.title.slice(0, 40).concat("...")
										: item.title}
								</h3>
								<p className="mb-2 text-[10px] text-gray-500">
									{item.description.length > 40
										? item.description.slice(0, 40).concat("...")
										: item.description}
								</p>
								{item.duration && (
									<p className="w-fit rounded-xl bg-black px-3 py-1 text-[9px] text-white">
										{item.duration}
									</p>
								)}
							</div>
						</div>
					)
				})}
			</div>
			{isMobile && enableDots && activateNavigation && (
				<div className="slider-dots mt-4 text-center">
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
									(currentSlide === idx ? " bg-primary-800" : "")
								}
							></button>
						)
					})}
				</div>
			)}
		</>
	)
}

export default MediathequeList
