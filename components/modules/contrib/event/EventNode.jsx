import React, { useEffect } from "react"
import { Container, Heading, Wysiwyg, Badge, Text, Image, Flag } from "@/ui"
import { normalizeNode } from "./normalizer"
import { dlPush } from "@vactorynext/core/lib"

const EventNode = ({ node }) => {
	const {
		image,
		title,
		dateStart,
		dateEnd,
		body,
		category,
		city,
		tags,
		isFlagged,
		hasFlag,
		id,
	} = normalizeNode(node)

	// trigger data layer event when visiting a event node
	useEffect(() => {
		dlPush("Événement à venir", {
			Titre: title,
			Catégorie: category,
			Ville: city,
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
					{city && (
						<Text
							variant="small"
							className="ml-[18px] border-l border-l-gray-300 px-[18px] text-gray-300"
						>
							{city}
						</Text>
					)}
				</div>
				{!!tags.length && (
					<div className="mb-5 flex flex-wrap items-center gap-4">
						{tags.map((tag, index) => (
							<Badge key={index} size={"xsmall"} text={tag} />
						))}
					</div>
				)}
				<div className="relative aspect-[16/9] shrink-0">
					{dateStart && dateEnd && (
						<div className="absolute left-2 top-2 z-10 flex gap-2">
							<Badge size="xsmall" className="bg-primary" text={dateStart} />
							<Badge size="xsmall" className="!bg-gray" text={dateEnd} />
						</div>
					)}

					{image && (
						<Image
							src={image?.uri?.value?._default}
							alt={image?.meta?.alt}
							title={title}
							width={image?.meta?.width}
							height={image?.meta?.height}
							className="h-full w-full object-cover"
						/>
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
			</div>
			<Wysiwyg html={body} className="prose max-w-none" />
		</Container>
	)
}

export const config = {
	id: "node--vactory_event",
	params: {
		fields: {
			"node--vactory_event":
				"drupal_internal__nid,body,field_vactory_media,field_vactory_taxonomy_1,field_vactory_taxonomy_2,field_vactory_date_interval,field_vactory_tags,vcc_normalized",
			"media--image": "thumbnail",
			"file--image": "uri",
			"taxonomy_term--vactory_event_category": "name",
			"taxonomy_term--vactory_event_citys": "name",
			"taxonomy_term--tags": "name",
		},
		include:
			"field_vactory_media,field_vactory_media.thumbnail,field_vactory_taxonomy_1,field_vactory_taxonomy_2,field_vactory_tags",
	},
}

export default EventNode
