import React, { Fragment, useState, useRef, useEffect } from "react"
import { useI18n, useAccount, useNode } from "@vactorynext/core/hooks"
import { useForm } from "react-hook-form"
import dynamic from "next/dynamic"
import { Button, Input, Icon, Wysiwyg } from "@/ui"
import { Dialog, Transition } from "@headlessui/react"
import { useInViewport } from "react-in-viewport"
import get from "lodash.get"
import { useFlag } from "@vactory/console/client"
import { toast } from "react-toastify"

const ReCaptcha = dynamic(() => import("react-google-recaptcha"), {
	ssr: false,
})

export const config = {
	id: "vactory_decoupled_espace_prive:lost-password",
}

const AccountLostPasswordWidget = ({ data }) => {
	const title = get(data, "components.0.title", null)
	const description = get(data, "components.0.intro.value.#text", null)
	const [recaptchaNeeded, setRecaptchaNeeded] = useState(false)
	const myRef = useRef()
	const { inViewport } = useInViewport(myRef)
	const { t, activeLocale } = useI18n()
	const { isAuthenticated, resetUserPassword } = useAccount()
	const [loading, setLoading] = useState(false)
	const [isModalOpen, setModalOpen] = useState(false)

	const node = useNode()
	const recaptchaRef = React.createRef()
	const recaptchaSiteKey = useFlag("captchaSiteKey")
	const {
		register,
		handleSubmit,
		setValue,
		clearErrors,
		setError,
		formState: { errors },
	} = useForm()

	useEffect(() => {
		if (inViewport && !recaptchaNeeded) {
			setRecaptchaNeeded(true)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inViewport])

	// When rendering client side don't display anything until loading is complete
	if (isAuthenticated || typeof window === "undefined") {
		return null
	}

	const onSubmit = async (input) => {
		setLoading(true)
		const toastId = toast.loading("Loading...")
		try {
			await resetUserPassword({
				data: {
					type: "user--password-reset",
					attributes: {
						mail: input.email,
					},
				},
			})
			setLoading(false)
			toast.dismiss(toastId)
			setModalOpen(true)
		} catch (err) {
			toast.dismiss(toastId)
			toast.error(t("Nx:Une erreur s'est produite"))
			console.error(err)
		}
	}

	return (
		<div className="relative px-4 sm:px-6 lg:px-8">
			{(title || description) && (
				<div className="mb-6">
					{title && (
						<h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
							{title}
						</h2>
					)}
					{description && (
						<div className="mx-auto mt-3 sm:mt-4">
							<Wysiwyg html={description} />
						</div>
					)}
				</div>
			)}
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
			>
				<input
					name="csrfToken"
					{...register("csrfToken")}
					type="hidden"
					defaultValue={node?.csrfTokenAuth}
				/>
				<div className="mb-4">
					<label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="email">
						E-mail
					</label>
					<Input
						type="text"
						name="email"
						id="email"
						autoComplete="email"
						placeholder="Saisissez votre adresse mail."
						{...register("email", { required: "Email is required" })}
						hasError={errors.email}
						errorMessage={errors?.email?.message}
					/>
				</div>
				<div className="relative my-4 flex flex-col items-end" ref={myRef}>
					<input
						type="hidden"
						name="recaptchaResponse"
						{...register("recaptchaResponse", { required: "Robot check required" })}
					/>
					{recaptchaNeeded && (
						<ReCaptcha
							sitekey={recaptchaSiteKey}
							hl={activeLocale}
							ref={recaptchaRef}
							onChange={(val) => {
								setValue("recaptchaResponse", val)
								clearErrors("recaptchaResponse")
							}}
							onExpired={() => {
								setValue("recaptchaResponse", null)
								setError("recaptchaResponse", {
									type: "manual",
									message: "Recaptcha Expired!",
								})
							}}
							onErrored={() => {
								setError("recaptchaResponse", {
									type: "manual",
									message: "Recaptcha Error!",
								})
							}}
						/>
					)}
					{errors.recaptchaResponse && (
						<p className="mt-2 text-sm text-error-600">
							{errors.recaptchaResponse.message}
						</p>
					)}
				</div>
				<div className="flex items-center justify-between">
					<Button type="submit" disabled={loading}>
						{t("Nx:Submit")}
					</Button>
				</div>
			</form>
			<Modal open={isModalOpen} setOpen={setModalOpen} />
		</div>
	)
}

const Modal = ({ open, setOpen }) => {
	const { t } = useI18n()
	// const router = useRouter()
	// const [redirect, setRedirect] = useState(false)
	const closeModal = () => {
		setOpen(false)
		// setRedirect(true)
	}

	// useUpdateEffect(() => {
	// 	router.push(`/${router.locale}`)
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [redirect])

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setOpen}>
				<div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span
						className="hidden sm:inline-block sm:h-screen sm:align-middle"
						aria-hidden="true"
					>
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
							<div>
								<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-100">
									<Icon
										id="check"
										className="h-6 w-6 text-success-600"
										aria-hidden="true"
									/>
								</div>
								<div className="mt-3 text-center sm:mt-5">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900"
									>
										{t("Nx:Password reset")}
									</Dialog.Title>
									<div className="mt-2">
										<p className="text-sm text-gray-500">
											{t(
												"Nx:If the provided email corresponds to a valid account, you will receive an email containing instructions to reset your password."
											)}
										</p>
									</div>
								</div>
							</div>
							<div className="mt-5 sm:mt-6">
								<button
									type="button"
									className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:text-sm"
									onClick={closeModal}
								>
									{t("Nx:Close")}
								</button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

export default AccountLostPasswordWidget
