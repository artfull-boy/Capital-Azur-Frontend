import get from "lodash.get"

import { Wysiwyg, Heading, Image } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:34",
}

export const TestemonialPushInfo = ({
	name,
	description,
	image,
	reversed,
	className,
}) => {
	return (
		<div
			className={vclsx(
				className,
				reversed ? "flex-col-reverse justify-end" : "flex-col",
				"flex h-full rounded-lg border border-t-4 border-gray-50 border-t-primary-500 bg-white px-6 py-8 shadow-xl"
			)}
		>
			<Wysiwyg html={description} className="prose mb-5 max-w-none" />

			<div className={vclsx(reversed && "mb-6", "flex items-center")}>
				{image.src && (
					<div
						className={vclsx(
							"relative mr-5 h-[75px] w-[75px] shrink-0 overflow-hidden rounded-full"
						)}
					>
						<Image
							src={image.src}
							width={image.width}
							height={image.height}
							alt={image.alt}
						/>
					</div>
				)}
				<Heading
					level="3"
					variant="none"
					className={vclsx(
						"text-20 grow font-bold leading-[27px] tracking-[.15px] text-primary-500"
					)}
				>
					{name}
				</Heading>
			</div>
		</div>
	)
}

const TestemonialContainer = ({ data }) => {
	const props = {
		introduction: get(data, "extra_field.intro", null),
		reversed: get(data, "extra_field.reverse_mode", false),
		items: data?.components?.map((item) => ({
			name: get(item, "name", null),
			description: get(item, "description.value['#text']", null),
			image: {
				src: get(item, "image[0]._default", null),
				alt: get(item, "image[0].meta.alt", null),
				height: get(item, "image[0].meta.height", null),
				width: get(item, "image[0].meta.width", null),
				title: get(item, "image_alt", null),
			},
		})),
	}

	return (
		<>
			<Wysiwyg html={props.introduction} className="prose mx-auto mb-12 text-center" />
			<div className="flex flex-wrap">
				{props.items.map((item, index) => {
					return (
						<div
							key={index}
							className="mb-6 shrink-0 basis-full px-4 md:mb-8 md:basis-1/2"
						>
							<TestemonialPushInfo {...item} reversed={props.reversed} />
						</div>
					)
				})}
			</div>
		</>
	)
}

export default TestemonialContainer
