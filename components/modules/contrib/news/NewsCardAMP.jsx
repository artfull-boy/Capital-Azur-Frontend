import { Link, Heading, Text, Badge, Image } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"

const CardImage = ({ image, alt }) => {
	if (!image) {
		return <></>
	}
	return (
		<div className="relative aspect-[16/9] overflow-hidden">
			{image.src && (
				<Image
					src={image?.src}
					alt={alt}
					type="card"
					fill
					className="h-full w-full object-cover transition-all duration-500 hover:scale-110 hover:brightness-90"
					isAmp={true}
				/>
			)}
		</div>
	)
}

export const NewsCardAMP = ({
	image,
	image_alt,
	category,
	date,
	className,
	url,
	title,
	excerpt,
	viewMoreLink = null,
	...rest
}) => {
	const { t } = useI18n()
	return (
		<div
			className={vclsx(
				"flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white text-black shadow",
				className
			)}
			{...rest}
		>
			<div className="w-full flex-shrink-0">
				{<CardImage image={image} alt={image_alt} />}
			</div>
			<div className="flex h-full flex-col p-[25px]">
				{(category || date) && (
					<div className="mb-[18px] flex flex-row items-center">
						{category?.map((term, index) => (
							<Link
								key={index}
								className="mr-2"
								isAmp={true}
								href={viewMoreLink && term?.slug ? `${viewMoreLink}/${term?.slug}` : "#."}
							>
								<Badge text={term?.name} size="normal" variant="inline" />
							</Link>
						))}

						{date && (
							<Text
								variant="small"
								className="ml-[10px] border-l border-l-gray-500 px-[10px] text-gray-500"
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
					<div className="mt-auto">
						<Link
							href={url || "#."}
							variant="permalink"
							isAmp={true}
							aria-label={`${t("Nx:En savoir plus")}: ${title}`}
						>
							{t("Nx:En savoir plus")}
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}
