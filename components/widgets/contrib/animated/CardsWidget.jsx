import { Icon, Link, Wysiwyg, Heading, Container } from "@/ui"
import { motion } from "framer-motion"
import { useState } from "react"

export const config = {
	id: "vactory_default:61",
}

// Service Card Component
const ServiceCard = ({ title, image, link }) => {
	const [isHovered, setIsHovered] = useState(false)

	return (
		<Link href={link?.url || "#"}>
			<motion.div
				className="flex h-full flex-col items-center justify-center rounded-lg bg-white p-8  transition-shadow duration-300 hover:shadow-lg"
				onHoverStart={() => setIsHovered(true)}
				onHoverEnd={() => setIsHovered(false)}
				whileHover={{ y: -30 }}
				transition={{ duration: 0.2 }}
			>
				<div className="mb-6 h-20 w-20">
					{/* Using image from backend */}
					<img src={image} alt={title} className="h-full w-full object-contain" />
				</div>
				<h3 className="text-center text-lg font-medium text-gray-800">{title}</h3>
			</motion.div>
		</Link>
	)
}

const ServicesSection = ({ title, content, services }) => {
	return (
		<Container className="my-24 w-full flex flex-col items-start justify-center gap-[25px]">
			<div className="flex flex-col gap-[25px] w-full">
				{/* Blue line heading */}
				<div className="flex items-center gap-[16px]">
					<span className="block h-[3px] w-[44px] bg-primary"></span>
					<Heading level={1} variant={3}>
						{title}
					</Heading>
					
				</div>

				{/* Description text */}
				<div>
					<p className="text-gray-700">{content}</p>
				</div>

				{/* Services cards grid */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
					{services?.map((service, index) => (
						<ServiceCard
							key={index}
							title={service.title}
							image={service.image}
							link={service.link}
						/>
					))}
				</div>
			</div>
		</Container>
	)
}

const CardsContainer = ({ data }) => {
	const widgetData = {
		title: data?.extra_field?.title,
		content: data?.extra_field?.content,
		services: data?.components?.map((card) => {
			return {
				title: card?.title,
				content: card?.content?.value["#text"] ? (
					<Wysiwyg html={card?.content?.value["#text"]} />
				) : null,
				image: card?.image[0]?._default,
				link: {
					title: card?.link?.title,
					url: card?.link?.url,
				},
			}
		}),
	}

	return <ServicesSection {...widgetData} />
}

export default CardsContainer
