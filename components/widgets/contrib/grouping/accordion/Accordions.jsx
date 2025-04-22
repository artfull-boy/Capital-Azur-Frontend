import { Heading, Text, Accordion } from "@/ui"

export const Accordions = ({ title, intro, questions }) => {
	return (
		<>
			{title && (
				<Heading level="2" variant="2" className="mb-8">
					{title}
				</Heading>
			)}
			{intro && <Text className="mb-6">{intro}</Text>}
			{questions && <Accordion variant="default" onlyOneOpen="true" nodes={questions} />}
		</>
	)
}
