import React from "react"
import {
	Container,
	Heading,
	LocalMediaModal,
	Wysiwyg,
	Flag,
	Badge,
	Icon,
	Button,
	Image,
	FiveStar,
} from "@/ui"
import { normalizeSingleNode } from "./normalizer"
import { useRef } from "react"
import { useI18n } from "@vactorynext/core/hooks"

const Thumbnail = ({ onClick, image, title }) => {
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
					title={title}
					fill
					className="object-cover"
				/>
			)}
			<div className="absolute bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center">
				<Icon id="play" className="h-16 w-16 text-white hover:text-gray-500"></Icon>
			</div>
		</div>
	)
}
const AcademyImage = ({ image, alt = "", ...rest }) => {
	if (!image) {
		return <></>
	}
	return (
		<div className="relative h-[200px] overflow-hidden">
			<Image
				src={image?._default}
				alt={alt}
				width={image?.meta?.width}
				height={image?.meta?.height}
				className="w-full object-cover"
				{...rest}
			/>
		</div>
	)
}

const AcademyNode = ({ node }) => {
	const {
		title,
		image,
		duree,
		excerpt,
		instructor,
		video,
		theme,
		tags,
		langue,
		date,
		document,
		id,
		isFlagged,
		hasFlag,
		vote,
	} = normalizeSingleNode(node, false)
	const videoModalRef = useRef()
	const { t } = useI18n()
	let video_id
	if (video) {
		if (video.includes("youtu.be/")) {
			video_id = video.split("youtu.be/")[1]
		} else {
			video_id = video.split("v=")[1]
		}
		let videoParamToRemove = video_id?.indexOf("&")
		if (videoParamToRemove != -1) {
			video_id = video_id.substring(0, videoParamToRemove)
		}
	}
	return (
		<Container className="py-11">
			<div className="mb-8 flex items-center gap-4">
				{title && <Heading>{title}</Heading>}
			</div>

			{(theme || date) && (
				<div className="mb-8 flex items-center gap-4">
					{theme && <Badge text={theme} />}
					{date && <div className="text-xs leading-[18px] text-gray-500">{date}</div>}
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
					) : (
						<div className="relative overflow-hidden">
							<AcademyImage
								image={image?.uri?.value}
								width={image?.meta?.width}
								height={image?.meta?.height}
								alt={title}
							/>
						</div>
					)}
				</div>
				<div className="flex flex-col">
					<div className="inline-flex">
						<div className="text-base font-semibold text-primary-600">
							{t("Nx:Langue:")}
						</div>
						{langue && <Wysiwyg html={langue} className="" />}
					</div>
					<div className="inline-flex">
						<div className="text-base font-semibold text-primary-600">
							{" "}
							{t("Nx:Durée:")}{" "}
						</div>
						{duree && <Wysiwyg html={duree} className="" />}
					</div>
					<div className="inline-flex">
						<div className="text-base font-semibold text-primary-600">
							{t("Nx:Animé par:")}
						</div>
						{instructor && <Wysiwyg html={instructor} className="" />}
					</div>
					<div className="inline-flex">
						<div className="text-base font-semibold text-primary-600">
							<FiveStar
								id={id}
								entity="node"
								icon="favorite-star"
								allowvote={true}
								rate={vote}
							/>
						</div>
					</div>
					{hasFlag && (
						<div className="mt-2 inline-flex">
							<Flag
								id={id}
								module="favorite_academy"
								className="cursor-pointer"
								isFlagged={isFlagged}
							/>
							<div className="ml-2">{t("Nx:Ajouter a ma liste")}</div>
						</div>
					)}
				</div>
			</div>
			{excerpt && <Wysiwyg html={excerpt} className="prose max-w-none" />}

			{document && (
				<div className="mt-10 flex flex-wrap items-center gap-4">
					{document && (
						<Button href={document} download target="_blank">
							{t("Nx:Télécharger le document")}
							<Icon id="download" className="rtl-icon" width="20" height="20" />
						</Button>
					)}
				</div>
			)}
		</Container>
	)
}

export const config = {
	id: "node--vactory_academy",
	params: {
		fields: {
			"node--vactory_academy":
				"title,field_vactory_date,field_vactory_excerpt,field_academy_duree,field_vactory_instructor,field_vactory_media,field_vactory_academy_langue,field_vactory_media_document,field_vactory_theme,field_vactory_youtube_videos,field_vactory_file_multiple,field_vactory_tags,field_vactory_youtube_media,vote",
			"taxonomy_term--vactory_academy_themes": "name",
			"taxonomy_term--tags": "name",
			"user--user":
				"drupal_internal__uid,display_name,created,field_about_the_author,field_date_of_birth,field_first_name,field_last_name,field_telephone",
			"media--image": "thumbnail",
			"file--image": "uri",
			"file--document": "uri",
			"media--file": "field_media_file",
			"taxonomy_term--vactory_news_theme": "name",
			"media--remote_video": "field_media_oembed_video",
		},
		include:
			"field_vactory_instructor,field_vactory_theme,field_vactory_media,field_vactory_media.thumbnail,field_vactory_media_document.field_media_file,field_vactory_file_multiple,field_vactory_tags,field_vactory_youtube_media",
	},
}

export default AcademyNode
