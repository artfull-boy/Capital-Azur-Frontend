import { Button, Wysiwyg } from "@/ui"
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export const config = {
	id: "vactory_default:65",
}

export const CtaFullImageCentered = ({ title, content, image, cta }) => {
	const imageContainerRef = useRef()
	const { scrollYProgress } = useScroll({
		target: imageContainerRef,
		offset: ["start end", "end center"],
	})

	const clipPathL = useTransform(scrollYProgress, [0, 1], ["10%", "0%"])
	const clipPathR = useTransform(scrollYProgress, [0, 1], ["10%", "0%"])
	const clipPathB = useTransform(scrollYProgress, [0, 1], ["50%", "0%"])

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
		animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.6 } },
	}

	const imageAnimation = {
		initial: {
			clipPath: "inset(0 10% 40% 10%)",
		},
	}
	return (
		<div>
			<div className="my-24 mb-32">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className="mx-auto flex w-full flex-col items-center md:w-2/3"
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
							<Button src={cta.url}>{cta.title}</Button>
						</motion.div>
					)}
				</motion.div>
			</div>
			<div ref={imageContainerRef}>
				<motion.div
					variants={imageAnimation}
					initial="initial"
					style={{
						clipPath: useMotionTemplate`inset(0 ${clipPathL} ${clipPathB} ${clipPathR})`,
					}}
					className="aspect-h-4 aspect-w-3 relative overflow-hidden md:aspect-h-10 md:aspect-w-16"
				>
					<motion.img
						src={image}
						className="absolute inset-0 h-full w-full object-cover"
					/>
				</motion.div>
			</div>
		</div>
	)
}

const CtaFullImageRightContainer = ({ data }) => {
	const widgetData = {
		title: data?.components[0]?.title,
		content: <Wysiwyg html={data?.components[0]?.content?.value["#text"]} />,
		image: data?.components[0]?.image[0]?._default,
		cta: {
			title: data?.components[0]?.cta?.title,
			url: data?.components[0]?.cta?.url,
		},
	}
	return <CtaFullImageCentered {...widgetData} />
}

export default CtaFullImageRightContainer
