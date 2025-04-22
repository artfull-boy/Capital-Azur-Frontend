import { Container } from "@/ui"
import { useTransform, useScroll, motion } from "framer-motion"
import { useRef } from "react"

export const config = {
	id: "vactory_default:74",
}

const Text = ({ children }) => {
	const containerRef = useRef(null)
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start center", "end center"],
	})
	const x = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
	return (
		<div ref={containerRef} className="relative mb-2 w-full overflow-hidden">
			<div className="w-full text-center text-3xl font-bold uppercase md:text-5xl">
				{children}
			</div>
			<motion.div
				style={{ x: x }}
				className="absolute left-0 top-0 h-full w-full bg-white/80"
			></motion.div>
		</div>
	)
}

export const LineByLineTextAnimation = ({ texts }) => {
	return (
		<Container>
			{texts.map((text, index) => {
				return <Text key={index}>{text}</Text>
			})}
		</Container>
	)
}

const LineByLineTextAnimationContainer = ({ data }) => {
	const widgetData = {
		texts: data?.components?.map((record) => {
			return record.text
		}),
		cta: {
			title: data?.extra_field?.cta?.title,
			url: data?.extra_field?.cta?.url,
		},
	}
	return <LineByLineTextAnimation {...widgetData} />
}

export default LineByLineTextAnimationContainer
