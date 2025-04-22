import { AnimatedImage, Container, Image, Wysiwyg } from "@/ui"
import { Button, Heading, Text } from "@/ui"


export const config = {
	id: "vactory_default:64",
}

// This DF must have a "No Container" wrapper in the appearance, so can the layout work perfectly
const CtaFullImageLeft = ({ title, content, image, cta }) => {
	return (
		<div className="bg-primary">
			<Container>
			<div className="flex w-full items-start justify-between bg-primary pt-24">
			<Image src={image} alt={image?.alt} width={"500"} height={"500"} />
			<div className="w-1/2">
				<div
					className={`flex flex-col items-start justify-center gap-[25px] text-white`}
				>
					{title && (
						<div className="flex items-center gap-[16px]">
							<span className="block h-[3px] w-[44px] bg-white"></span>
							<Heading level={1} variant={3}>
								{title}
							</Heading>
						</div>
					)}
					{content && content}
					{cta?.url && cta?.title && (
						<div className=" text-center">
							<Button className={"bg-white text-primary border-1 border-primary hover:bg-primary hover:text-white hover:border-white"} {...cta}>{cta.title}</Button>
						</div>
					)}
				</div>
			</div>
		</div>
		</Container>
		</div>
	)
}

const CtaFullImagLeftContainer = ({ data }) => {
	const widgetData = {
		title: data?.components[0]?.title,
		content: <Wysiwyg html={data?.components[0]?.content?.value["#text"]} />,
		image: data?.components[0]?.image[0]?._default,
		cta: {
			title: data?.components[0]?.cta?.title,
			url: data?.components[0]?.cta?.url,
		},
	}
	return <CtaFullImageLeft {...widgetData} />
}

export default CtaFullImagLeftContainer
