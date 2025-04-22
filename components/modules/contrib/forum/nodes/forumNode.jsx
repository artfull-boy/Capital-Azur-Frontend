import React, { useEffect } from "react"
import { Container, Image } from "@/ui"
import { normalizeNode } from "../normalizer"
import { Comments } from "@/comments"
import { deserialise } from "kitsu-core"
import { drupal } from "@vactorynext/core/drupal"
import { useRouter } from "next/router"
import Cookies from "js-cookie"

const ForumNode = ({ node }) => {
	const normalizedNode = normalizeNode(deserialise(node))
	const router = useRouter()
	const locale = router.locale
	const alreadySeen = Cookies.get(`alreadyseen${normalizedNode.id}`)

	useEffect(() => {
		if (alreadySeen === undefined) {
			const sendData = async () => {
				await drupal.fetch(`${locale}/api/_updateNodeViewsCount/${normalizedNode.id}`, {
					withAuth: true,
					method: "PATCH",
				})
			}
			Cookies.set(`alreadyseen${normalizedNode.id}`, true)
			sendData()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Container className="py-11">
			<div className="mb-8">
				<div>
					<div>
						<div>
							<div>
								<div>
									{normalizedNode.expert?.picture?.uri && (
										<div className="relative h-[150px] w-[150px] overflow-hidden rounded-full border-2 border-white shadow-xl">
											<Image
												src={normalizedNode.expert?.picture?.uri}
												alt={normalizedNode.expert?.picture?.alt}
												className="object-cover"
												fill
											/>
										</div>
									)}
								</div>
								<div>
									<div>
										{normalizedNode.expert.firstName &&
											normalizedNode.expert.lastName && (
												<h5>
													{normalizedNode.expert.firstName}{" "}
													{normalizedNode.expert.lastName}
												</h5>
											)}

										{normalizedNode.expert.profession && (
											<p>{normalizedNode.expert.profession}</p>
										)}
									</div>
								</div>
							</div>
						</div>
						{normalizedNode.expert.field_about_the_author && (
							<div>
								<p>{normalizedNode.expert.field_about_the_author}</p>
							</div>
						)}
					</div>
				</div>
				<div>
					<h1 className="mb-10 mt-10 block text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
						{normalizedNode.title}
					</h1>
					{normalizedNode.body}
				</div>
			</div>

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
	id: "node--vactory_forum",
	params: {
		fields: {
			"node--vactory_forum":
				"body,created,title,field_vactory_forum_status,field_vactory_date,field_vactory_excerpt,field_forum_editeur,field_forum_expert,field_vactory_forums_thematic,field_vactory_media,internal_comment",
			"media--image": "thumbnail",
			"file--image": "uri",
			"taxonomy_term--vactory_forums_thematic": "name",
			"user--user":
				"field_first_name,field_last_name,field_user_profession,field_about_the_author,user_picture",
		},
		include:
			"field_vactory_forums_thematic,field_vactory_media,field_vactory_media.thumbnail,field_forum_editeur,field_forum_expert,field_forum_expert.user_picture",
	},
}

export default ForumNode
