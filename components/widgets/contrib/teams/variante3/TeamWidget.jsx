import { Text, Image } from "@/ui"

export const config = {
	id: "vactory_default:19",
	lazy: false,
}

export const Team = ({ cols, items = [] }) => {
	return (
		<div className={`grid md:gap-${cols} md:grid-cols-${cols} mt-10`}>
			{items.map((item) => {
				return (
					<div key={item.id} className="mb-8 flex flex-row pr-5">
						<div className="my-auto mr-5 basis-1/4">
							<Image
								{...item.image}
								alt={item.image_alt}
								className="h-full rounded-full border border-gray-500 object-cover"
							/>
						</div>
						<div className="basis-3/4">
							<Text variant="base" className="mb-1 font-semibold">
								{item.name}
							</Text>
							<Text variant="small" className="mb-1 font-medium text-gray-500">
								{" "}
								{item.role}{" "}
							</Text>
							<Text> {item.description} </Text>
						</div>
					</div>
				)
			})}
		</div>
	)
}

const TeamContainer = ({ data }) => {
	const props = {
		cols: data.extra_field.cols,
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
		})),
	}

	return <Team {...props} />
}

export default TeamContainer
