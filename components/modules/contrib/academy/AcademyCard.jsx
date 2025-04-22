import { Heading, Text, Badge, Flag, Link, Image, FiveStar } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { useState } from "react"

const AcademyImage = ({ image, alt = "" }) => {
	return (
		<div className="relative aspect-[16/9] overflow-hidden">
			{image?._default ? (
				<Image
					src={image?._default}
					alt={alt}
					fill
					type="card"
					className="object-cover transition-all duration-500 hover:scale-110 hover:brightness-90"
				/>
			) : null}
		</div>
	)
}

export const AcademyCard = ({
	title,
	duree,
	excerpt,
	image,
	instructor,
	tags,
	url,
	id,
	isFlagged,
	hasFlag,
	vote,
	reloadPage = null,
}) => {
	const { t } = useI18n()
	const [flageChange, setflageChange] = useState("")

	return (
		<div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white text-black shadow">
			<div className="relative w-full flex-shrink-0">
				<AcademyImage
					image={image?.uri?.value}
					width={image?.meta?.width}
					height={image?.meta?.height}
					alt={title}
				/>
				<div className="absolute left-0 top-0 rounded-tl-lg bg-primary-500 px-2 py-1 text-white">
					{t("Nx:Durée")} {duree}
				</div>
				{hasFlag && (
					<Flag
						id={id}
						title={title}
						module="default_flag"
						className="absolute right-4 top-4 cursor-pointer"
						isFlagged={isFlagged}
						reloadPage={reloadPage}
						flageChange={flageChange}
						onFlaggedChange={() => setflageChange(Date.now())}
					/>
				)}
			</div>

			<Link
				variant="default"
				href={url || "#."}
				className="group flex h-full flex-col p-5"
				aria-label={`${t("Nx:En savoir plus")}: ${title}`}
			>
				<Heading level="3">{title}</Heading>

				<div className="flex flex-wrap items-center gap-2">
					{tags?.map((tag, index) => (
						<Badge key={index} text={tag} className="mb-2" />
					))}
				</div>
				<Text className="mb-5">{instructor}</Text>
				<Text className="mb-6">{excerpt}</Text>
				<FiveStar
					id={id}
					entity="node"
					icon="favorite-star"
					allowvote={false}
					rate={vote}
				/>
				{url && (
					<Text variant="permalink" className="mt-auto w-fit">
						{t("Nx:En savoir plus")}
					</Text>
				)}
			</Link>
		</div>
	)
}
