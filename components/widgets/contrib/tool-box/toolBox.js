import { useContext } from "react"

import { ThemeContext } from "@vactory/ui/theme-context"
import { Link } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
// import { Button } from "@vactory/ui/button"

export const ToolBox = ({ list, className = "", variant }) => {
	const { toolbox } = useContext(ThemeContext)
	return (
		<div className={vclsx(toolbox[variant].wrapper, className)}>
			<nav className={vclsx(toolbox[variant].position, className)}>
				<ul className={toolbox[variant].items}>
					{list.map((item, index) => {
						return (
							<li key={item.id}>
								<Link
									key={index}
									href={item.href}
									className={toolbox[variant].item.wrapper}
									variant={variant}
								>
									<div className={toolbox[variant].item.itemIcon}>{item.icon}</div>
									<div className={toolbox[variant].item.itemTitle}>
										<span className="m-2 block">{item.title}</span>
									</div>
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>
		</div>
	)
}
