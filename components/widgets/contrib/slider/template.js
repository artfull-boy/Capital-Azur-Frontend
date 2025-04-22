import React from "react"
import { Heading } from "@vactory/ui/heading"

export const Template = () => {
	// isActive to show layer or div
	return (
		<div className="h-[100px]  w-[200px] bg-white">
			<Heading
				level={2}
				className="mb-3 ml-8 text-left before:text-primary-500 before:content-['-__']"
			>
				{/* item.title  */} template Example
			</Heading>
		</div>
	)
}
