import { motion } from "framer-motion"

import { Button, Container, Icon, Link } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:79",
}

const Card = ({ icon, title, content, link, index }) => {
	const cardAnimations = {
		initial: {
			opacity: 0,
			y: -20,
		},
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 1,
				delay: 0.3 * index,
			},
		},
	}
	return (
		<motion.div
			whileInView="animate"
			initial="initial"
			viewport={{ once: true }}
			variants={cardAnimations}
			className={vclsx("relative mb-8 flex-1 ")}
		>
			<motion.div className="relative h-full w-full overflow-hidden rounded-md bg-gray-50 p-8">
				<Icon id={icon} className="mb-10 h-12 w-12" />
				<motion.h4 className="mb-6 text-2xl font-semibold text-black ">{title}</motion.h4>
				<motion.p className="mb-10 font-light text-gray-600">{content}</motion.p>

				<motion.div className="self-start">
					<Link href={link.url}>{link.title}</Link>
				</motion.div>
			</motion.div>
		</motion.div>
	)
}

export const AnimatedCards = ({ title, content, cta, cards }) => {
	const titleAnimation = {
		initial: { opacity: 0, y: 100 },
		animate: { opacity: 1, y: 0, transition: { duration: 1 } },
	}
	const contentAnimation = {
		initial: { opacity: 0, y: 120 },
		animate: { opacity: 1, y: 0, transition: { duration: 1.3 } },
	}

	const ctaAnimation = {
		initial: { opacity: 0, y: 30 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.8 } },
	}

	return (
		<Container className="my-24">
			<div className="flex flex-col justify-between gap-x-12 md:flex-row">
				<div className="w-full md:w-5/12">
					<div className="sticky top-24">
						<motion.div initial="initial" whileInView="animate" viewport={{ once: true }}>
							<motion.h2
								variants={titleAnimation}
								className="mb-8 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl"
							>
								{title}
							</motion.h2>

							<motion.div
								variants={contentAnimation}
								className="mb-10 text-base text-gray-500 md:text-lg"
							>
								{content}
							</motion.div>

							{cta?.url && (
								<motion.div variants={ctaAnimation}>
									<Button href={cta.href}>{cta.title}</Button>
								</motion.div>
							)}
						</motion.div>
					</div>
				</div>

				<motion.div className="relative flex w-full flex-col md:w-6/12">
					{cards.map((card, index) => {
						return <Card key={index} index={index} {...card} />
					})}
				</motion.div>
			</div>
		</Container>
	)
}

const AnimatedCardsV4Container = ({ data }) => {
	const widgetData = {
		title: data?.extra_field?.title,
		content: data?.extra_field?.content,
		cta: {
			title: data?.extra_field?.cta?.title,
			url: data?.extra_field?.cta?.url,
		},
		cards: data?.components?.map((card) => {
			return {
				title: card?.title,
				content: card?.content,
				link: {
					title: card?.link?.title,
					url: card?.link?.url,
				},
			}
		}),
	}
	return <AnimatedCards {...widgetData} />
}

export default AnimatedCardsV4Container
