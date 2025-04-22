import Testimonial from "./testimonial"

const TestimonialContainer = ({ data }) => {
	const props = {
		items: data?.components.map((item, index) => ({
			id: index,
			name: item.name,
			role: item.role,
			img: item.image[0]._default,
			alt: item.image[0].meta.alt,
			description: item.image[0].meta.alt,
		})),
		isRtl: false,
	}

	return <Testimonial {...props} />
}

export default TestimonialContainer
