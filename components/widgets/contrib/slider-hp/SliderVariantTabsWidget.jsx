import { useKeenSlider } from "keen-slider/react"
import { useState } from "react"
import YouTube from "react-youtube"

import { Heading, Tabs, Image, Wysiwyg } from "@/ui"
import { useRTLDirection } from "@vactorynext/core/hooks"

import "keen-slider/keen-slider.min.css"

export const config = {
	id: "vactory_default:39",
}

const Slide = ({ opacity, slide }) => {
	const [videoIsReady, setVideoIsReady] = useState(false)

	return (
		<div
			style={{ opacity: opacity }}
			className={`absolute left-0 top-0 flex h-full w-full items-center justify-center overflow-hidden`}
		>
			{slide.tabBackground.video ? (
				<>
					<YouTube
						id={slide.tabBackground.video}
						opts={{
							playerVars: {
								playlist: slide.tabBackground.video,
								loop: 1,
								autoplay: 1,
								controls: 0,
								mute: 1,
								rel: 0,
							},
						}}
						onPlay={() => {
							setVideoIsReady(true)
						}}
						videoId={slide.tabBackground.video}
						iframeClassName="w-full h-full"
						className="absolute bottom-0 left-0 top-0 my-auto h-full w-full"
					/>
					{!videoIsReady && (
						<Image
							src={slide.tabBackground.image}
							alt={slide.tabBackground.image_alt}
							className="absolute right-0 top-0 object-cover"
							fill
						/>
					)}
				</>
			) : (
				<Image
					src={slide.tabBackground.image}
					alt={slide.tabBackground.image_alt}
					className="absolute right-0 top-0 object-cover"
					fill
				/>
			)}
		</div>
	)
}

const TabSlider = ({ data }) => {
	const isRTLDirection = useRTLDirection()
	const [opacities, setOpacities] = useState([])

	const slidesData = data.components.map((item) => {
		return {
			tabBackground: {
				image: item?.image[0]?._default,
				image_alt: item?.image[0]?.meta?.alt,
				video: item?.video ? item?.video : null,
			},
		}
	})

	const tabsData = data.components.map((item, index) => {
		return {
			id: index,
			title: item.title,
			content: (
				<>
					<Heading level={4} className="mb-3">
						{item.title_description}
					</Heading>
					<Wysiwyg html={item.content.value["#text"]} />
				</>
			),
		}
	})

	const [sliderRef, instanceRef] = useKeenSlider({
		initial: 0,
		loop: true,
		rtl: isRTLDirection,
		slides: slidesData.length,
		detailsChanged(slider) {
			const newOpacities = slider.track.details.slides.map((slide) => {
				return slide.portion
			})
			setOpacities(newOpacities)
		},
	})

	return (
		<div
			ref={sliderRef}
			className="keen-slider relative pt-[calc(4_/_3_*_100%)] md:pt-[calc(9_/_16_*_100%)] landscape:pt-[calc(3_/_4_*_100%)] md:landscape:pt-[calc(9_/_16_*_100%)]"
		>
			{slidesData.map((slide, index) => {
				return <Slide opacity={opacities[index]} key={index} slide={slide}></Slide>
			})}
			<div className="md:w-3/2 absolute right-0 top-0 h-full w-full max-w-[800px] px-5 pb-5 pt-10 sm:w-10/12 lg:w-1/2">
				<Tabs
					onClick={(idx) => {
						instanceRef.current?.moveToIdx(idx)
					}}
					nodes={tabsData}
				/>
			</div>
		</div>
	)
}

export default TabSlider
