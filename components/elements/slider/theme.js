export const sliderTheme = {
	default: {
		wrapper: "relative lg:px-10 mb-8",
		slider: "",
		arrows: {
			wrapper: "",
			button:
				"inline-flex justify-center items-center w-8 h-8 text-black hover:text-gray-500 transition absolute -bottom-10 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 bg-transparent",
			prev: "left-0",
			next: "right-0",
		},
		dots: {
			wrapper: "flex items-center justify-center absolute -bottom-8 left-0 right-0",
			dot: "dot inline-block w-4 h-4 cursor-pointer rounded-full my-0 mx-2 bg-transparent",
			dotNotActive: "bg-gray",
			dotActive: "active bg-primary",
		},
	},
	fullBackground: {
		wrapper: "relative",
		slider: "",
		arrows: {
			wrapper: "",
			button:
				"bg-transparent group absolute z-50 items-center justify-center hidden w-11 h-11 transform -translate-y-1/2 border-2 border-gray-500 border-opacity-50 hover:border-transparent rounded-full md:flex top-1/2 transition-all hover:bg-black hover:bg-opacity-70 before:transition-all before:absolute before:content-[''] before:w-full before:border-b-2 before:border-white hover:before:w-2/6",
			prev: "left-5 before:left-1/2 hover:before:left-4",
			next: "right-5 before:right-1/2 hover:before:right-4",
		},
		dots: {
			wrapper:
				"absolute flex items-center transform -translate-x-1/2 bottom-6 left-1/2 rtl:translate-x-1/2 gap-x-4",
			dot: "dot rounded-full",
			dotNotActive: "bg-white w-4 h-4",
			dotActive: "active bg-gray-400 w-6 h-6",
		},
	},
	sliderImageBgVideo: {
		wrapper: "relative",
		slider: "",
		arrows: {
			wrapper: "",
			button:
				"bg-transparent group absolute z-50 items-center justify-center hidden w-11 h-11 transform -translate-y-1/2 border-2 border-gray-500 border-opacity-50 hover:border-transparent rounded-full md:flex top-1/2 transition-all hover:bg-black hover:bg-opacity-70 before:transition-all before:absolute before:content-[''] before:w-full before:border-b-2 before:border-white hover:before:w-2/6",
			prev: "left-5 before:left-1/2 hover:before:left-4",
			next: "right-5 before:right-1/2 hover:before:right-4",
		},
		dots: {
			wrapper: "absolute flex items-center bottom-5 right-5 gap-x-4",
			dot: "rounded-full w-4 h-4",
			dotNotActive: "bg-gray-200",
			dotActive: "active bg-primary-500",
		},
	},
	// cards aside wip
	cardsAside: {
		wrapper: "relative",
		slider: "ms-12",
		arrows: {
			wrapper: "",
			button: "absolute",
			prev: "top-0",
			next: "top-10",
		},
		dots: {
			wrapper: "",
			dot: "",
			dotNotActive: "",
			dotActive: "",
		},
	},
}
