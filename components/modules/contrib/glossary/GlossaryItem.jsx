import { Heading, Wysiwyg } from "@/ui"

export const GlossaryItem = ({ title, body }) => {
	return (
		<div className="bg-white p-5 shadow-sm rounded-md">
			<Heading level="2" variant="5" className="mb-2">
				{title}
			</Heading>
			<Wysiwyg html={body} className="prose max-w-none pl-4" />
		</div>
	)
}
