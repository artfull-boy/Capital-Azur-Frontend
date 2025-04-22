// paragraph_accordion
export const accordion = {
	default: {
		wrapper: "accordion_default-wrapper",
		element: "accordion_default-element",
		button: {
			base: "accordion_default-base",
			inactive: "accordion_default-inactive",
			active: "accordion_default-active",
			icon: {
				base: "animate",
				inactiveId: "plus",
				activeId: "minus",
				width: "16",
				height: "16",
			},
		},
		panel: {
			wrapper: "accordion_default-panel--wrapper",
			inactive: "max-h-[0vh]",
			active: "!max-h-[200vh]",
			base: "accordion_default-panel--base",
		},
	},
	no_icon: {
		wrapper: "accordion_no-icon-wrapper",
		element: "mb-3",
		button: {
			base: "accordion_no-icon-base",
			inactive: "accordion_no-icon-inactive",
			active: "accordion_no-icon-active",
		},
		panel: {
			wrapper: "accordion_no-icon-panel--wrapper",
			inactive: "max-h-0",
			active: "max-h-[300vh] py-5 ",
			base: "accordion_no-icon-panel--base",
		},
	},
	paragraph_accordion: {
		wrapper: "",
		element: "accordion_paragraph-element",
		button: {
			base: "accordion_paragraph-base",
			inactive: "accordion_paragraph-inactive",
			active: "accordion_paragraph-active",
			icon: {
				base: "animate",
				inactiveId: "chevron-down",
				activeId: "chevron-up",
				width: "16",
				height: "16",
			},
		},
		panel: {
			wrapper: "accordion_paragraph-panel--wrapper",
			inactive: "max-h-[0vh]",
			active: "!max-h-[200vh]",
			base: "accordion_paragraph-panel--base",
		},
	},
}
