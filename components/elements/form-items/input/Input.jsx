import { useRouter } from "next/router"
import React, { forwardRef, useRef } from "react"

import { Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

import { Keyboard } from "../arabic-keyboard/arabicKeyboard"
import { input } from "./theme"

export const Input = forwardRef(
	(
		{
			label,
			labelDisplay = "default",
			variant = "default",
			placeholder,
			addonAfter = null,
			addonBefore = null,
			prefix = null,
			sufix = null,
			type = "text",
			handleSufixClick = null, // this only used in password case and it maight be optimized
			handleInputChange,
			hasError,
			errorMessage,
			description,
			disabled,
			inputClass,
			wrapperClass,
			setValue,
			name,
			...rest
		},
		forwardedRef
	) => {
		// const displayOfLabel = ["default", "before", "after", "inline", "invisible", "none"]

		const inputRef = useRef()
		const router = useRouter()
		const { locale } = router
		return (
			<div
				className={vclsx(
					"relative mb-4 w-full",
					labelDisplay == "after" && "flex flex-wrap",
					labelDisplay == "inline" && "flex flex-wrap md:items-center"
				)}
			>
				{type !== "hidden" && label && labelDisplay !== "none" && (
					<label
						className={vclsx(
							input[variant].label,
							"text-[15px] font-500 text-gray-500",
							labelDisplay == "invisible" && "sr-only",
							labelDisplay == "inline" &&
								"shrink-0 grow md:max-w-1/5 md:basis-1/5 md:pr-5",
							labelDisplay == "after" && "order-2 mt-4"
						)}
						htmlFor={name}
					>
						{label}
					</label>
				)}
				<div
					className={vclsx(
						wrapperClass,
						input[variant].wrapper,
						type === "hidden" && "border-none",
						hasError && input[variant].hasError,
						labelDisplay == "inline" && "shrink-0 grow md:max-w-4/5 md:basis-4/5",
						labelDisplay == "after" && "border-1"
					)}
				>
					{addonBefore && (
						<div className={vclsx("flex", input[variant].addonBefore)}>{addonBefore}</div>
					)}
					<span
						className={vclsx(
							addonBefore && addonAfter
								? input[variant].inputWrapper.inside
								: addonAfter
									? input[variant].inputWrapper.left
									: addonBefore
										? input[variant].inputWrapper.right
										: input[variant].inputWrapper.full,
							hasError && input[variant].hasError
						)}
					>
						{prefix && <div className={vclsx(input[variant].prefix)}>{prefix}</div>}
						<input
							ref={(element) => {
								if (forwardedRef) {
									if (typeof forwardedRef === "function") {
										forwardedRef(element)
									} else {
										forwardedRef.current = element
									}
								}
								inputRef.current = element
							}}
							onChange={(e) => handleInputChange?.(e.target.value)}
							className={vclsx(
								input[variant].input,
								"pl-9 h-14",
								disabled && "cursor-not-allowed bg-gray-50",
								inputClass
							)}
							type={type}
							placeholder={placeholder}
							disabled={disabled}
							id={name}
							name={name}
							{...rest}
						/>
						{sufix && (
							<div
								className={vclsx(input[variant].sufix)}
								onClick={() => {
									handleSufixClick?.()
								}}
								onKeyDown={(e) => {
									e.key === "Enter" && handleSufixClick?.()
								}}
								role="button"
								tabIndex={0}
							>
								{sufix}
							</div>
						)}
					</span>
					{addonAfter && (
						<div className={vclsx("flex", input[variant].addonAfter)}>{addonAfter}</div>
					)}
				</div>
				{locale === "ar" && (
					<Keyboard
						name={name}
						inputRef={inputRef}
						inputClass={inputClass}
						setValue={setValue}
					/>
				)}

				{errorMessage && hasError && (
					<p className={input[variant].errorMessage}>{errorMessage}</p>
				)}
				{description && (
					<Wysiwyg className={input[variant].description} html={description} />
				)}
			</div>
		)
	}
)
