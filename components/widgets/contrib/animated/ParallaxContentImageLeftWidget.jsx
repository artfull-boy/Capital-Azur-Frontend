import { Button, Wysiwyg } from "@/ui"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export const config = {
	id: "vactory_default:58",
}

const variants = {
	initial: {
		opacity: 1,
	},
	animate: {
		opacity: 1,
	},
}

const ParallaxContentImageLeftWidget = ({ title, content, image, cta }) => {
	const targetRef = useRef()
	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ["start end", "end start"],
	})
	const translateY = useTransform(scrollYProgress, [0, 1], [0, 150])
	const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

	return (
		<div ref={targetRef} className="relative mb-24 px-2 md:mb-44">
			<motion.div
				style={{ y: translateY }}
				className="relative z-10 ml-auto h-full w-full md:w-1/2 md:py-20"
			>
				<div className="rounded-md bg-primary-500 p-6 text-white md:p-20">
					<motion.h2
						variants={variants}
						className="mb-4 text-4xl font-bold md:mb-8 md:text-4xl"
					>
						{title}
					</motion.h2>
					<motion.div variants={variants} className="mb-8 md:text-lg">
						{content}
					</motion.div>
					<motion.div variants={variants}>
						<Button href={cta.url}>{cta.title}</Button>
					</motion.div>
				</div>
			</motion.div>
			<div className="relative left-0 top-0 h-[400px] w-full overflow-hidden rounded-md md:absolute md:h-full md:w-7/12">
				<motion.img
					style={{ scale: scale }}
					src={image}
					className="h-full w-full object-cover"
				/>
			</div>
		</div>
	)
}

const ParallaxContentImageLeftWidgetContainer = ({ data }) => {
	const widgetData = {
		title: data?.components[0]?.title,
		content: <Wysiwyg html={data?.components[0]?.content?.value["#text"]} />,
		image: data?.components[0]?.image[0]?._default,
		cta: {
			title: data?.components[0]?.cta?.title,
			url: data?.components[0]?.cta?.url,
		},
	}
	return <ParallaxContentImageLeftWidget {...widgetData} />
}

export default ParallaxContentImageLeftWidgetContainer
