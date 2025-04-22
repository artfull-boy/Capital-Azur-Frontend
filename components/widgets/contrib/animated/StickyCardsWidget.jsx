import { Icon, Link, Wysiwyg } from "@/ui"
import { motion } from "framer-motion"

export const config = {
	id: "vactory_default:62",
}

const container = {
	initial: { opacity: 0 },
	animate: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
}

const items = {
	initial: {
		y: 20,
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8 },
	},
}

const linkArrow = {
	initial: {
		opacity: 0,
	},
	hover: {
		opacity: 1,
	},
}

const border = {
	initial: {
		width: 0,
	},
	animate: {
		width: "100%",
		transition: {
			duration: 1,
		},
	},
}

const Box = ({ title, content, link }) => {
	return (
		<motion.div
			variants={container}
			initial="initial"
			whileInView="animate"
			viewport={{ once: true }}
			className="relative w-full pb-8"
		>
			<motion.span
				variants={border}
				className="mb-8 block h-px bg-gray-200"
			></motion.span>
			{link.url ? (
				<Link href={link.url}>
					<motion.h2
						variants={items}
						initial="initial"
						whileHover="hover"
						animate="animate"
						className="mb-4 flex items-center gap-x-4 text-4xl"
					>
						<span className="block">{title}</span>
						<motion.div variants={linkArrow}>
							<Icon id="chevron-right" className="h-4 w-4" />
						</motion.div>
					</motion.h2>
				</Link>
			) : (
				<motion.h2 variants={items} className="mb-6 text-4xl">
					{title}
				</motion.h2>
			)}

			<motion.div variants={items} className="text-lg text-gray-500">
				{content}
			</motion.div>
		</motion.div>
	)
}

const StickyCards = ({ title, content, cards }) => {
	// const listContainer = {
	// 	initial: { opacity: 0 },
	// 	animate: {
	// 		opacity: 1,
	// 		transition: { staggerChildren: 0.3, delayChildren: 0.5 },
	// 	},
	// }
	return (
		<div className="my-24 flex flex-col justify-between gap-x-16 md:flex-row">
			<div className="w-full md:w-4/12">
				<div className="sticky top-24">
					<h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
						{title}
					</h1>
					<p className="mt-6 leading-8 text-gray-600">{content}</p>
				</div>
			</div>
			<div className="relative flex w-full flex-col md:w-7/12">
				{cards.map((card, index) => {
					return <Box key={index} {...card} />
				})}
			</div>
		</div>
	)
}

const StickyCardsContainer = ({ data }) => {
	const widgetData = {
		title: data?.extra_field?.title,
		content: data?.extra_field?.content,
		link: {
			title: data?.extra_field?.cta?.title,
			url: data?.extra_field?.cta?.url,
		},
		cards: data?.components?.map((card) => {
			return {
				title: card?.title,
				content: <Wysiwyg html={card?.content?.value["#text"]} />,
				link: {
					title: card?.link?.title,
					url: card?.link?.url,
				},
			}
		}),
	}
	return <StickyCards {...widgetData} />
}

export default StickyCardsContainer
