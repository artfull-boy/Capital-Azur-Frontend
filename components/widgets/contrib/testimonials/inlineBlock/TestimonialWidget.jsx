import { Text, Wysiwyg, Image } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:27",
	lazy: false,
}

export const Block = ({ intro, items = [] }) => {
	return (
		<>
			{intro && <Text className="mb-5 text-center"> {intro}</Text>}
			{items.map((item, i) => {
				return (
					<div
						key={i}
						className={vclsx(
							"mb-5 flex flex-col items-center overflow-hidden rounded-lg border border-gray-100 p-5 shadow-lg",
							item.mode ? "md:flex-row-reverse" : "md:flex-row"
						)}
					>
						<div className="mb-4 h-40 w-40 shrink-0 md:mb-0">
							<Image
								{...item.image}
								className="h-full rounded-full border-2 border-gray-200 object-cover"
								alt={item.image_alt}
							/>
						</div>
						<div
							className={vclsx("text-center md:text-left", item.mode ? "mr-4" : "ml-4")}
						>
							<Wysiwyg className="mb-3" html={item.description} />
							<Text variant="base" className="font-medium">
								{" "}
								{item.name}
							</Text>
							<Text variant="small" className="text-gray-500">
								{" "}
								{item.role}
							</Text>
						</div>
					</div>
				)
			})}
		</>
	)
}

const BlockContainer = ({ data }) => {
	const props = {
		intro: data?.extra_field.intro,
		items: data?.components.map((item, index) => ({
			id: index,
			image: {
				src: item.image[0]._default,
				width: item.image[0].meta.width,
				height: item.image[0].meta.height,
			},
			image_alt: item.image_alt,
			name: item.name,
			role: item.role,
			description: item.description,
			mode: item.mode,
		})),
	}

	return <Block {...props} />
}

export default BlockContainer
