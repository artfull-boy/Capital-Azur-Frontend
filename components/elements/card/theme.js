export const card = {
	default: {
		wrapper:
			"flex flex-col border border-gray-100 rounded-lg shadow overflow-hidden text-black bg-white",
		image: "relative flex items-center justify-center flex-shrink-0",
		body: "flex flex-col h-full p-5",
		tag: "mb-5",
		title: "text-xl font-semibold text-gray-900 text-primary-600",
		excerpt: "my-3 text-base text-gray-500",
		link: "mt-auto",
	},
	inline: {
		wrapper: "md:flex-row",
		image: "md:w-half lg:w-third",
		body: "md:w-full flex flex-col justify-center p-5",
	},
	inlineInversed: {
		wrapper: "md:flex-row-reverse ",
		image: "md:w-half lg:w-third",
		body: "md:w-full flex flex-col justify-center p-5",
	},
	"2Cols": {
		wrapper: "lg:flex-row ",
		image: "aspect-[16/9] lg:w-1/2",
		body: "lg:w-1/2 flex flex-col justify-center p-5",
	},
	"2ColsInversed": {
		wrapper: "lg:flex-row-reverse ",
		image: "aspect-[16/9] lg:w-1/2",
		body: "lg:w-1/2 flex flex-col justify-center p-5",
	},
	cardPicto: {
		image: "w-20 pl-4 pt-4",
		body: "flex flex-col h-full p-5",
		link: "mt-auto",
	},
}
