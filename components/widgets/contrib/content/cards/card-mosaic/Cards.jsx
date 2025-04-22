import { useRef } from "react"

import { Card, Icon, LocalMediaModal, Text, Button, Image, Animate } from "@/ui"

import { Thumbnail } from "./Thumbnail"

export const Cards = ({ intro, btn_more, items = [] }) => {
	const videoModalRef = useRef()
	return (
		<>
			{intro && <Text className="mb-5 text-center"> {intro}</Text>}
			<div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
				<Animate animationType="zoom" cascade={true} damping={0.2}>
					{items.map((item) => {
						return (
							<Card
								className="h-full"
								key={item.id}
								variant={item.id % 2 === 0 ? "2Cols" : "2ColsInversed"}
								title={item.title}
								excerpt={item.description}
								url={item.link_url}
								urlContent={item.link_title}
								image={
									item.video_url ? (
										<>
											<Thumbnail
												image={item.image}
												imageAlt={item.image_alt}
												onClick={() => {
													videoModalRef.current.open()
												}}
											/>
											<LocalMediaModal
												ref={videoModalRef}
												sourceId={item.video_url}
												closeIcon={<Icon className="h-5 w-5" id="x" />}
												expenderIcon={<Icon className="h-5 w-5" id="arrows-expand" />}
												minimizerIcon={<Icon className="h-5 w-5" id="minus" />}
											/>
										</>
									) : (
										<Image
											{...item.image}
											alt={item.image_alt}
											className="h-full w-full object-cover"
										/>
									)
								}
							/>
						)
					})}
				</Animate>
			</div>

			{btn_more?.href && btn_more?.title && (
				<div className="text-center">
					<Button {...btn_more}>{btn_more?.title}</Button>
				</div>
			)}
		</>
	)
}
