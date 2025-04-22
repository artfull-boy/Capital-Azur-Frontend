import { VactoryAncre } from "./AncreVariant2"

export const config = {
	id: "vactory_default:48",
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
