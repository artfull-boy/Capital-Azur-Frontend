import React from "react"
import { Image, Heading, Text } from "@/ui"
//import { useRTLDirection } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_default:46",
}

const SliderFullBackground = ({ data }) => {
	const slidesData = data.components.map((item) => {
		var slideData = {}
		slideData.title = item.title
		slideData.content = item.content
		slideData.background_desktop = {
			url: item?.image?.[0]?._default,
			alt: item?.image?.[0]?.meta?.alt,
		}
		slideData.background_mobile = { url: item?.image_mobile?.[0]?._default }
		slideData.link = { title: item.link.title, url: item.link.url }
		if (item.video) {
			slideData.video = item.video
		}
		return slideData
	})

	return (
		<amp-carousel
			width="450"
			height="300"
			layout="responsive"
			type="slides"
			role="region"
			aria-label="Basic carousel"
		>
			{slidesData.map((slide, index) => {
				return (
					<div
						key={index}
						className="overflow-hidden rounded-lg border border-gray-300 text-center"
					>
						<Image
							src={slide.background_desktop.url}
							alt={slide.background_desktop.alt}
							width={1000}
							height={600}
							isAmp={true}
						/>
						<div className="p-4">
							<Heading level="3" variant="5" className="mb-5">
								{slide.title}
							</Heading>
							<Text className="">{slide?.content}</Text>
						</div>
					</div>
				)
			})}
		</amp-carousel>
	)
}
export default SliderFullBackground
