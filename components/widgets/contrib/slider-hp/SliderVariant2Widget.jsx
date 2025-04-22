import React, { useRef, useState } from "react"
import { Slider, SliderSlides, LocalMediaModal, Icon, Image } from "@/ui"
import get from "lodash.get"

export const config = {
	id: "vactory_default:38",
}

const Slide = ({ slideId, currentSlide, slide }) => {
	const videoModalRef = useRef()

	return (
		<>
			<div
				onClick={() => {
					if (slideId === currentSlide) videoModalRef.current.open()
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter" && slideId === currentSlide) videoModalRef.current.open()
				}}
				role="button"
				tabIndex={0}
				className="relative w-full pt-[calc(4_/_3_*_100%)] md:pt-[calc(9_/_16_*_100%)]"
			>
				<div className="absolute left-0 top-0 h-full w-full">
					<div className="relative z-40 bg-gradient-to-b from-black px-6 py-8">
						<p className="text-xl font-bold text-white ">{slide.videoTitle}</p>
					</div>
					<div className="absolute bottom-0 left-0 right-0 top-0 z-30 m-auto h-16 w-16 cursor-pointer">
						<Icon className="h-16 w-16 text-white text-opacity-50" id="play" />
					</div>
					<Image
						{...slide.image}
						alt={slide?.image?.alt}
						className="absolute left-0 top-0 h-full w-full object-cover"
					/>
				</div>
			</div>
			<LocalMediaModal
				ref={videoModalRef}
				sourceId={slide.video}
				closeIcon={<Icon className="h-5 w-5" id="x" />}
				expenderIcon={<Icon className="h-5 w-5" id="arrows-expand" />}
				minimizerIcon={<Icon className="h-5 w-5" id="minus" />}
			/>
		</>
	)
}
const SliderVideos = ({ data }) => {
	const [currentSlide, setCurrentSlide] = useState(0)

	const slidesData = data.components.map((item) => {
		return {
			image: {
				src: get(item, "image[0]._default", null),
				width: get(item, "image[0].meta.width", null),
				height: get(item, "image[0].meta.height", null),
				alt: get(item, "image[0].meta.alt", null),
				title: get(item, "image[0].meta.title", null),
			},
			video: get(item, "video", null),
			title: get(item, "titleVideo", null),
			videoTitle: get(item, "titleVideo", null),
		}
	})

	const sliderSettings = {
		arrows: {
			hideArrowMobile: true,
			hideArrowTablet: false,
			hideArrowDesktop: false,
		},
		loop: true,
		initial: 0,
		mode: "snap",
		breakpoints: {
			"(min-width: 800px)": {
				slides: { origin: "center", perView: 1.7, spacing: 15 },
			},
			"(max-width: 800px)": {
				slides: { perView: 1 },
			},
		},
	}

	const onSlideChange = (childSliderCurrent) => {
		// Update the parent's state when the child's state changes
		setCurrentSlide(childSliderCurrent)
	}

	return (
		<>
			<Slider sliderSettings={sliderSettings} onCurrentSlideChange={onSlideChange}>
				{slidesData.map((slide, index) => {
					return (
						<SliderSlides key={index} className="">
							<Slide
								key={`slide-cover-${index}`}
								slideId={index}
								currentSlide={currentSlide}
								slide={slide}
							/>
						</SliderSlides>
					)
				})}
			</Slider>
		</>
	)
}
export default SliderVideos
