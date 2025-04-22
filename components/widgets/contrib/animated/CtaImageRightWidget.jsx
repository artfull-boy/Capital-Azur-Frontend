import React from "react"
import { motion } from "framer-motion"
import { AnimatedImage, Button, Container, Heading, Image, Wysiwyg } from "@/ui"

export const config = {
	id: "vactory_default:52",
}

const CtaImageRight = ({ title, content, image, cta }) => {
	const isSpecialTitle =
		title.toUpperCase() === "Une banque avec une vision pour l’Afrique".toUpperCase()

	return (
		<div className={`${isSpecialTitle ? "bg-[#027BFE] pt-2" : ""}`}>
			<Container
				className={`my-24 flex w-full  justify-between  ${
					isSpecialTitle ? "mb-0 items-end" : ""
				}`}
			>
				{!!title && (
					<div
						className={`flex w-1/2 flex-col items-start gap-[25px] ${
							isSpecialTitle ? "p-8" : ""
						}`}
					>
						<div className="flex items-center justify-start gap-[25px] uppercase">
							<span
								className={`block h-[2px] w-[44px] ${
									isSpecialTitle ? "bg-white" : "bg-primary"
								}`}
							></span>
							<Heading
								level={1}
								variant={3}
								className={isSpecialTitle ? "text-white" : ""}
							>
								{title}
							</Heading>
						</div>
						<Wysiwyg
							html={content.props.html}
							className={`text-lg ${isSpecialTitle ? "text-white/80" : "text-gray-500"}`}
						></Wysiwyg>
						{cta?.url && cta?.title && (
							<div className="text-center">
								<Button
									className={
										isSpecialTitle
											? "border-1 border-white bg-white font-600 uppercase text-primary hover:bg-transparent hover:text-white"
											: "border-1 border-primary bg-white font-600 uppercase text-primary hover:border-white hover:bg-primary hover:text-white"
									}
									{...cta}
								>
									{cta.title}
								</Button>
							</div>
						)}
					</div>
				)}
						<Image
							src={image}
							width={800}
							height={500}
							className="w-[600px] object-cover align-bottom"
						/>
			</Container>
		</div>
	)
}

const CtaImageRightContainer = ({ data }) => {
	const widgetData = {
		title: data.components[0].title,
		content: <Wysiwyg html={data.components[0].content.value["#text"]} />,
		image: data.components[0].image[0]?._default,
		cta: {
			title: data.components[0].cta.title,
			url: data.components[0].cta.url,
		},
	}
	return <CtaImageRight {...widgetData} />
}

export default CtaImageRightContainer
