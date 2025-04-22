import { motion, useAnimationControls } from "framer-motion"
import { forwardRef, useEffect, useRef, useState } from "react"

import { Button, Container, Icon, Link } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:80",
}

const Slide = forwardRef(({ image, title, content, link }, ref) => {
	return (
		<div
			className={vclsx(
				"relative w-full shrink-0 pr-6 last:pr-0 md:basis-1/2 lg:basis-1/3"
			)}
			ref={ref}
		>
			<div className={vclsx("relative mb-8 h-[300px] overflow-hidden md:h-[400px]")}>
				<motion.img
					src={image}
					className="absolute inset-0 h-[150%] w-[150%] object-cover"
				/>
			</div>
			<div className="mt-2">
				<h3 className="mb-1 text-xl font-semibold">{title}</h3>
				<p className="mb-2 text-base text-gray-400">{content}</p>
				<Link href={link.url}>{link.title}</Link>
			</div>
		</div>
	)
})

export const Slider = ({ title, content, cta, slides }) => {
	const cardRef = useRef(null)
	const trackRef = useRef(null)
	const containerRef = useRef(null)
	const currentSlide = useRef(0)
	const trackAnimationControls = useAnimationControls()

	const [cardWidth, setCardWith] = useState(null)
	const [containerWidth, setContainerWidth] = useState(null)

	useEffect(() => {
		setCardWith(cardRef.current.getBoundingClientRect().width)
		setContainerWidth(containerRef.current.getBoundingClientRect().width)
	}, [])

	const handleClick = () => {
		trackAnimationControls.start({
			x: -1 * cardWidth * currentSlide.current,
			transition: {
				duration: 1,
				type: "spring",
				stiffness: 50,
				damping: 20,
			},
		})
	}

	const movePrev = () => {
		handleClick()
		currentSlide.current = currentSlide.current - 1 < 0 ? 0 : currentSlide.current - 1
	}
	const moveNext = () => {
		const visibleCards = parseInt(containerWidth / cardWidth)
		const number = slides.length - visibleCards
		handleClick()
		currentSlide.current =
			currentSlide.current + 1 > number ? 0 : currentSlide.current + 1
	}

	const titleAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 1 } },
	}
	const contentAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 1.3 } },
	}

	const ctaAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 0.5, delay: 0.8 } },
	}

	return (
		<div
			onClick={handleClick}
			onKeyDown={(e) => {
				e.key === "Enter" && handleClick()
			}}
			role="button"
			tabIndex={0}
			style={{ contain: "paint" }}
		>
			<Container className="my-24">
				<div ref={containerRef}>
					<div className="">
						<div className="flex items-end justify-between">
							<motion.div
								initial="initial"
								whileInView="animate"
								viewport={{ once: true }}
								className="w-8/12"
							>
								<motion.h2
									variants={titleAnimation}
									className="mb-8 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl"
								>
									{title}
								</motion.h2>

								<motion.p
									variants={contentAnimation}
									className="mb-10 text-base text-gray-500 md:text-lg"
								>
									{content}
								</motion.p>

								{cta?.url && (
									<motion.div variants={ctaAnimation}>
										<Button href={cta.url}>{cta.title}</Button>
									</motion.div>
								)}
							</motion.div>
							<div className="flex gap-x-8">
								<button onClick={movePrev} className="rounded-full p-3">
									<Icon id="chevron-left" className="h-6 w-6" />
								</button>
								<button onClick={moveNext} className="rounded-full p-3">
									<Icon id="chevron-right" className="h-6 w-6" />
								</button>
							</div>
						</div>
						<motion.div
							ref={trackRef}
							animate={trackAnimationControls}
							className="mt-24 flex min-w-fit overflow-scroll md:mt-32 md:overflow-visible"
						>
							{slides.map((slide, index) => {
								return <Slide key={index} {...slide} ref={cardRef} />
							})}
						</motion.div>
					</div>
				</div>
			</Container>
		</div>
	)
}

const SliderV1Container = ({ data }) => {
	const widgetData = {
		title: data?.extra_field?.title,
		content: data?.extra_field?.content,
		cta: {
			title: data?.extra_field?.cta?.title,
			url: data?.extra_field?.cta?.url,
		},
		slides: data?.components?.map((slide) => {
			return {
				image: slide?.image[0]?._default,
				title: slide?.title,
				content: slide?.content,
				link: {
					title: slide?.link?.title,
					url: slide?.link?.url,
				},
			}
		}),
	}
	return <Slider {...widgetData} />
}

export default SliderV1Container
