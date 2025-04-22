import React, { useEffect } from "react"
//import { Vcc } from "./Vcc"
import { Badge, Container, Heading, Wysiwyg, Image, Flag } from "@/ui"
import { normalizeNode } from "./normalizer"
import { Comments } from "@/comments"
import { dlPush } from "@vactorynext/core/lib"

const BlogNodeAMP = ({ node }) => {
	const { image, title, body, category, date, isFlagged, hasFlag, id } =
		normalizeNode(node)

	// trigger data layer event when visiting a blog post
	useEffect(() => {
		dlPush("Consultation article", {
			"Titre article": title,
			"Catégorie article": category,
			"Date article": date,
			"URL article": window.location.href,
			"Commentaires article": node?.internal_comment?.contributions,
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<Container className="py-11">
			<Heading level="1" className="mb-5 text-center">
				{title}
			</Heading>
			<div className="mx-auto mb-8 max-w-3xl">
				<div className="mb-6 flex items-center justify-center text-lg">
					{category && <Badge text={category} size="normal" />}
					{date && (
						<span className="ml-[18px] border-l border-l-gray-300 px-[18px] text-xs leading-[18px] text-gray-500">
							{date}
						</span>
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
				{image && (
					<div className="relative aspect-[16/9]">
						<Image
							src={image?.uri?.value?._default}
							alt={image?.meta?.alt}
							title={title}
							className="h-full w-full object-cover"
							// fill
							isAmp={true}
						/>
					</div>
				)}
			</div>

			<Wysiwyg html={body} className="prose mb-6 max-w-none" />

			{/* Comments. */}
			<Comments
				entity_id={node.id} // The node id. (require)
				content_type="vactory_news" // The content type. (require)
				field_name="comment" // The field name at content type. (optionnal)
				settings={node?.internal_comment} // It contains field settings such as : status, limit per page, comment anonymous ... (require).
				btn_label="poster un commentaire" // optionnal
			/>
			{/* end comments */}
		</Container>
	)
}

export const config = {
	id: "node--vactory_blog",
	params: {
		fields: {
			"node--vactory_blog":
				"body,created,field_vactory_excerpt,field_vactory_media,field_blog_category,field_blog_tags,internal_comment,vcc_normalized",
			"media--image": "thumbnail",
			"file--image": "uri",
			"taxonomy_term--field_blog_category": "name",
			"taxonomy_term--field_blog_tags": "name",
		},
		include:
			"field_vactory_media,field_vactory_media.thumbnail,field_blog_category,field_blog_tags",
	},
}

export default BlogNodeAMP
