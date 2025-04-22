module.exports = {
	languages: {
		// Default language to be redirected to when no locale is specified .e.g / > /fr
		default: "fr",
		// Enables languages. Drupal must have these enabled.
		enabled: ["fr", "en"],
		// Languages labels, mostly used by dropdowns.
		labels: [
			{ code: "en", label: "English" },
			{ code: "fr", label: "Français" },
		],
	},
	// List of menus used by frontend (useMenu hook). Must exists in Drupal.
	menus: ["main", "menu-top", "footer", "footer-bottom"],
	images: {
		contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
		disableStaticImages: false,
		loader: "default",
		loaderFile: "",
		path: "/_next/image",
		remotePatterns: [],
		unoptimized: false,
		domains: [
			process.env.NEXT_IMAGE_DOMAIN ?? "",
			"vactory.sooninprod.com",
			"placehold.co",
			"php.vactory.orb.local",
			"localhost"
		],
		dangerouslyAllowSVG: true,
		// contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		deviceSizes: [320, 375, 414, 640, 768, 1024, 1280, 1440, 1920],
		imageSizes: [],
		formats: ["image/webp"],
		minimumCacheTTL: 60,
	},
	performance: {
		widgets: {
			mode: "all", // all or selective
			list: [],
		},
	},
	// Security tweaks.
	security: {
		// Default headers.
		headers: [
			{
				key: "X-DNS-Prefetch-Control",
				value: "on",
			},
			{
				key: "Strict-Transport-Security",
				value: "max-age=63072000; includeSubDomains; preload",
			},
			{
				key: "X-XSS-Protection",
				value: "1; mode=block",
			},
			{
				key: "X-Frame-Options",
				value: "SAMEORIGIN",
			},
			{
				key: "Permissions-Policy",
				value: "camera=(), microphone=(), geolocation=()",
			},
			{
				key: "X-Content-Type-Options",
				value: "nosniff",
			},
			{
				key: "Referrer-Policy",
				value: "strict-origin-when-cross-origin",
			},
		],
	},
};
