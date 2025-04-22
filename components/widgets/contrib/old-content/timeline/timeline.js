import { useMedia } from "@vactorynext/core/hooks"

import { Heading } from "@vactory/ui/heading"
import { Text } from "@vactory/ui/text"
import { Button } from "@vactory/ui/button"
import { Icon } from "@vactory/ui/icon"
import { vclsx } from "@vactorynext/core/utils"

import { data as defaultData } from "./mock-data"

export const TimeLine = ({ data = defaultData, iconId, breakPoint = 768 }) => {
	// Check if the screen is Mobile
	const isMobile = useMedia(`(max-width: ${breakPoint}px)`)

	const leftBoxStyle =
		"rounded-tr-none before:content[''] before:top-0 before:right-[-22px] before:absolute before:border-t-[23px] before:border-solid before:border-t-primary-800 before:border-r-[23px] before:border-r-transparent"

	const rightBoxStyle =
		"rounded-tl-none before:content[''] before:top-0 before:left-[-22px] before:absolute before:border-t-[23px] before:border-solid before:border-t-primary-800 before:border-l-[23px] before:border-l-transparent"

	const line =
		"before:absolute before:content[''] before:w-1 before:h-[calc(100%+58px)] before:bg-primary-300"

	const bullet =
		"after:absolute after:content[''] after:w-4 after:h-4 after:bg-primary-800 after:rounded-full after:top-[-12px] after:left-full after:-translate-x-1/2 rtl:after:translate-x-1/2 after:border-solid after:border-white after:border-[5px] after:box-content md:after:left-[50%]"

	return (
		<div className="py-16">
			<div className="mb-24 rounded-lg bg-primary-300 px-[43px] py-[37px]">
				<Heading className="mb-[32px] text-[20px] font-bold leading-[32px] text-white md:mb-[43px] md:text-[28px] md:font-semibold md:leading-[38px]">
					{data.title}
				</Heading>
				<Text
					as="p"
					className="md:font-regular text-[14px] font-semibold leading-[21px] text-white md:text-[16px] md:leading-[24px]"
				>
					{data.intro}
				</Text>
			</div>
			<div className="mx-auto max-w-[630px]">
				{data.items.map((item, i) => {
					return (
						<div
							className="flex flex-row-reverse justify-between pb-[58px] md:pb-[52px] md:odd:flex-row"
							key={item.id}
						>
							<div
								className={vclsx(
									!isMobile
										? i % 2 !== 0
											? rightBoxStyle
											: leftBoxStyle
										: rightBoxStyle,
									"relative min-h-[140px] rounded-md bg-primary-800 p-4 md:w-[40.7%]"
								)}
							>
								<Text
									as="p"
									className="mb-[16px] flex items-center text-[20px] font-semibold leading-[30px] text-success-300"
								>
									<Icon id={iconId} className="mr-4" width="24px" height="24px" />
									{item.title}
								</Text>
								<Text
									as="p"
									className="font-regular text-[14px] leading-[21px] text-white"
								>
									{item.description}
								</Text>
							</div>
							<div
								className={vclsx(
									"relative ml-8 mr-12 w-1",
									line,
									bullet,
									i == 0 && "before:top-[-100px] before:h-[calc(100%+158px)]",
									i == data.items.length - 1 && "before:bg-transparent"
								)}
							></div>
							<div className="md:w-[40.7%]"></div>
						</div>
					)
				})}
			</div>
			<Button
				href={data.cta.href}
				target={data.cta.target}
				className="mx-auto block w-fit rounded"
			>
				{data.cta.title}
			</Button>
		</div>
	)
}
