import { useRef } from "react"

import { Link, Icon, LocalMediaModal, Text, Heading, Badge, Image } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"

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
					className="object-cover transition-all duration-500 hover:scale-110 hover:brightness-90"
					type="card"
					fill
					isAmp={true}
				/>
			)}
		</div>
	)
}

const CardImage = ({ video, image }) => {
	const videoModalRef = useRef()
	const imageModalRef = useRef()
	let video_id
	if (video) {
		video_id = video.split("v=")[1]
		let videoParamToRemove = video_id?.indexOf("&")
		if (videoParamToRemove != -1) {
			video_id = video_id?.substring(0, videoParamToRemove)
		}
	}

	if (!image) {
		return <></>
	}
	return (
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
				<>
					<Thumbnail
						image={image}
						onClick={() => {
							imageModalRef.current.open()
						}}
					/>
					<LocalMediaModal
						ref={imageModalRef}
						sourceId={image}
						type="image"
						closeIcon={<Icon className="h-5 w-5" id="x" />}
						expenderIcon={<Icon className="h-5 w-5" id="arrows-expand" />}
						minimizerIcon={<Icon className="h-5 w-5" id="minus" />}
					/>
				</>
			)}
		</div>
	)
}

export const MediathequeCardAMP = ({
	image,
	video,
	theme,
	date,
	className,
	url,
	title,
	excerpt,
	type,
	...props
}) => {
	const { t } = useI18n()
	return (
		<div
			className={vclsx(
				"lrt:text-left flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white text-black shadow rtl:text-right",
				className
			)}
			data-type={type}
			{...props}
		>
			<div className="relative w-full flex-shrink-0">
				<CardImage image={image} title={title} video={video} />
				<div className="absolute -bottom-[15px] right-2 z-10 h-8 w-8 rounded-full bg-primary-200">
					<Icon
						id={type === "Photo" ? "picture" : "video-camera"}
						className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2"
					/>
				</div>
			</div>
			<div className=" flex h-full flex-col">
				<Link
					href={url}
					className="group relative flex h-full flex-col items-start p-6"
					aria-label={`${t("Nx:En savoir plus")}: ${title}`}
					isAmp={true}
				>
					{(theme || date) && (
						<div className="mb-[18px] flex flex-row items-center">
							{theme && <Badge text={theme} size="normal" variant="inline" />}
							{date && (
								<Text
									className={vclsx(
										"mediatheque-card-date",
										"pr-[10px] text-xs leading-[18px] text-gray-500",
										theme ? "  ml-[10px] border-l border-l-gray-500 pl-[10px]" : null
									)}
								>
									{date}
								</Text>
							)}
						</div>
					)}
					<>
						{title && (
							<Heading level="3" variant="cardTitle" className="mb-[18px]">
								{title}
							</Heading>
						)}
						{excerpt && (
							<Text variant="cardExcerpt" className="mb-[25px]">
								{excerpt}
							</Text>
						)}
					</>
					{url && (
						<Text variant="permalink" className="mt-auto w-fit">
							{t("Nx:En savoir plus")}
							<Icon id="arrow-right" className="rtl-icon" width="20" height="20" />
						</Text>
					)}
				</Link>
			</div>
		</div>
	)
}
