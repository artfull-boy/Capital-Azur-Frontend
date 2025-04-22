import { Link, Badge, Heading, Text, Wysiwyg } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"

export const JobAdsCard = ({
	body,
	category,
	city,
	date,
	url,
	title,
	description,
	className,
	contract,
	profession,
}) => {
	const { t } = useI18n()

	return (
		<div className="flex flex-col gap-0">
			<Link href={url}>
				<div className="mb-4 flex flex-wrap gap-2">
					{profession && (
						<Badge text={profession} className="bg-blue-900 font-normal text-white" />
					)}
					{city && <Badge text={city} className="bg-yellow-400 font-normal text-black" />}
				</div>
				<div
					className={vclsx(
						"group flex h-full flex-col items-start gap-5 overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm",
						className
					)}
				>
					{/* Top badges */}

					{/* Title */}
					{title && (
						<Heading
							level="3"
							variant="5"
							className="transition-all duration-300 ease-in-out group-hover:text-primary"
						>
							{title}
						</Heading>
					)}

					{/* Date */}
					{date && <Text className="mb-4 text-sm text-gray-400">{date}</Text>}

					{/* Description */}
					{body && (
						<Wysiwyg
							variant="cardExcerpt"
							html={body.processed}
							className="mb-6 text-gray-700"
						></Wysiwyg>
					)}

					{/* Read more */}
					{url && (
						<Link
							href={url}
							className="mt-auto inline-block rounded-lg border bg-primary px-6 py-3  text-sm font-medium  uppercase text-white shadow-lg transition-all duration-300 ease-in-out hover:border-primary hover:bg-white hover:text-primary"
						>
							{t("En savoir plus")}
						</Link>
					)}
				</div>
			</Link>
		</div>
	)
}
