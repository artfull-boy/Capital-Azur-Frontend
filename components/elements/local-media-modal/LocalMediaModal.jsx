import { Transition } from "@headlessui/react"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import YouTube from "react-youtube"
import { Text } from "../text/Text"
import { Image } from "../image/Image"
import { vclsx } from "@vactorynext/core/utils"

// const youtube_parser = (url) => {
// 	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
// 	var match = url.match(regExp)
// 	return match && match[7].length == 11 ? match[7] : false
// }

export const LocalMediaModal = forwardRef(
	({ sourceId, closeIcon, type = "video" }, ref) => {
		const [isOpen, setIsOpen] = useState(false)
		useImperativeHandle(ref, () => ({
			open: () => {
				setIsOpen(true)
			},
		}))

		const opts = {
			playerVars: {
				autoplay: 1,
				rel: 0,
			},
		}

		useEffect(() => {
			document.addEventListener("keyup", (e) => {
				if (e.key === "Escape") {
					setIsOpen(false)
				}
			})
		}, [isOpen])

		return (
			<>
				<Transition
					show={isOpen}
					enter="transition-opacity duration-75"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity duration-150"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					className={vclsx(
						"fixed z-[1000] flex items-center justify-center transition",
						"inset-0 p-5 lg:px-40 xxl:px-64"
					)}
				>
					<Transition.Child
						show={isOpen}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
						className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
						onClick={() => {
							setIsOpen(false)
						}}
					></Transition.Child>
					<Transition.Child
						show={isOpen}
						enter="transition-opacity ease-linear duration-600"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
						className="relative flex-1 rounded-lg bg-black shadow-xl transition"
					>
						<div className="group">
							<div className="absolute bottom-full z-50 mb-1 ltr:right-0 rtl:left-0">
								<button
									onClick={(e) => {
										e.stopPropagation()
										setIsOpen(false)
									}}
									type="button"
									className="rounded-md bg-black bg-opacity-50 p-2 text-white hover:text-primary-300"
								>
									<Text as="span" className="sr-only">
										Close
									</Text>
									{closeIcon}
								</button>
							</div>
							<div
								className={vclsx(
									"overflow-hidden",
									"aspect-h-9 aspect-w-16 isolate rounded-lg "
								)}
							>
								{type === "video" ? (
									<YouTube
										id={sourceId}
										opts={opts}
										videoId={sourceId}
										iframeClassName="w-full h-full"
										className="absolute bottom-0 left-0 top-0 my-auto h-full w-full"
									/>
								) : (
									<Image
										src={sourceId?.uri?.value?._default}
										alt={sourceId?.meta?.alt}
										width={sourceId?.meta?.width}
										height={sourceId?.meta?.height}
									/>
								)}
							</div>
						</div>
					</Transition.Child>
				</Transition>
			</>
		)
	}
)
