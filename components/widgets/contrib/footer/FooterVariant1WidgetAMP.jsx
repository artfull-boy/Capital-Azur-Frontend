import React from "react"
import { useMenu } from "@vactorynext/core/hooks"
import { Text, Link, Image } from "@/ui"

export const config = {
	id: "vactory_footer:footer-variant1",
	lazy: false,
}

export const Footer = ({ logo, copyrights, footerMenu, footerBottomMenu }) => {
	return (
		<div className="bg-primary-900 px-12 py-12">
			{/* LINKS LIST */}
			<div>
				{footerMenu?.map((item, i) => {
					return (
						<div className="mb-16 last:mb-0 md:mb-0" key={i}>
							<Text variant="subtitle2" className="mb-4 text-white">
								{item.title}
							</Text>
							<ul className="list-none">
								{item?.below?.map((link, j) => {
									return (
										<li key={j} className="mb-2 text-gray-200 hover:underline">
											<Link
												variant="small"
												href={link.url}
												target="_self"
												className="text-white underline"
											>
												{link.title}
											</Link>
										</li>
									)
								})}
							</ul>
						</div>
					)
				})}
			</div>

			{/* FOOTER's BOTTOM */}
			<div className="md:mx-auto md:max-w-[1216px]">
				<div className="mb-9 flex flex-col items-center justify-between">
					<Link href="/" isAmp={true}>
						<Image
							className="mx-auto mb-6 w-[152px] md:m-0"
							{...logo}
							alt={logo?.alt}
							isAmp={true}
							layout="responsive"
						/>
					</Link>
					<ul className="mb-12 flex flex-wrap justify-center gap-x-9 md:mb-0 md:gap-9">
						{footerBottomMenu?.map((link, i) => {
							return (
								link.url && (
									<li
										key={i}
										className="mb-6 block text-gray-300 last:mb-0 hover:underline md:mb-0"
									>
										<Link
											variant="body2"
											href={link.url}
											target="_self"
											isAmp={true}
											className="text-white underline"
										>
											{link.title}
										</Link>
									</li>
								)
							)
						})}
					</ul>
				</div>
				<Text variant="body2" className="text-center text-gray-300">
					{copyrights}
				</Text>
			</div>
		</div>
	)
}

const FooterVariant1Widget = ({ data }) => {
	const footerMenu = useMenu("footer")
	const footerBottomMenu = useMenu("main")
	const props = {
		newsletterTitle: data?.components?.[0]?.newsletterTitle,
		newsletterSubtitle: data?.components?.[0]?.newsletterSubtitle,
		newsletterbtn: data?.components?.[0]?.newsletterbtn,
		logo: {
			src: data?.components?.[0]?.logo?.[0]?._default,
			width: data?.components?.[0]?.logo?.[0]?.meta?.width,
			height: data?.components?.[0]?.logo?.[0]?.meta?.height,
			alt: data?.components?.[0]?.logo?.[0]?.meta?.alt,
		},
		copyrights: data?.components?.[0]?.copyrights,
		footerMenu,
		footerBottomMenu,
	}

	return <Footer {...props} />
}

export default FooterVariant1Widget
