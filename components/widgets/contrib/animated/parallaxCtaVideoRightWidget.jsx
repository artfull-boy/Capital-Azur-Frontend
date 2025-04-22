import { AnimatedVideoModal, Button, Container, Icon, Wysiwyg } from "@/ui"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useMedia } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_default:73",
}

export const ParallaxCTAVideoRight = ({ title, content, thumbnail, videoId, cta }) => {
	const containerRef = useRef()
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"],
	})
	const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])
	const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"])

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

	const playerButtonAnimation = {
		hover: {
			scale: 1.2,
		},
	}
	return (
		<Container className="my-24">
			<div
				ref={containerRef}
				className="relative flex flex-col-reverse gap-x-16 md:flex-row"
			>
				<div className="w-full md:w-4/12">
					<motion.div
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
						style={{ y: !isMobile && contentY }}
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
				</div>
				<div className="w-full md:w-8/12">
					<AnimatedVideoModal videoId={videoId}>
						<motion.div
							initial="initial"
							whileHover="hover"
							className="aspect-h-9 aspect-w-16 relative overflow-hidden shadow-xl"
						>
							<motion.img
								className="absolute inset-0 z-10 h-full w-full object-cover"
								src={thumbnail}
							/>
							<div className="absolute z-20 h-full w-full bg-black/40"></div>
							<motion.div
								variants={playerButtonAnimation}
								transition={{ duration: 0.5 }}
								className="aboslute z-30 flex h-full w-full items-center justify-center"
							>
								<div className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-white">
									<Icon id={"play"} className="h-12 w-12 text-primary-500" />
								</div>
							</motion.div>
						</motion.div>
					</AnimatedVideoModal>
				</div>

				{!isMobile && (
					<motion.div
						style={{ y: backgroundY }}
						className="absolute bottom-0 left-0 right-0 top-0 z-[-100] mx-auto my-auto h-[120%] w-8/12 bg-gray-50"
					></motion.div>
				)}
			</div>
		</Container>
	)
}

const ParallaxCTAVideoRightContainer = ({ data }) => {
	const widgetData = {
		title: data?.components[0]?.title,
		content: <Wysiwyg html={data?.components[0]?.content?.value["#text"]} />,
		thumbnail: data?.components[0]?.thumbnail[0]?._default,
		videoId: data?.components[0]?.videoId,
		cta: {
			title: data?.components[0]?.cta?.title,
			url: data?.components[0]?.cta?.url,
		},
	}
	return <ParallaxCTAVideoRight {...widgetData} />
}

export default ParallaxCTAVideoRightContainer
