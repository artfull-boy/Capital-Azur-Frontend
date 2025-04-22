import { Wysiwyg } from "@/ui"

export const config = {
	id: "vactory_default:29",
	lazy: false,
}

const freeContent = (data) => {
	const cols = data.data.extra_field.col
	return (
		<div className={"md:gap- grid" + cols + " md:grid-cols-" + cols}>
			{data.data.components.map((item, i) => {
				{
					return (
						item.description && (
							<Wysiwyg key={i} className="mb-6" html={item.description.value["#text"]} />
						)
					)
				}
			})}
		</div>
	)
}

export default freeContent
