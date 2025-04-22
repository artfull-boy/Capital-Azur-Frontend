import { Icon, Link, Wysiwyg } from "@/ui"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export const config = {
	id: "vactory_default:60",
}

const cardsContainer = {
	animate: {
		transition: {
			staggerChildren: 0.3,
		},
	},
}

const cardContainer = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
	},
}

const ThreeCardWithImage = ({ title, content, image, cards }) => {
	const containerRef = useRef()
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"],
	})

	const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])

	return (
		<div className="relative">
			<div className="mx-auto max-w-screen-xl">
				<motion.h2
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					className="text-center text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
					transition={{ type: "ease", duration: 1 }}
				>
					{title}
				</motion.h2>
				<motion.div className="mx-auto mt-6 w-2/3 text-center text-xl text-gray-600">
					{content}
				</motion.div>
				<div className="mx-auto mt-20 max-w-screen-xl ">
					<motion.div
						variants={cardsContainer}
						initial="initial"
						whileInView="animate"
						viewport={{ once: true, amount: 0.3 }}
						className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3"
					>
						{cards.map((card, index) => {
							return (
								<motion.div
									key={index}
									variants={cardContainer}
									className="flex flex-col items-center rounded p-6"
								>
									<Icon id="plus" className="mb-10 h-8 w-8 text-black" />
									<Link key={index} href={card.link.url}>
										<h3 className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-gray-900 md:text-2xl">
											{card.title}
										</h3>
									</Link>
									<div className="mt-4 flex flex-auto flex-col text-center text-base leading-7 text-gray-600">
										{card.content}
									</div>
								</motion.div>
							)
						})}
					</motion.div>
				</div>
			</div>
			<motion.div
				ref={containerRef}
				style={{ scale: scale }}
				className="relative h-screen w-full"
			>
				<motion.img src={image} className="absolute h-full w-full object-cover" />
			</motion.div>
		</div>
	)
}
const ThreeCardWithImageContainer = ({ data }) => {
	const widgetData = {
		title: data?.extra_field?.title,
		content: data?.extra_field?.content,
		image: data?.extra_field?.image[0]?._default,
		cards: data?.components?.map((cardItem) => {
			return {
				name: cardItem?.icon_name,
				title: cardItem?.card_title,
				content: <Wysiwyg html={cardItem?.card_content?.value["#text"]} />,
				link: {
					url: cardItem?.link?.url,
				},
			}
		}),
	}

	return <ThreeCardWithImage {...widgetData} />
}

export default ThreeCardWithImageContainer
