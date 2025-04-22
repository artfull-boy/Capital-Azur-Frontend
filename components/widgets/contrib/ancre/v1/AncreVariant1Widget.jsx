import { VactoryAncre } from "./AncreVariant1"

export const config = {
	id: "vactory_default:47",
}

const AncreContainer = ({ data }) => {
	const props = {
		navigation: data.components.map((item) => {
			return {
				name: item.title,
				id: item.paragraphId,
			}
		}),
	}

	return <VactoryAncre {...props} />
}

export default AncreContainer
