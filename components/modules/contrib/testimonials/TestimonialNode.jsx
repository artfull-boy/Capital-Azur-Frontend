import React from "react"
import { Container, Badge, Text, Wysiwyg, Image, Flag } from "@/ui"
import { normalizeNode } from "./normalizer.js"

const TestimonialNode = ({ node }) => {
	const { title, image, category, date, excerpt, body, isFlagged, hasFlag, id } =
		normalizeNode(node)
	return (
		<Container className="py-11">
			<div className="mb-10 grid gap-5 md:grid-cols-2 md:items-center">
				<div className="relative aspect-[16/9] overflow-hidden rounded-lg">
					{image && (
						<Image
							src={image?.uri?.value?._default}
							alt={image?.meta?.alt}
							width={image?.meta?.width}
							height={image?.meta?.height}
							title={title}
							className="h-full w-full object-cover"
						/>
					)}
				</div>
				<div>
					<div className="mb-8 flex items-center">
						<Badge text={category} size="xsmall" />
						{date && (
							<Text className="ml-4 border-l border-l-gray-300 px-[18px] text-xs leading-[18px]">
								{date}
							</Text>
						)}
						{hasFlag && (
							<Flag
								id={id}
								module="default_flag"
								className="cursor-pointer"
								isFlagged={isFlagged}
							/>
						)}
					</div>
					<Wysiwyg html={excerpt} className="prose max-w-none" />
				</div>
			</div>
			<Wysiwyg html={body} className="prose max-w-none" />
		</Container>
	)
}

export const config = {
	id: "node--vactory_testimonials",
	params: {
		fields: {
			"node--vactory_testimonials":
				"title,field_vactory_address,body,field_vactory_date,field_vactory_excerpt,field_vactory_media,field_vactory_profils,field_vactory_role,field_vactory_tags",
			"media--image": "thumbnail",
			"file--image": "uri",
			"taxonomy_term--tags": "name",
			"taxonomy_term--vactory_testimonials_profils": "name",
		},
		include:
			"field_vactory_profils,field_vactory_tags,field_vactory_media,field_vactory_media.thumbnail",
	},
}

export default TestimonialNode
