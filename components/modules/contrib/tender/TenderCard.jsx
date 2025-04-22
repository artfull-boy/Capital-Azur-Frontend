import { Button, Icon, Heading, Text, Badge } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"

export const TenderCard = ({
	title,
	reference,
	excerpt,
	date,
	document_1,
	document_2,
	tags,
}) => {
	const { t } = useI18n()
	return (
		<div className="flex h-full flex-col items-start rounded-2xl bg-white shadow-sm p-6 space-y-4 group">
	{/* Reference Badge */}
	

	{/* Title */}
	<Heading level="3" variant="5" className="uppercase font-medium group-hover:text-primary transition-all duration-300 ease-in-out">
		{title}
	</Heading>
	<div className="flex items-center space-x-4">

			<Badge
				text={reference}
				size="xsmall"
				className="bg-[#0F1F57] text-white px-3 py-1 text-sm font-medium rounded-full"
			/>
		
		<Text className="text-gray-400 text-base">{date}</Text>
	</div>
	{/* Excerpt */}
	<Text className="text-base text-gray-700">
		{excerpt} <span className="text-blue-600 font-medium">Voir le fichier en téléchargement pour plus de détails</span>
	</Text>

	{/* Button */}
	{document_2 && (
		<div className="pt-4">
			<Button
				href={document_2}
				variant="primary"
				className="bg-white text-primary  rounded-lg px-6 py-3 shadow-lg hover:bg-primary hover:text-white transition-all duration-300 ease-in-out uppercase"
				download
			>
				{t("Télécharger le dossier")}
			</Button>
		</div>
	)}
</div>

	)
}
