import { useI18n } from "@vactorynext/core/hooks"

import { Heading, Icon, Link, Text } from "@/ui"
import { useFormatDateToString, vclsx } from "@vactorynext/core/utils"
import { useEffect, useState } from "react"

export const ForumCard = ({
	url,
	title,
	excerpt,
	status,
	views,
	date,
	thematics,
	editeur,
	comments,
}) => {
	const { t } = useI18n()
	const formatDateToString = useFormatDateToString()

	views = views == undefined ? 0 : views

	// To check if we are on Client or Server side
	const [isClient, setIsClient] = useState(false)
	useEffect(() => {
		setIsClient(true)
	}, [])

	return (
		<div className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-md hover:border-primary lg:px-10">
			<div className="mb-6 flex gap-3">
				<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50 bg-opacity-50">
					<div
						className={vclsx(
							"h-6 w-6 rounded-full border-[5px]",
							status === "0"
								? "border-error-200 bg-error-500"
								: "border-success-200 bg-success-500"
						)}
					></div>
				</div>
				<div>
					<Text variant="small" className="font-bold text-primary">
						{thematics}
					</Text>
					<Heading level={3} variant={5} className="!mb-0">
						{title}
					</Heading>
				</div>
			</div>

			<Text variant="cardExcerpt" className="mb-6">
				{excerpt.length > 128 ? excerpt.substring(0, 280) + "..." : excerpt}
			</Text>

			<div className="mb-4 flex flex-wrap gap-4 text-gray-400">
				<Text className="flex items-center gap-1">
					<Icon id="user" width="16px" height="16px" />
					{editeur}
				</Text>
				<Text className="flex items-center gap-1">
					<Icon id="clock" width="16px" height="16px" />
					{date}
				</Text>
				<Text className="flex items-center gap-1">
					<Icon id="eye" width="16px" height="16px" />
					{`${views} ${t("Nx:views")}`}
				</Text>
				<Text className="flex items-center gap-1">
					<Icon id="chat" width="16px" height="16px" />
					{`${comments} ${t("Nx:reponses")}`}
				</Text>
			</div>
			{date && isClient && (
				<Text variant="small" className="text-gray-500">
					{formatDateToString(date)}
				</Text>
			)}
			<Link href={url || "#."} className="absolute inset-0">
				<span className="sr-only">Forum card</span>
			</Link>
		</div>
	)
}
