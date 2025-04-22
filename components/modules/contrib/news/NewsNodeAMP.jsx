import { Container, Text, Badge, Wysiwyg, Image } from "@/ui"
import { NextPrev } from "../next-prev/nextPrev"
import { normalizeNode } from "./normalizer"
import { useEffect } from "react"
import { dlPush } from "@vactorynext/core/lib"

const NewsNodeAMP = ({ node }) => {
	const normalizedNode = normalizeNode(node)
	const { image, image_alt, category, date, excerpt, body } = normalizedNode
	const nextPrevInfo = {
		nid: node.drupal_internal__nid,
		resource: "vactory_news",
		queryParams: {
			fields: {
				"node--vactory_news": "title,path,field_vactory_media,field_vactory_news_theme",
				"media--image": "thumbnail",
				"file--image": "uri",
				"taxonomy_term--vactory_news_theme": "name",
			},
			include:
				"field_vactory_media,field_vactory_media.thumbnail,field_vactory_news_theme",
		},
	}

	if (image && !image.src && image.uri.value._default) {
		image.src = image.uri.value._default || "https://source.unsplash.com/random"
		image.width = image.meta.width || 700
		image.height = image.meta.height || 500
	}

	useEffect(() => {
		// trigger data layer event when visiting a new post
		dlPush("Consultation News", {
			"Titre News": excerpt,
			"Catégorie News": category,
			"Date News": date,
			"URL News": window.location.href,
			"Commentaires News": node?.internal_comment?.contributions,
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<Container className="py-3">
			<NextPrev {...nextPrevInfo} />
			<div className=" mb-11">
				<div>
					{image && image.src && image.width && image.height && (
						<div className="overflow-hidden rounded-lg">
							<Image
								{...image}
								alt={image_alt}
								className="h-full w-full object-cover"
								isAmp={true}
							/>
						</div>
					)}
				</div>{" "}
				<div className="p-7 md:p-12">
					<div className="mb-8 flex items-center justify-center">
						<Badge text={category} />
						{date && (
							<Text
								variant="small"
								className="ml-[18px] border-l border-l-gray-300 px-[18px] text-gray-300"
							>
								{date}
							</Text>
						)}
					</div>
					<Wysiwyg html={excerpt} className="prose mx-auto" />
				</div>
				<Wysiwyg html={body} className="prose max-w-none" />
			</div>
		</Container>
	)
}

export const config = {
	id: "node--vactory_news",
	params: {
		fields: {
			"node--vactory_news":
				"body,created,field_vactory_excerpt,field_vactory_media,field_vactory_news_theme,field_vactory_date,vcc_normalized,internal_comment",
			"media--image": "thumbnail",
			"file--image": "uri",
			"taxonomy_term--vactory_news_theme": "name",
		},
		include: "field_vactory_media,field_vactory_media.thumbnail,field_vactory_news_theme",
	},
}

export default NewsNodeAMP
