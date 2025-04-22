/* eslint-disable @next/next/no-img-element */
import React from "react"

import { vclsx } from "@vactorynext/core/utils"

import { Image } from "../image/Image"
import { avatar } from "./theme"

const DEFAULT_AVATAR_IMAGE =
	"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"

export const Avatar = ({
	children,
	className = "",
	variant = "default",
	size = "normal",
	alt = "",
	src = DEFAULT_AVATAR_IMAGE,
	...rest
}) => {
	// textSizes
	if (variant === "placeholder") {
		return (
			<div
				className={vclsx(avatar[variant].base, avatar.size[size], className)}
				{...rest}
			>
				<svg className={avatar[variant].svg} fill="currentColor" viewBox="0 0 24 24">
					<path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
				</svg>
			</div>
		)
	} else if (variant === "default") {
		return (
			<Image
				className={vclsx(avatar[variant].base, avatar.size[size], className)}
				src={src}
				alt={alt}
				width={100}
				height={100}
				{...rest}
			/>
		)
	} else if (variant === "initials") {
		return (
			<span
				className={vclsx(avatar[variant].base, avatar.size[size], className)}
				{...rest}
			>
				<span className={vclsx(avatar[variant].text, avatar[variant].textSizes[size])}>
					{children}
				</span>
			</span>
		)
	}
}
