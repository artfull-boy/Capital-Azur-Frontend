import React, { forwardRef, useRef } from "react"

import { Icon, Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

import { inputRadio } from "./theme"

export const InputRadio = forwardRef(
	(
		{
			variant = "default",
			hasError,
			errorMessage,
			label,
			name,
			options,
			selectedInput,
			setSelectedInput,
			disabled,
			description,
			...rest
		},
		ref
	) => {
		return (
			<>
				<div className={vclsx(inputRadio[variant].label)}>
					{label && <label htmlFor={name}>{label}</label>}
				</div>
				<div className={inputRadio[variant].wrapper}>
					{options.map((option, index) => {
						return (
							<InputRadioElement
								key={index}
								selectedInput={
									selectedInput !== undefined
										? options.find((option) => {
												return selectedInput === option.value
											})
										: {}
								}
								setSelectedInput={setSelectedInput}
								name={name}
								option={option}
								{...rest}
								ref={ref && ref}
								disabled={disabled}
							/>
						)
					})}
				</div>
				{hasError && <p className={inputRadio[variant].errorMessage}>{errorMessage}</p>}
				{description && (
					<Wysiwyg className={inputRadio[variant].description} html={description} />
				)}
			</>
		)
	}
)

const InputRadioElement = forwardRef(
	(
		{ variant = "default", selectedInput, setSelectedInput, option, disabled, ...rest },
		ref
	) => {
		const inputRadioRef = useRef()

		const handleInputClick = () => {
			if (!disabled) {
				setSelectedInput(option)
				inputRadioRef.current.click()
			}
		}

		return (
			<div className="shrink-0 grow">
				<label
					htmlFor={option.value}
					className={vclsx(inputRadio[variant].radioContainer, "relative")}
				>
					<input
						type="radio"
						value={option.value}
						checked={selectedInput.value === option.value ? true : false}
						id={option.value}
						className="invisible absolute left-56 h-0 w-0"
						{...rest}
						ref={(e) => {
							typeof ref === "function" && ref?.(e)
							inputRadioRef.current = e
						}}
					/>
					<div
						onClick={handleInputClick}
						onKeyDown={(e) => {
							e.key === "Enter" && handleInputClick()
						}}
						role="button"
						tabIndex={0}
						className={vclsx(
							inputRadio[variant].input,
							selectedInput.value === option.value
								? inputRadio[variant].state.checked
								: inputRadio[variant].state.unChecked,
							disabled && "pointer-events-none cursor-not-allowed bg-gray-50"
						)}
					>
						{selectedInput === option && (
							<Icon
								id="dots-circle-horizontal-solid"
								className={inputRadio[variant].icon}
							></Icon>
							/** this icon must a be a simple filled circle */
						)}
					</div>
					<span
						onClick={handleInputClick}
						onKeyDown={(e) => {
							e.key === "Enter" && handleInputClick()
						}}
						role="button"
						tabIndex={0}
						className={vclsx(
							"text-sm",
							disabled && "pointer-events-none cursor-not-allowed text-gray-400"
						)}
					>
						{option.label}
					</span>
				</label>
			</div>
		)
	}
)
