import { Tab } from "@headlessui/react"
import { vclsx } from "@vactorynext/core/utils"

import { tabs } from "./theme"

export const Tabs = ({ nodes = [], variant = "default", onClick }) => {
	return (
		<div className={tabs[variant].wrapper}>
			<Tab.Group>
				<Tab.List className={tabs[variant].listwrapper}>
					{nodes.map((node) => (
						<Tab
							onClick={() => {
								typeof onClick === "function" && onClick(node.id)
							}}
							key={node.id}
							className={({ selected }) =>
								vclsx(
									tabs[variant].title.base,
									selected ? tabs[variant].title.active : tabs[variant].title.inactive
								)
							}
						>
							{node.title}
						</Tab>
					))}
				</Tab.List>
				<Tab.Panels className="mt-2">
					{nodes.map((node) => (
						<Tab.Panel key={node.id} className={tabs[variant].panel}>
							{node.content}
						</Tab.Panel>
					))}
				</Tab.Panels>
			</Tab.Group>
		</div>
	)
}
