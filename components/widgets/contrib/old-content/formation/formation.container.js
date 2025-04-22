// import { title } from "process"
import Formation from "./formation"

const FormationContainer = ({ data }) => {
	const props = {
		items: data?.components.map((item, index) => ({
			id: index,
			title: item.title,
			description: item.description,
			cta: item.cta,
		})),
		bgColors: ["#052583", "#1947F3", "#7A87F6"],
		ctaText: "",
		ctaIcon: "",
		ctaTextRtl: "",
		ctaIconRtl: "",
		isRtl: false,
	}

	return <Formation {...props} />
}

export default FormationContainer
