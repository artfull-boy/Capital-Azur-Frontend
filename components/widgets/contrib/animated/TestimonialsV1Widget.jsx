import { Container, Icon } from "@/ui"
import { useAnimationControls, motion } from "framer-motion"
import { forwardRef, useImperativeHandle, useRef, useState } from "react"

export const config = {
	id: "vactory_default:81",
}

const AnimateImage = forwardRef(({ src }, ref) => {
	const targetRef = useRef()
	const leftOverlayControls = useAnimationControls()
	const rightOverlayControls = useAnimationControls()

	useImperativeHandle(ref, () => {
		return {
			triggerLeftOverlayAnimation: () => {
				triggerLeftOverlayAnimation()
			},
			triggerRightOverlayAnimation: () => {
				triggerRightOverlayAnimation()
			},
			startImageAnimation: () => {},
		}
	})

	const toLeftoverlayAnimations = {
		initial: { clipPath: "inset(0% 0% 0% 100%)" },
		start: {
			clipPath: "inset(0% 0% 0% 0%)",
			transition: { duration: 1, ease: [0.65, 0.05, 0.36, 1] },
		},
		end: {
			clipPath: "inset(0% 100% 0% 0%)",
			transition: {
				duration: 1,
				transition: { duration: 1, ease: [0.65, 0.05, 0.36, 1] },
			},
			transitionEnd: {
				clipPath: "inset(0% 0% 0% 100%)",
			},
		},
	}

	const toRightoverlayAnimations = {
		initial: { clipPath: "inset(0% 100% 0% 0%)" },
		start: {
			clipPath: "inset(0% 0% 0% 0%)",
			transition: { duration: 1, ease: [0.65, 0.05, 0.36, 1] },
		},
		end: {
			clipPath: "inset(0% 0% 0% 100%)",
			transition: { duration: 1, ease: [0.65, 0.05, 0.36, 1] },
			transitionEnd: {
				clipPath: "inset(0% 100% 0% 0%)",
			},
		},
	}

	const imageAnimation = {
		initial: {
			clipPath: "inset(100% 0% 0% 0%)",
			transition: { duration: 1 },
		},
		animate: {
			clipPath: "inset(0% 0% 0% 0%)",
			transition: { duration: 1 },
		},
	}

	const triggerLeftOverlayAnimation = async () => {
		await leftOverlayControls.start(toLeftoverlayAnimations.start)
		return leftOverlayControls.start(toLeftoverlayAnimations.end)
	}

	const triggerRightOverlayAnimation = async () => {
		await rightOverlayControls.start(toRightoverlayAnimations.start)
		return rightOverlayControls.start(toRightoverlayAnimations.end)
	}

	return (
		<div ref={targetRef} className="absolute h-full w-full overflow-hidden">
			<motion.div
				initial={toLeftoverlayAnimations.initial}
				animate={leftOverlayControls}
				className="absolute z-30 h-full w-full bg-white"
			></motion.div>
			<motion.div
				initial={toRightoverlayAnimations.initial}
				animate={rightOverlayControls}
				className="absolute z-30 h-full w-full bg-white"
			></motion.div>
			<motion.img
				initial={imageAnimation.initial}
				whileInView={imageAnimation.animate}
				viewport={{ once: true }}
				src={src}
				className="absolute inset-0 z-20 h-full w-full object-cover "
			/>
		</div>
	)
})

