import React, { useEffect, useState, useRef } from "react"
import get from "lodash.get"
import { signIn } from "next-auth/react"
import { useI18n, useNode } from "@vactorynext/core/hooks"
import { useRouter } from "next/router"
import { useForm, FormProvider } from "react-hook-form"
import { Button, Icon, Link, Input, InputPassword, Wysiwyg } from "@/ui"
import { SYSTEM_ROUTES } from "@vactorynext/core/lib"
import dynamic from "next/dynamic"
import { useInViewport } from "react-in-viewport"
import { useFlag } from "@vactory/console/client"

const ReCaptcha = dynamic(() => import("react-google-recaptcha"), {
	ssr: false,
})

export const config = {
	id: "vactory_decoupled_espace_prive:signin",
	lazy: true,
}

export const AccountLoginWidget = ({ data }) => {
	const title = get(data, "components.0.title", null)
	const description = get(data, "components.0.intro.value.#text", null)

	const [recaptchaNeeded, setRecaptchaNeeded] = useState(false)
	const myRef = useRef()
	const { inViewport } = useInViewport(myRef)
	const router = useRouter()
	const { locale } = router
	const callbackUrl = router?.query?.callbackUrl || `/${locale}`
	const { t, activeLocale } = useI18n()
	const { csrfTokenAuth, providers } = useNode()
	const recaptchaRef = React.createRef()
	const isNewUser = router?.query?.isNew || false
	const isCaptchaEnabled = useFlag("captcha")
	const recaptchaSiteKey = useFlag("captchaSiteKey")
	const methods = useForm()
	const {
		register,
		handleSubmit,
		setError,
		setValue,
		clearErrors,
		formState: { errors },
	} = methods

	useEffect(() => {
		// Prefetch the callback page
		if (router?.query?.callbackUrl) {
			const callbackUrl = router.query.callbackUrl
			const cleanUrl = callbackUrl.endsWith("/") ? callbackUrl.slice(0, -1) : callbackUrl
			router.prefetch(cleanUrl)
		}

		// Prefetch reset password & register page.
		// router.prefetch()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (inViewport && !recaptchaNeeded) {
			setRecaptchaNeeded(true)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inViewport])

	const onSubmit = async (input) => {
		// Trim the input values
		const trimmedInput = {
			...input,
			username: input.username.trim(),
			password: input.password.trim(),
		}
		clearErrors()
		const res = await signIn("credentials", {
			redirect: false,
			callbackUrl,
			...trimmedInput,
		})
		if (res?.error) {
			setError(
				"username",
				{
					type: "manual",
					message: res?.error,
				},
				{
					shouldFocus: true,
				}
			)
		}
		if (res.url) router.push(res.url)
	}

	return (
		<FormProvider {...methods}>
			<div className="flex min-h-full flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
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

				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						{t("Nx:Connectez-vous à votre compte")}
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Ou{" "}
						<Link
							href={`/${locale}${SYSTEM_ROUTES.account_register.path}`}
							className="font-medium text-primary-600 hover:text-primary-500"
						>
							{t("Nx:Créer un nouveau compte")}
						</Link>
					</p>
				</div>

				{isNewUser && <WelcomeNewUser />}

				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
						<form
							method="post"
							onSubmit={handleSubmit(onSubmit)}
							className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
						>
							<input
								name="csrfToken"
								{...register("csrfToken")}
								type="hidden"
								defaultValue={csrfTokenAuth}
							/>
							<div className="relative mb-4">
								<label
									className="mb-2 block text-sm font-bold text-gray-700"
									for="username"
								>
									{t("Nx:E-mail")}
								</label>
								<Input
									type="text"
									name="username"
									id="username"
									autoComplete="email"
									placeholder={t("Nx:Saisissez votre adresse mail.")}
									{...register("username", { required: t("Nx:Email is required") })}
									hasError={errors?.username}
									errorMessage={errors?.username?.message}
								/>
							</div>
							<div className="relative mb-6">
								<label
									className="mb-2 block text-sm font-bold text-gray-700"
									for="password"
								>
									{t("Nx:Password")}
								</label>
								<InputPassword
									type="password"
									name="password"
									id="password"
									placeholder={t("Nx:Saisissez votre mot de passe.")}
									applyValidations={false}
									{...register("password", { required: t("Nx:Email is required") })}
								/>
							</div>
							<div className="relative my-4 flex flex-col items-end" ref={myRef}>
								<input
									type="hidden"
									name="captcha"
									{...register("captcha", {
										required: t("Nx:Robot check required"),
									})}
								/>
								{recaptchaNeeded && isCaptchaEnabled && (
									<ReCaptcha
										sitekey={recaptchaSiteKey}
										hl={activeLocale}
										ref={recaptchaRef}
										onChange={(val) => {
											setValue("captcha", val)
											clearErrors("captcha")
										}}
										onExpired={() => {
											setValue("captcha", null)
											setError("captcha", {
												type: "manual",
												message: t("Nx:Recaptcha Expired!"),
											})
										}}
										onErrored={() => {
											setError("captcha", {
												type: "manual",
												message: t("Nx:Recaptcha Error!"),
											})
										}}
									/>
								)}
								{errors.captcha && (
									<p className="mt-2 text-sm text-error-600">{errors.captcha.message}</p>
								)}
							</div>
							<div className="flex items-center justify-between">
								<div className="text-sm">
									<Link
										href={`/${locale}${SYSTEM_ROUTES.account_lost_password.path}`}
										className="font-medium text-primary-600 hover:text-primary-500"
									>
										{t("Nx:Forgot your password?")}
									</Link>
								</div>
								<div>
									<Button type="submit">{t("Nx:Submit")}</Button>
								</div>
							</div>
						</form>
					</div>
					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-white px-2 text-gray-500">
									{t("Nx:Ou continuer avec")}
								</span>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-3 gap-3">
							{Object.values(providers).map((provider) => (
								<div key={provider.id}>
									<a
										href="#."
										onClick={() => signIn(provider.id)}
										className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
									>
										{/* <span className="sr-only"> */}
										{t("Nx:Sign in with")} {provider.name}
										{/* </span> */}
										{/* <KeyCloakIcon /> */}
									</a>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</FormProvider>
	)
}

const WelcomeNewUser = () => {
	const { t } = useI18n()
	return (
		<div className="rounded-md bg-success-50 p-4">
			<div className="flex">
				<div className="flex-shrink-0">
					<Icon
						id="check-circle"
						className="h-5 w-5 text-success-400"
						aria-hidden="true"
					/>
				</div>
				<div className="ml-3">
					<p className="text-sm font-medium text-success-800">
						{t("Nx:You have successfully signed up, please signin using the form below.")}
					</p>
				</div>
				<div className="ml-auto pl-3">
					<div className="-mx-1.5 -my-1.5">
						<button
							type="button"
							className="inline-flex rounded-md bg-success-50 p-1.5 text-success-500 hover:bg-success-100 focus:outline-none focus:ring-2 focus:ring-success-600 focus:ring-offset-2 focus:ring-offset-success-50"
						>
							<span className="sr-only">Dismiss</span>
							<Icon id="x" className="h-5 w-5" aria-hidden="true" />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AccountLoginWidget
