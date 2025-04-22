import React, { useEffect } from "react"
import { Wysiwyg, Button, Container, Text } from "@/ui"
import { useI18n } from "@vactorynext/core/hooks"
import { dlPush } from "@vactorynext/core/lib"

const JobAdsNodeAMP = ({ node }) => {
	const { t } = useI18n()
	const encodedTitle = Buffer.from(node.title, "utf8").toString("base64")

	// trigger data layer event when visiting a job ad
	useEffect(() => {
		dlPush("consultation offre emploi", {
			"Type contrat": node?.field_vactory_contract?.name,
			Fonction: node?.title,
			Ville: node?.field_vactory_city?.name,
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<Container>
			<div className="relative pb-4 pt-4 lg:pb-10 lg:pt-10">
				<div className="mb-6 text-xl font-bold">
					<h1>{node?.title}</h1>
				</div>
				<div className="mb-8 overflow-hidden rounded-lg">
					<table className="w-full  border-collapse border border-gray-400 bg-white text-sm shadow-sm  ">
						<thead className="bg-gray-50 ">
							<tr>
								<th className="border border-gray-300 px-2 py-4 text-left font-semibold  text-gray-900">
									{t("Nx:Type Contrat")}
								</th>
								<th className="border border-gray-300 px-2 py-4 text-left font-semibold  text-gray-900">
									{t("Nx:Profession")}
								</th>
								<th className="border border-gray-300 px-2 py-4 text-left font-semibold  text-gray-900">
									{t("Nx:City")}
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="space-x-2 border border-gray-300 px-2 py-4 text-gray-500">
									{node?.field_vactory_contract &&
										node?.field_vactory_contract.map((el, i) => (
											<Text as="span" key={i}>
												{el.name}
											</Text>
										))}
								</td>
								<td className="border border-gray-300 px-2 py-4 text-gray-500">
									{node?.field_vactory_profession?.name}
								</td>
								<td className="border border-gray-300 px-2 py-4 text-gray-500">
									{node?.field_vactory_city?.name}
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<Wysiwyg
					className={"prose max-w-none"}
					html={node?.field_vactory_description?.processed}
				/>
				{node?.candidature_spontanee_url !== null ? (
					<Button
						href={`/${node?.candidature_spontanee_url}&title=${encodedTitle}` || "#."}
						variant="primary"
						className="mt-10"
						isAmp={true}
					>
						{t("Nx:Postuler")}
					</Button>
				) : null}
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

export default JobAdsNodeAMP
