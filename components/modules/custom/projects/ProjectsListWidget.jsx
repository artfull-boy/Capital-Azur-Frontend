import { Heading, Container, Button } from "@/ui"
import { normalizeProjects } from "./normalizer"
import ProjectCard from "./ProjectsCard"

export const config = {
	id: "vactory_projects:three-columns",
	lazy: false,
}
export default function ProjectsPage({ data }) {
	const projects = normalizeProjects(data)
	console.log("ProjectsPage", normalizeProjects(data))

	return (
		<div className="py-24 bg-white">
			<Container className="relative">
			{/* title */}
			{projects.pageTitle && (
				<div className="mb-8 flex items-center justify-start gap-4">
					<span className="block h-0.5 w-12 bg-primary" />
					<Heading level={1} variant={3} className="uppercase">
						{projects.pageTitle}
					</Heading>
				</div>
			)}

			<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
				{projects.projects.map((p) => (
					<ProjectCard key={p.id} {...p} />
				))}
			</div>
			{projects.buttonUrl && (
				<div className="mt-12 flex justify-center">
					<Button
						className="border border-primary bg-white px-8 py-3 font-semibold uppercase text-primary hover:bg-primary hover:text-white"
						href={projects.buttonUrl}
					>
						{projects.buttonLabel}
					</Button>
				</div>
			)}
		</Container>
		</div>
	)
}
