import Team from "./team"

const TeamContainer = ({ data }) => {
	const props = {
		items: data?.components.map((item, index) => ({
			id: index,
			name: item.name,
			role: item.role,
			img: item.image[0]._default,
			alt: item.image[0].meta.alt,
		})),
		isRtl: false,
	}

	return <Team {...props} />
}

export default TeamContainer
