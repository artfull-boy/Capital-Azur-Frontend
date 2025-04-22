import { useI18n } from "@vactorynext/core/hooks"
import get from "lodash.get"

import { Wysiwyg, Heading, Link, Badge, Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:25",
}

const mosaiqLayout = (layout) => {
	switch (layout) {
		case "col-md-12":
			return "col-span-full"
		case "col-md-8":
			return "col-span-full lg:col-span-2 xl:col-span-3"
		case "col-md-6":
			return "col-span-full lg:col-span-2"
		case "col-md-4":
			return "col-span-full lg:col-span-2"
		case "col-md-3":
			return "col-span-full lg:col-span-2 xl:col-span-1"
		default:
			return "col-auto"
	}
}

export const RapportAnnuelCard = ({
	backgroundColor,
	backgroundImage,
	tag,
	title,
	description,
	file,
	cta,
	// hasVideo,
	// layout,
}) => {
	const bgColor = backgroundColor ? backgroundColor : "white"
	const bgImage = backgroundImage.src ? `url("${backgroundImage.src}")` : ""
	// const cardStyle = {
	// 	backgroundColor: bgColor,
	// 	backgroundImage: bgImage,
	// 	backgroundSize: "cover",
	// 	backgroundRepeat: "no-repeat",
	// }

	const { t } = useI18n()
	return (
		<div
			style={{
				backgroundColor: bgColor,
				backgroundImage: bgImage,
				backgroundSize: "cover",
				backgroundRepeat: "no-repeat",
			}}
			className={vclsx(
				"h-full rounded-sm px-5 py-5 shadow-md",
				"before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:z-10 before:block before:bg-black before:opacity-5 before:content-['']"
			)}
		>
			<div className="relative z-20 flex h-full min-h-[350px] flex-col items-start text-white">
				{/* <Image {...backgroundImage}  /> */}
				{tag && <Badge className="mb-5" text={tag} />}
				{title && (
					<Heading level="3" variant={2} className="!mb-6 !leading-none">
						{title}
					</Heading>
				)}
				{description && <Wysiwyg html={description} className="prose mb-8 text-white" />}

				<div className="mt-auto flex flex-wrap gap-4">
					{cta.href && (
						<Link
							{...cta}
							variant="permalink"
							className="!text-white before:border-white"
						>
							{cta.title}
						</Link>
					)}
					{file && (
						<Link
							href={file}
							target="_blank"
							variant="downlaod"
							className="flex items-center gap-2"
							download
						>
							<Icon id="cloud-upload-solid" className="h-5 w-5" />
							{t("Nx:download file")}
						</Link>
					)}
				</div>
			</div>
		</div>
	)
}

const RapportAnnuelListing = ({ data }) => {
	const items = data.components.map((item) => ({
		tag: get(item, "tag", null),
		title: get(item, "titre", null),
		description: get(item, "description.value['#text']", null),
		file: get(item, "file._default", null),
		cta: {
			title: get(item, "link.title", null),
			href: get(item, "link.url", null),
			className: get(item, "link.attributes.class", null),
			id: get(item, "link.attributes.id", null),
			rel: get(item, "link.attributes.rel", null),
			target: get(item, "link.attributes.target", null),
		},
		hasVideo: get(item, "mode", null),
		layout: get(item, "col", null),
		backgroundColor: get(item, "background_color", null),
		backgroundImage: {
			src: get(item, "background_img[0]._default", null),
			width: get(item, "background_img[0].meta.width", null),
			height: get(item, "background_img[0].meta.height", null),
			alt: get(item, "background_img[0].meta.alt", null),
			title: get(item, "background_img[0].meta.title", null),
		},
	}))

	return (
		<div className="grid grid-flow-row-dense grid-cols-4 gap-6">
			{items.map((item, index) => {
				const cardLayout = mosaiqLayout(item.layout)
				return (
					<div
						key={index}
						className={vclsx(cardLayout, "relative overflow-hidden rounded-lg")}
					>
						<RapportAnnuelCard {...item} />
					</div>
				)
			})}
		</div>
	)
}

export default RapportAnnuelListing
