import { Image, Icon } from "@/ui"

export const Thumbnail = ({ onClick, image, imageAlt }) => {
	return (
		<div
			onClick={onClick}
			onKeyDown={(e) => {
				e.key === "Enter" && onClick()
			}}
			role="button"
			tabIndex={0}
			className="relative flex w-full flex-1 cursor-pointer items-center justify-center overflow-hidden rounded"
		>
			<Image
				{...image}
				alt={imageAlt}
				className="animate h-full w-full object-cover group-hover:scale-110"
			/>

			<div className="absolute bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center">
				<Icon id="play" className="h-16 w-16 text-white hover:text-gray-500"></Icon>
			</div>
		</div>
	)
}
