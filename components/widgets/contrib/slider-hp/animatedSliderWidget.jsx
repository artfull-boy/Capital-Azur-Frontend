import { useState } from "react"
import { useKeenSlider } from "keen-slider/react"
import truncate from "truncate"
import get from "lodash.get"
import { Button, Icon, Image } from "@/ui"
import { useRTLDirection } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"
import { stripHtml } from "@vactorynext/core/lib"

export const config = {
	id: "vactory_default:42",
}

const SlideContent = ({ slideId, currentSlide, title, content, link }) => {
	return (
		<div
			className={vclsx(
				slideId === currentSlide ? "opacity-1 z-30" : "z-10 opacity-0",
				"absolute left-0 top-0 flex h-full w-full items-center justify-center transition-opacity duration-500"
			)}
		>
			<div className="text-white">
				{title && <h1 className="mb-5 text-2xl font-semibold">{title}</h1>}
				{content && <p className="mb-10 text-lg">{content}</p>}
				{link.href && link.title && (
					<Button variant="secondary" href={link.href}>
						{link.title}
					</Button>
				)}
			</div>
		</div>
	)
}

const SlideImage = ({ slideId, currentSlide, image }) => {
	return (
		<>
			<Image
				{...image}
				alt={image?.alt}
				className={vclsx(
					slideId === currentSlide ? "opacity-1" : "opacity-0",
					"absolute top-0 h-full w-full object-cover transition-opacity duration-500"
				)}
			/>
		</>
	)
}

const ProgressIndicator = ({ isProgressVisible }) => {
	return (
		<div className="relative flex w-32 items-center">
			<div className="h-1 w-1 rounded-full bg-gray-400"></div>
			{isProgressVisible && (
				<div
					className={vclsx("infinit relative h-[2px] w-0 animate-progress bg-gray-400")}
				></div>
			)}
		</div>
	)
}

const Indicators = ({ currentSlide, totalSlides }) => {
	return (
		<div className="flex items-center text-white">
			<span className="text-sm">{currentSlide}</span>
			<span className="mx-3 text-xl">/</span>
			<span className="text-sm">{totalSlides}</span>
		</div>
	)
}

const Navigation = ({ slider, hideProgressIndicator }) => {
	const handleNext = () => {
		slider.current.next()
		hideProgressIndicator()
	}
	const handlePrev = () => {
		slider.current.prev()
		hideProgressIndicator()
	}
	return (
		<div className="flex gap-x-2 divide-x divide-gray-700 bg-black">
			<button
				className="flex items-center justify-center bg-transparent p-5"
				onClick={handlePrev}
				aria-label="navigation button"
			>
				<Icon id="chevron-left" className="rtl-icon h-4 w-4 text-white" />
			</button>
			<button
				className="flex items-center justify-center bg-transparent p-5"
				onClick={handleNext}
				aria-label="navigation button"
			>
				<Icon id="chevron-right" className="rtl-icon h-4 w-4 text-white" />
			</button>
		</div>
	)
}

const AnimatedTabs = ({ data }) => {
	const slidesData = data.components.map((item) => {
		return {
			title: get(item, "title", null),
			subTitle: get(item, "second_title", null),
			content: truncate(stripHtml(get(item, "content.value['#text']", "")), 300),
			image: {
				src: get(item, "image[0]._default", null),
				width: get(item, "image[0].meta.width", null),
				height: get(item, "image[0].meta.height", null),
				alt: get(item, "image[0].meta.alt", null),
				title: get(item, "image[0].meta.title", null),
			},
			link: {
				href: get(item, "link.url", null),
				title: get(item, "link.title", null),
				id: get(item, "link.attributes.id", ""),
				className: get(item, "link.attributes.class", ""),
				rel: get(item, "link.attributes.rel", null),
				target: get(item, "link.attributes.target", null),
			},
		}
	})

	const isRTLDirection = useRTLDirection()
	const [isProgressVisible, setIsProgressVisible] = useState(false)
	const [currentSlide, setCurrentSlide] = useState(0)
	const [loaded, setLoaded] = useState(false)
	const [refCallback, slider] = useKeenSlider({
		loop: true,
		rtl: isRTLDirection,
		slides: slidesData.length,
		created() {
			setLoaded(true)
		},
		slideChanged(slider) {
			setCurrentSlide(slider.track.details.rel)
		},
	})

	return (
		<div
			ref={refCallback}
			className="keen-slider relative box-content bg-black pt-[calc(4_/_3_*_100%)] md:pb-[100px] md:pt-[calc(9_/_16_*_100%)] lg:pb-0 landscape:pt-[calc(3_/_4_*_100%)] md:landscape:pt-[calc(9_/_16_*_100%)]"
		>
			<div className="absolute left-0 right-0 top-0 z-30 flex h-full w-full flex-col justify-center px-5 py-10 md:w-10/12">
				<div className="relative flex-grow md:w-1/2">
					{slidesData.map((slide, index) => {
						return (
							<SlideContent
								key={index}
								slideId={index}
								currentSlide={currentSlide}
								title={slide.title}
								content={slide.content}
								link={slide.link}
							/>
						)
					})}
				</div>

				{loaded && slider && (
					<div className="relative z-40 flex w-full shrink-0 items-center justify-between">
						<div className="flex items-center gap-x-5">
							<div className="relative flex items-center">
								<ProgressIndicator isProgressVisible={isProgressVisible} />
							</div>

							<Indicators
								currentSlide={currentSlide + 1}
								totalSlides={slider.current?.options?.slides}
							/>
						</div>
						<Navigation
							slider={slider}
							hideProgressIndicator={() => {
								setIsProgressVisible(false)
							}}
						/>
					</div>
				)}
			</div>

			<div className="absolute right-0 top-0 h-full w-full md:ml-auto md:w-1/2">
				<div className="relative z-10 h-full w-full">
					{slidesData.map((slide, index) => {
						return (
							<SlideImage
								key={index}
								slideId={index}
								currentSlide={currentSlide}
								image={slide.image}
							/>
						)
					})}
				</div>
				<div className="absolute right-0 top-0 z-20 h-full w-full bg-black bg-opacity-[.2] md:hidden"></div>
			</div>
		</div>
	)
}

export default AnimatedTabs
