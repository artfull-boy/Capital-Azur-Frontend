import { Wysiwyg } from "@/ui"
import { motion } from "framer-motion"

export const config = {
	id: "vactory_default:56",
}

const addZero = (number) => {
	return ("0" + number).slice(-2)
}

const Section = ({ element, index }) => {
	const wrapper = {
		visible: {
			transition: { staggerChildren: 0.2 },
		},
	}

	const indicator = {
		hidden: {
			y: 100,
			opacity: 0,
		},
		visible: {
			y: 0,
			opacity: 1,
			transition: { duration: 1 },
		},
	}

	const contentWrapper = {
		visible: {
			transition: {
				staggerChildren: 0.5,
			},
		},
	}
	const content = {
		hidden: {
			opacity: 0,
		},
		visible: {
			opacity: 1,
		},
	}
	return (
		<motion.div
			variants={wrapper}
			initial="hidden"
			whileInView="visible"
			viewport={{ amount: 0.35, once: true }}
			className="flex flex-col md:flex-row"
		>
			<div className="w-full md:w-3/12">
				<motion.h3
					variants={indicator}
					className="sticky top-20 pt-20 text-9xl font-bold"
				>
					{addZero(index + 1)}
				</motion.h3>
			</div>
			<motion.div
				variants={contentWrapper}
				className="flex w-full flex-col gap-x-32 border-b-2 border-black py-20 md:w-9/12 md:flex-row"
			>
				<div className="w-full md:w-1/2">
					<motion.div variants={content} className="mb-6 text-2xl font-bold">
						{element.smallParagraph}
					</motion.div>
				</div>
				<motion.div variants={content} className="w-full md:w-1/2">
					{element.bigParagraph}
				</motion.div>
			</motion.div>
		</motion.div>
	)
}

const StickyIndicatorParagraph = ({ data }) => {
	const formattedData = data.components.map((item) => {
		return {
			smallParagraph: item.smallParagraph,
			bigParagraph: <Wysiwyg html={item?.bigParagraph?.value?.["#text"]} />,
		}
	})
	return (
		<div className="relative z-50 bg-white">
			{formattedData.map((element, index) => {
				return <Section key={index} element={element} index={index} />
			})}
		</div>
	)
}

export default StickyIndicatorParagraph
