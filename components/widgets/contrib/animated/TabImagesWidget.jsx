import { Container, Icon, Link } from "@/ui"
import { AnimatePresence, motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export const config = {
	id: "vactory_default:54",
}

const TabImages = ({ data }) => {
	const [current, setCurrent] = useState(0)
	const containerRef = useRef()
	const isInView = useInView(containerRef, { amount: "some", once: true })

	const items = data.components.map((record, index) => {
		return {
			id: index,
			title: record?.title,
			content: record?.content,
			image: record?.image[0]?._default,
			url: record?.link?.url,
		}
	})

	useEffect(() => {
		if (isInView) {
			setInterval(() => {
				setCurrent((prev) => {
					if (prev === items.length - 1) return 0
					return prev + 1
				})
			}, 5000)
		}
	}, [isInView]) // eslint-disable-line react-hooks/exhaustive-deps

	const elementContainer = {
		animate: {
			transition: { staggerChildren: 0.2 },
		},
	}

	const image = {
		initial: { opacity: 0, y: 10 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 10 },
	}

	return (
		<Container className="my-24 md:my-24">
			<div
				ref={containerRef}
				className="relative items-end md:flex md:flex-row md:gap-x-20"
			>
				<div className="relative left-0 z-10 h-[60vh] w-full md:min-h-[70vh] md:w-2/3">
					<AnimatePresence>
						<motion.img
							key={items[current].id}
							variants={image}
							transition={{ duration: 0.8 }}
							src={items[current].image}
							className={`absolute inset-0 h-full w-full rounded-md object-cover`}
						/>
					</AnimatePresence>
				</div>
				<div className="relative z-10 w-full px-2 md:w-1/3 md:px-0">
					<motion.div
						initial="initial"
						animate="animate"
						variants={elementContainer}
						className="-mt-[50%] bg-white px-4 py-2 md:mt-0"
					>
						{items.map((item, index) => {
							return (
								<Element
									key={index}
									current={current}
									index={index}
									isInView={isInView}
									{...item}
								/>
							)
						})}
					</motion.div>
				</div>
			</div>
		</Container>
	)
}

const Element = ({ current, index, title, content, url, isInView }) => {
	const elementContainer = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
	}
	const progress = {
		initial: {
			width: 0,
		},
		animate: {
			width: "100%",
			transition: { duration: 5 },
		},
		exit: {
			opacity: 0,
		},
	}
	const linkVariant = {
		initial: {
			x: 0,
		},
		hover: {
			x: 20,
		},
	}
	return (
		<motion.div
			variants={elementContainer}
			className="relative mb-2 border-b py-3 md:pb-8"
		>
			<Link href={url}>
				<motion.div
					initial={"initial"}
					whileHover={"hover"}
					className="mb-2 flex items-center gap-x-4 md:mb-3"
				>
					<span className="text-lg font-medium uppercase md:text-2xl">{title}</span>
					<motion.div variants={linkVariant}>
						<Icon id="chevron-right" className="h-4 w-4" />
					</motion.div>
				</motion.div>
			</Link>

			<p className="text-sm md:text-base">{content}</p>
			<AnimatePresence>
				{current === index && isInView && (
					<motion.span
						variants={progress}
						initial="initial"
						animate="animate"
						exit="exit"
						className="absolute bottom-0 left-0 block h-1 w-full bg-primary-600"
					></motion.span>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

export default TabImages
