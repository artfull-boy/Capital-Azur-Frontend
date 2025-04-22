import React, { useEffect } from "react"
import { Wysiwyg, Button, Container, Text } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { dlPush } from "@vactorynext/core/lib"

const JobAdsNode = ({ node }) => {
	
	const { t } = useI18n()
	const encodedTitle = Buffer.from(node.title, "utf8").toString("base64")

	useEffect(() => {
		dlPush("consultation offre emploi", {
			"Type contrat": node?.field_vactory_contract?.name,
			Fonction: node?.title,
			Ville: node?.field_vactory_city?.name,
		})
	}, [])

	return (
		<Container>
			<div className="mx-auto py-10">
				<h1 className="mb-6 text-3xl font-bold">{node?.title}</h1>

				{/* Job Description */}
				<div className="mb-8">
				
					<Wysiwyg
						className="prose max-w-none text-gray-700"
						html={node?.body?.processed}
					/>
				</div>

				{/* Profile Description */}
				<div className="mb-8">
				<p className="font-semibold text-black">{t("Profil recherché")}</p>
					<Wysiwyg
						className="prose max-w-none text-gray-700"
						html={node?.field_vactory_description?.processed}
					/>
				</div>

				{/* Job Info Section */}
				<div className="mb-10 space-y-3">
					<div>
						<p className="font-semibold text-black">{t("Profession")}</p>
						<p className="text-gray-800">{node?.field_vactory_profession?.name}</p>
					</div>
					<div className="mb-10">
						<p className="font-semibold text-black">{t("Type Contrat")}</p>
						<p className="text-gray-800">{node?.field_vactory_contract?.name}</p>
					</div>
					<div className="mb-10">
						<p className="font-semibold text-black">{t("City")}</p>
						<p className="text-gray-800">{node?.field_vactory_city?.name}</p>
					</div>
				</div>

				{/* Recruiter Contact Info */}
				<div className="mb-10">
					<h2 className="mb-2 text-lg font-semibold">
						{t("Coordonnées du recruteur")}
					</h2>
					{node?.field_vactory_email && (
						<p className="text-gray-700">{node?.field_vactory_email}</p>
					)}
					{node?.field_vactory_telephone && (
						<p className="text-gray-700">{node?.field_vactory_telephone}</p>
					)}
					{node?.field_vactory_address && (
						<Wysiwyg className="text-gray-700" html={node?.field_vactory_address.processed}></Wysiwyg>
					)}
				</div>

				{/* CTA Button */}
				{node?.candidature_spontanee_url && (
					<Button
						href={`/${node?.candidature_spontanee_url}&title=${encodedTitle}`}
						variant="primary"
						className="mt-4"
					>
						{t("Nx:Postuler")}
					</Button>
				)}
			</div>
		</Container>
	)
}

export const config = {
	id: "node--vactory_job_ads",
	params: {
		fields: {
			"node--vactory_job_ads":
				"drupal_internal__nid,path,title,field_vactory_description,field_vactory_address,field_vactory_email,field_vactory_telephone,field_vactory_contract,field_vactory_profession,field_vactory_city,candidature_spontanee_url",
			"taxonomy_term--vactory_job_ads_city": "tid,name",
			"taxonomy_term--vactory_job_ads_contract": "tid,name",
			"taxonomy_term--vactory_job_ads_profession": "tid,name",
		},
		include: "field_vactory_contract,field_vactory_profession,field_vactory_city",
	},
}

export default JobAdsNode
