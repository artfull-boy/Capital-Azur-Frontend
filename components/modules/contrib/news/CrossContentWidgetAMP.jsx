import { useNode } from "@vactorynext/core/hooks"
import { Heading, Button, Wysiwyg, Text, EmptyBlock, Container } from "@/ui"
import { NewsCardAMP } from "./NewsCardAMP"
import { normalizeVCC } from "./normalizer"

export const config = {
	id: "vactory_news:cross-content-news",
}

const CrossContentNews = ({ data }) => {
	const { vcc } = useNode()

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
		nodes: normalizeVCC(vcc?.nodes || []),
	}
	if (props?.nodes?.length <= 0) return null
	return <CrossContent {...props} />
}

export const CrossContent = ({ title, intro, link, linkTitle, nodes }) => {
	return (
		<Container spacing="small_space" layout="full">
			{title && (
				<Heading level="2" className="mb-8 text-center">
					{title}
				</Heading>
			)}

			{intro && (
				<Text variant="intro" as="div">
					{intro}
				</Text>
			)}
			{nodes?.length && (
				<div className="grid gap-4 md:grid-cols-2">
					{nodes?.map((item) => {
						return <NewsCardAMP key={item.id} {...item} viewMoreLink={link?.href} />
					})}
				</div>
			)}
			{nodes?.length <= 0 && <EmptyBlock />}
			{link.href && linkTitle && (
				<div className="mt-10 text-center">
					<Button {...link} isAmp={true}>
						{linkTitle}
					</Button>
				</div>
			)}
		</Container>
	)
}

export default CrossContentNews
