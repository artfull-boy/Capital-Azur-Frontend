import { Link, Text, Heading, Badge, Image, Flag } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"
import { useState } from "react"

export const BlogCard = ({
	image,
	category,
	className,
	url,
	title,
	id,
	excerpt,
	viewMoreLink,
	isFlagged,
	hasFlag,
	reloadPage = null,
	...rest
}) => {
	const { t } = useI18n()
	const [flageChange, setflageChange] = useState("")
	return (
		<div
			className={vclsx(
				"lrt:text-left flex h-full flex-col rounded-lg border border-gray-100 bg-white text-black shadow rtl:text-right",
				className
			)}
			{...rest}
		>
			<div className="relative aspect-[16/9] shrink-0 overflow-hidden rounded-t-lg">
				{image?.src && (
					<Link href={url} aria-label={`${t("Nx:En savoir plus")}: ${title}`}>
						<p className="sr-only">{`${t("Nx:En savoir plus")}: ${title}`}</p>
						<Image
							src={image?.src}
							alt={image?.alt}
							fill
							type="card"
							className="h-full w-full object-cover transition-all duration-500 hover:scale-110 hover:brightness-90"
						/>
					</Link>
				)}
			</div>

			<div className="relative flex h-full flex-col items-start p-8 pt-10">
				{category && (
					<Link
						href={
							viewMoreLink && category?.slug
								? `${viewMoreLink}/${category?.slug}/all`
								: "#."
						}
					>
						<Badge
							text={category.name}
							className="mb-[18px]"
							size="normal"
							variant="ribbon"
						/>
					</Link>
				)}
				<>
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
					{title && (
						<Heading level="3" variant="cardTitle" className="mb-[18px]">
							{title}
						</Heading>
					)}
					{excerpt && (
						<Text variant="cardExcerpt" className="mb-[25px]" as="div">
							{excerpt}
						</Text>
					)}
				</>
				{url && (
					<div className="mt-auto">
						<Link
							href={url || "#."}
							variant="permalink"
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
