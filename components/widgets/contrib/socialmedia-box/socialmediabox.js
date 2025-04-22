import { vclsx } from "@vactorynext/core/utils"
import { Link, Icon } from "@/ui"

import { socialmediabox } from "./theme"

export const MediaBox = ({ list, className = "", variant = "default" }) => {
	return (
		<div className={vclsx(socialmediabox[variant].wrapper, className)}>
			<div className={socialmediabox[variant].container}>
				{list.map((media, index) => {
					return (
						<Link key={index} href={media.href}>
							<Icon
								id={media.id}
								className={socialmediabox[variant].icons}
								aria-hidden="true"
							/>
						</Link>
					)
				})}
			</div>
		</div>
	)
}
