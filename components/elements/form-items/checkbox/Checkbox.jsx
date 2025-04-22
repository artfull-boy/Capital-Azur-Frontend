import React, { forwardRef, useRef } from "react"

import { Icon, Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

import { checkbox } from "./theme"

export const Checkbox = forwardRef(
	(
		{
			variant = "default",
			label,
			disabled = false,
			checked = false,
			setChecked,
			hasError,
			errorMessage,
			className,
			description,
			name,
			...rest
		},
		ref
	) => {
		// eslint-disable-next-line no-unused-vars

		const checkboxRef = useRef()

		const toggleCheckbox = () => {
			!disabled && checkboxRef.current.click()
		}

		return (
			<div className={vclsx("relative", className)}>
				<input
					type="checkbox"
					className="invisible absolute left-56 h-0 w-0"
					disabled={disabled}
					onChange={!disabled && setChecked}
					id={name}
					name={name}
					{...rest}
					ref={(e) => {
						ref?.(e)
						checkboxRef.current = e
					}}
				/>
				<div
					className={checkbox[variant].wrapper}
					onClick={toggleCheckbox}
					onKeyDown={(e) => {
						e.key === "Enter" && toggleCheckbox()
					}}
					tabIndex={0}
					role="checkbox"
					aria-checked={checked}
				>
					<div
						aria-label={label}
						className={vclsx(
							checkbox[variant].input,
							checked && disabled
								? checkbox[variant].checked["disabled"]
								: checked && !disabled
									? checkbox[variant].checked["enabled"]
									: !checked && disabled
										? checkbox[variant].unchecked["disabled"]
										: checkbox[variant].unchecked["enabled"]
						)}
					>
						{checked && <Icon id="check" className={checkbox[variant].icon} />}
					</div>
					<label
						className={vclsx(
							disabled
								? checkbox[variant].label["disabled"]
								: checkbox[variant].label["enabled"]
						)}
						htmlFor={name}
					>
						{label}
					</label>
				</div>
				{hasError && (
					<span className={checkbox[variant].errorMessage}>{errorMessage}</span>
				)}
				{description && (
					<Wysiwyg className={checkbox[variant].description} html={description} />
				)}
			</div>
		)
	}
)
