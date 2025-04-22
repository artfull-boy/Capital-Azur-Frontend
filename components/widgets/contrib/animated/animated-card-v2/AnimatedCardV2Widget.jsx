import React from "react"
import { motion } from "framer-motion"
import { Button, Icon, Link } from "@/ui"

export const config = {
	id: "vactory_default:77",
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
			variants={cardAnimations}
			className="relative mb-8 flex-1 self-stretch md:mb-0 "
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
		<div className="mx-auto my-24 max-w-screen-xl">
			<motion.div
				initial="initial"
				whileInView="animate"
				viewport={{ once: true }}
				className="mx-auto mb-32 flex w-full flex-col items-center md:w-2/3"
			>
				<motion.h2
					variants={titleAnimation}
					className="mb-8 text-center text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl"
				>
					{title}
				</motion.h2>

				<motion.div
					variants={contentAnimation}
					className="mb-10 text-center text-base text-gray-500 md:text-lg"
				>
					{content}
				</motion.div>
				{cta?.url && (
					<motion.div variants={ctaAnimation}>
						<Button href={cta.href}>{cta.title}</Button>
					</motion.div>
				)}
			</motion.div>
			<motion.div
				whileInView="animate"
				initial="initial"
				viewport={{ once: true }}
				className="flex flex-col gap-x-6 md:flex-row"
			>
				{cards.map((card, index) => {
					return <Card key={index} index={index} {...card} />
				})}
			</motion.div>
		</div>
	)
}

const AnimatedCardsV2Container = ({ data }) => {
	const widgetData = {
		title: data?.extra_field?.title,
		content: data?.extra_field?.content,
		cta: {
			title: data?.extra_field?.cta?.title,
			url: data?.extra_field?.cta?.url,
		},
		cards: data?.components?.map((card) => {
			return {
				icon: card?.icon,
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

export default AnimatedCardsV2Container
