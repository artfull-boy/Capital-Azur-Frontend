import React, { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { Input } from "@/ui"
import {
	useCheckConditions,
	useErrorMessage,
	toRegister,
} from "@vactorynext/core/webform"

export const NumberField = ({ name, field }) => {
	const {
		label,
		placeholder,
		htmlInputType,
		helperText,
		validation,
		shouldDisplay,
		states,
		attributes,
	} = field
	const { register, watch, setValue } = useFormContext()
	const errorMessage = useErrorMessage(name, label, useFormContext)
	const { t } = useTranslation()
	const values = watch({ nest: true })
	const isVisible = useMemo(() => {
		return shouldDisplay ? shouldDisplay(values) : true
	}, [values, shouldDisplay])

	const local_state = useCheckConditions(states, watch)

	if (!isVisible) return null
	if (local_state?.invisible) return null
	if (local_state?.["visible-slide"] === false) return null
	if (local_state?.visible === false) return null

	var local_validation =
		local_state["required"] !== undefined
			? { ...validation, required: local_state.required }
			: { ...validation }

	const { onChange, ...registerFuncs } = register(
		name,
		toRegister(t("Nx:" + label), local_validation, values, t)
	)

	const handleOnChange = (e) => {
		if (attributes.step) {
			const value = e.target.value
			const regex = `^-?\\d+(\\.\\d{0,${attributes.step}})?`
			const match = value.match(regex)
			const matchedValue = match ? match[0] : ""

			setValue(name, matchedValue) // Update the form value to conform to the two decimal places rule
		}
		onChange(e) // Call the original onChange handler
	}

	return (
		<Input
			id={name}
			type={htmlInputType || "number"}
			name={name}
			label={t(`Nx:${label}`) + `${local_validation?.required ? " *" : ""}`}
			variant="default"
			placeholder={placeholder}
			onChange={handleOnChange} // Updated to use the custom onChange handler
			{...registerFuncs}
			hasError={!!errorMessage}
			errorMessage={errorMessage}
			description={helperText}
			aria-label={t(`Nx:${label}`)}
			{...attributes}
		/>
	)
}
