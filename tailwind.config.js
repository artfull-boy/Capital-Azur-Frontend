// apps/starter/tailwind.config.js

const defaultThemeConfig = require("./themes/default/tailwind.config.js")
const defaultTheme = require("tailwindcss/defaultTheme")

const content = [
	"./pages/**/*.{js,ts,jsx,tsx}",
	"./components/**/**/*.{js,ts,jsx,tsx}",
	"../../packages/***/**/*.{js,ts,jsx,tsx}",
	"../../packages/****/***/**/*.{js,ts,jsx,tsx}",
	"../../packages/*****/****/***/**/*.{js,ts,jsx,tsx}",
	"../../node_modules/@vactorynext/core/dist/**/*.js",
	"../../node_modules/@vactorynext/core/dist/***/**/*.js",
]

module.exports = {
	// Merge the default configuration
	...defaultThemeConfig,

	// Override or extend configurations here
	content: content,
	theme: {
		// Merge the default theme
		...defaultThemeConfig.theme,
		colors: {
			primary: "#027BFE",
			secondary:"#FFFFFF",
			accent: "#F4F8F8",
			cardTags: "#08286A",
		      },
		
		      
		// Extend or override theme properties
		extend: {
			...defaultThemeConfig.theme?.extend,
			// Add your custom extensions here
			fontFamily: {
				rtl: process.env.POSTCSS_CONFIG
					? ["Cairo"]
					: ["Cairo", ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [
		// Include default plugins
		...defaultThemeConfig.plugins,

		// Add any additional plugins here
	],
}
