import { Text, Button, Link, Icon, Image } from "@/ui"

export const config = {
	id: "vactory_default:11",
	lazy: false,
}

const ListImage = ({ data }) => {
	const btn_attributes = {
		id: data?.extra_field.btn_more.id,
		target: data?.extra_field.btn_more.target,
		rel: data?.extra_field.btn_more.rel,
		className: data?.extra_field.btn_more.class,
	}
	return (
		<>
			{data?.extra_field.intro && (
				<Text className="mb-5 text-center"> {data?.extra_field.intro}</Text>
			)}
			<div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
				{data?.components.map((item, i) => {
					const image_info = {
							src: item.image[0]._default,
							width: item.image[0].meta.width,
							height: item.image[0].meta.height,
						},
						link_attributes = {
							id: data?.extra_field.btn_more.id,
							target: data?.extra_field.btn_more.target,
							rel: data?.extra_field.btn_more.rel,
							className: data?.extra_field.btn_more.class,
						}

					return (
						<div key={i} className="flex flex-col">
							{image_info && (
								<Image
									{...image_info}
									alt={item.image_alt}
									className="h-full w-full object-cover"
								/>
							)}
							{item.link.url && item.link.title && (
								<div className="mt-3 text-center">
									<Link href={item.link.url} {...link_attributes} variant="permalink">
										{item.link.title}
										<Icon id="arrow-right" className="rtl-icon h-5 w-5" />
									</Link>
								</div>
							)}
						</div>
					)
				})}
			</div>
			{data?.extra_field.btn_more.url && data?.extra_field.btn_more.title && (
				<div className="text-center">
					<Button href={data?.extra_field.btn_more.url} {...btn_attributes}>
						{data?.extra_field.btn_more.title}
					</Button>
				</div>
			)}
		</>
	)
}

export default ListImage
