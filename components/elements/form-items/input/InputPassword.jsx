import { passwordStrength } from "check-password-strength"
import { forwardRef, Fragment, useState } from "react"
import { useFormContext } from "react-hook-form"

import { Transition } from "@headlessui/react"
import { Icon, Input } from "@/ui"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"

import { input } from "./theme"

const validations = [
	{
		name: "passWordLength",
		pattern: /.{8,}/,
		messageError: "This is too short",
		ruleString: "Minimum caracter 8 digits",
	},
	{
		name: "hasSpecialCaracter",
		pattern: "[$&+,:;=?@#|'<>.^*()%!-]",
		messageError: "It doesn't contain special caracter",
		ruleString: "Password must contain at least one special caracter",
	},
	{
		name: "hasCapitalLetter",
		pattern: ".*[A-Z].*",
		messageError: "Doesn't have a capital letter",
		ruleString: "Password must contain at least one capital caracter",
	},
	{
		name: "hasNumber",
		pattern: /\d/,
		messageError: "Doesn't contains a number",
		ruleString: "Password must contain at least one number caracter",
	},
]

const PasswordConstraint = ({ validity, constraint }) => {
	const { t } = useTranslation()
	return (
		<Transition
			as={Fragment}
			show={validity}
			enter="transition duration-[400ms]"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="duration-200 transition ease-in-out"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div className="flex items-center space-x-2">
				<span className="text-sm text-gray-500">{t(constraint)}</span>
			</div>
		</Transition>
	)
}

const generateValidationFunction = (validations, validation) => {
	return (validations[validation.name] = (arg) => {
		var regex = new RegExp(validation.pattern)
		return regex.test(arg) || validation.messageError
	})
}

const generateValidationFunctions = () => {
	var validationsFunctions = {}
	validations.forEach((validation) => {
		generateValidationFunction(validationsFunctions, validation)
	})
	return validationsFunctions
}

export const InputPassword = forwardRef(
	(
		{
			name,
			applyValidations = true,
			labelDisplay,
			type,
			label,
			variant = "default",
			sufix = null,
			...rest
		},
		ref
	) => {
		const [inputValue, setInputValue] = useState(null)
		const [score, setScore] = useState(0)
		const [isPasswordVisible, setIsPasswordVisible] = useState(false)
		const {
			register,
			formState: { errors },
		} = useFormContext()

		const validatePattern = (pattern) => {
			var regex = new RegExp(pattern)
			return regex.test(inputValue)
		}

		const handleChange = (e) => {
			var inputValue = e.target.value
			if (inputValue === "") {
				setInputValue(null)
			} else {
				setInputValue(inputValue)
			}

			setScore(passwordStrength(e.target.value).id)
		}

		const handleEyeButtonClick = (e) => {
			e.preventDefault()
			setIsPasswordVisible((prev) => {
				return !prev
			})
		}

		const hasError = () => {
			return !!errors[name]
		}

		const restFields = applyValidations
			? register(name, {
					required: "this field is required",
					validate: applyValidations && generateValidationFunctions(),
				})
			: { ...rest, ref, name }

		return (
			<div
				className={vclsx(
					labelDisplay == "after" && "flex flex-wrap",
					labelDisplay == "inline" && "flex flex-wrap md:items-center"
				)}
			>
				{type !== "hidden" && label && labelDisplay !== "none" && (
					<label
						className={vclsx(
							input[variant].label,
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
				<Input
					type={isPasswordVisible ? "text" : "password"}
					{...restFields}
					onChange={(e) => {
						restFields.onChange(e)
						handleChange(e)
					}}
					hasError={hasError()}
					errorMessage={errors[name]?.message}
					sufix={
						sufix ? (
							sufix
						) : (
							<button onClick={(e) => handleEyeButtonClick(e)}>
								<Icon id="eye" className="h-5 w-5 text-black" />
							</button>
						)
					}
					name={name}
				/>
				{applyValidations && (
					<div className="mb-2 mt-3 h-1 w-full bg-gray-100">
						<div
							className={vclsx(
								"h-1 transition-all",
								"h-1 transition-all",
								inputValue !== null && score === 0
									? "w-3/12 bg-error-600"
									: inputValue !== null && score === 1
										? "w-6/12 bg-warning-600"
										: inputValue !== null && score === 2
											? "w-9/12 bg-warning-600"
											: inputValue !== null && score === 3
												? "w-12/12 bg-success-600"
												: "w-0"
							)}
						></div>
					</div>
				)}
				{applyValidations && (
					<div className="flex flex-col gap-x-2">
						{validations.map((constraint, index) => {
							return (
								<PasswordConstraint
									key={index}
									constraint={constraint.ruleString}
									validity={!validatePattern(constraint.pattern)}
								/>
							)
						})}
					</div>
				)}
			</div>
		)
	}
)
