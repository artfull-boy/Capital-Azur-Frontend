import { Link, Badge, Heading, Text } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"

export const JobAdsCardAMP = ({ contract, className, url, title, description }) => {
	const { t } = useI18n()
	return (
		<div
			className={vclsx(
				"flex h-full flex-col items-start overflow-hidden rounded-lg border border-gray-100 bg-white shadow",
				className
			)}
		>
			<Link
				href={url}
				isAmp={true}
				className="group relative flex h-full flex-col items-start p-6"
				aria-label={`${t("Nx:En savoir plus")}: ${title}`}
			>
				{contract ? (
					<div className="flex gap-2">
						{contract.map((el, index) => (
							<Badge text={el} className="mb-5" key={index} />
						))}
					</div>
				) : null}

				<>
					{title && (
						<Heading
							level="3"
							variant="cardTitle"
							className="mb-[18px] hover:text-primary-500"
						>
							{title}
						</Heading>
					)}
				</>
				{description && (
					<Text variant="cardExcerpt" className="mb-[25px]">
						{description}
					</Text>
				)}
				{url && (
					<div className="mt-auto">
						<Text variant="permalink">{t("Nx:En savoir plus")}</Text>
					</div>
				)}
			</Link>
		</div>
	)
}
