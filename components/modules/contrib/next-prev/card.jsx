import { Link, Icon, Heading, Badge, Image } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const Card = ({ image, image_alt, title, tag, link, direction = "left" }) => {
	return (
		<div
			className={vclsx(
				"fixed top-1/2 z-10 flex h-[130px] w-[400px] text-white transition-all duration-300 ease-in",
				direction == "left"
					? "left-0 -translate-x-[364px] flex-row-reverse hover:translate-x-0 rtl:translate-x-[364px]"
					: "right-0 translate-x-[364px] flex-row hover:translate-x-0 rtl:-translate-x-[364px]"
			)}
		>
			{link && (
				<Link
					href={link}
					className={vclsx(
						"flex h-full items-center bg-black px-2 transition-all duration-300 ease-in hover:bg-gray-600"
					)}
					aria-label={title}
				>
					<p className="sr-only">{title}</p>
					{direction == "left" ? (
						<Icon id="arrow-left" className="rtl-icon" width="20" height="20" />
					) : (
						<Icon id="arrow-right" className="rtl-icon" width="20" height="20" />
					)}
				</Link>
			)}
			<Link href={link} className="flex w-full flex-row bg-black" aria-label={title}>
				<p className="sr-only">{title}</p>
				<div className="relative w-1/3">
					{image && image.src && (
						<Image
							{...image}
							alt={image_alt}
							className="absolute left-0 top-0 h-full w-full object-cover"
						/>
					)}
				</div>
				<div className="flex w-2/3 flex-row justify-between pl-3">
					<div className="py-2 pr-2">
						<Heading level="3" variant="6">
							{title}
						</Heading>
						<Badge text={tag} />
					</div>
				</div>
			</Link>
		</div>
	)
}
