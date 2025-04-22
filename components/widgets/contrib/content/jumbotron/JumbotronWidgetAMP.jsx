import { Text, Heading, Button } from "@/ui"

export const config = {
	id: "vactory_default:1",
	lazy: false,
}

export const Jumbotron = ({
	title,
	description,
	lead,
	link_url,
	link_attributes,
	link_title,
}) => {
	return (
		<div className="rounded bg-gray-300 px-6 py-11">
			{title && (
				<Heading level="2" variant="1" className="mb-[25px]">
					{title}
				</Heading>
			)}
			{lead && <Text className="divide-y divide-gray-300">{lead}</Text>}
			{description && <Text className="mb-5">{description}</Text>}
			{link_title && link_url && (
				<Button href={link_url} {...link_attributes}>
					{link_title}
				</Button>
			)}
		</div>
	)
}

const JumbotronContainer = (data) => {
	const props = {
		title: data.data.components[0].title,
		description: data.data.components[0].description,
		lead: data.data.components[0].lead,
		link_title: data.data.components[0].link.title,
		link_url: data.data.components[0].link.url,
		link_attributes: {
			id: data.data.components[0].link.attributes.id,
			target: data.data.components[0].link.attributes.target,
			rel: data.data.components[0].link.attributes.rel,
			className: data.data.components[0].link.attributes.class,
		},
	}
	return <Jumbotron {...props} />
}

export default JumbotronContainer
