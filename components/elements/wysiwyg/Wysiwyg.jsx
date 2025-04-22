// import { Element } from "domhandler/lib/node"
import parse, { domToReact } from "html-react-parser"
import PropTypes from "prop-types"
import { useState } from "react"
import { useMedia } from "@vactorynext/core/hooks"

import { vclsx } from "@vactorynext/core/utils"

import { Heading } from "../heading/Heading"
import { Image } from "../image/Image"
import { Link } from "../link/Link"
import { Text } from "../text/Text"

export function Wysiwyg({ html, as, prose, className, textVariant, ...rest }) {
	// usecase: Wysiwyg inside of p ==> wrong dom nesting
	const AsComponent = as ?? "div"

	// prose should be optional. e.g, form valadiation messages are not prose
	const finalClassName = vclsx(prose && "prose", className)

	const options = {
		replace: (domNode) => {
			if (domNode.name === "img") {
				let ImgComponent = () => {
					const { src, alt = "", "data-align": dataAlign = "" } = domNode.attribs
					const [width, setWidth] = useState("auto")
					const [height, setHeight] = useState("0")
					const isDesktop = useMedia("(min-width: 768px)")

					/* Height and Width explaination in this scenario: */
					// Desktop: if the image IS positioned "left, right", it'll get half the width as max-width and half the height, and if it IS NOT positioned, it'll get their original height and original width as max-width
					// Mobile: images will have their original height & a max-width of 100% to take the full container's width

					return (
						<span
							style={{
								display: "block",
								position: "relative",
								height: isDesktop
									? dataAlign === "" || dataAlign === "center"
										? height
										: height / 2
									: height,
								maxWidth: isDesktop
									? dataAlign === "" || dataAlign === "center"
										? width
										: width / 2
									: width,
							}}
							className={vclsx(
								dataAlign == "left"
									? "float-left mb-4 mr-4 w-full"
									: dataAlign == "right"
										? "float-right mb-4 ml-4 w-full"
										: dataAlign == "center"
											? "mx-auto block w-full"
											: ""
							)}
						>
							<Image
								src={`/api/proxy${src}`}
								alt={alt}
								fill
								onLoad={({ target }) => {
									const { naturalWidth, naturalHeight } = target
									setWidth(naturalWidth)
									setHeight(naturalHeight)
								}}
							/>
						</span>
					)
				}
				return <ImgComponent />
			}

			const headings = ["h1", "h2", "h3", "h4", "h5", "h6"]
			if (headings.includes(domNode.name)) {
				for (let i = 1; i <= 6; i++) {
					if (domNode.name == "h" + i) {
						return <Heading level={i}>{domToReact(domNode.children)}</Heading>
					}
				}
			}

			if (domNode.name === "ul" || domNode.name === "ol") {
				const className = domNode.attribs.class ? domNode.attribs.class : "custom-list"
				return <ul className={vclsx(className)}>{domToReact(domNode.children)}</ul>
			}

			if (domNode.name == "p" && typeof domNode?.children == "string") {
				return (
					<Text as="p" variant={textVariant}>
						{domToReact(domNode.children)}
					</Text>
				)
			}

			if (domNode.name === "a") {
				const { href, class: className, id, rel, target, title } = domNode.attribs
				if (!href.includes("/sites/default/files")) {
					return (
						<Link
							href={href}
							className={className}
							id={id}
							rel={rel}
							target={target}
							title={title}
							aria-label={target === "_blank" ? `${title} (opens in a new tab)` : title}
						>
							{domToReact(domNode.children)}
						</Link>
					)
				}
			}

			if (domNode.name === "iframe") {
				const { src } = domNode.attribs
				if (src.includes("media/oembed")) {
					let video_id = ""
					if (src.includes("youtube.com/watch")) {
						video_id = src.split("%3Fv%3D")[1].split("%26")[0]
					} else {
						let regExp =
							/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
						video_id = src.match(regExp)[7]
					}

					const url = `https://www.youtube.com/embed/${video_id}?enablejsapi=1&rel=0&showinfo=0&controls=1&autoplay=0`
					return (
						<iframe
							className="content-media__object"
							id="featured-video"
							src={url}
							title={video_id}
						></iframe>
					)
				}
			}
		},
	}

	return html ? (
		<AsComponent className={finalClassName} {...rest}>
			{parse(html.toString(), options)}
		</AsComponent>
	) : null
}

Wysiwyg.propTypes = {
	prose: PropTypes.bool,
	as: PropTypes.element,
}
