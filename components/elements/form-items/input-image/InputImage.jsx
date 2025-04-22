import React, { useRef, useState } from "react"
import { Icon } from "@/ui"
import { handleImageInputChange, openGallery, resetInput } from "@vactorynext/core/utils"

export const InputImage = () => {
	const [selectedImage, setSelectedImage] = useState(null)
	const inputRef = useRef()

	return (
		<div className="mb-4">
			<input
				ref={inputRef}
				onChange={(e) => handleImageInputChange(e, setSelectedImage)}
				type="file"
				name="image"
				className="buttom-0 absolute h-0 w-0 overflow-hidden"
			/>
			<div
				style={{
					backgroundImage: `url(${selectedImage})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
				onClick={() => {
					inputRef.current.click()
				}}
				onKeyDown={(e) => {
					e.key === "Enter" && inputRef.current.click()
				}}
				role="button"
				tabIndex={0}
				className="relative h-24 w-24 cursor-pointer rounded-full bg-gray-300"
			>
				{selectedImage === null ? (
					<>
						<div className="flex h-full w-full items-center justify-center p-1">
							<Icon id="upload" className="h-8 w-8 text-gray-400"></Icon>
						</div>
						<button
							className="absolute bottom-1 right-0 h-7 w-7 rounded-full border-2 border-white bg-gray-700 p-1"
							onClick={(e) => openGallery(e, inputRef)}
						>
							<Icon id="plus" className="h-full w-full text-white"></Icon>
						</button>
					</>
				) : (
					<button
						className="absolute bottom-1 right-0 z-10 h-7 w-7 rounded-full border-2 border-white bg-error-600 bg-gray-700 p-1"
						onClick={(e) => resetInput(e, setSelectedImage)}
					>
						<Icon id="trash" className="h-full w-full text-white"></Icon>
					</button>
				)}
			</div>
		</div>
	)
}
