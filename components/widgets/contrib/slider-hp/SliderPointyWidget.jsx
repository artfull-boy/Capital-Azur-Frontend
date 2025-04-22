import React, { useState } from "react"
import { Heading, Button, Image } from "@/ui"
import { useBreakPoint } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"
import get from "lodash.get"
import { stripHtml } from "@vactorynext/core/lib"
import truncate from "truncate"

export const config = {
	id: "vactory_default:37",
}

const Slide = ({ activeSlide, slideId, slide }) => {
	const device = useBreakPoint()
	return (
		<>
			<div
				className={vclsx(
					activeSlide >= slideId
						? "z-20 translate-x-0"
						: "z-30 translate-x-full rtl:-translate-x-full",
					"absolute left-0 top-0 h-full w-full transform transition duration-1000"
				)}
			>
				<div
					style={{ backgroundColor: slide.background }}
					className={vclsx(
						"relative w-full pt-[calc(4_/_3_*_100%)] md:h-full md:w-1/2 md:!p-0 landscape:pt-[calc(3_/_4_*_100%)]"
					)}
				>
					<div
						className={vclsx(
							activeSlide === slideId && activeSlide <= slideId
								? "opacity-1"
								: "opacity-0",
							"absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center p-8 transition duration-700"
						)}
					>
						{slide.title && (
							<Heading
								level={device === "desktop" ? 2 : device === "tablet" ? 3 : 4}
								className="mb-8 text-white"
							>
								{slide.title}
							</Heading>
						)}
						{slide.content && <p className="text-lg text-white">{slide.content}</p>}
						{slide.link.href && slide.link.title && (
							<Button
								href={slide.link.href}
								className="mt-8 self-start"
								size={device === "desktop" ? "large" : "normal"}
							>
								{slide.link.title}
							</Button>
						)}
					</div>
				</div>

				<div className="relative w-full pt-[calc(4_/_3_*_100%)] md:h-full md:w-1/2 md:!p-0 landscape:pt-[calc(3_/_4_*_100%)]">
					<Image
						{...slide.image}
						alt={slide?.image?.alt}
						className="absolute left-0 top-0 h-full w-full object-cover"
					/>
				</div>
			</div>
			{/* doesn't show on mobile */}
			<div
				className={vclsx(
					activeSlide === slideId && activeSlide <= slideId
						? "opacity-1 z-10"
						: "opacity-0",
					"absolute left-0 top-0 hidden h-full w-full transition delay-300 duration-75 md:block"
				)}
			>
				<div className="relative ml-auto h-full w-1/2">
					<Image
						{...slide.image}
						alt={slide?.image?.alt}
						className="absolute left-0 top-0 h-full w-full object-cover"
					/>
				</div>
			</div>
		</>
	)
}

export const SliderPointy = ({ data }) => {
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
			background: get(item, "background_color", null),
		}
	})

	const [activeSlide, setActiveSlide] = useState(0)

	return (
		<>
			<div className="relative w-full overflow-hidden pb-[calc(4_/_3_*_100%)] pt-[calc(4_/_3_*_100%)] md:!pb-0 md:pt-[calc(9_/_16_*_100%)] landscape:pb-[calc(3_/_4_*_100%)] landscape:pt-[calc(3_/_4_*_100%)] md:landscape:pt-[calc(9_/_16_*_100%)]">
				{slidesData.map((slide, index) => {
					return (
						<Slide key={index} slideId={index} activeSlide={activeSlide} slide={slide} />
					)
				})}

				<div className="absolute bottom-6 z-50 flex w-full justify-center">
					<div className="flex">
						{slidesData.map((_, index) => {
							return (
								<button
									key={index}
									onClick={() => {
										setActiveSlide(index)
									}}
									className={vclsx(
										"flex h-12 w-12 items-center justify-center bg-black bg-opacity-75 md:h-16 md:w-16"
									)}
								>
									<span
										className={vclsx(
											"text-lg font-medium",
											activeSlide === index ? "text-primary-300 " : "text-white "
										)}
									>
										{index + 1}
									</span>
								</button>
							)
						})}
					</div>
				</div>
			</div>
		</>
	)
}

export default SliderPointy
