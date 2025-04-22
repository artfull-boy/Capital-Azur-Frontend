import { default as NextImage } from "next/image"
import blurredPlaceholderImage from "/public/assets/img/blurred-placeholder-image.png"
import { useTheme } from "next-themes"
import { useUserPreference } from "@vactorynext/core/hooks"
import { useState } from "react"
import { useNode } from "@vactorynext/core/hooks"
import { drupal } from "@vactorynext/core/drupal"
import { toast } from "react-toastify"
import { vclsx } from "@vactorynext/core/utils"
import { useRouter } from "next/router"

export const Image = ({
	src,
	alt,
	quality = 80,
	className = null,
	isAmp = false,
	disablePlaceholder = false,
	styleMode = null,
	type = null,
	sizes = "100vw",
	...rest
}) => {
	const { theme, systemTheme } = useTheme()
	const [imageSrcUpdated, setImageSrcUpdated] = useState(null)
	const { theme: customTheme } = useUserPreference()
	const router = useRouter()
	const locale = router.locale

	const node = useNode()
	let liveMode = null

	// if theme is set, use it, else use custom theme which comes from the getServerSideProps in pages/index.jsx
	// This solution is to prevent the hydration mismatch between server and client since theme variable is always undefined on the server
	let chosenTheme = theme ? (theme === "system" ? systemTheme : theme) : customTheme

	let imageSrc
	if (typeof src === "string") {
		imageSrc = src
	} else if (styleMode) {
		imageSrc = src[styleMode]
	} else if (chosenTheme === "dark") {
		imageSrc = src["dark"]
	} else {
		imageSrc = src["_original"]
	}

	const regex = /{LiveMode\s*id="([^"]+)"}([\s\S]*){\/LiveMode}/i
	const match = imageSrc.match(regex)
	if (match) {
		liveMode = match[1]
		imageSrc = match[2]
	}

	if (!src) {
		return (
			<div className="mx-auto w-full max-w-5xl rounded-xl border-2 border-red-500 bg-red-100 p-6">
				<p className="mb-4 text-xl font-medium text-red-700">
					Image.jsx : Missing `src` prop or empty
				</p>
			</div>
		)
	}

	function getDataAttrValueByElement(element, attr) {
		while (element && element !== document) {
			if (element.hasAttribute(attr)) {
				return element.getAttribute(attr)
			}
			element = element.parentElement
		}
		return null
	}

	const handleDoubleClick = (e) => {
		const fileInput = document.createElement("input")
		fileInput.type = "file"
		fileInput.accept = "image/*"
		fileInput.style.display = "none"

		fileInput.onchange = async (event) => {
			const file = event.target.files[0]
			if (file) {
				const paragraphId = getDataAttrValueByElement(e.target, "data-paragraph-id")
				const nid = getDataAttrValueByElement(e.target, "data-node-id")
				const paragraphTabId = getDataAttrValueByElement(
					e.target,
					"data-paragraph-tab-id"
				)
				const templateDelta = getDataAttrValueByElement(e.target, "data-template-delta")

				const formData = new FormData()
				formData.append("file", file)
				formData.append("id", liveMode)
				formData.append("paragraphId", paragraphId)
				formData.append("nid", nid)
				if (paragraphTabId && templateDelta) {
					formData.append("paragraphTabId", paragraphTabId)
					formData.append("templateDelta", templateDelta)
				}

				const toastId = toast.loading("Saving image...")
				try {
					const token = await drupal.getAccessToken()
					// eslint-disable-next-line
					const response = await fetch(
						`${node._NEXT_PUBLIC_ENV.NEXT_BASE_URL}/api/proxy/${locale}/api/edit_live_mode_image`,
						{
							method: "POST",
							body: formData,
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					)

					if (!response.ok) {
						toast.error("Failed to upload image")
					}

					toast.success("Image has been saved successfully!")

					const reader = new FileReader()
					reader.onload = (e) => {
						setImageSrcUpdated(e.target.result)
						toast.dismiss(toastId)
					}
					reader.readAsDataURL(file)
				} catch (error) {
					toast.dismiss(toastId)
					toast.error("Failed to upload image")
					console.error("Error:", error)
				}
			}
			document.body.removeChild(fileInput)
		}

		fileInput.oncancel = () => {
			document.body.removeChild(fileInput)
		}

		document.body.appendChild(fileInput)
		fileInput.click()
	}

	return (
		<span
			onDoubleClick={liveMode ? handleDoubleClick : null}
			className={vclsx(liveMode ? "border-2 border-dashed border-red-500" : "", "block")}
		>
			{isAmp ? (
				<amp-img
					src={imageSrcUpdated || imageSrc}
					alt={alt}
					className={className}
					layout="responsive"
					{...rest}
				/>
			) : (
				<NextImage
					src={imageSrcUpdated || imageSrc}
					alt={alt}
					quality={quality}
					className={className}
					blurDataURL={blurredPlaceholderImage.src}
					/* Show/Hide placeholder Image depends on "disablePlaceholder" value */
					placeholder={disablePlaceholder ? "empty" : "blur"}
					sizes={
						type === "card"
							? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, calc((1300px / 3))"
							: sizes
					}
					{...rest}
				/>
			)}
		</span>
	)
}
