import { Container, Text, Badge, Wysiwyg, Image, Flag, Heading } from "@/ui"
import { NextPrev } from "../next-prev/nextPrev"
import { normalizeNode } from "./normalizer"
import { Comments } from "@/comments"
import { useEffect } from "react"
import { dlPush } from "@vactorynext/core/lib"
import { useRouter } from "next/router"
import { useI18n } from "@vactorynext/core/hooks"

const NewsNode = ({ node }) => {
	const router = useRouter()
	const normalizedNode = normalizeNode(node)
	const {
		title,
		id,
		image,
		image_alt,
		category,
		date,
		excerpt,
		body,
		isFlagged,
		hasFlag,
	} = normalizedNode

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
	const { t } = useI18n()

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
			"URL News": `/${router.locale}/${router.asPath}`,
			"Commentaires News": node?.internal_comment?.contributions,
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Container>
			<div className="flex flex-col gap-6 mb-11 md:mb-16">
				<Heading level={2} variant={3} className="text-primary">
					{title}
				</Heading>
				<div className="">
					<div className="flex items-center justify-start">
						<Badge text={category} className="bg-black text-white"/>
						{date && (
							<Text
								variant="small"
								className="ml-[18px] border-l border-l-gray-500 px-[18px] text-gray-500"
							>
								{date}
							</Text>
						)}
						{hasFlag && (
							<div className="ml-[18px] border-l border-l-gray-500 px-[18px]">
								<Flag
									id={id}
									module="favorite_news"
									className="cursor-pointer"
									isFlagged={isFlagged}
								/>
								{t("Nx:Ajouter a ma liste")}
							</div>
						)}
					</div>
				</div>
				<hr className="text-gray-300 bg-gray-500"/>
				<div>
					{image && image.src && image.width && image.height && (
						<div className="overflow-hidden rounded-lg">
							<Image {...image} alt={image_alt} className="w-[40%] object-cover" />
						</div>
					)}
				</div>
				
				{body && <Wysiwyg html={body} className="prose max-w-none" />}
			</div>
			{/* <NextPrev {...nextPrevInfo} /> */}

			{/* Comments. */}
			<Comments
				entity_id={node.id} // The node id. (require)
				content_type="vactory_news" // The content type. (require)
				field_name="comment" // The field name at content type. (optionnal)
				settings={node?.internal_comment} // It contains field settings such as : status, limit per page, comment anonymous ... (require).
				btn_label="poster un commentaire" // optionnal
			/>
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

export default NewsNode
