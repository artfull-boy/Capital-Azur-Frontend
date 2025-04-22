import { React } from "react"

import { Heading, Button, Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

const TitleButton = ({ items = [], bgColor = "#03164E", ctaIcon = "download-solid" }) => {
	return items.map((item, id) => {
		return (
			<div
				key={id}
				className={vclsx(
					`bg-[${bgColor}]`,
					"flex flex-col items-center px-7 py-12 md:flex-row md:justify-between md:px-14 md:py-11"
				)}
			>
				<Heading level={6} className="pb-10 text-center text-white md:pb-0">
					{item.title}
				</Heading>
				<Button href={item.ctaUrl} className="flex rounded">
					{item.ctaText}
					<Icon id={ctaIcon} className="ml-2 h-5 w-5" />
				</Button>
			</div>
		)
	})
}

export default TitleButton
