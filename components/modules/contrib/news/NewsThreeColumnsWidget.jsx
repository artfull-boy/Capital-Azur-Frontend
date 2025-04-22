import get from "lodash.get"
import {
	Wysiwyg,
	Heading,
	Button,
	CustomAnimation,
	fadeInUpAnimation,
	Container,
} from "@/ui"
import { NewsCard } from "./NewsCard"
import { normalizeNodes } from "./normalizer"
import { deserialise } from "kitsu-core"
import { useI18n } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_news:three-columns",
}

const ThreeColumnsContainer = ({ data }) => {
	const response = deserialise(get(data, "components.0.collection.data", {}))
	const title = get(data, "components.0.title", "")
	const raw_description = get(data, "components.0.description.value.#text", null)
	const posts = normalizeNodes(response.data)
	const viewMoreLink = {
		title: get(data, "components.0.link.title", null),
		url: get(data, "components.0.link.url", null),
		className: get(data, "components.0.link.attributes.class", null),
		id: get(data, "components.0.link.attributes.id", null),
		rel: get(data, "components.0.link.attributes.rel", null),
		target: get(data, "components.0.link.attributes.target", null),
	}

	const { t } = useI18n()
	return (
		<div className="bg-white">
			<Container className="relative bg-white py-24">
				{!!title && (
					<div className="flex flex-col items-start gap-[25px]">
						<div className="flex items-center justify-start gap-[25px]">
							<span className="block h-[3px] w-[44px] bg-primary"></span>
							<Heading level={1} variant={3} className="uppercase">
								{title}
							</Heading>
						</div>
					</div>
				)}

				<div className="mt-12 grid max-w-lg gap-5 md:max-w-none md:grid-cols-2 lg:grid-cols-3">
					<CustomAnimation keyFrame={fadeInUpAnimation} cascade={true}>
						{posts.map((post) => (
							<NewsCard
								{...post}
								viewMoreLink={viewMoreLink?.url}
								listingLayout={"grid"}
								key={post.id}
							/>
						))}
					</CustomAnimation>
				</div>
				{viewMoreLink.url && (
					<div className="mt-10 text-center">
						<Button
							href={viewMoreLink.url}
							className={
								"border-1 border-primary bg-white text-primary shadow-md hover:border-white hover:bg-primary hover:text-white"
							}
							id={viewMoreLink.id}
							rel={viewMoreLink.rel}
							target={viewMoreLink.target}
							variant="primary"
						>
							{viewMoreLink.title ? viewMoreLink.title : t("Voir plus d'actualités")}
						</Button>
					</div>
				)}
			</Container>
		</div>
	)
}

export default ThreeColumnsContainer
