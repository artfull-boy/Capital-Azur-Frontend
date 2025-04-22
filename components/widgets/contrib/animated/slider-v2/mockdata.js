export const mockdata = {
	settings: {
		toHide: false,
		containerLayout: "default",
		/* containerLayout options: ["default", "full"] */
	},
	data: {
		components: [
			{
				image: [{ _default: "/assets/img/flowers.webp" }],
				title: "Slide 1 Title",
				link: {
					title: "Learn More",
					url: "/learn-more",
				},
			},
			{
				image: [{ _default: "/assets/img/flowers.webp" }],
				title: "Slide 2 Title",
				link: {
					title: "Discover",
					url: "/discover",
				},
			},
			{
				image: [{ _default: "/assets/img/flowers.webp" }],
				title: "Slide 3 Title",
				link: {
					title: "Explore",
					url: "/explore",
				},
			},
			// Add more slides as needed
		],
	},
}