export const TestimonialsV1 = ({ testimonials }) => {
	const [current, setCurrent] = useState(0)
	const imageRef = useRef(null)
	const nextImage = useRef(null)
	const testimonialAnimationControls = useAnimationControls()
	const authorAnimationControls = useAnimationControls()
	const positionAnimationControls = useAnimationControls()

	const testimonialAnimation = {
		initial: {
			opacity: 1,
			transition: {
				duration: 0.6,
			},
		},
		animate: {
			opacity: 0,
			transition: {
				duration: 1,
			},
		},
	}
	const positionAnimations = {
		initial: {
			y: 0,
			transition: {
				duration: 1,
			},
		},
		animate: {
			y: "100%",
			transition: {
				duration: 1,
			},
		},
	}
	const authorAnimation = {
		initial: {
			y: 0,
			transition: {
				duration: 1,
			},
		},
		animate: {
			y: "100%",
			transition: {
				duration: 0.8,
			},
		},
	}

	const getNextCurrent = (current) => {
		if (current >= testimonials.length - 1) return 0
		return current + 1
	}

	const triggerTestimonialAnimation = async () => {
		await testimonialAnimationControls.start(testimonialAnimation.animate)
		return testimonialAnimationControls.start(testimonialAnimation.initial)
	}

	const triggerAuthorAnimation = async () => {
		await authorAnimationControls.start(authorAnimation.animate)
		return authorAnimationControls.start(authorAnimation.initial)
	}

	const triggerPositionAnimation = async () => {
		await positionAnimationControls.start(positionAnimations.animate)
		return positionAnimationControls.start(positionAnimations.initial)
	}

	const movePrev = () => {
		triggerTestimonialAnimation()
		triggerAuthorAnimation()
		triggerPositionAnimation()
		imageRef.current.triggerLeftOverlayAnimation()
		nextImage.current.triggerLeftOverlayAnimation()
		setTimeout(() => {
			setCurrent((prev) => {
				if (prev === 0) {
					return testimonials.length - 1
				}
				return prev - 1
			})
		}, 1000)
	}

	const moveNext = () => {
		triggerTestimonialAnimation()
		triggerAuthorAnimation()
		triggerPositionAnimation()
		imageRef.current.triggerRightOverlayAnimation()
		nextImage.current.triggerRightOverlayAnimation()

		setTimeout(() => {
			setCurrent((prev) => {
				if (prev === testimonials.length - 1) {
					return 0
				}
				return prev + 1
			})
		}, 1000)
	}

	const throttle = (fn, delay) => {
		var wait = false
		return (...args) => {
			if (!wait) {
				wait = true
				fn.apply(null, [...args])
				setTimeout(() => {
					wait = false
				}, delay)
			}
		}
	}

	return (
		<div className="relative my-44 bg-white">
			<Container>
				<div className="flex flex-col gap-x-24 md:flex-row">
					<div className="w-full md:w-5/12">
						<div className="aspect-h-4 aspect-w-3 relative bg-gray-200">
							<AnimateImage src={testimonials[current].image} ref={imageRef} />
						</div>
					</div>
					<div className="w-full self-end md:w-7/12">
						<motion.p
							initial={testimonialAnimation.initial}
							animate={testimonialAnimationControls}
							className="mb-12 mt-6 w-10/12 text-2xl font-medium"
						>
							{testimonials[current].testimonial}
						</motion.p>
						<div className="relative overflow-hidden">
							<motion.p
								initial={authorAnimation.initial}
								animate={authorAnimationControls}
								className="text-base font-medium "
							>
								{testimonials[current].author}
							</motion.p>
						</div>
						<div className="relative overflow-hidden">
							<motion.p
								initial={positionAnimations.initial}
								animate={positionAnimationControls}
								className="text-base font-medium text-gray-500"
							>
								{testimonials[current].position}
							</motion.p>
						</div>
						<div className="mt-24 flex items-center justify-between">
							<div className="flex items-center justify-end gap-x-6">
								<button
									onClick={throttle(movePrev, 2000)}
									className="rounded-full border p-3"
								>
									<Icon id="chevron-left" className="h-6 w-6" />
								</button>
								<button
									onClick={throttle(moveNext, 2000)}
									className="rounded-full border p-3"
								>
									<Icon id="chevron-right" className="h-6 w-6" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</Container>
			<div className="absolute bottom-0 right-0 w-44">
				<div className="aspect-h-4 aspect-w-3 bg-gray-200">
					<AnimateImage
						src={testimonials[getNextCurrent(current)].image}
						ref={nextImage}
					/>
				</div>
			</div>
		</div>
	)
}

export const TestimonialsV1Container = ({ data }) => {
	const testimonials = data?.components?.map((testimonial) => {
		return {
			image: testimonial?.image[0]?._default,
			testimonial: testimonial?.testimonial,
			author: testimonial?.author,
			position: testimonial?.position,
		}
	})
	return <TestimonialsV1 testimonials={testimonials} />
}

export default TestimonialsV1Container
