import { useRef } from "react"

import { Text, Card, Button, Image, LocalMediaModal, Icon, Animate } from "@/ui"

import { Thumbnail } from "./Thumbneil"

export const Cards = ({ intro, btn_more, items = [] }) => {
	const videoModalRef = useRef()
	const link_attributes = {
		id: btn_more?.attributes?.id,
		target: btn_more?.attributes?.target,
		rel: btn_more?.attributes?.rel,
		className: btn_more?.attributes?.class,
	}
	return (
		<>
			{intro && <Text className="mb-5 text-center"> {intro}</Text>}
			<Animate animationType="fade" direction="left" cascade={true} damping={0.2}>
				{items.map((item) => {
					return (
						<Card
							className="group mb-5"
							key={item.id}
							variant="inline"
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
										className="animate h-full w-full object-cover group-hover:scale-110"
									/>
								)
							}
						/>
					)
				})}
			</Animate>

			{btn_more?.url && btn_more?.title && (
				<div className="text-center">
					<Button href={btn_more?.url} {...link_attributes}>
						{btn_more?.title}
					</Button>
				</div>
			)}
		</>
	)
}
