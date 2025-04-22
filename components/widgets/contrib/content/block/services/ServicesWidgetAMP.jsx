import { Text, Heading, Button } from "@/ui"

export const config = {
	id: "vactory_default:4",
	lazy: false,
}

const Services = (data) => {
	return (
		<div className="grid grid-cols-1 gap-5 text-center md:grid-cols-2">
			{data.data.components.map((service, i) => {
				const link_title = service.link.title,
					link_url = service.link.url,
					link_attributes = {
						id: service.link.attributes.id,
						target: service.link.attributes.target,
						rel: service.link.attributes.rel,
						className: service.link.attributes.class,
					}
				return (
					<div
						key={i}
						className="flex flex-col rounded-md border border-gray-100 p-3 shadow"
					>
						<Heading level="5" variant="5" className="!mb-5 border-b pb-4">
							{service.title}
						</Heading>
						{service.description && <Text className="mb-5">{service.description}</Text>}
						{link_title && link_url && (
							<div>
								<Button href={link_url} {...link_attributes} isAmp={true}>
									{link_title}
								</Button>
							</div>
						)}
					</div>
				)
			})}
		</div>
	)
}

export default Services
