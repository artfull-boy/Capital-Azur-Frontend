import { Button, Wysiwyg } from "@/ui"
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export const config = {
	id: "vactory_default:84",
}

const CtaFullImageCenteredV2 = ({ title, cta, image }) => {
	const targetRef = useRef()

	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ["start start", "end end"],
	})

	const clipPathL = useTransform(scrollYProgress, [0, 1], ["10%", "0%"])
	const clipPathR = useTransform(scrollYProgress, [0, 1], ["10%", "0%"])
	const clipPathT = useTransform(scrollYProgress, [0, 1], ["70%", "0%"])

	const titleAnimation = {
		initial: { opacity: 0, y: 100 },
		animate: { opacity: 1, y: 0, transition: { duration: 1 } },
	}

	const ctaAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 0.5, delay: 1 } },
	}

	const imageAnimation = {
		initial: {
			clipPath: "inset(100% 10% 0% 10%)",
		},
		animate: {
			clipPath: "inset(70% 10% 0% 10%)",
			transition: {
				duration: 1,
			},
		},
	}

	return (
		<div ref={targetRef} className="h-[150vh]">
			<div className="sticky top-0 h-[100vh] w-full">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className="absolute left-0 right-0 top-1/3 mx-auto mb-32 flex w-full flex-col items-center md:w-1/2"
				>
					<motion.h2
						variants={titleAnimation}
						className="mb-8 text-center text-4xl font-semibold tracking-tight md:text-5xl lg:text-8xl "
					>
						{title}
					</motion.h2>

					{cta?.url && (
						<motion.div variants={ctaAnimation}>
							<Button src={cta.url}>{cta.title}</Button>
						</motion.div>
					)}
				</motion.div>
				<motion.div
					initial={imageAnimation.initial}
					whileInView={imageAnimation.animate}
					viewport={{ once: true }}
					style={{
						clipPath: useMotionTemplate`inset(${clipPathT} ${clipPathL} 0% ${clipPathR})`,
					}}
					className="absolute bottom-0 h-full w-full"
				>
					<div className="absolute left-0 right-0 top-1/3 z-30 mx-auto mb-32 flex w-full flex-col items-center md:w-1/2">
						<h2 className="mb-8 text-center text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-8xl ">
							Smart living starts with smart building
						</h2>

						{cta?.url && (
							<motion.div variants={ctaAnimation}>
								<Button src={cta.url}>{cta.title}</Button>
							</motion.div>
						)}
					</div>
					<motion.img
						src={image}
						// style={{ scale: scale, y: translateY }}
						className="absolute inset-0 h-full w-full object-cover"
					/>
				</motion.div>
			</div>
		</div>
	)
}

const CtaFullImageCenteredV2Container = ({ data }) => {
	const widgetData = {
		title: data?.components[0]?.title,
		content: <Wysiwyg html={data?.components[0]?.content?.value["#text"]} />,
		image: data?.components[0]?.image[0]?._default,
		cta: {
			title: data?.components[0]?.cta?.title,
			url: data?.components[0]?.cta?.url,
		},
	}
	return <CtaFullImageCenteredV2 {...widgetData} />
}

export default CtaFullImageCenteredV2Container
