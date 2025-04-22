import { drupal } from "@vactorynext/core/drupal"
import { redis } from "@vactorynext/core/server"

import {
	getEnabledMenus,
	DEFAULT_JSONAPI_NODE_PARAMS,
	query as queryBuild,
} from "@vactorynext/core/lib"

import { getTranslations, getMenus, redirectsHelper } from "@vactorynext/core/server"

import { TemplatesMapping } from "@/runtime/nodes-templates"
import { NodeParamsMapping } from "@/runtime/nodes-params"
import { TemplatesMappingAMP } from "@/runtime/nodes-templates-amp"
import { NodeParamsMappingAMP } from "@/runtime/nodes-params-amp"
import { getSession, getCsrfToken } from "next-auth/react"
import { SessionExpiration } from "@/account"
import loadThemeLayout from "@/themes/.runtime"
import { Wysiwyg, Text } from "@/ui"
import { getServerSidePropsFlags } from "@vactory/console/server"
import cookie from "cookie"
import {
	NodeDefault,
	NodePageHtml,
	NodePageComponent,
	getSystemRouteExceptionInfos,
} from "@vactorynext/core/config-client"
import projectConfig from "../project.config"
import { checkDrupalHealth } from "@vactorynext/core/server"
import { updateFlag } from "@vactory/console/lib/database/flags"

// To enable AMP, switch false to "hybrid"
export const config = { amp: false }

const enabledMenus = getEnabledMenus()

export default function NodePage(props) {
	return (
		<NodePageComponent
			{...props}
			TemplatesMapping={TemplatesMapping}
			TemplatesMappingAMP={TemplatesMappingAMP}
			NodeDefault={NodeDefault}
			Text={Text}
			Wysiwyg={Wysiwyg}
			NodePageHtml={NodePageHtml}
			SessionExpiration={SessionExpiration}
		/>
	)
}

NodePage.getLayout = function getLayout(page, theme) {
	const Layout = loadThemeLayout(theme)
	return <Layout {...page.props}>{page}</Layout>
}

