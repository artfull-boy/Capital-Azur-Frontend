import { Heading, Text, Button } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:12",
	lazy: false,
}

const PushImage = ({ data }) => {
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
			<div
				className={vclsx(
					"mb-5 grid  grid-cols-1",
					data?.extra_field.mode ? "" : "md:grid-cols-2 md:gap-2"
				)}
			>
				{data?.components.map((item, i) => {
					const link_attributes = {
						id: item.link.attributes.id,
						target: item.link.attributes.target,
						rel: item.link.attributes.rel,
						className: item.link.attributes.class,
					}
					return (
						<div
							key={i}
							className="group relative mb-3 cursor-pointer p-6 text-center text-white"
							style={{
								backgroundImage: "url(" + item.image[0]._default + ")",
								width: "100%",
								height: "100%",
								backgroundRepeat: "no-repeat",
								backgroundSize: "cover",
							}}
						>
							{data?.extra_field.mode_text === 1 && (
								<Heading
									level="3"
									variant="3"
									className="absolute left-[50%] top-[50%] w-full translate-x-[-50%] translate-y-[-50%] text-center group-hover:invisible rtl:translate-x-[50%]"
								>
									{item.titre}
								</Heading>
							)}
							<div
								className={
									data?.extra_field.mode_text === 1 ? "invisible group-hover:visible" : ""
								}
							>
								<Heading level="3" variant="3">
									{item.titre}
								</Heading>
								<Text className="mb-3"> {item.description} </Text>
								<Button href={item.link.url} {...link_attributes}>
									{item.link.title}
								</Button>
							</div>
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

export default PushImage
