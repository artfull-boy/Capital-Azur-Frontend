import {
	Text,
	Wysiwyg,
	Heading,
	ThumbSlider,
	SliderSlides,
	SliderThumbs,
	Image,
} from "@/ui"
import get from "lodash.get"

export const config = {
	id: "vactory_default:24",
}

const sliderSettings = {
	arrows: {
		hideArrowMobile: false,
		hideArrowTablet: false,
		hideArrowDesktop: false,
	},
	rtl: false,
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
}

const thumbsSliderSettings = {
	arrows: {
		hideArrowMobile: false,
		hideArrowTablet: false,
		hideArrowDesktop: false,
	},
	rtl: false,
	loop: false,
	disabled: true,
	centred: true,
	initial: 0,
	slides: {
		origin: "auto",
		number: null,
		perView: 4,
		spacing: 16,
	},
	mode: "snap",
	rubberband: false,
	renderMode: "precision",
	defaultAnimation: { duration: 500 },
	vertical: false,
	opacity: false,
}

const TestemonialSlides = ({ items }) => {
	return (
		<>
			{items.map((item, index) => {
				return (
					<SliderSlides key={index}>
						<div className="p-15 relative mx-auto h-full text-center lg:p-20">
							<Wysiwyg html={item.description} className="prose max-w-none" />
							<Heading level="3" variant={"4"} className="mt-4 text-center">
								{item.name}
							</Heading>
							<Text className="text-base text-gray-500">{item.role}</Text>
						</div>
					</SliderSlides>
				)
			})}
		</>
	)
}

const TestemonialThumbs = ({ items }) => {
	return (
		<>
			{items.map((item, index) => {
				return (
					<SliderThumbs key={index} className={"mx-3 cursor-pointer"}>
						<div className="relative mx-auto h-[80px] w-[80px] overflow-hidden rounded-full border-2 border-white shadow-xl">
							<Image
								{...item.image}
								alt={item.image.alt}
								className="h-full object-cover"
							/>
						</div>
					</SliderThumbs>
				)
			})}
		</>
	)
}

const TestemonialSlider = ({ data }) => {
	const props = {
		introduction: get(data, "extra_field.intro", null),
		items: data?.components?.map((item) => ({
			name: get(item, "name", null),
			role: get(item, "role", null),
			description: get(item, "description.value['#text']", null),
			image: {
				src: get(item, "image[0]._default", null),
				alt: get(item, "image[0].meta.alt", null),
				height: get(item, "image[0].meta.height", null),
				width: get(item, "image[0].meta.width", null),
				title: get(item, "image_alt", null),
			},
		})),
	}

	return (
		<>
			<Text className="prose mx-auto mb-12 text-center">{props.introduction}</Text>
			<ThumbSlider
				sliderSettings={sliderSettings}
				thumbsSliderSettings={thumbsSliderSettings}
				thumbSliderClassName={"flex justify-center"}
				sliderClassName={""}
				slides={<TestemonialSlides {...props} />}
				thumbs={<TestemonialThumbs {...props} />}
			/>
		</>
	)
}

export default TestemonialSlider
