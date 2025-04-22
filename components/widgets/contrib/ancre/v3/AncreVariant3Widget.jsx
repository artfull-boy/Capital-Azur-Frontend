import { VactoryAncre } from "./AncreVariant3"

export const config = {
	id: "vactory_default:91",
}

const AncreContainer = ({ data }) => {
	const props = {
		data: {
			navigation: data.components?.map((item) => {
				return {
					name: item.title,
					id: item.paragraphId,
				}
			}),
			title: data.extra_field.title,
			btn: data.extra_field.link,
		},
	}
	return <VactoryAncre {...props} />
}

export default AncreContainer
