import { Button, Container, Wysiwyg } from "@/ui"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useMedia } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_default:68",
}

export const ParallaxInternalCTAFullImageRight = ({ title, content, image, cta }) => {
	const imageContainerRef = useRef()
	const { scrollYProgress } = useScroll({
		target: imageContainerRef,
		offset: ["start end", "end start"],
	})
	const y = useTransform(scrollYProgress, [0, 1], ["0", "-25%"])
	const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1])

	const isMobile = useMedia("(max-width: 600px)", false)

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
		<div className="relative md:h-[80vh]">
			<Container className="my-24">
				<div className="mb-16 mr-auto h-full md:mb-0 md:flex md:w-1/2 md:items-center md:pr-16">
					<motion.div
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
						className="mb-32"
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
				</div>
			</Container>
			<div
				ref={imageContainerRef}
				className="relative right-0 top-0 h-96 overflow-hidden bg-gray-100 md:absolute md:h-[80vh] md:w-1/2"
			>
				<motion.img
					style={{ y: !isMobile && y, scale: imageScale }}
					src={image}
					className="absolute inset-0 h-[135%] w-[135%] object-cover"
				/>
			</div>
		</div>
	)
}

const ParallaxInternalCtaFullImageRightContainer = ({ data }) => {
	const widgetData = {
		title: data?.components[0]?.title,
		content: <Wysiwyg html={data?.components[0]?.content?.value["#text"]} />,
		image: data?.components[0]?.image[0]?._default,
		cta: {
			title: data?.components[0]?.cta?.title,
			url: data?.components[0]?.cta?.url,
		},
	}
	return <ParallaxInternalCTAFullImageRight {...widgetData} />
}

export default ParallaxInternalCtaFullImageRightContainer
