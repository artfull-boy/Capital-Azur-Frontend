import { useScroll, motion, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import { Waypoint } from "react-waypoint"

import { Container, Icon, Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:82",
}

const Box = ({ icon, title, content, index, setActiveElement, isLast = false }) => {
	const boxRef = useRef()
	const handleWaypointEnter = () => {
		setActiveElement(index)
	}

	return (
		<Waypoint topOffset="40%" bottomOffset="40%" onEnter={handleWaypointEnter}>
			<div
				ref={boxRef}
				className={vclsx(
					"py-auto flex h-[70vh] flex-col justify-center",
					isLast && "mb-44"
				)}
			>
				{icon && <Icon id={icon} className="mb-8 h-10 w-10" />}
				<h2 className="mb-6 text-4xl font-semibold">{title}</h2>
				<div className="mb-4 text-gray-500">{content}</div>
			</div>
		</Waypoint>
	)
}

const StickyImagesWithContent = ({ data, title, content }) => {
	const [activeElement, setActiveElement] = useState(0)
	const tragetRef = useRef()
	const { scrollYProgress } = useScroll({
		target: tragetRef,
		offset: ["0 1", "0 0.1"],
	})

	const translateX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])

	const imageAnimation = {
		initial: {
			opacity: 0,
			y: 10,
		},
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.2,
			},
		},
		exit: {
			opacity: 0,
			y: 10,
		},
	}
	const titleAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 1 } },
	}
	const contentAnimation = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 1.3 } },
	}

	return (
		<div style={{ contain: "paint" }}>
			<Container className="relative my-24">
				<div>
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
					</motion.div>
					<div>
						<motion.div
							ref={tragetRef}
							style={{ x: translateX }}
							className="sticky top-[5vh] box-content h-[95vh]"
						>
							<div className="relative h-full w-full">
								<AnimatePresence>
									<motion.img
										key={data[activeElement].image}
										variants={imageAnimation}
										initial="initial"
										animate="animate"
										exit="exit"
										src={data[activeElement].image}
										className="absolute inset-0 h-full w-full rounded-md object-cover"
									/>
								</AnimatePresence>
							</div>
						</motion.div>
						<div className={vclsx("flex w-full", "justify-end")}>
							<div className={vclsx("relative w-6/12  ", "pl-16")}>
								{data.map((record, index) => {
									if (index === data.length - 1)
										return (
											<Box
												key={index}
												index={index}
												setActiveElement={setActiveElement}
												isLast={true}
												{...record}
											/>
										)
									return (
										<Box
											key={index}
											index={index}
											setActiveElement={setActiveElement}
											{...record}
										/>
									)
								})}
							</div>
						</div>
					</div>
				</div>
			</Container>
		</div>
	)
}
export const StickyImagesWithContentContainer = ({ data }) => {
	const widgetData = {
		title: data?.extra_field?.title,
		content: data?.extra_field?.content,
		items: data?.components?.map((item) => {
			return {
				image: item?.image[0]?._default,
				title: item?.title,
				icon: item?.icon,
				content: <Wysiwyg html={item?.content?.value["#text"]} />,
				link: {
					title: item?.link?.title,
					url: item?.link?.url,
				},
			}
		}),
	}
	return (
		<StickyImagesWithContent
			data={widgetData.items}
			title={widgetData.title}
			content={widgetData.content}
		/>
	)
}

export default StickyImagesWithContentContainer
