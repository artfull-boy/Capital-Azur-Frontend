import { React, useState } from "react"
import MediathequeList from "./mediatheque-list"
import { data } from "./mock-data"
import YouTube from "react-youtube"
import { Image } from "@/ui"

const Mediatheque = ({ items = data, enableDots = true }) => {
	const [chosenVideo, setChosenVideo] = useState(items[0])

	const defaultSetting = {
		height: "100%",
		width: "100%",
		playerVars: {
			autoplay: 1,
			loop: 1,
		},
	}

	return (
		<div className="maxmd:bg-black flex flex-col md:h-[460px] md:flex-row">
			<div className="mb-4 h-[200px] overflow-hidden rounded-lg md:mb-0 md:mr-4 md:h-auto md:w-3/5">
				{chosenVideo.link ? (
					<YouTube opts={defaultSetting} videoId={chosenVideo.link} className="h-full" />
				) : (
					<Image
						className="lazyload h-full w-full object-cover"
						src={chosenVideo.thumbnail}
						alt=""
					/>
				)}
			</div>
			<div className="md:w-2/5">
				<MediathequeList
					items={items}
					setChosenVideo={setChosenVideo}
					chosenVideo={chosenVideo}
					enableDots={enableDots}
				/>
			</div>
		</div>
	)
}

export default Mediatheque
