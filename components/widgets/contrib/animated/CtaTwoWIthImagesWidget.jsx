import { Button, Wysiwyg } from "@/ui"
import { motion, useAnimationControls, useInView } from "framer-motion"
import { useEffect, useRef } from "react"

export const config = {
	id: "vactory_default:59",
}

const CtaWithTwoImages = ({ title, content, cta, bigImage, smallImage }) => {
	const containerRef = useRef(null)
	const isInView = useInView(containerRef, { amount: "some", once: true })
	const overlayControls = useAnimationControls()

	const image = {
		initial: { x: 0 },
		animate: { x: "-100%" },
	}

	useEffect(() => {
		if (isInView) {
			overlayControls.start(image.animate)
		}
	}, [isInView]) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div ref={containerRef} className="mx-auto mb-44 max-w-screen-xl">
			<div className="mb-[500px] flex gap-x-20">
				<div className="relative flex-1">
					<div className="mr-12">
						<h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
							{title}
						</h2>
						<div className="mb-6">{content}</div>

						<Button href={cta.url}>{cta.text}</Button>
					</div>
				</div>
				<div className="relative h-[600px] flex-1">
					<div className="relative h-full w-full overflow-hidden ">
						<motion.div
							variants={image}
							animate={overlayControls}
							initial="initial"
							transition={{ duration: 0.8 }}
							className="absolute right-0 top-0 z-40 h-full w-full bg-white"
						></motion.div>
						<motion.img
							src={bigImage}
							className="absolute right-0 top-0 h-full w-full object-cover"
						/>
					</div>
					<div className="absolute right-full top-full h-1/2 w-1/2 overflow-hidden">
						<motion.div
							variants={image}
							animate={overlayControls}
							initial="initial"
							transition={{ delay: 0.4, duration: 0.6 }}
							className="relative z-40 h-full w-full bg-white"
						></motion.div>
						<motion.img
							src={smallImage}
							className="absolute left-0 top-0 z-30 h-full w-full object-cover"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

const CtaWithTwoImagesContainer = ({ data }) => {
	const widgetData = {
		title: data?.components[0]?.title,
		content: <Wysiwyg html={data?.components[0]?.content?.value["#text"]} />,
		cta: {
			text: data?.components[0]?.cta?.title,
			url: data?.components[0]?.cta?.url,
		},
		bigImage: data.components[0]?.bigImage[0]?._default,
		smallImage: data.components[0]?.smallImage[0]?._default,
	}
	return <CtaWithTwoImages {...widgetData} />
}

export default CtaWithTwoImagesContainer
