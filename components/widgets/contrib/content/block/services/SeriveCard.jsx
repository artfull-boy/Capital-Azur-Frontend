import { Heading, Button, Text } from "@/ui"

export const ServiceCard = ({
	title,
	link_title,
	link_url,
	link_attributes,
	description,
}) => {
	return (
		<div className="flex h-full flex-col rounded-md rounded-tr-[50px] border border-gray-100 bg-white p-3 shadow">
			<Heading level="5" variant="5" className="!mb-5 border-b pb-4">
				{title}
			</Heading>
			{description && <Text className="mb-5">{description}</Text>}
			{link_title && link_url && (
				<Button href={link_url} {...link_attributes}>
					{link_title}
				</Button>
			)}
		</div>
	)
}
