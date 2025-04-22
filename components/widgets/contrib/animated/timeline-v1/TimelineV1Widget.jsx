import {
	motion,
	useAnimationControls,
	useMotionValueEvent,
	useScroll,
	useTransform,
} from "framer-motion"
import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react"

import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:85",
}
export const TimelineV1 = ({ timeline }) => {
	const targetRef = useRef()
	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ["start center", "end center"],
	})
	const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
	return (
		<div className="relative mx-auto max-w-screen-xl">
			<div className="absolute left-1/4 h-full w-[3px]">
				<span className="absolute block h-full w-full bg-gray-100"></span>
				<motion.span
					style={{ height: height }}
					className="absolute block h-12 w-full bg-black"
				></motion.span>
			</div>
			<div ref={targetRef} className="w-full">
				<div className="py-44">
					{timeline.map((timelineElement, index) => {
						return <Timeline key={index} timeline={timelineElement} isPair={index % 2} />
					})}
				</div>
			</div>
		</div>
	)
}

const Timeline = ({ timeline, isPair }) => {
	const timelineRef = useRef()
	const imageRef = useRef()
	const [reachCenter, setReachCenter] = useState(false)
	const { scrollYProgress } = useScroll({
		target: timelineRef,
		offset: ["start end", "start start"],
	})
	useMotionValueEvent(scrollYProgress, "change", (latest) => {
		if (latest >= 0.5) {
			setReachCenter(true)
		}
	})

	useEffect(() => {
		if (reachCenter) {
			imageRef.current.animate()
		}
	}, [reachCenter])
	const headerAnimation = {
		initial: { opacity: 0, y: 100 },
		animate: { opacity: 1, y: 0, transition: { duration: 1 } },
	}
	const contentAnimation = {
		initial: { opacity: 0, y: 120 },
		animate: { opacity: 1, y: 0, transition: { duration: 1.2 } },
	}
	return (
		<div
			ref={timelineRef}
			className={vclsx("mb-32 flex gap-x-20 last:mb-0", isPair ? "pl-32" : "pr-32")}
		>
			<div className="relative w-5/12">
				<div className="aspect-h-4 aspect-w-3 relative">
					<AnimatedImage ref={imageRef} src={timeline.image} direction={"down"} />
				</div>
			</div>
			<motion.div
				initial="initial"
				whileInView="animate"
				viewport={{ once: true, amount: "some" }}
				className="w-7/12"
			>
				<motion.h1 variants={headerAnimation} className="mb-12 text-5xl font-bold">
					{timeline.date}
				</motion.h1>
				<motion.p variants={contentAnimation} className="text-lg text-gray-500">
					{timeline.content}
				</motion.p>
			</motion.div>
		</div>
	)
}

const AnimatedImage = forwardRef(({ src }, ref) => {
	const imageAnimationControls = useAnimationControls()
	useImperativeHandle(ref, () => {
		return {
			animate: () => {
				imageAnimationControls.start({
					scale: 1.1,
					transition: { duration: 0.5 },
				})
			},
		}
	})
	return (
		<motion.div className="h-full w-full overflow-hidden bg-black">
			<motion.img
				animate={imageAnimationControls}
				src={src}
				className="absolute inset-0 h-full w-full object-cover"
			/>
		</motion.div>
	)
})

const TimelineV1Container = ({ data }) => {
	const timeline = data.components.map((timeline) => {
		return {
			date: timeline?.date,
			content: timeline?.content,
			image: timeline?.image[0]?._default,
			cta: {
				title: timeline?.link?.title,
				url: timeline?.link?.url,
			},
		}
	})
	return <TimelineV1 timeline={timeline} />
}

export default TimelineV1Container
