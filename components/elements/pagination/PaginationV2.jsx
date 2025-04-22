import { useI18n } from "@vactorynext/core/hooks"
import { pagination } from "./theme"
import { Icon } from "@/ui"
import { getUrl, vclsx } from "@vactorynext/core/utils"

const scrollingHelper = (elementRef, yOffset = 100) => {
	if (elementRef?.current) {
		const y =
			elementRef?.current.getBoundingClientRect().top + window.pageYOffset - yOffset
		window.scrollTo({ top: y, behavior: "smooth" })
	}
}

export const PaginationV2 = (props) => {
	const {
		contentRef,
		total,
		pageSize,
		pagerNumber = 4,
		current,
		onChange,
		variant = "v2",
		previousArrow,
		nextArrow,
		baseUrl = "#.",
		isLoading,
		id,
	} = props
	const { t } = useI18n()
	const count = Math.ceil(total / pageSize)
	const buttons =
		current <= pagerNumber - 1
			? Array(count)
					.fill()
					.map((_, i) => i + 1)
					.slice(0, pagerNumber)
			: current >= count - 2
				? Array(count)
						.fill()
						.map((_, i) => i + 1)
						.slice(-pagerNumber)
				: [current - 1, current, current + 1]

	return (
		<nav className={pagination[variant].wrapper} id={id}>
			<div className="flex lg:gap-3">
				<a
					href={getUrl(baseUrl, 1)}
					onClick={(e) => {
						e.preventDefault()
						if (current - 1 < 1) {
							return
						}
						isLoading && scrollingHelper(contentRef)

						onChange(1)
					}}
					className={vclsx(
						pagination[variant].arrow.base,
						current - 1 < 1 && pagination[variant].arrow.disabled
					)}
					title={t("Nx:To first page")}
					id={`${id}-first-page`}
					aria-label={`${t("Nx:Go to page")} ${1}`}
				>
					{previousArrow ? (
						previousArrow
					) : (
						<>
							<Icon
								id="double-chevron-left"
								className={vclsx(pagination[variant].arrow.icon)}
							/>
							<span className="sr-only">{t("Nx:To first page")}</span>
						</>
					)}
				</a>
				<a
					href={current - 1 < 1 ? getUrl(baseUrl, current) : getUrl(baseUrl, current - 1)}
					onClick={(e) => {
						e.preventDefault()
						if (current - 1 < 1) {
							return
						}
						isLoading && scrollingHelper(contentRef)

						onChange(current - 1)
					}}
					className={vclsx(
						pagination[variant].arrow.base,
						current - 1 < 1 && pagination[variant].arrow.disabled
					)}
					title={t("Nx:Previous")}
					id={`${id}-previous`}
					aria-label={`${t("Nx:Go to page")} ${current - 1 < 1 ? 1 : current - 1}`}
				>
					{previousArrow ? (
						previousArrow
					) : (
						<>
							<Icon
								id={"chevron-left"}
								className={vclsx(pagination[variant].arrow.icon)}
							/>
							<span className="sr-only">{t("Nx:Previous")}</span>
						</>
					)}
				</a>
			</div>

			<div className={vclsx(pagination[variant].pager.wrapper)}>
				{buttons[0] !== 1 && (
					<>
						<a
							onClick={(e) => {
								e.preventDefault()
								scrollingHelper(contentRef)
								onChange(1)
							}}
							className={vclsx(
								pagination[variant].pager.base,
								pagination[variant].pager.no_active
							)}
							href={getUrl(baseUrl, 1)}
							id={`${id}-page-1`}
							aria-label={`${t("Nx:Go to page")} ${1}`}
						>
							1
						</a>
						{count > 5 ? <p>...</p> : null}
					</>
				)}

				{buttons.map((button) => {
					return (
						<a
							key={button}
							onClick={(e) => {
								e.preventDefault()
								scrollingHelper(contentRef)
								onChange(button)
							}}
							className={vclsx(
								pagination[variant].pager.base,
								button === current
									? pagination[variant].pager.active
									: pagination[variant].pager.no_active
							)}
							href={getUrl(baseUrl, button)}
							id={`${id}-page-${button}`}
							aria-label={`${t("Nx:Go to page")} ${button}`}
						>
							{button}
						</a>
					)
				})}

				{buttons[buttons.length - 1] !== count && (
					<>
						{count > 5 ? <p>...</p> : null}
						<a
							onClick={(e) => {
								e.preventDefault()
								scrollingHelper(contentRef)
								onChange(count)
							}}
							className={vclsx(
								pagination[variant].pager.base,
								pagination[variant].pager.no_active
							)}
							href={getUrl(baseUrl, count)}
							id={`${id}-page-${count}`}
							aria-label={`${t("Nx:Go to page")} ${count}`}
						>
							{count}
						</a>
					</>
				)}
			</div>
			<div className="flex lg:gap-3">
				<a
					href={
						current + 1 > count ? getUrl(baseUrl, current) : getUrl(baseUrl, current + 1)
					}
					onClick={(e) => {
						e.preventDefault()
						if (current + 1 > count) {
							return
						}
						scrollingHelper(contentRef)
						onChange(current + 1)
					}}
					className={vclsx(
						pagination[variant].arrow.base,
						current + 1 > count && pagination[variant].arrow.disabled
					)}
					title={t("Nx:Next")}
					id={`${id}-next`}
					aria-label={`${t("Nx:Go to page")} ${
						current + 1 > count ? current : current + 1
					}`}
				>
					{nextArrow ? (
						nextArrow
					) : (
						<>
							<span className="sr-only">{t("Nx:Next")}</span>
							<Icon
								id={"chevron-right"}
								className={vclsx(pagination[variant].arrow.icon)}
							/>
						</>
					)}
				</a>
				<a
					href={getUrl(baseUrl, count)}
					onClick={(e) => {
						e.preventDefault()
						if (current + 1 > count) {
							return
						}
						scrollingHelper(contentRef)
						onChange(count)
					}}
					className={vclsx(
						pagination[variant].arrow.base,
						current + 1 > count && pagination[variant].arrow.disabled
					)}
					title={t("Nx:To last page")}
					id={`${id}-last-page`}
					aria-label={`${t("Nx:Go to page")} ${count}`}
				>
					{nextArrow ? (
						nextArrow
					) : (
						<>
							<span className="sr-only">{t("Nx:To last page")}</span>
							<Icon
								id="double-chevron-right"
								className={vclsx(pagination[variant].arrow.icon)}
							/>
						</>
					)}
				</a>
			</div>
		</nav>
	)
}
