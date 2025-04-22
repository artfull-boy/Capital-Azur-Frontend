import { Link, Icon, Heading, Text, Badge, Image } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { dlPush } from "@vactorynext/core/lib"

const PublicationImage = ({ image, title = "" }) => {
	if (!image) {
		return <></>
	}
	return (
		<div className="relative aspect-[16/9] overflow-hidden">
			<Image
				src={image?.uri?.value?._default}
				alt={image?.meta?.alt}
				title={title}
				fill
				type="card"
				className="object-cover transition-all duration-500 hover:scale-110 hover:brightness-90"
			/>
		</div>
	)
}

export const PublicationCard = ({ image, title, excerpt, date, document, tags }) => {
	const { t } = useI18n()

	// trigger data layer event when the user tries to download a publication
	const handlePublicationDownload = () => {
		dlPush("Consultation publication", {
			"Titre Publication": title,
			"Catégorie Publication": [...tags],
			"Date Publication": date,
		})
	}
	return (
		<div
			className={
				"group flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white text-black shadow"
			}
		>
			<div className="w-full flex-shrink-0">
				<PublicationImage image={image} alt={title} />
			</div>

			<Link
				href={document || "#."}
				target="_blank"
				className="flex h-full flex-col p-5"
				onClick={handlePublicationDownload}
				download
			>
				{!!tags.length && (
					<div className="mb-5 flex flex-wrap items-center gap-2">
						{tags.map((tag, index) => (
							<Badge key={index} text={tag} />
						))}
					</div>
				)}
				<Heading level="3" variant="cardTitle" className="mb-5">
					{title}
				</Heading>

				<Text variant="cardExcerpt" className="mb-5">
					{excerpt}
				</Text>
				<div className="mt-auto flex items-center justify-between">
					<Text variant="permalink" className="inline-flex gap-2">
						{t("Download")}
						<Icon id="cloud-download" width={24} height={24} />
					</Text>
					<Text variant="small" className="text-gray-400">
						{date}
					</Text>
				</div>
			</Link>
		</div>
	)
}
