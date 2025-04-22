import get from "lodash.get"

import { useNode } from "@vactorynext/core/hooks"
import { Breadcrumb, Container, Wysiwyg, Image } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_banner:default",
}

const BannerVariant_1_Widget = ({ data }) => {
	const node = useNode()
	const settingsGlobal = {
		image: {
			src: get(data, "components.0.group_banner.image.0._default", null),
			width: get(data, "components.0.group_banner.image.0.meta.width", null),
			height: get(data, "components.0.group_banner.image.0.meta.height", null),
			alt: get(data, "components.0.group_banner.image.0.meta.alt", ""),
		},
		image_mobile: {
			src: get(data, "components.0.group_banner.image_mobile.0._default", null),
			width: get(data, "components.0.group_banner.image_mobile.0.meta.width", null),
			height: get(data, "components.0.group_banner.image_mobile.0.meta.height", null),
			alt: get(data, "components.0.group_banner.image_mobile.0.meta.alt", ""),
		},
		title:
			get(data, "components.0.group_banner_title.use_page_title", 0) == 1
				? node.title
				: get(data, "components.0.group_banner_title.custom_title", node.title),
	}

	// from page banner
	const settings = {
		showBreadcrumb: get(data, "components.0.group_banner_content.use_breadcrumb", false),
		content: (
			<Wysiwyg
				html={get(
					data,
					"components.0.group_banner_content.description.value['#text']",
					null
				)}
			/>
		),
		breadcrumb: node?.breadcrumb.map((item, index) => ({
			id: index,
			href: item.url,
			name: item.text,
		})),
		image: {
			src: get(
				node,
				"banner.image.thumbnail.uri.value._default",
				settingsGlobal.image.src
			),
			width: get(node, "banner.image.thumbnail.meta.width", settingsGlobal.image.width),
			height: get(
				node,
				"banner.image.thumbnail.meta.height",
				settingsGlobal.image.height
			),
		},
		image_alt: get(node, "banner.image.thumbnail.alt.width", settingsGlobal.image.alt),
		image_mobile: {
			src: get(
				node,
				"banner.image_mobile.thumbnail.uri.value._default",
				settingsGlobal.image_mobile.src
			),
			width: get(
				node,
				"banner.image_mobile.thumbnail.meta.width",
				settingsGlobal.image_mobile.width
			),
			height: get(
				node,
				"banner.image_mobile.thumbnail.meta.height",
				settingsGlobal.image_mobile.height
			),
		},
		image_mobile_alt: get(
			node,
			"banner.image_mobile.thumbnail.meta.alt",
			settingsGlobal.image_mobile.alt
		),

		title: node?.banner?.title || settingsGlobal.title,
	}

	return <Banner {...settings} />
}

const banner = {
	default: {
		wrapper:
			"relative w-full text-white h-[140px] lg:h-[200px] pb-4 lg:pb-[64px] flex items-end justify-start before:content-[''] before:bg-gray-900/50 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:z-[1]",
		image_mobile: "absolute top-0 left-0 w-full h-full object-cover",
		image_desktop: "absolute top-0 left-0 w-full h-full object-cover",
		title:
			"text-white text-xl leading-[30px] lg:text-5xl lg:leading-normal font-semibold -tracking-[1px]",
		content: "",
		breadcrumb: {
			wrapper: "mt-5",
			variant: "default",
		},
	},
}

const Banner = ({
	image,
	image_mobile = null,
	image_alt,
	image_mobile_alt,
	title,
	content,
	showBreadcrumb,
	breadcrumb,
	variant = "default",
}) => {
	const imgMobileExist = image_mobile !== null ? true : false
	return (
		<div className={banner[variant].wrapper}>
			{image.src && image.width && image.height && (
				<div
					className={vclsx(
						imgMobileExist && "hidden md:block",
						!imgMobileExist && "block"
					)}
				>
					<Image
						{...image}
						alt={image_alt}
						className={banner[variant].image_desktop}
						isAmp={true}
					/>
				</div>
			)}
			{image_mobile.src && image_mobile.width && image_mobile.height && (
				<div className="block md:hidden">
					<Image
						{...image_mobile}
						alt={image_mobile_alt}
						className={banner[variant].image_mobile}
					/>
				</div>
			)}
			<Container className="relative z-[1]">
				<div className={banner?.[variant]?.title_wrapper || ""}>
					{title && <h1 className={banner?.[variant]?.title}>{title}</h1>}
					{content && <div className={banner?.[variant]?.content || ""}>{content}</div>}
				</div>
				{showBreadcrumb && (
					<div className={banner?.[variant]?.breadcrumb?.wrapper || ""}>
						<Breadcrumb
							variant={banner?.[variant]?.variant || "default"}
							pages={breadcrumb}
						/>
					</div>
				)}
			</Container>
		</div>
	)
}

export default BannerVariant_1_Widget
