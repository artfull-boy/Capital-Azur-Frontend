import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { AnimatePresence, motion, useAnimationControls } from "framer-motion"
import { Button, Container, Icon, Image } from "@/ui"

export const config = {
	id: "vactory_default:63",
}

const AnimateImage = forwardRef(({ src }, ref) => {
	const controlsRight = useAnimationControls()
	const controlsLeft = useAnimationControls()
	useImperativeHandle(
		ref,
		() => {
			return {
				enterRight() {
					controlsRight.start({ x: 0, transition: { duration: 0.6 } })
				},
				exitRight() {
					controlsRight.start({
						x: "100%",
						transition: { duration: 0.4 },
						transitionEnd: { x: "-100%" },
					})
				},
				enterLeft: () => {
					controlsLeft.start({ x: 0, transition: { duration: 0.6 } })
				},
				exitLeft: () => {
					controlsLeft.start({
						x: "-100%",
						transition: { duration: 0.4 },
						transitionEnd: { x: "100%" },
					})
				},
			}
		},
		[] // eslint-disable-line react-hooks/exhaustive-deps
	)
	return (
		<div className="relative h-full w-full overflow-hidden rounded-md">
			<motion.div
				initial={{ x: "-100%" }}
				transition={{ duration: 1 }}
				animate={controlsRight}
				className="absolute left-0 top-0 z-30 h-full w-full bg-white"
			></motion.div>
			<motion.div
				initial={{ x: "100%" }}
				transition={{ duration: 1 }}
				animate={controlsLeft}
				className="absolute left-0 top-0 z-30 h-full w-full bg-white"
			></motion.div>
			<Image
				src={src}
				alt="image alt"
				fill
				className="absolute left-0 top-0 z-20 h-full w-full object-cover"
			/>
		</div>
	)
})

const Content = forwardRef(({ title, content, link }, ref) => {
	const contentAnimationControl = useAnimationControls()
	const ctaAnimationControl = useAnimationControls()

	const contentVariants = {
		initial: {
			opacity: 1,
			y: 0,
		},
		animate: {
			opacity: 0,
			y: 20,
			transition: { duration: 0.3 },
		},
	}

	const ctaVariants = {
		initial: {
			opacity: 1,
		},
		animate: {
			opacity: 0,
			transition: { duration: 0.3 },
		},
	}

	useImperativeHandle(
		ref,
		() => {
			return {
				start() {
					contentAnimationControl.start(contentVariants.animate)
					ctaAnimationControl.start(ctaVariants.animate)
				},
				exit() {
					contentAnimationControl.start(contentVariants.initial)
					ctaAnimationControl.start(ctaVariants.initial)
				},
			}
		},
		[] // eslint-disable-line react-hooks/exhaustive-deps
	)

	return (
		<AnimatePresence>
			<div className="flex-grow">
				<motion.h3
					initial={contentVariants.initial}
					animate={contentAnimationControl}
					className="mb-5 text-2xl font-semibold md:text-4xl"
				>
					{title}
				</motion.h3>
				<motion.p
					initial={contentVariants.initial}
					animate={contentAnimationControl}
					className="text-gray-500"
				>
					{content}
				</motion.p>
			</div>
			<motion.div initial={ctaVariants.initial} animate={ctaAnimationControl}>
				<Button href={link.url}>{link.title}</Button>
			</motion.div>
		</AnimatePresence>
	)
})

const Handlers = ({ moveNext, movePrev }) => {
	const handlersVariants = {
		visible: {
			opacity: 1,
		},
		hidden: {
			opacity: 0,
		},
	}

	return (
		<div>
			<motion.div
				variants={handlersVariants}
				animate="visible"
				exit="hidden"
				className="flex gap-x-8"
			>
				<button onClick={movePrev}>
					<Icon id="chevron-left" className="h-5 w-5" />
				</button>
				<button onClick={moveNext}>
					<Icon id="chevron-right" className="h-5 w-5" />
				</button>
			</motion.div>
		</div>
	)
}

const pad = (deg) => {
	return ("0" + deg).slice(-2)
}

const Indicators = ({ current, data }) => {
	return (
		<div className="flex items-center gap-x-2">
			<span className="text-sm">{pad(current + 1)}</span>
			<span className="text-sm">/</span>
			<span className="text-sm text-gray-400">{pad(data.length)}</span>
		</div>
	)
}

const SliderWidget = ({ data }) => {
	const [current, setCurrent] = useState(0)
	const bigImageRef = useRef()
	const smallImageRef = useRef()
	const contentRef = useRef()

	const interval = useRef()

	useEffect(() => {
		interval.current = setInterval(() => {
			moveNext()
		}, 10000)
		return () => {
			clearInterval(interval.current)
		}
	}, [current]) // eslint-disable-line react-hooks/exhaustive-deps

	const moveNext = () => {
		bigImageRef?.current?.enterRight()
		smallImageRef?.current?.enterRight()
		contentRef?.current?.start()

		setTimeout(() => {
			setCurrent((prev) => {
				if (prev === data.length - 1) return 0
				return prev + 1
			})

			bigImageRef?.current?.exitRight()
			smallImageRef?.current?.exitRight()
			contentRef?.current?.exit()
		}, 600)
	}

	const movePrev = () => {
		bigImageRef.current.enterLeft()
		smallImageRef.current.enterLeft()
		contentRef.current.start()

		setTimeout(() => {
			setCurrent((prev) => {
				if (prev === 0) {
					return data.length - 1
				}
				return prev - 1
			})
			bigImageRef.current.exitLeft()
			smallImageRef.current.exitLeft()
			contentRef.current.exit()
		}, 600)
	}

	return (
		<Container className="my-24">
			<div className="flex min-h-[50rem] flex-col gap-x-16 md:flex-row">
				<div className="mb-6 hidden w-full md:mb-0  md:block md:w-7/12">
					<AnimateImage ref={bigImageRef} src={data[current].bigImage} />
				</div>
				<div className="flex w-full flex-col gap-y-12 md:w-5/12">
					<div className="h-[300px] w-full">
						<AnimateImage ref={smallImageRef} src={data[current].smallImage} />
					</div>
					<Content ref={contentRef} {...data[current]} />
					<div className="flex items-center justify-between">
						<Handlers movePrev={movePrev} moveNext={moveNext} />
						<Indicators current={current} data={data} />
					</div>
				</div>
			</div>
		</Container>
	)
}

const SliderWidgetContainer = ({ data }) => {
	const widgetData = data?.components?.map((slide) => {
		return {
			title: slide?.title,
			content: slide?.content,
			bigImage: slide?.bigImage[0]?._default,
			smallImage: slide?.smallImage[0]?._default,
			link: {
				title: slide?.link?.title,
				url: slide?.link?.url,
			},
		}
	})
	return <SliderWidget data={widgetData} />
}

export default SliderWidgetContainer
