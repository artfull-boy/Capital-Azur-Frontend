import dynamic from "next/dynamic"

// todo: auto-collect themes at runtime.
// Using next/head and calling <style amp-custom="" ... /> triggers $RC streaming issues
// We get stuff like <template in the HTML markup which is not good for validatin AMP.
// Until we figure this out, AMP Layout is not lazy loaded.
// import { Layout as LayoutAmp } from "@/themes/amp"
// Other themes need to be lazy loaded so their CSS don't conflict.
const LayoutAmp = dynamic(() => import("@/themes/amp").then((mod) => mod.Layout))
const LayoutDefault = dynamic(() => import("@/themes/default").then((mod) => mod.Layout))
const LayoutAlt = dynamic(() => import("@/themes/alt").then((mod) => mod.Layout))

const THEMES = {
	amp: LayoutAmp,
	alt: LayoutAlt,
	default: LayoutDefault,
}

const loadThemeLayout = (theme) => {
	const Layout = THEMES[theme]

	if (!Layout) {
		const errorMessage = `[loadThemeLayout] Could not find theme "${theme}". Please use one of the following available themes "${Object.keys(
			THEMES
		).join(",")}" or create your own.`
		throw new Error(errorMessage)
	}

	return Layout
}

export default loadThemeLayout
