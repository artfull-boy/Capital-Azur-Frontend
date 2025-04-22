import { useState } from "react"
import { useBreakPoint } from "@vactorynext/core/hooks"

import { Slider, SliderSlides, Button, Heading, Image } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"
import truncate from "truncate"

export const config = {
	id: "vactory_default:43",
}

const Slide = ({ slideIndex, currentSlide, slide }) => {
	const device = useBreakPoint()
	return (
		<div
			className={vclsx(
				slideIndex === currentSlide ? "max-h-[600px]" : "max-h-[400px]",
				"relative h-full flex-1 overflow-hidden rounded-lg transition-[max-height] ease-out"
			)}
		>
			{slideIndex === currentSlide && (
				<div className="relative z-30 px-16 py-16">
					<Heading
						level={device === "desktop" ? 2 : device === "tablet" ? 3 : 4}
						className="mb-8 text-white"
					>
						{slide.title}
					</Heading>
					<p className="text-xl text-white">{slide.content}</p>

					{slide.link.href && slide.link.title && (
						<Button href={slide.link.href} className="mt-8 self-start">
							{slide.link.title}
						</Button>
					)}
				</div>
			)}
			<div className="absolute left-0 right-0 top-0 h-full w-full">
				<div className="absolute left-0 right-0 top-0 z-10 h-full w-full bg-black bg-opacity-25"></div>
				{slide.image.src && (
					<Image
						{...slide.image}
						alt={slide?.image?.alt}
						className={"h-full w-full object-cover"}
					/>
				)}
			</div>
		</div>
	)
}

const SliderCover = ({ data }) => {
	const [currentSlide, setCurrentSlide] = useState(0)

	const slidesData = data.components.map((item) => {
		return {
			title: get(item, "title", null),
			content: truncate(stripHtml(get(item, "content.value['#text']", "")), 300),
			link: {
				href: get(item, "link.url", null),
				title: get(item, "link.title", null),
				id: get(item, "link.attributes.id", ""),
				className: get(item, "link.attributes.class", ""),
				rel: get(item, "link.attributes.rel", null),
				target: get(item, "link.attributes.target", null),
			},
			image: {
				src: get(item, "image[0]._default", null),
				width: get(item, "image[0].meta.width", null),
				height: get(item, "image[0].meta.height", null),
				alt: get(item, "image[0].meta.alt", null),
				title: get(item, "image[0].meta.title", null),
			},
		}
	})

	const sliderSettings = {
		arrows: {
			hideArrowMobile: true,
			hideArrowTablet: false,
			hideArrowDesktop: false,
		},
		loop: true,
		breakpoints: {
			"(min-width: 800px)": {
				slides: {
					origin: "center",
					perView: 1.6,
					spacing: 15,
				},
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
			<Slider
				sliderSettings={sliderSettings}
				onCurrentSlideChange={onSlideChange}
				className="h-[600px]"
			>
				{slidesData.map((slide, index) => {
					return (
						<SliderSlides
							key={index}
							className="flex shrink-0 items-center justify-center"
						>
							<Slide slideIndex={index} currentSlide={currentSlide} slide={slide} />
						</SliderSlides>
					)
				})}
			</Slider>
		</>
	)
}

export default SliderCover
