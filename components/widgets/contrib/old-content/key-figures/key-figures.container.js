import KeyFigures from "./key-figures"

const KeyFiguresContainer = ({ data }) => {
	const props = {
		items: data?.components.map((item, index) => ({
			id: index,
			number: item.number,
			textPrefix: item.textPrefix,
			textSuffix: item.textSuffix,
			description: item.description,
		})),
	}

	return <KeyFigures {...props} />
}

export default KeyFiguresContainer
