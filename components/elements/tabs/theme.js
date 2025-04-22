export const tabs = {
	default: {
		wrapper: "",
		listwrapper: "flex p-1 space-x-1 bg-primary-900 rounded-xl",
		title: {
			base: "w-full py-2.5 text-sm leading-5 font-medium rounded-lg bg-transparent animate",
			active: "!bg-white shadow text-primary-500",
			inactive: "text-primary-100 hover:bg-white/[0.12] hover:text-white",
		},
		panel:
			"bg-white rounded-xl p-3 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary-400 ring-white ring-opacity-60",
	},
	paragraph_tabs: {
		wrapper: "",
		listwrapper: "flex p-1 space-x-1 bg-primary-900 rounded-xl",
		title: {
			base: "w-full py-2.5 text-sm leading-5 font-medium rounded-lg bg-transparent animate",
			active: "!bg-white shadow text-primary-500",
			inactive: "text-primary-100 hover:bg-white/[0.12] hover:text-white",
		},
		panel:
			"bg-white rounded-xl p-3 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary-400 ring-white ring-opacity-60",
	},
	secondary: {
		wrapper: "w-full border border-success-300 border-solid rounded-xl overflow-hidden",
		listwrapper: "flex",
		title: {
			base: "w-full py-2.5 text-sm leading-5 font-medium bg-transparent animate",
			active: "text-success-100 !bg-success-900 hover:bg-success-800",
			inactive: "text-success-900 bg-success-100 hover:bg-success-200",
		},
		panel:
			"bg-white rounded-xl p-3 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary-400 ring-white ring-opacity-60",
	},
}
