import React from "react"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { Transition } from "@headlessui/react"

export const ModalMessage = ({ message = "", onClose }) => {
	const { t } = useTranslation()
	const [isOpen, setIsOpen] = React.useState(true)

	return (
		<div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto">
			<div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
				<Transition
					show={isOpen}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					className="fixed inset-0 transition-opacity"
					aria-hidden="true"
				>
					<div className="absolute inset-0 bg-gray-500 opacity-75" />
				</Transition>

				{/* <!-- This element is to trick the browser into centering the modal contents. --> */}
				<span
					className="hidden sm:inline-block sm:h-screen sm:align-middle"
					aria-hidden="true"
				>
					&#8203;
				</span>
				<Transition
					show={isOpen}
					enter="ease-out duration-300"
					enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					enterTo="opacity-100 translate-y-0 sm:scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 translate-y-0 sm:scale-100"
					leaveTo="translate-y-4 sm:translate-y-0 sm:scale-95 opacity-0"
					className={`${
						isOpen ? "inline-block" : "hidden"
					} transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle`}
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-headline"
				>
					<div>{message}</div>
					<div className="mt-5 sm:mt-6">
						<button
							onClick={(e) => {
								onClose(e)
								setIsOpen(false)
							}}
							type="button"
							className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:text-sm"
						>
							{t("Nx:Close")}
						</button>
					</div>
				</Transition>
			</div>
		</div>
	)
}
