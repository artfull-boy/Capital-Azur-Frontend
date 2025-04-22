import React from "react"

import { Link, Heading, Badge, Text, Image, Flag, Button } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"

export const EventCard = ({
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
	const [startDay, startMonth] = (dateStart || "").split(" ")
	const [endDay, endMonth] = (dateEnd || "").split(" ")
	return (
		<div
			className={vclsx(
				"group flex h-full cursor-pointer overflow-hidden rounded-lg border border-gray-100 bg-white shadow",
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
					<div className="absolute right-2 top-2 z-10 w-20 rounded-lg bg-red-500 p-2 text-center text-white">
						<div className="text-2xl font-bold leading-tight">{startDay}</div>
						<div className="text-xs uppercase">{startMonth}</div>
						<div className="my-1 border-t border-white" />
						<div className="text-2xl font-bold leading-tight">{endDay}</div>
						<div className="text-xs uppercase">{endMonth}</div>
					</div>
				)}

				{image?.src && (
					<Link href={url} aria-label={`${t("Nx:En savoir plus")}: ${title}`}>
						<p className="sr-only">{`${t("Nx:En savoir plus")}: ${title}`}</p>
						<Image
							src={image?.src}
							alt={image?.alt}
							fill
							type="card"
							className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-90"
						/>
					</Link>
				)}
			</div>
			{/* content */}
			<div className="flex flex-col justify-between">
				<div className="relative flex flex-col p-6 h-60">
					<Heading
						level={1}
						variant="5"
						className="font-bold uppercase group-hover:text-primary"
					>
						{title}
					</Heading>
					{/* badges */}
					<div className="mb-4 flex flex-wrap gap-2">
						{city && (
							<span className="inline-block rounded-xl bg-red-500 px-2 py-1 text-[10px] font-semibold uppercase text-white">
								{city.name}
							</span>
						)}
						{category.map((term, i) => (
							<span
								key={i}
								className="inline-block rounded-xl bg-blue-900 px-2 py-1 text-[10px] font-semibold uppercase text-white"
							>
								{term.name}
							</span>
						))}
					</div>

					{/* title & excerpt */}

					{excerpt && (
						<Text variant="cardExcerpt" className=" text-gray-700">
							{excerpt}
						</Text>
					)}
				</div>
				{/* “Lire plus” button */}
				{url && (
					<div className="p-6 w-fit z-10">
						<Link
							href={url}
							className=" border-b-2 border-primary text-sm font-semibold uppercase text-primary"
						>
							Lire plus
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}
