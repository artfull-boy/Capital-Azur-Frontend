// import { deepmerge } from "deepmerge"
import { useContext } from "react"
import YoutubeBackground from "react-youtube-background"

import { vclsx } from "@vactorynext/core/utils"
import { ThemeContext } from "@vactory/ui/theme-context"

export const SlideBgVideo = ({ bgVideoId, variant = "default", ...props }) => {
	const { slider } = useContext(ThemeContext)
	const defaultSetting = {
		height: "100%",
		width: "100%",
		playerVars: {
			autoplay: 1,
			loop: 1,
			controls: 0,
			rel: 0,
			showinfo: 0,
		},
	}

	return (
		<YoutubeBackground
			className={vclsx("iframe-wrapper", slider[variant].slide.bgVideo)}
			{...props}
			opt={defaultSetting}
			videoId={bgVideoId}
		/>
	)
}
