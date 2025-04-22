import React, { useState } from "react"
import { Layer } from "@vactory/ui/layer"
import { Button } from "@vactory/ui/button"

export const Sidebar = () => {
	const [showLayer, setShowLayer] = useState(false)
	return (
		<div>
			<Button
				onClick={() => {
					setShowLayer(true)
				}}
				variant="primary"
				className="rounded-md"
			>
				Show Sidebar
			</Button>
			<Layer
				position="sidebar"
				isShow={showLayer}
				overlayBackground="bg-black"
				overlayOpacity="bg-opacity-70"
				onEsc={() => setShowLayer(false)}
				onClose={() => setShowLayer(false)}
				onCloseCallback={() => {
					console.log("this get executed after the unmount of the layer")
				}}
				isShowing={showLayer}
			>
				<div className="h-screen w-96 bg-white px-6 py-12 shadow shadow-black ">
					<div>
						<ul>
							<li>element</li>
							<li>element</li>
							<li>element</li>
							<li>element</li>
							<li>element</li>
						</ul>
					</div>
				</div>
			</Layer>
		</div>
	)
}
