import { AnimatedImage, Button, Container, Wysiwyg } from "@/ui"
import { motion } from "framer-motion"

export const config = {
	id: "vactory_default:51",
}

// This DF must have a "No Container" wrapper in the appearance, so can the layout work perfectly
const CtaFullImageRight = ({ title, content, image, cta }) => {
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
		<div className="relative my-24 md:h-[80vh]">
			<Container>
				<div className="mb-16 mr-auto h-full pr-0 md:mb-0 md:flex md:w-1/2 md:items-center md:pr-16">
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
			<div className="relative right-0 top-0 h-96 overflow-hidden md:absolute md:h-[80vh] md:w-1/2">
				<AnimatedImage src={image} direction={"left"} />
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
	return <CtaFullImageRight {...widgetData} />
}

export default CtaFullImageRightContainer
