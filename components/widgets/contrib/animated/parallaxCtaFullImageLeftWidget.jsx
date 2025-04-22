import { Button, Container, Wysiwyg } from "@/ui"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useMedia } from "@vactorynext/core/hooks"
export const config = {
	id: "vactory_default:69",
}

// This DF must have a "No Container" wrapper in the appearance, so can the layout work perfectly
const ParallaxCtaFullImageLeft = ({ title, content, image, cta }) => {
	const containerRef = useRef()
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"],
	})
	const background = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
	const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
	const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"])
	const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1])

	const isMobile = useMedia("(max-width: 600px)", false)

	const titleAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 1 } },
	}
	const contentAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 1.3 } },
	}

	const ctaAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 0.5, delay: 0.8 } },
	}
	return (
		<div className="relative md:h-[70vh]">
			<div ref={containerRef}>
				<Container className="my-24">
					<motion.div
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
						style={{ y: !isMobile && contentY }}
						className="mb-16 ml-auto md:mb-0 md:w-6/12 md:pl-16"
					>
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
								<Button href={cta.url}>{cta.title}</Button>
							</motion.div>
						)}
					</motion.div>
				</Container>
			</div>
			<div className="relative left-0 top-0 z-20 h-96 overflow-hidden md:absolute md:h-[60vh] md:w-6/12">
				<motion.img
					style={{ y: !isMobile && imageY, scale: imageScale }}
					src={image}
					className="absolute inset-0 h-full w-full object-cover"
				/>
			</div>
			{!isMobile && (
				<motion.div
					style={{ y: background }}
					className="absolute bottom-0 left-0 right-0 z-[-100] mx-auto h-96 w-5/12 bg-gray-50"
				></motion.div>
			)}
		</div>
	)
}

const ParallaxCtaFullImageLeftContainer = ({ data }) => {
	const widgetData = {
		title: data?.components[0]?.title,
		content: <Wysiwyg html={data?.components[0]?.content?.value["#text"]} />,
		image: data?.components[0]?.image[0]?._default,
		cta: {
			title: data?.components[0]?.cta?.title,
			url: data?.components[0]?.cta?.url,
		},
	}
	return <ParallaxCtaFullImageLeft {...widgetData} />
}

export default ParallaxCtaFullImageLeftContainer
