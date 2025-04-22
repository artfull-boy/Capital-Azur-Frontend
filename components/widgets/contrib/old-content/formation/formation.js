import { React } from "react"

import { Heading, Text, Link, Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

const Formation = ({
	items = [],
	bgColors = ["#052583", "#1947F3", "#7A87F6"],
	ctaText = "En savoir plus",
	ctaTextRtl = "اقرأ المزيد",
	ctaIcon = "arrow-narrow-right-solid",
	ctaIconRtl = "arrow-narrow-left-solid",
	isRtl = false,
}) => {
	return (
		<div className="md:flex md:gap-7">
			{items.map((item, i) => {
				return (
					<div
						key={i}
						className={vclsx(
							`bg-[${bgColors[i]}]`,
							"mb-9 flex flex-col p-8 md:mb-0 md:flex-1",
							isRtl && "items-end"
						)}
					>
						<Heading
							level={6}
							className={vclsx(
								"mb-[28px] tracking-wide text-white md:mb-[43px]",
								isRtl && "text-right"
							)}
						>
							{item.title}
						</Heading>
						<Text
							as="p"
							className={vclsx(
								"font-regular md:font-regular mb-[28px] text-[14px] leading-[21px] text-white md:text-[16px] md:leading-[24px]",
								isRtl && "text-right"
							)}
						>
							{item.description}
						</Text>
						<div
							className={vclsx(
								"flex items-center text-white md:mt-auto",
								isRtl && "flex-row-reverse "
							)}
						>
							<Link href={item.cta} className="text-[14px] font-bold">
								{isRtl ? ctaTextRtl : ctaText}
							</Link>
							<Icon
								id={isRtl ? ctaIconRtl : ctaIcon}
								width="25px"
								height="25px"
								className="mx-3"
							/>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default Formation
