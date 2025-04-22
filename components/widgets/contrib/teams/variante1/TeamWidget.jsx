import { Text, Button, Heading, Link, Image } from "@/ui"

export const config = {
	id: "vactory_default:9",
	lazy: false,
}

export const Team = ({ intro, btn_more, items = [] }) => {
	const MoreLinkAttributes = {
		id: btn_more.id,
		target: btn_more.target,
		rel: btn_more.rel,
		className: btn_more.class,
	}
	return (
		<>
			{intro && <Text className="mb-5 text-center"> {intro}</Text>}
			{items.map((item) => {
				return (
					<div
						key={item.id}
						className="mb-5 flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white text-black shadow md:flex-row"
					>
						<div className="flex w-full flex-shrink-0 items-center justify-center md:w-40">
							<Image
								{...item.image}
								alt={item.image_alt}
								className="h-full w-full object-cover"
							/>
						</div>
						<Link
							href={item.link_url}
							{...item.link_attributes}
							className="group flex w-full flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between"
						>
							<div className="mb-2 md:mb-0 md:mr-2">
								<Heading level="6" variant="6" className="mb-1">
									{item.title}
								</Heading>
								<Text className="mb-2 font-medium">{item.authors}</Text>
								<Text> {item.description} </Text>
							</div>
							<Text variant="permalink"> {item.link_title} </Text>
						</Link>
					</div>
				)
			})}

			{btn_more.url && btn_more.title && (
				<div className="text-center">
					<Button href={btn_more.url} {...MoreLinkAttributes}>
						{btn_more.title}
					</Button>
				</div>
			)}
		</>
	)
}

const TeamContainer = ({ data }) => {
	const props = {
		intro: data?.extra_field.intro,
		btn_more: data?.extra_field.btn_more,
		items: data?.components.map((item, index) => ({
			id: index,
			image: {
				src: item.image[0]._default,
				width: item.image[0].meta.width,
				height: item.image[0].meta.height,
			},
			image_alt: item.image_alt,
			title: item.title,
			authors: item.authors,
			description: item.description,
			link_url: item.link.url,
			link_title: item.link.title,
			link_attributes: {
				id: item.link.attributes.id,
				target: item.link.attributes.target,
				rel: item.link.attributes.rel,
				className: item.link.attributes.class + "my-auto ml-auto whitespace-nowrap",
			},
		})),
	}

	return <Team {...props} />
}

export default TeamContainer
