import { Slider, SliderSlides, Card, Image } from "@/ui"

export const config = {
	id: "vactory_default:40",
}

const SliderCard = ({ data }) => {
	const slidesData = data.components.map((item) => {
		return {
			title: item.title,
			excerpt: item.content,
			image: (
				<Image
					src={item.image[0]._default}
					alt={item.image_alt}
					className="object-cover"
					fill
				/>
			),
			url: item.link.url,
			urlContent: item.link.title,
		}
	})

	const sliderSettings = {
		arrows: {
			hideArrowMobile: false,
			hideArrowTablet: false,
			hideArrowDesktop: false,
		},
		slides: {
			origin: "auto",
			number: null,
			perView: 1,
			spacing: 16,
		},
		breakpoints: {},
	}

	return (
		<Slider sliderSettings={sliderSettings} variant="default" className="">
			{slidesData.map((slide, index) => {
				return (
					<SliderSlides key={`slide-card-${index}`} className="px-5 py-2">
						<Card variant="inline" {...slide} className="h-56" />
					</SliderSlides>
				)
			})}
		</Slider>
	)
}

export default SliderCard
