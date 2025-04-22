import { useContext } from "react"

import { ThemeContext } from "@vactory/ui/theme-context"
import { Image } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const SlideImage = ({
	imgUrl,
	variant = "default",
	className,
	bgNextImage,
	...rest
}) => {
	const { slider } = useContext(ThemeContext)
	if (bgNextImage) {
		return bgNextImage
	}
	return (
		<Image
			alt="slider"
			src={imgUrl}
			className={vclsx(className, slider[variant].slide.image)}
			{...rest}
		/>
	)
}
