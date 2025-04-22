import React, { useState, Fragment } from "react"

import { Transition } from "@headlessui/react"
import { vclsx } from "@vactorynext/core/utils"

import { Icon } from "../icon/Icon"
import { alert } from "./theme"

export const Alert = ({
	children,
	wrapper,
	variant = "info",
	icon,
	className,
	shouldClose = true,
}) => {
	const [show, setShow] = useState(true)
	const handleCloseClick = () => {
		shouldClose && setShow(false)
	}
	return (
		<Transition show={show} as={Fragment} {...alert.animation}>
			<div className={vclsx(alert.wrapper[wrapper], alert.variant[variant], className)}>
				<div className="flex">
					<Icon id={icon} className={vclsx(alert["icon"])}></Icon>
					<div>{children}</div>
				</div>
				{shouldClose && (
					<div
						onClick={handleCloseClick}
						onKeyDown={(e) => {
							e.key === "Enter" && handleCloseClick()
						}}
						role="button"
						tabIndex={0}
						className="cursor-pointer"
					>
						<Icon id="x" className={vclsx(alert["icon"])}></Icon>
					</div>
				)}
			</div>
		</Transition>
	)
}

export default Alert
