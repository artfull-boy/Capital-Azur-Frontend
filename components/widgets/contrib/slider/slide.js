import { useContext } from "react"

import { ThemeContext } from "@vactory/ui/theme-context"
import { vclsx } from "@vactorynext/core/utils"

//import {SlideBgVideo} from "./slide-bg-video";
import { SlideImage } from "./slide-image"
import { SlideVideo } from "./slide-video"

const Slide = ({
	children,
	// isActive = false,
	// content = null,
	bgImage = null,
	videoId = null,
	// bgVideoId = null,
	className = "",
	variant = "default",
	bgNextImage,
	...props
}) => {
	const { slider } = useContext(ThemeContext)

	return (
		<div
			className={vclsx("keen-slider__slide", className, slider[variant].slide.wrapper)}
			{...props}
		>
			{bgImage && <SlideImage variant={variant} imgUrl={bgImage} />}
			{bgNextImage && <SlideImage variant={variant} bgNextImage={bgNextImage} />}
			{/*bgVideoId && <SlideBgVideo variant={variant} bgVideoId={bgVideoId} />*/}
			{videoId && <SlideVideo variant={variant} videoId={videoId} />}
			{children && <div className={slider[variant].slide.content}>{children}</div>}
		</div>
	)
}

export default Slide
