import React from "react"
import get from "lodash.get"
import { Button, Wysiwyg, Heading, Text } from "@/ui"
import { AcademyCard } from "./AcademyCard"
import { normalizeNodes } from "./normalizer"
import { deserialise } from "kitsu-core"

export const config = {
	id: "vactory_academy:three-columns",
}

const ThreeColumnsContainer = ({ data }) => {
	const response = deserialise(get(data, "components.0.collection.data", {}))
	const title = get(data, "components.0.title", "")
	const raw_description = get(data, "components.0.description.value.#text", null)
	const description = <Wysiwyg as="p" html={raw_description} />
	const link = get(data, "components.0.link.url", null)
	const link_label = get(data, "components.0.link.title", "")
	const nodes = normalizeNodes(response.data)

	return (
		<div className="relative">
			<div className="relative mx-auto max-w-7xl">
				<div className="text-center">
					{title && (
						<Heading variant="3" level="2" className="mb-5 text-center">
							{title}
						</Heading>
					)}
					{raw_description.length > 0 && (
						<Text className="mx-auto max-w-2xl text-xl text-gray-500">{description}</Text>
					)}
				</div>
				<div className="mx-auto mt-12 grid max-w-lg gap-5 md:max-w-none md:grid-cols-2 lg:grid-cols-3">
					{nodes.map((node) => (
						<React.Fragment key={node.id}>
							<AcademyCard {...node} />
						</React.Fragment>
					))}
				</div>
				{link && (
					<div className="mt-12 flex justify-center">
						<Button href={link}>{link_label}</Button>
					</div>
				)}
			</div>
		</div>
	)
}

export default ThreeColumnsContainer
