import { Heading, Text, Button } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:13",
	lazy: false,
}

const pushCard = ({ data }) => {
	const btn_attributes = {
			id: data?.components[0].btn_more.attributes.id,
			target: data?.components[0].btn_more.attributes.target,
			rel: data?.components[0].btn_more.attributes.rel,
			className: data?.components[0].btn_more.attributes.class,
		},
		link_attributes = {
			id: data?.components[0].link.attributes.id,
			target: data?.components[0].link.attributes.target,
			rel: data?.components[0].link.attributes.rel,
			className: data?.components[0].link.attributes.class,
		}
	return (
		<>
			{data?.components[0].intro && (
				<Text className="mb-5 text-center"> {data?.components[0].intro}</Text>
			)}

			<div
				className="group relative mb-5 h-[150px] w-full cursor-pointer p-6 md:h-full "
				style={{
					backgroundImage: "url(" + data?.components[0].image[0]._default + ")",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
				}}
			>
				<div
					className={vclsx(
						"lef-2 absolute right-2 top-[80%] bg-white p-3 md:relative md:w-[50%]",
						data?.components[0].mode ? "md:ml-auto" : ""
					)}
				>
					<Heading level="3" variant="3">
						{" "}
						{data?.components[0].titre}
					</Heading>
					<Text className="mb-3"> {data?.components[0].description} </Text>
					<Button href={data?.components[0].link.url} {...link_attributes}>
						{" "}
						{data?.components[0].link.title}{" "}
					</Button>
				</div>
			</div>

			{data?.components[0].btn_more.url && data?.components[0].btn_more.title && (
				<div className="text-center">
					<Button href={data?.components[0].btn_more.url} {...btn_attributes}>
						{data?.components[0].btn_more.title}
					</Button>
				</div>
			)}
		</>
	)
}

export default pushCard
