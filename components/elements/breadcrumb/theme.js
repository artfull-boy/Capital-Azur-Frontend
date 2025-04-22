export const breadcrumb = {
	default: {
		wrapper: "",
		list: "flex items-center space-x-4",
		listElement: "flex items-center",
		link: "ltr:ml-4 rtl:mr-4 text-sm font-medium text-white hover:text-primary-500",
		nolink: "ltr:ml-4 rtl:mr-4 text-sm font-medium text-white",
		linkActive:
			"ltr:ml-4 rtl:mr-4 text-sm font-medium text-primary-500 hover:text-gray-700",
		separateIcon: {
			id: "chevron-right",
			width: "10",
			height: "10",
			className: "rtl-icon",
		},
		homeIcon: {
			id: "home",
			width: "30",
			height: "30",
			className: "",
		},
	},
	secondary: {
		wrapper: "",
		list: "flex items-center space-x-4",
		listElement: "flex items-center",
		link: "ltr:ml-4 rtl:mr-4 text-base text-gray-500 hover:text-primary-500",
		nolink: "ltr:ml-4 rtl:mr-4 text-base text-gray-500",
		linkActive: "ltr:ml-4 rtl:mr-4 text-blue-500 text-error-500 hover:text-gray-700",
		separateIcon: {
			id: "chevron-right",
			width: "15",
			height: "15",
			className: "text-gray-400",
		},
		homeIcon: {
			id: "home",
			width: "30",
			height: "30",
			className: "",
		},
	},
	tertiary: {
		wrapper: "",
		list: "flex items-center space-x-4",
		listElement: "flex items-center",
		link: "ltr:ml-4 rtl:mr-4 text-base text-blue-600 hover:text-white",
		nolink: "ltr:ml-4 rtl:mr-4 text-base text-gray-500",
		linkActive: "ltr:ml-4 rtl:mr-4 text-blue-600 hover:text-gray-700",
		separateIcon: {
			id: "chevron-right",
			width: "15",
			height: "15",
			className: "text-blue-600",
		},
		homeIcon: {
			id: "home",
			width: "30",
			height: "30",
			className: "",
		},
	},
}