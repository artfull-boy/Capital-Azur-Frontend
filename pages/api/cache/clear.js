import { redis, redisOffline, isHttpMethod } from "@vactorynext/core/server"

export default async function handler(req, res) {
	const secret = req.headers["x-cache-secret"] || ""
	isHttpMethod(req, res, ["GET"])

	if (process.env.CACHE_SECRET === undefined) {
		res.status(500).json({ status: "CACHE_SECRET environment variable not specified!" })
		return
	}

	if (process.env.CACHE_SECRET !== secret) {
		res.status(500).json({ status: "secret key doesn't match" })
		return
	}

	if (req?.query?.invalidateOffline) {
		console.log(`[Cache]: received command to clear all offline caches`)
		await redisOffline.flushall()
		res.status(200).json({ status: "Offline Cache cleared" })
		return
	}

	if (req?.query?.invalidate) {
		console.log(
			`[Cache]: received command to clear ${req.query.invalidate} cache`,
			req.query
		)

		const pipeline = redis.pipeline()

		if (req.query.invalidate === "node" && req?.query?.id) {
			const keys = await redis.keys(`*node:${req.query.id}*`)
			if (keys.length > 0) {
				console.log(
					`[Cache]: clearing cache for node ${req.query.id} using redis pattern *node:${req.query.id}*, found ${keys.length} items in cache`
				)
				keys.forEach(function (key) {
					pipeline.del(key.replace(process.env.REDIS_PREFIX, ""))
				})
				await pipeline.exec()
			} else {
				console.log(
					`[Cache]: No cache found for node ${req.query.id} using redis pattern *node:${req.query.id}*`
				)
			}
		}

		if (req.query.invalidate === "menu" && req?.query?.menu) {
			const keys = await redis.keys(`*config:system.menu.${req.query.menu}*`)
			if (keys.length > 0) {
				console.log(
					`[Cache]: clearing cache for menu ${req.query.menu} using redis pattern *menus:*:${req.query.menu}, found ${keys.length} items in cache`
				)
				keys.forEach(function (key) {
					pipeline.del(key.replace(process.env.REDIS_PREFIX, ""))
				})
				await pipeline.exec()
			} else {
				console.log(
					`[Cache]: No cache found for menu ${req.query.menu} using redis pattern *menus:*:${req.query.menu}`
				)
			}
		}

		if (req.query.invalidate === "translation") {
			const keys = await redis.keys(`*i18n*`)
			if (keys.length > 0) {
				console.log(`[Cache]: clearing cache for translations`)
				keys.forEach(function (key) {
					pipeline.del(key.replace(process.env.REDIS_PREFIX, ""))
				})
				await pipeline.exec()
			} else {
				console.log(`[Cache]: No cache found for translations`)
			}
		}

		if (req.query.invalidate === "slugs") {
			for (let key in req.query) {
				if (key.startsWith("slugs")) {
					const keys = await redis.keys(`*slug:${req.query[key]}`)
					if (keys.length > 0) {
						console.log(
							`[Cache]: clearing cache for slug ${req.query[key]} using redis pattern *slug:${req.query[key]}, found ${keys.length} items in cache`
						)
						keys.forEach(function (key) {
							pipeline.del(key.replace(process.env.REDIS_PREFIX, ""))
						})
						await pipeline.exec()
					} else {
						console.log(
							`[Cache]: No cache found for slug ${req.query[key]} using redis pattern *slug:${req.query[key]}`
						)
					}
				}
			}
		}

		if (req.query.invalidate === "bundles") {
			for (let key in req.query) {
				if (key.startsWith("bundles")) {
					const keys = await redis.keys(`*bundle:${req.query[key]}*`)
					if (keys.length > 0) {
						console.log(
							`[Cache]: clearing cache for bundle ${req.query[key]} using redis pattern *bundle:${req.query[key]}*, found ${keys.length} items in cache`
						)
						keys.forEach(function (key) {
							pipeline.del(key.replace(process.env.REDIS_PREFIX, ""))
						})
						await pipeline.exec()
					} else {
						console.log(
							`[Cache]: No cache found for bundle ${req.query[key]} using redis pattern *bundle:${req.query[key]}*`
						)
					}
				}
			}
		}

		if (req.query.invalidate === "router" && req?.query?.slug) {
			const keys = await redis.keys(`*router:${req.query.slug}*`)
			if (keys.length > 0) {
				console.log(
					`[Cache]: clearing cache for route ${req.query.slug} using redis pattern *router:${req.query.slug}*, found ${keys.length} items in cache`
				)
				keys.forEach(function (key) {
					pipeline.del(key.replace(process.env.REDIS_PREFIX, ""))
				})
				await pipeline.exec()
			} else {
				console.log(
					`[Cache]: No cache found for route ${req.query.slug} using redis pattern *route:${req.query.slug}*`
				)
			}
		}

		if (req.query.invalidate === "redirections") {
			redis.del("__REDIRECTS")
		}
	} else {
		console.log(`[Cache]: received command to clear all caches`)
		await redis.flushdb()
	}

	res.status(200).json({ status: "Cache cleared" })
}
