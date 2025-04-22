import { Heading, Button, Wysiwyg, Text, EmptyBlock, Container } from "@/ui"
import { NewsCard } from "./NewsCard"
import { normalizeNodes } from "./normalizer"
import { drupal } from "@vactorynext/core/drupal"

export const config = {
	id: "vactory_news:cross-content-news",
}

const CrossContentNews = ({ data }) => {
	const deserialized = drupal.deserialize(data?.components[0]?.collection?.data)

	const props = {
		title: data?.components?.[0]?.title,
		intro: data?.components?.[0]?.intro?.value?.["#text"] ? (
			<Wysiwyg html={data?.components?.[0]?.intro?.value?.["#text"]} />
		) : null,
		link: {
			href: data?.components?.[0]?.link?.url,
			id: data?.components?.[0]?.link?.attributes?.id,
			rel: data?.components?.[0]?.link?.attributes?.rel,
			target: data?.components?.[0]?.link?.attributes?.target || "_self",
			className: data?.components?.[0]?.link?.attributes?.class,
		},
		linkTitle: data?.components?.[0]?.link?.title,
		nodes: normalizeNodes(deserialized?.data || []),
		// nodes: [],
	}
	if (props?.nodes?.length <= 0) return null
	return <CrossContent {...props} />
}

export const CrossContent = ({ title, intro, link, linkTitle, nodes }) => {
	return (
		<Container spacing="small_space" layout="full" className="flex flex-col gap-8">
			{title && (
						<div className="flex items-center gap-[16px]">
							<span className="block h-[3px] w-[44px] bg-primary"></span>
							<Heading level={1} variant={3}>
								{title}
							</Heading>
						</div>
					)}

			{intro && (
				<Text variant="intro" as="div">
					{intro}
				</Text>
			)}
			{nodes?.length && (
				<div className="grid gap-4 md:grid-cols-3">
					{nodes?.map((item) => {
						return (
							<NewsCard
								{...item}
								viewMoreLink={link?.href}
								listingLayout="grid"
								key={item.id}
							/>
						)
					})}
				</div>
			)}
			{nodes?.length <= 0 && <EmptyBlock />}
			{link.href && linkTitle && (
				<div className="mt-10 text-center">
					<Button {...link}>{linkTitle}</Button>
				</div>
			)}
		</Container>
	)
}

export default CrossContentNews
