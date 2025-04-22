import { Link, Heading, Text, Badge, Image, Flag } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"
import { useState } from "react"

const CardImage = ({ image, title, alt, url, t }) => {
	return (
		<div className="relative aspect-[16/9] overflow-hidden">
			{image.src && (
				<Link href={url} aria-label={`${t("Nx:En savoir plus")}: ${title}`}>
					<p className="sr-only">{`${t("Nx:En savoir plus")}: ${title}`}</p>
					<Image
						src={image.src}
						alt={alt}
						type="card"
						fill
						className="h-full w-full object-cover transition-all duration-500 hover:scale-110 hover:brightness-90"
					/>
				</Link>
			)}
		</div>
	)
}

export const NewsCard = ({
	image,
	image_alt,
	category,
	date,
	className,
	url,
	title,
	id,
	excerpt,
	isFlagged,
	hasFlag,
	viewMoreLink = null,
	listingLayout,
	reloadPage = null,
	...rest
}) => {
	const { t } = useI18n()
	const [flageChange, setflageChange] = useState("")
	return (
		<div
			className={vclsx(
				"flex h-full overflow-hidden rounded-lg border border-gray-100 bg-white shadow",
				listingLayout === "grid" ? "flex-col" : "flex-col lg:flex-row",
				className
			)}
			{...rest}
		>
			<div
				className={vclsx(
					"relative w-full shrink-0 overflow-hidden",
					listingLayout === "list" && "lg:flex-1"
				)}
			>
				{<CardImage image={image} alt={image_alt} url={url} title={title} t={t} />}
				{hasFlag && (
					<Flag
						id={id}
						title={title}
						module="default_flag"
						className=" absolute right-4 top-4 cursor-pointer"
						isFlagged={isFlagged}
						reloadPage={reloadPage}
						flageChange={flageChange}
						onFlaggedChange={() => setflageChange(Date.now())}
					/>
				)}
			</div>
			<div className={vclsx("relative h-full", listingLayout === "list" && "lg:flex-1")}>
				<div className="relative flex h-full flex-col p-[25px]">
					{(category || date) && (
						<div className="mb-[18px] flex flex-row items-center">
							{category?.map((term, index) => (
								<Badge
									text={term?.name}
									size="normal"
									variant="inline"
									key={index}
									className="mr-2 bg-[#08286A] px-2   text-white uppercase text-[10px]"
									href={
									viewMoreLink && term?.slug ? `${viewMoreLink}/${term?.slug}` : null
									}
								/>
							))}

							{date && (
								<Text
									variant="small"
									className="ml-[10px]  px-[10px] text-gray-500"
								>
									{date}
								</Text>
							)}
						</div>
					)}
					<>
						{title && (
							<Heading level="3" variant="cardTitle" className="mb-[40px]">
								{title}
							</Heading>
						)}
						
					</>
					{url && (
						<div className="mt-auto">
							<Link
								href={url || "#."}
								variant="permalink"
								aria-label={`${t("Lire Plus")}: ${title}`}
								title={title}
							>
								{t("Lire Plus")}
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
