import { Container } from "@/ui"
import { useTransform, useScroll, useMotionValueEvent } from "framer-motion"
import { useRef, useState } from "react"

export const config = {
	id: "vactory_default:75",
}

const Text = ({ children }) => {
	const targetRef = useRef()
	const [highlitedItems, setHighlitedItems] = useState(0)
	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ["0 0.9", "0.5 0.2"],
	})
	const childs = children.split(" ").map((element, index) => {
		if (index < highlitedItems) {
			return (
				<span key={index} className="text-3xl font-bold text-black md:text-5xl">
					{element}
				</span>
			)
		}
		return (
			<span key={index} className="text-3xl font-bold text-gray-200 md:text-5xl">
				{element}
			</span>
		)
	})
	const highlitedItem = useTransform(scrollYProgress, [0, 1], [0, childs.length])

	useMotionValueEvent(highlitedItem, "change", (latest) => {
		setHighlitedItems(Math.ceil(latest))
	})
	return (
		<div ref={targetRef} className="flex flex-wrap justify-center gap-x-4">
			{childs}
		</div>
	)
}

export const WordByWordTextAnimation = ({ text }) => {
	return (
		<Container className="my-24">
			<Text>{text}</Text>
		</Container>
	)
}

const WordByWordTextAnimationContainer = ({ data }) => {
	const widgetData = {
		text: data?.components[0]?.text,
		cta: {
			title: data?.components[0]?.cta?.title,
			url: data?.components[0]?.cta?.url,
		},
	}
	return <WordByWordTextAnimation {...widgetData} />
}

export default WordByWordTextAnimationContainer
