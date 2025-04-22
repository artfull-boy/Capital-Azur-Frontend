import React from "react"

import { Link, Heading, Badge, Text, Image, Flag } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"

export const EventCardAMP = ({
	title,
	excerpt,
	image,
	url,
	dateStart,
	dateEnd,
	category,
	city,
	className,
	viewMoreLink,
	listingLayout,
	isFlagged,
	hasFlag,
	reloadPage,
	...props
}) => {
	const { t } = useI18n()
	return (
		<div
			className={vclsx(
				"flex h-full overflow-hidden rounded-lg border border-gray-100 bg-white shadow",
				listingLayout === "grid" ? "flex-col" : "flex-col lg:flex-row",
				className
			)}
			{...props}
		>
			<div
				className={vclsx(
					"relative aspect-[16/9] shrink-0 overflow-hidden",
					listingLayout === "list" && "lg:flex-1"
				)}
			>
				{dateStart && dateEnd && (
					<div className="absolute left-2 top-2 z-10 flex gap-2">
						<Badge size="xsmall" className="bg-primary" text={dateStart} />
						<Badge size="xsmall" className="bg-gray" text={dateEnd} />
					</div>
				)}

				{image?.src?._original && (
					<Link
						href={url}
						isAmp={true}
						aria-label={`${t("Nx:En savoir plus")}: ${title}`}
					>
						<p className="sr-only">{`${t("Nx:En savoir plus")}: ${title}`}</p>
						<Image
							src={image?.src}
							alt={image?.alt}
							className="h-full w-full object-cover transition-all duration-500 hover:scale-110 hover:brightness-90"
							fill
							type="card"
							isAmp={true}
						/>
					</Link>
				)}
			</div>
			<div
				className={vclsx(
					"group relative flex h-full flex-col items-start p-6",
					listingLayout === "list" && "lg:flex-1"
				)}
			>
				<div className="mb-[18px] flex items-center">
					{category && (
						<>
							{category?.map((term, index) => (
								<Badge
									key={index}
									text={term?.name}
									size="normal"
									variant="inline"
									href={
										viewMoreLink && term?.slug
											? `${viewMoreLink}/${term?.slug}/all`
											: null
									}
								/>
							))}
						</>
					)}
					{city &&
						(viewMoreLink && city?.slug ? (
							<Link className="mr-2" href={`${viewMoreLink}/all/${city?.slug}`}>
								<Text
									variant="small"
									className="ml-[10px] border-l border-l-gray-500 px-[10px] text-gray-500"
								>
									{city?.name}
								</Text>
							</Link>
						) : (
							<Text
								variant="small"
								className="ml-[10px] border-l border-l-gray-500 px-[10px] text-gray-500"
							>
								{city?.name}
							</Text>
						))}
				</div>

				<>
					{hasFlag && (
						<Flag
							id={props?.id}
							title={title}
							module="default_flag"
							className="absolute right-4 top-4 cursor-pointer"
							isFlagged={isFlagged}
							reloadPage={reloadPage}
						/>
					)}
					{title && (
						<Heading level="3" variant="cardTitle" className="mb-5">
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
							isAmp={true}
						>
							{t("Nx:En savoir plus")}
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}
