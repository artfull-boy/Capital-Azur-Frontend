import React from "react"
import {
	Container,
	Badge,
	Icon,
	LocalMediaModal,
	Wysiwyg,
	Heading,
	Link,
	Image,
} from "@/ui"
import { Vcc } from "./Vcc"
import { normalizeNode } from "./normalizer"
import { useRef } from "react"
import { useI18n } from "@vactorynext/core/hooks"

const Thumbnail = ({ onClick, image }) => {
	return (
		<div
			onClick={onClick}
			onKeyDown={(e) => {
				e.key === "Enter" && onClick()
			}}
			role="button"
			tabIndex={0}
			className="cursor-pointer"
		>
			{image && (
				<Image
					src={image?.uri?.value?._default}
					alt={image?.meta?.alt}
					title={image?.meta?.title}
					width={image?.meta?.width}
					height={image?.meta?.height}
					isAmp={true}
				/>
			)}

			<div className="absolute bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center">
				<Icon id="play" className="h-16 w-16 text-white hover:text-gray-500"></Icon>
			</div>
		</div>
	)
}

const MediathequeNodeAMP = ({ node }) => {
	const { title, image, video, category, tags, date, excerpt, body, document } =
		normalizeNode(node)
	const videoModalRef = useRef()
	const { t } = useI18n()

	let video_id
	if (video) {
		video_id = video.split("v=")[1]
		let videoParamToRemove = video_id?.indexOf("&")
		if (videoParamToRemove != -1) {
			video_id = video_id?.substring(0, videoParamToRemove)
		}
	}
	return (
		<Container className="py-11">
			{title && <Heading>{title}</Heading>}
			{(category || date) && (
				<div className="mb-8 flex items-center gap-4">
					{category && <Badge text={category} />}
					{date && <span className="text-xs leading-[18px] text-gray-500">{date}</span>}
				</div>
			)}

			{!!tags.length && (
				<div className="mb-5 flex flex-wrap items-center gap-4">
					{tags.map((tag, index) => (
						<Badge key={index} size={"xsmall"} text={tag} />
					))}
				</div>
			)}

			<div className="mb-8 grid gap-8 md:mb-10 md:grid-cols-2 md:items-center">
				<div className="relative aspect-[16/9] overflow-hidden">
					{video ? (
						<>
							<Thumbnail
								image={image}
								onClick={() => {
									videoModalRef.current.open()
								}}
							/>
							<LocalMediaModal
								ref={videoModalRef}
								sourceId={video_id}
								closeIcon={<Icon className="h-5 w-5" id="x" />}
								expenderIcon={<Icon className="h-5 w-5" id="arrows-expand" />}
								minimizerIcon={<Icon className="h-5 w-5" id="minus" />}
							/>
						</>
					) : image ? (
						<Image
							src={image?.uri?.value?._default}
							alt={image?.meta?.alt}
							title={image?.meta?.title}
							width={image?.meta?.width}
							height={image?.meta?.height}
							isAmp={true}
							className="object-cover"
						/>
					) : null}
				</div>
				{excerpt && <Wysiwyg html={excerpt} className="prose max-w-none" />}
			</div>
			{body && <Wysiwyg html={body} className="prose max-w-none" />}
			{(document || image) && (
				<div className="mt-10 flex flex-wrap items-center gap-4">
					{document && (
						<Link
							href={document}
							download
							target="_blank"
							variant="btnPrimary"
							isAmp={true}
						>
							{t("Nx:Télécharger le document")}
							<Icon id="download" className="rtl-icon" width="20" height="20" />
						</Link>
					)}
					{image && (
						<Link
							href={image.uri.value._default}
							download
							target="_blank"
							variant="btnPrimary"
							isAmp={true}
						>
							{t("Nx:Télécharger l'image")}
							<Icon id="download" className="rtl-icon" width="20" height="20" />
						</Link>
					)}
				</div>
			)}
			{node.vcc_normalized && (
				<div className="py-6">
					<Vcc data={node?.vcc_normalized} />
				</div>
			)}
		</Container>
	)
}

export const config = {
	id: "node--vactory_mediatheque",
	params: {
		fields: {
			"node--vactory_mediatheque":
				"field_body,field_vactory_excerpt,field_vactory_media,field_vactory_tags,field_mediatheque_date,field_mediatheque_theme,field_mediatheque_video,field_vactory_media_document",
			"media--image": "thumbnail",
			"file--image": "uri",
			"file--document": "uri",
			"media--file": "name,field_media_file",
			"taxonomy_term--mediatheque_theme_albums": "name",
			"media--remote_video": "field_media_oembed_video",
		},
		include:
			"field_vactory_media,field_vactory_media.thumbnail,field_vactory_tags,field_mediatheque_theme,field_mediatheque_video,field_vactory_media_document,field_vactory_media_document.field_media_file",
	},
}

export default MediathequeNodeAMP
