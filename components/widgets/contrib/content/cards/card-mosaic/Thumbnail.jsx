import { Icon, Image } from "@/ui"

export const Thumbnail = ({ onClick, image, imageAlt }) => {
	return (
		<div
			onClick={onClick}
			onKeyDown={(e) => {
				e.key === "Enter" && onClick()
			}}
			role="button"
			tabIndex={0}
			className="relative flex h-full w-full flex-1 cursor-pointer items-center justify-center overflow-hidden rounded"
		>
			<Image {...image} alt={imageAlt} className="h-full w-full object-cover" />

			<div className="absolute bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center">
				<Icon id="play" className="h-16 w-16 text-white hover:text-gray-500"></Icon>
			</div>
		</div>
	)
}
