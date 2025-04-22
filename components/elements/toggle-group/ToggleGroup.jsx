import React, { Children, useEffect, useState } from "react"
import { toggleGroup } from "./theme"
import { vclsx } from "@vactorynext/core/utils"

export const ToggleGroup = ({
	children,
	type = "multiple",
	onChange = () => {},
	disabled = false,
	variant = "default",
}) => {
	const [toggleState, setToggleState] = useState([])

	const handleClick = (ev, child) => {
		if (type === "multiple") {
			toggleState.includes(child?.key)
				? setToggleState((prev) => prev.filter((key) => key !== child?.key))
				: setToggleState((prev) => prev.concat(child?.key))
		} else if (type === "single") {
			toggleState.includes(child?.key)
				? setToggleState(() => [])
				: setToggleState(() => [child?.key])
		}
	}

	useEffect(() => {
		onChange(toggleState)
	}, [toggleState])

	return (
		<div
			className={vclsx(
				toggleGroup[variant].wrapper.base,
				disabled && toggleGroup[variant].wrapper.disabled
			)}
		>
			{Children.map(children, (child, i) => {
				return (
					<div
						key={i}
						onClick={(ev) => (disabled ? null : handleClick(ev, child))}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								if (!disabled) {
									handleClick(e, child)
								}
							}
						}}
						role="button"
						tabIndex={0}
						className={vclsx(
							toggleGroup[variant].element.base,
							disabled
								? toggleGroup[variant].element.disabled
								: toggleState.includes(child?.key)
									? toggleGroup[variant].element.active
									: toggleGroup[variant].element.inactive
						)}
					>
						{child}
					</div>
				)
			})}
		</div>
	)
}

export default ToggleGroup
