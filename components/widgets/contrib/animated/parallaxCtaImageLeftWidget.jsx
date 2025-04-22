import { Button, Container, Wysiwyg } from "@/ui"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useMedia } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_default:71",
}

const ParallaxCtaImageRight = ({ title, content, image, cta }) => {
	const containerRef = useRef()
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"],
	})
	const background = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
	const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])
	const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"])
	const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1])

	const isMobile = useMedia("(max-width: 600px)", false)

	const titleAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 1 } },
	}
	const contentAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 1.2 } },
	}

	const ctaAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
	}
	return (
		<Container className="my-24">
			<div
				ref={containerRef}
				className="relative flex w-full flex-col-reverse gap-x-12 md:flex-row"
			>
				<motion.div className="relative w-full md:w-5/12">
					<motion.div
						style={{ y: !isMobile && imageY }}
						className="relative w-full overflow-hidden pt-[100%]"
					>
						<motion.img
							style={{ scale: imageScale }}
							src={image}
							className="absolute inset-0 h-[150%] w-[150%] object-cover"
						/>
					</motion.div>
				</motion.div>
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					style={{ y: !isMobile && contentY }}
					className="w-full md:w-7/12"
				>
					<motion.h2
						variants={titleAnimation}
						className="mb-8 text-4xl font-semibold tracking-tight md:text-4xl lg:text-5xl"
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

				{!isMobile && (
					<motion.div
						style={{ y: background }}
						className="absolute inset-0 z-[-100] m-auto h-[120%] w-8/12 bg-gray-50"
					></motion.div>
				)}
			</div>
		</Container>
	)
}

const ParallaxCtaImageRightContainer = ({ data }) => {
	const widgetData = {
		title: data?.components[0]?.title,
		content: <Wysiwyg html={data?.components[0]?.content?.value["#text"]} />,
		image: data?.components[0]?.image[0]?._default,
		cta: {
			title: data?.components[0]?.cta?.title,
			url: data?.components[0]?.cta?.url,
		},
	}
	return <ParallaxCtaImageRight {...widgetData} />
}

export default ParallaxCtaImageRightContainer
