// import { deepmerge } from "deepmerge"
import { useContext } from "react"
import YouTube from "react-youtube"

import { vclsx } from "@vactorynext/core/utils"
import { ThemeContext } from "@vactory/ui/theme-context"

export const SlideVideo = ({ videoId, variant = "default", ...props }) => {
	const { slider } = useContext(ThemeContext)
	const defaultSetting = {
		height: "100%",
		width: "100%",
		playerVars: {
			autoplay: 1,
			loop: 1,
			rel: 0,
		},
	}

	return (
		<div className={vclsx("iframe-wrapper", slider[variant].slide.video)}>
			<YouTube opt={defaultSetting} videoId={videoId} {...props} />
		</div>
	)
}
