import { Text, Button, Container, Wysiwyg, Image, Heading } from "@/ui"

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
	}

	const image_info = {
		src: data?.components[0].image[0]._default,
		width: data?.components[0].image[0].meta.width,
		height: data?.components[0].image[0].meta.height,
	}

	return (
		<Container className="container relative mx-auto  my-24 rounded-lg bg-white">
			<div className="relative flex flex-col gap-8 px-[38px] py-[45px] lg:flex-row ">
				{/* Left Column with Image and Name */}
				<div className=" mb-8 lg:mb-0">
					<div>
						{image_info && (
							<Image
								{...image_info}
								alt={data?.components[0].image_alt}
								className="w-[170px] object-cover"
							/>
						)}
					</div>

					<div className="mt-6 flex items-center">
						<div className="mr-3 h-0.5 w-4 bg-primary"></div>
						{data?.components[0].intro && (
							<div>
								<Text className="font-400 text-primary">YOHAN LABAH,</Text>
								<Text className="text-[10px] font-300 text-primary">
									Président, Capital Azur
								</Text>
							</div>
						)}
					</div>
				</div>

				{/* Right Column with Content */}
				<div className="lg:w-3/4">
					<div className="mb-6 flex items-center gap-4">
						<div className="h-0.5 w-12 bg-blue-600"></div>
						<Heading level={1} variant={2} className="uppercase text-black">
							{data?.components[0].intro}
						</Heading>
					</div>

					{data?.components[0].description && (
						<Wysiwyg
							className="prose prose-lg max-w-none space-y-6 text-[16px] text-gray-700"
							html={data?.components[0].description.value["#text"]}
						/>
					)}
				</div>

				{/* Decorative Quotes */}
				<div className="pointer-events-none absolute bottom-0 right-0 rotate-180">
					<svg
						width="320"
						height="320"
						viewBox="0 0 320 320"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="text-primary opacity-10"
					>
						<path
							d="M193.778 256H320V141.333C320 71.111 280.889 21.333 209.778 0L184.889 56.889C227.556 67.556 248.889 92.444 252.444 128H193.778V256ZM10.667 256H136.889V141.333C136.889 71.111 97.778 21.333 26.667 0L1.778 56.889C44.444 67.556 65.778 92.444 69.333 128H10.667V256Z"
							fill="currentColor"
						/>
					</svg>
				</div>
			</div>
		</Container>
	)
}

export default FullImage
