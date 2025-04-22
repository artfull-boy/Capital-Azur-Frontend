import { useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { motion } from "framer-motion"
import { AnimatedImage } from "@/ui"

export const config = {
	id: "vactory_default:86",
}

const TimelineV2 = ({ timeline }) => {
	const targetRef = useRef()
	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ["start center", "end center"],
	})
	const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

	return (
		<div className="mx-auto my-44 max-w-screen-xl">
			<div ref={targetRef} className="relative mx-auto py-12">
				<div className="absolute left-1/2 h-full w-[3px] -translate-x-1/2">
					<span className="absolute inset-0 block h-full w-full bg-gray-300"></span>
					<motion.span
						style={{ height: height }}
						className="absolute inset-0 block h-12 w-full bg-black"
					></motion.span>
				</div>
				<div className="w-full">
					{timeline.map((timelineElement, index) => {
						return <Timeline key={index} timeline={timelineElement} />
					})}
				</div>
			</div>
		</div>
	)
}

const Timeline = ({ timeline }) => {
	const contentAnimation = {
		initial: {
			opacity: 0,
		},
		animate: {
			opacity: 1,
			transition: {
				duration: 1,
			},
		},
	}
	return (
		<div className="mb-32 flex">
			<div className="sticky top-1/2 w-1/2 self-start pr-16">
				<h2 className="inline-block text-6xl font-bold">{timeline.date}</h2>
			</div>
			<div className="relative w-1/2 pl-20">
				<motion.span className="absolute -left-2 -top-2 block h-4 w-4 rounded-full bg-black ring-4 ring-white"></motion.span>
				<motion.p
					initial="initial"
					whileInView="animate"
					viewport={{ amount: "some" }}
					variants={contentAnimation}
					className="mb-12 text-gray-500"
				>
					{timeline.content}
				</motion.p>
				<div className="aspect-h-12 aspect-w-16">
					<AnimatedImage src={timeline.image} direction="up" overlay={false} />
				</div>
			</div>
		</div>
	)
}

const TimelineV2Container = ({ data }) => {
	const timeline = data.components.map((timeline) => {
		return {
			date: timeline?.date,
			content: timeline?.content,
			image: timeline?.image[0]?._default,
			cta: {
				title: timeline?.link?.title,
				url: timeline?.link?.url,
			},
		}
	})
	return <TimelineV2 timeline={timeline} />
}

export default TimelineV2Container