export async function getServerSideProps(context) {
	// Check if Drupal is healthy
	const isHealthy = await checkDrupalHealth()

	// If Drupal is not healthy, set the offline flags
	if (!isHealthy) {
		updateFlag("system__enableOffline", true)
		updateFlag("system__showOfflineMessage", true)
	} else {
		updateFlag("system__enableOffline", false)
		updateFlag("system__showOfflineMessage", false)
	}

	// initialize redirects
	await redirectsHelper.initialize()

	const { slug, ...query } = context.query
	const currentPath = context.req ? context.req.url : null
	const { locale } = context
	let joinedSlug = Array.isArray(slug) ? slug.join("/") : slug
	const isAmp = context.req.url.includes("amp=1")

	// Parse the cookies from the request headers
	const cookies = context.req.headers.cookie
		? cookie.parse(context.req.headers.cookie)
		: {}

	// Check if the URL contains an unsupported language code
	const urlPath = context.req.url
	const pathParts = urlPath.split("/").filter(Boolean)

	// If we have a path part that matches a backend language but isn't in our enabled list
	const unsupportedLang = pathParts.find(
		(part) =>
			// Check if this part looks like a language code (2 characters)
			part.length === 2 &&
			// And it's not in our enabled languages
			!projectConfig.languages.enabled.includes(part)
	)

	if (unsupportedLang) {
		// Set the status code to 404
		context.res.statusCode = 404

		return {
			props: {
				session: null,
				node: {},
				systemRoute: getSystemRouteExceptionInfos("Page not found", 404, null),
				params: null,
				i18n: [],
				menus: [],
				locale: locale,
				error: { statusCode: 404 },
				currentPath: currentPath,
				flags: {},
				projectThemeCookie: cookies?.projectThemeCookie || "light",
				listingType: "",
			},
		}
	}

	// Drupal router doesn't accept empty slug.
	if (!joinedSlug) {
		joinedSlug = "/"
	}

	let accessToken = null
	let uid = 0 // Anonymous
	const session = await getSession({ req: context.req })

	// @todo: only in debug
	//console.log("getNodeServerSideProps Session:", session)

	if (session) {
		accessToken = session.accessToken
		uid = session?.user?.id || 0
	}

	const { serverFlags, clientFlags } = getServerSidePropsFlags()

	let i18n = [],
		menus = []

	if (serverFlags.get("maintenanceMode") === true) {
		return {
			props: {
				session,
				node: {},
				systemRoute: getSystemRouteExceptionInfos("Maintenance", 500, session),
				params: null,
				i18n: i18n,
				menus: menus,
				locale: locale,
				error: { statusCode: 500 },
				currentPath: currentPath,
				flags: clientFlags,
				projectThemeCookie: cookies?.projectThemeCookie || "light",
				listingType: cookies?.listingType || "",
			},
		}
	}

	try {
		i18n = await getTranslations(locale, {
			auth: session,
			uid,
			locale,
		})
		// If Menus from Admin console are not defined, use the ones from project config
		menus = await getMenus(
			clientFlags?.system__menus ? clientFlags?.system__menus.split(",") : enabledMenus,
			locale,
			{
				auth: session,
				uid,
				locale,
			}
		)
	} catch (err) {
		console.log(err)
		const statusCode = err?.statusCode || 500
		context.res.statusCode = statusCode
		return {
			props: {
				session,
				node: {},
				systemRoute: getSystemRouteExceptionInfos(err, statusCode, session),
				params: null,
				i18n: i18n,
				menus: menus,
				locale: locale,
				error: { statusCode: statusCode },
				currentPath: currentPath,
				flags: clientFlags,
				projectThemeCookie: cookies?.projectThemeCookie || "light",
				listingType: cookies?.listingType || "",
			},
		}
	}

	// const locale = getLocaleFromPath(joinedSlug, enabledLanguages)
	// const langprefix = locale ? `${locale}/` : ``
	// Router stuff
	let router, routerResponse
	try {
		let routerOptions = {
			// headers: {
			// 	"X-Internal-Cacheability-Debug": "true"
			// }
			// withCache: false,
			// cacheKey: `route-${uid}-${locale}-${joinedSlug}`,
		}

		if (accessToken) {
			routerOptions["withAuth"] = () => `Bearer ${accessToken}`
			routerOptions["headers"] = {
				"X-Auth-Provider": session.provider,
			}
		}
		const cacheKey = `router:${joinedSlug} language:${locale} ${uid}`
		const cached = await redis.get(cacheKey)
		if (cached) {
			router = JSON.parse(cached)
		} else {
			routerResponse = await drupal.getRoute(joinedSlug, locale, routerOptions)
			router = await routerResponse.json()
			await redis.set(
				cacheKey,
				JSON.stringify(router),
				"EX",
				process.env.REDIS_ROUTER_EXPIRE
			) // 5 mins > keep routing longer
		}
	} catch (err) {
		console.log(err)
		const statusCode = err?.statusCode || 500
		context.res.statusCode = statusCode
		return {
			props: {
				session,
				node: {},
				systemRoute: getSystemRouteExceptionInfos(err, statusCode, session),
				params: null,
				i18n: i18n,
				menus: menus,
				locale: locale,
				error: { statusCode: statusCode },
				currentPath: currentPath,
				flags: clientFlags,
				projectThemeCookie: cookies?.projectThemeCookie || "light",
				listingType: cookies?.listingType || "",
			},
		}
	}

	// Check for redirect.
	if (router?.redirect?.length) {
		const [redirect] = router.redirect
		return {
			redirect: {
				destination: redirect.to,
				permanent: redirect.status === "301",
			},
		}
	}

	// New redirects with locale in source
	const { pathname, search } = new URL(context.req.url, process.env.NEXT_BASE_URL)
	const path = `/${locale}${pathname}`
	const fullPath = search ? `${path}${search}` : path

	if (redirectsHelper.hasRedirect(fullPath)) {
		return {
			redirect: {
				destination: redirectsHelper.getRedirectFor(fullPath),
				permanent: true,
			},
		}
	}

	// New redirects without locale in source
	const path_without_locale = pathname
	const fullPath_without_locale = search
		? `${path_without_locale}${search}`
		: path_without_locale

	if (redirectsHelper.hasRedirect(fullPath_without_locale)) {
		return {
			redirect: {
				destination: redirectsHelper.getRedirectFor(fullPath_without_locale),
				permanent: true,
			},
		}
	}

	// Set HTTP status code.
	context.res.statusCode = router.status

	let nodeParams = Object.assign(
		{},
		JSON.parse(
			JSON.stringify(
				isAmp
					? NodeParamsMappingAMP[router.jsonapi.resourceName] ?? {}
					: NodeParamsMapping[router.jsonapi.resourceName] ?? {}
			)
		)
	)
	// Add internal fields
	if (nodeParams?.fields && nodeParams?.fields[router.jsonapi.resourceName]) {
		// console.log("#DEBUG BEFORE", nodeParams.fields[router.jsonapi.resourceName])
		nodeParams.fields[router.jsonapi.resourceName] =
			DEFAULT_JSONAPI_NODE_PARAMS + "," + nodeParams.fields[router.jsonapi.resourceName]
		// console.log("#DEBUG AFTER", nodeParams.fields[router.jsonapi.resourceName])
	}

	let queryParams = ""
	if (Object.keys(query).length > 0) {
		queryParams = queryBuild(query)
		nodeParams["q"] = {
			...query,
		}
	}

	if (router?.system?._query) {
		nodeParams["q"] = {
			...nodeParams["q"],
			...router?.system?._query,
		}
	}

	let node
	try {
		let nodeOptions = {
			withCache: false,
			cacheKey: `node:${router.entity.id} user:${uid} language:${locale} locale routes route_match http_response`, // @todo: access token ?
		}

		if (accessToken) {
			nodeOptions["withAuth"] = () => `Bearer ${accessToken}`
			nodeOptions["headers"] = {
				"X-Auth-Provider": session.provider,
			}
		}

		let joinedSlugKey = queryParams == "" ? joinedSlug : `${joinedSlug}?${queryParams}`
		joinedSlugKey = `/${joinedSlugKey}`.replace("//", "/")
		const cacheKey = `node:${router.entity.id} bundle:${router.entity.bundle} language:${locale} user:${uid} slug:${joinedSlugKey}`
		const cached = await redis.get(cacheKey)
		if (cached) {
			node = JSON.parse(cached)
		} else {
			if ("revision" in (nodeParams?.q || [])) {
				nodeParams = { ...nodeParams, resourceVersion: "id:" + nodeParams?.q?.revision }
			}
			node = await drupal.getNode(router, nodeParams, locale, joinedSlug, nodeOptions)
			if (!node.internal_extra.cache_exclude) {
				await redis.set(
					cacheKey,
					JSON.stringify(node),
					"EX",
					process.env.REDIS_NODE_EXPIRE
				) // 1 min > keep it fresh
			}
		}

		// @todo: invoke hooks here

		// Retrieve blocks HTML & BODY classes.
		let body_classes = ["relative"],
			html_classes = []
		const node_blocks = node.internal_blocks || []
		node_blocks.forEach((blk) => {
			const bclass = blk?.body_classes || ""
			const hclass = blk?.html_classes || ""

			bclass.split(" ").forEach((clx) => (clx.length > 0 ? body_classes.push(clx) : null))
			hclass.split(" ").forEach((clx) => (clx.length > 0 ? html_classes.push(clx) : null))
		})

		// Theme name ( from Theme Switcher )
		node._theme = node?.internal_extra?.theme

		// CSRF Token from next-auth for auth page such as login and register ...
		node.csrfTokenAuth = await getCsrfToken(context)
		// CSRF Token for other requests
		node.csrfToken = context.res.getHeader("X-CSRF-Token") || "missing"

		// Alter metatag
		node.internal_metatag =
			node?.internal_metatag?.map((tag) => {
				const host = context?.req.headers.host
				const protocol =
					context.req.headers["x-forwarded-proto"] ||
					(context.req.connection.encrypted ? "https" : "http")
				const fullHost = `${protocol}://${host}`
				const backendBase = process.env.DRUPAL_BASE_URL
				const frontendBase = process.env.NEXT_BASE_URL
				if (tag?.id == "canonical_url" && tag.attributes?.href?.startsWith(backendBase))
					tag.attributes.href = tag.attributes.href.replace(backendBase, fullHost)
				else if (tag.attributes?.href?.startsWith(backendBase))
					tag.attributes.href = tag.attributes.href.replace(backendBase, frontendBase)
				return tag
			}) || []

		// Add current domain to node.
		node._NEXT_PUBLIC_ENV = JSON.stringify({
			NEXT_BASE_URL: process.env.NEXT_BASE_URL,
			DRUPAL_BASE_URL: process.env.DRUPAL_BASE_URL,
		})
		return {
			props: {
				session,
				node: node,
				params: Object.keys(query).length > 0 ? query : null,
				i18n: i18n,
				menus: menus,
				locale: locale,
				systemRoute: {
					...(router?.system || {}),
					status: router.status,
				},
				document: {
					htmlClass: html_classes.join(" "),
					bodyClass: body_classes.join(" "),
				},
				flags: clientFlags,
				projectThemeCookie: cookies?.projectThemeCookie || "light",
				listingType: cookies?.listingType || "",
			},
		}
	} catch (err) {
		console.log(err)
		const statusCode = err?.statusCode || 500
		context.res.statusCode = statusCode
		return {
			props: {
				session,
				node: {},
				systemRoute: getSystemRouteExceptionInfos(err, statusCode, session),
				params: null,
				i18n: i18n,
				menus: menus,
				locale: locale,
				error: { statusCode: statusCode },
				currentPath: currentPath,
				flags: clientFlags,
				projectThemeCookie: cookies?.projectThemeCookie || "light",
				listingType: cookies?.listingType || "",
			},
		}
	}
}
