import Select, { components } from "react-select"

export const SelectMultipleV2 = ({
	options,
	isMulti,
	id,
	placeholder,
	field,
	closeMenuOnSelect = false,
}) => {
	return (
		<Select
			{...field}
			placeholder={placeholder}
			options={options}
			isMulti={isMulti}
			id={id}
			components={{ MultiValue }}
			className="react-select-container"
			classNamePrefix="react-select"
			hideSelectedOptions={false}
			isOptionDisabled={(option) => option.disabled}
			closeMenuOnSelect={closeMenuOnSelect}
		/>
	)
}

const MultiValue = ({ index, getValue, ...props }) => {
	const maxToShow = 1
	const hiddenSelectedOptions = getValue()
		.slice(maxToShow)
		.map((x) => x.label)

	return index < maxToShow ? (
		<components.MultiValue {...props} />
	) : index === maxToShow ? (
		<div className="order-2 whitespace-nowrap rounded-[4px] bg-primary-600 px-1 text-white">
			{`+ ${hiddenSelectedOptions.length}`}
		</div>
	) : null
}
