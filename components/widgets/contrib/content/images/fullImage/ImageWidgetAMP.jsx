import { Text, Button, Wysiwyg, Image } from "@/ui"

export const config = {
	id: "vactory_default:10",
	lazy: false,
}

const FullImage = ({ data }) => {
	const link_attributes = {
			id: data?.components[0].id,
			target: data?.components[0].target,
			rel: data?.components[0].rel,
			className: data?.components[0].class,
		},
		image_info = {
			src: data?.components[0].image[0]._default,
			width: data?.components[0].image[0].meta.width,
			height: data?.components[0].image[0].meta.height,
		}
	return (
		<>
			<h1>this is the image widget amp</h1>
			{data?.components[0].intro && (
				<Text className="mb-5 text-center"> {data?.components[0].intro}</Text>
			)}

			{image_info && (
				<Image
					{...image_info}
					alt={data?.components[0].image_alt}
					className="h-full w-full object-cover"
					isAmp={true}
				/>
			)}

			{data?.components[0].description && (
				<Wysiwyg className="mb-4" html={data?.components[0].description.value["#text"]} />
			)}

			{data?.components[0].btn_more.url && data?.components[0].btn_more.title && (
				<div className="text-center">
					<Button href={data?.components[0].btn_more.url} {...link_attributes}>
						{data?.components[0].btn_more.title}
					</Button>
				</div>
			)}
		</>
	)
}

export default FullImage
