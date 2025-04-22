import ProjectsCard from "./ProjectsCard"
import { normalizeProjects } from "./normalizer"
import { ParentTransition, ChildTransition, Container, Heading } from "@/ui"

import { vclsx } from "@vactorynext/core/utils"
import { motion } from "framer-motion"

export const config = {
	id: "vactory_projects:list",
}

const NewsListWidget = ({ data }) => {
	const projects = normalizeProjects(data)

	return (
		<Container>
			{/* Layout Switcher
				<LayoutSwitcher listingLayout={listingLayout} switchLayout={switchLayout} /> */}

			<div className="flex flex-col items-start justify-start gap-8 py-24">
				<div className="mb-8 flex items-center justify-start gap-4">
					<span className="block h-0.5 w-12 bg-primary" />
					<Heading level={1} variant={3} className="uppercase">
						{projects.pageTitle || "Projects"}
					</Heading>
				</div>
				<motion.div
					variants={ParentTransition}
					initial={"initial"}
					className={vclsx("mx-auto grid gap-5 md:grid-cols-2 lg:grid-cols-3")}
					key={projects.projects.reduce((prev, curr) => prev + curr.id, "")}
				>
					{projects.projects.map((post, index) => (
						<motion.div
							key={post.id}
							variants={ChildTransition(index)}
							initial="initial" // Set initial state for each child
							whileInView="animate" // Animate this child when it comes into view
							viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of the element is in view, only once
						>
							<ProjectsCard {...post} />
						</motion.div>
					))}
				</motion.div>
			</div>
		</Container>
	)
}

export default NewsListWidget
