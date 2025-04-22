import { Icon } from "@/ui"
import Link from "next/link"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
	id: "vactory_default:20",
	/* adminFlagsConfig: {
                group: "ToolboxVariant1",
                flags: [
                        {
                                name: "enabled",
                                defaultValue: true,
                                fieldLabel: "Enable Toolbox",
                                fieldType: "boolean",
                        },
                ],
        }, */
}

export const ToolBox = ({ hasDescription, items, className = "" }) => {
	return (
		<div className="fixed bottom-[50%] translate-y-[50%] left-10 z-10 flex flex-col gap-0 rounded-md border-2 border-[#fff] bg-[#0078F6] shadow-lg ">
			<Link className="p-3" href={"#."}>
				<Icon id={`facebook`} width="22" height="22" color="#fff" className="hover:text-black"/>
			</Link>
			<Link className="p-3" href={"#."}>
				<Icon id={`twitter`} width="22" height="22" color="#fff" className="hover:text-black"/>
			</Link>
			<Link className="p-3" href={"#."}>
				<Icon id={`whatsapp`} width="22" height="22" color="#fff" className="hover:text-black"/>
			</Link>
			<Link className="p-3" href={"#."}>
				<Icon id={`mail`} width="22" height="22" color="#fff" className="hover:text-black"/>
			</Link>
		</div>
	)
}

const ToolBoxContainer = ({ data }) => {
	const props = {
		hasDescription: data?.extra_field?.mode,
		items: data?.components?.map((item) => ({
			icon: item?.icon,
			description: item?.description,
			title: item?.link?.title,
			url: item?.link?.url,
			id: item?.link?.attributes?.id,
			className: item?.link?.attributes?.class,
			target: item?.link?.attributes?.target,
			rel: item?.link?.attributes?.rel,
		})),
	}
	return <ToolBox {...props} />
}

export default ToolBoxContainer
