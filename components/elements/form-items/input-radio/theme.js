export const inputRadio = {
	default: {
		wrapper: "flex items-center flex-wrap gap-4 mb-4",
		radioContainer: "flex gap-x-2 items-center",
		input:
			"w-5 h-5 rounded-full flex items-center justify-center p-1 transition duration-200",
		state: {
			checked:
				"bg-primary-500 ring-1 ring-primary-300 hover:ring-2 hover:ring-primary-300",
			unChecked:
				"border border-gray-200 hover:border-gray-400 hover:ring-2 hover:ring-gray-300",
		},
		icon: "h-full w-full text-white",
		label: "text-sm font-medium text-gray-700 pb-1",
		errorMessage: "inline-block text-xs text-error-600 mt-1",
		description: "text-sm text-gray-400 mt-1",
	},
}
