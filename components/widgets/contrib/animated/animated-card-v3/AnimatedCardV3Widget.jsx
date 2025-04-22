import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useMedia } from "@vactorynext/core/hooks"
import { Button, Container, Icon, Link } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:78",
}

const Card = ({ icon, title, content, link, isLastElement }) => {
	const cardAnimations = {
		initial: {
			opacity: 0,
			y: -20,
		},
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 1,
			},
		},
	}
	return (
		<motion.div
			variants={cardAnimations}
			whileInView="animate"
			initial="initial"
			viewport={{ once: true }}
			className={vclsx(
				"relative mb-8 h-[400px] min-w-[25vw] flex-1 self-stretch md:mb-0 md:h-[400px]",
				isLastElement ? "mr-0" : "md:mr-6"
			)}
		>
			<motion.div className="relative h-full w-full overflow-hidden rounded-md bg-gray-50 p-8">
				<Icon id={icon} className="mb-10 h-12 w-12" />
				<motion.h4 className="mb-6 text-2xl font-semibold text-black ">{title}</motion.h4>
				<motion.p className="mb-10 font-light text-gray-600">{content}</motion.p>

				<motion.div className="self-start">
					<Link href={link.url}>{link.title}</Link>
				</motion.div>
			</motion.div>
		</motion.div>
	)
}

export const AnimatedCards = ({ title, content, cta, cards }) => {
	const targetRef = useRef(null)
	const cardContainerRef = useRef(null)
	const [scrolledWidth, setScrolledWidth] = useState(null)

	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ["start start", "end end"],
	})

	useEffect(() => {
		const _scrolledWidth =
			cardContainerRef?.current?.getBoundingClientRect()?.width -
			targetRef.current.getBoundingClientRect()?.width
		setScrolledWidth(_scrolledWidth)
	}, [])

	const translateX = useTransform(scrollYProgress, [0, 1], [0, -1 * scrolledWidth])

	const stroke = useTransform(scrollYProgress, [0, 1], [0, 1])
	const isMobile = useMedia("(max-width: 600px)", false)
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
		<div style={{ contain: "paint" }}>
			<Container>
				<div ref={targetRef} className="w-full md:h-[calc(100vh+200vw)] ">
					<div className="py-32 md:sticky md:top-0 md:h-screen">
						<div className="relative">
							<div className="flex w-full items-end justify-between">
								<motion.div
									initial="initial"
									whileInView="animate"
									viewport={{ once: true }}
									className="w-full md:w-8/12"
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
											<Button href={cta.href}>{cta.title}</Button>
										</motion.div>
									)}
								</motion.div>
								{!isMobile && (
									<div>
										<svg id="progress" width="100" height="100" viewBox="0 0 100 100">
											<circle
												cx="50"
												cy="50"
												r="30"
												pathLength="1"
												className="fill-transparent stroke-primary-400/30 stroke-[20px]"
											/>
											<motion.circle
												cx="50"
												cy="50"
												r="30"
												pathLength="1"
												className="fill-transparent stroke-primary-500 stroke-[20px]"
												style={{ pathLength: stroke }}
											/>
										</svg>
									</div>
								)}
							</div>
						</div>

						<motion.div
							ref={cardContainerRef}
							style={{ x: translateX }}
							className="mt-24 flex w-full flex-col md:min-w-fit md:flex-row"
						>
							{cards.map((card, index) => {
								if (index === cards.length) {
									return <Card key={index} index={index} isLastElement={true} {...card} />
								}

								return <Card key={index} index={index} {...card} />
							})}
						</motion.div>
					</div>
				</div>
			</Container>
		</div>
	)
}
const AnimatedCardsV3Container = ({ data }) => {
	const widgetData = {
		title: data?.extra_field?.title,
		content: data?.extra_field?.content,
		cta: {
			title: data?.extra_field?.cta?.title,
			url: data?.extra_field?.cta?.url,
		},
		cards: data?.components?.map((card) => {
			return {
				icon: card?.icon,
				title: card?.title,
				content: card?.content,
				link: {
					title: card?.link?.title,
					url: card?.link?.url,
				},
			}
		}),
	}
	return <AnimatedCards {...widgetData} />
}

export default AnimatedCardsV3Container
