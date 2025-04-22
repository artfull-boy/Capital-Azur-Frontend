import { useState } from "react"
import { Icon, Link, Image } from "@/ui"

export const config = {
	id: "vactory_default:16",
	lazy: false,
}

const WidgetLiensContainer = ({ data }) => {
	const props = {
		items: data?.components?.map((item) => ({
			link: {
				href: item?.link?.url,
				id: item?.link?.attributes?.id,
				rel: item?.link?.attributes?.rel,
				target: item?.link?.attributes?.target || "_self",
				className:
					item?.link.attributes?.class +
					" flex rounded-lg shadow-[-5px_6px_19px_-1px_#b6bec9] overflow-hidden group",
			},
			image: {
				src: item?.image?.[0]?._default,
				width: item?.image?.[0]?.meta?.width,
				height: item?.image?.[0]?.meta?.height,
				alt: item?.image_alt,
			},
			description: item?.description,
		})),
	}

	return <WidgetLiens {...props} />
}

const Lineitem = ({ item }) => {
	const [isMouseOver, setIsMouseOver] = useState(false)

	return (
		<>
			{item.link.href && (
				<Link
					{...item.link}
					onMouseEnter={() => setIsMouseOver(true)}
					onMouseLeave={() => setIsMouseOver(false)}
				>
					{item.image.src && (
						<div className="my-auto h-auto w-[120px] shrink-0 px-3 py-2 text-center">
							<Image
								{...item.image}
								alt={item.image.alt}
								className="h-full w-full object-cover"
							/>
						</div>
					)}
					{item.description && <div className="mr-4 py-5">{item.description}</div>}
					<div className="w-[100px] shrink-0 border-l-2 border-gray-50 bg-primary-500 text-white transition-all group-hover:bg-white group-hover:text-primary-500">
						<Icon
							id={isMouseOver ? "plus" : "chevron-right"}
							className="mx-auto h-full w-6"
						/>
					</div>
				</Link>
			)}
		</>
	)
}

const WidgetLiens = ({ items }) => {
	return (
		<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
			{items.map((item, i) => {
				return <Lineitem item={item} key={i} />
			})}
		</div>
	)
}

export default WidgetLiensContainer
