import { useRef } from "react"

import {
	Card,
	Icon,
	LocalMediaModal,
	Text,
	Button,
	Image,
	CustomAnimation,
	fadeInUpAnimation,
} from "@/ui"

import { Thumbnail } from "./thumbneil"

export const Cards = ({ intro, btn_more, items = [] }) => {
	const videoModalRef = useRef()
	const link_attributes = {
		id: btn_more?.id,
		target: btn_more?.target,
		rel: btn_more?.rel,
		className: btn_more?.class,
	}
	return (
		<>
			{intro && <Text className="mb-5 text-center"> {intro}</Text>}
			<div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				<CustomAnimation keyFrame={fadeInUpAnimation} cascade={true}>
					{items.map((item) => {
						return (
							<Card
								className="group h-full"
								key={item.id}
								variant="default"
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
											className="animate h-full w-full object-cover group-hover:scale-110"
											alt={item.image_alt}
										/>
									)
								}
							/>
						)
					})}
				</CustomAnimation>
			</div>
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
