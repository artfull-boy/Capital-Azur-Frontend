import React from "react"
import { Container, Wysiwyg, Button, Image, Heading } from "@/ui"

export const config = {
	id: "vactory_default:53",
}

const CtaImageLeft = ({ title, content, image, cta }) => {
	return (
		<div className="bg-[#E2C6CD]">
			<Container>
				<div className="flex flex-col items-center gap-0 md:flex-row">
					{/* Left side - Image */}
					<div className=" w-[60%] md:w-2/3 p-0 m-0">
						<Image
							src={image}
							alt="Capital Azur Mobile App"
							width={"1000"}
							height={"1000"}
						/>
					</div>

					{/* Right side - Content */}
					<div className="w-[40%]">
						<div className="flex items-center gap-[16px]">
							<span className="block h-[3px] w-[44px] bg-primary"></span>
							<Heading level={1} variant={3} className="text-primary">
								{title}
							</Heading>
						</div>

						<div className="space-y-4 text-base text-blue-800">{content}</div>

						{cta?.url && (
							<div className="mt-8">
								<Button href={cta.url}>{cta.title}</Button>
							</div>
						)}
					</div>
				</div>
			</Container>
		</div>
	)
}

const CtaImageLeftContainer = ({ data }) => {
	const widgetData = {
		title: data.components[0].title,
		content: <Wysiwyg html={data.components[0].content.value["#text"]} />,
		image: data.components[0].image[0]?._default,
		cta: {
			title: data.components[0].cta.title,
			url: data.components[0].cta.url,
		},
	}
	return <CtaImageLeft {...widgetData} />
}

export default CtaImageLeftContainer
