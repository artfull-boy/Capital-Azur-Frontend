import { Icon } from "@/ui"
import { useAnimationControls, motion, AnimatePresence } from "framer-motion"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

export const config = {
	id: "vactory_default:87",
}

const TimelineV3 = ({ timeline, title, content }) => {
	const datesRef = useRef([])
	const trackRef = useRef()
	const containerRef = useRef()
	const [current, setCurrent] = useState(0)
	const [dateWidth, setDateWidth] = useState()
	const trackAnimationControl = useAnimationControls()

	const titleAnimation = {
		initial: { opacity: 0, y: 100 },
		animate: { opacity: 1, y: 0, transition: { duration: 1 } },
	}
	const contentAnimation = {
		initial: { opacity: 0, y: 120 },
		animate: { opacity: 1, y: 0, transition: { duration: 1.3 } },
	}

	const imageAnimation = {
		initial: { opacity: 0, y: 30 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
		exit: {
			opacity: 0,
			transition: { duration: 0.5 },
		},
	}

	const movetrack = ({ index, multiplier }) => {
		datesRef.current[index].initial()
		trackAnimationControl.start({
			x: -1 * dateWidth * multiplier,
			transition: {
				duration: 1,
				type: "spring",
				stiffness: 50,
				damping: 20,
			},
		})
	}

	const moveNext = () => {
		setCurrent((prev) => {
			if (prev === timeline.length - 1) return prev
			movetrack({ index: prev, multiplier: prev + 1 })
			return prev + 1
		})
	}

	const movePrev = () => {
		setCurrent((prev) => {
			if (prev === 0) return prev
			movetrack({ index: prev, multiplier: prev - 1 })
			return prev - 1
		})
	}

	useEffect(() => {
		var dateWidth = containerRef.current.getBoundingClientRect().width / 3
		setDateWidth(dateWidth)
	}, [])

	useEffect(() => {
		datesRef.current[current].animate()
	}, [current])

	return (
		<div
			style={{ contain: "paint" }}
			ref={containerRef}
			className="mx-auto my-44 max-w-screen-xl"
		>
			<motion.div
				initial="initial"
				whileInView="animate"
				viewport={{ once: true }}
				className="mx-auto mb-32 w-2/3"
			>
				<motion.h2
					variants={titleAnimation}
					className="mb-8 text-center text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl"
				>
					{title}
				</motion.h2>

				<motion.p
					variants={contentAnimation}
					className="mb-10 text-center text-base text-gray-500 md:text-lg"
				>
					{content}
				</motion.p>
			</motion.div>
			<div className="relative mx-auto mb-12">
				<div className="flex">
					<div className="relative w-1/2">
						<div className="aspect-h-11 aspect-w-16 relative">
							<AnimatePresence mode="wait">
								<motion.img
									initial="initial"
									animate="animate"
									exit="exit"
									variants={imageAnimation}
									key={timeline[current].image}
									src={timeline[current].image}
									className="object-cover"
								/>
							</AnimatePresence>
						</div>
					</div>
					<div className="w-1/2 pl-16">
						<div className="mb-12">
							<p className="text-lg">{timeline[current].content}</p>
						</div>
						<div className="flex w-full gap-x-3">
							<button className="rounded-full border p-2 " onClick={movePrev}>
								<Icon id="chevron-left" className="h-5 w-5" />
							</button>
							<button className="rounded-full border p-2 " onClick={moveNext}>
								<Icon id="chevron-right" className="h-5 w-5" />
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="relative">
				<motion.div
					animate={trackAnimationControl}
					ref={trackRef}
					className="relative z-30"
				>
					<div className="flex">
						{timeline.map((timelineElement, index) => {
							return (
								<TimelineDate
									key={index}
									ref={(element) => {
										datesRef.current.push(element)
									}}
									date={timelineElement.date}
								/>
							)
						})}
					</div>
				</motion.div>
				<div className="absolute top-1/2 z-20 w-full">
					<span className="absolute z-20 block h-[2px] w-full bg-gray-200"></span>
				</div>
			</div>
		</div>
	)
}

const TimelineDate = forwardRef(({ date }, ref) => {
	const dateAnimationControls = useAnimationControls()
	useImperativeHandle(ref, () => {
		return {
			animate: () => {
				dateAnimationControls.start(dateAnimation.animate)
			},
			initial: () => {
				dateAnimationControls.start(dateAnimation.initial)
			},
		}
	})
	const dateAnimation = {
		initial: {
			scale: 0.5,
			color: "#ececec",
			transition: {
				duration: 1,
			},
		},
		animate: {
			color: "#000000",
			scale: 1,
			transition: {
				duration: 1,
			},
		},
	}
	return (
		<motion.div
			initial={dateAnimation.initial}
			animate={dateAnimationControls}
			className="flex w-1/3 shrink-0 justify-center"
		>
			<span className="bg-white px-4 text-9xl font-bold">{date}</span>
		</motion.div>
	)
})

const TimelineV3Container = ({ data }) => {
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
	const widgetData = {
		title: data?.extra_field?.title,
		content: data?.extra_field?.content,
		cta: {
			title: data?.extra_field?.cta?.title,
			url: data?.extra_field?.cta?.url,
		},
	}
	return <TimelineV3 timeline={timeline} {...widgetData} />
}

export default TimelineV3Container
