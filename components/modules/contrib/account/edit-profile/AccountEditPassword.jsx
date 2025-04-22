import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useI18n, useAccount, useNode } from "@vactorynext/core/hooks"
import { useRouter } from "next/router"
import { drupal } from "@vactorynext/core/drupal"
import { signOut } from "next-auth/react"
import { toast } from "react-toastify"

const errorFields = {
	"/data/attributes/pass": "current_password",
}

const EditProfilePasswordPage = ({ account }) => {
	const { t } = useI18n()
	const currentUser = account
	const router = useRouter()
	const locale = router.locale
	const { csrfToken } = useNode()
	const [loading, setLoading] = useState(false)
	const { loginUrl } = useAccount()

	const {
		register,
		handleSubmit,
		setError,
		watch,
		formState: { errors },
	} = useForm()

	const onSubmit = async (input) => {
		setLoading(true)
		const toastId = toast.loading("Loading...")

		try {
			const response = await drupal.fetch(`${locale}/api/user/user/${currentUser.id}`, {
				withAuth: true,
				method: "PATCH",
				headers: {
					"X-CSRF-Token": csrfToken,
				},
				body: JSON.stringify({
					data: {
						id: currentUser.id,
						type: `user--user`,
						attributes: {
							pass: {
								value: input.new_password,
								existing: input.current_password,
							},
						},
					},
				}),
			})
			const data = await response.json()
			if (response.ok) {
				await signOut({ callbackUrl: loginUrl })
			} else {
				const errors = data?.errors || []
				errors.forEach((item) => {
					const field = errorFields[item?.source?.pointer] || undefined
					if (field) {
						setError(field, {
							type: "manual",
							message: item.detail,
						})
					} else {
						console.warn(item)
					}
				})
			}
			setLoading(false)
			toast.dismiss(toastId)
		} catch (err) {
			setLoading(false)
			toast.dismiss(toastId)
			toast.error(t("Une erreur s'est produite"))
			console.error(err)
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<input
				name="csrfToken"
				{...register("csrfToken")}
				type="hidden"
				defaultValue={csrfToken}
			/>
			<div className="shadow sm:overflow-hidden sm:rounded-md">
				<div className="space-y-6 bg-white px-4 py-6 sm:p-6">
					<div>
						<h3 className="text-lg font-medium leading-6 text-gray-900">Password</h3>
						<p className="mt-1 text-sm text-gray-500">Update you password.</p>
					</div>

					<div className="grid grid-cols-6 gap-6">
						<div className="col-span-6 sm:col-span-3">
							<label
								htmlFor="current-password"
								className="block text-sm font-medium text-gray-700"
							>
								Current Password
							</label>
							<input
								type="password"
								name="current-password"
								id="current-password"
								autoComplete="given-name"
								className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
								{...register("current_password", {
									required: "Current password is required",
								})}
							/>
							{errors.current_password && (
								<p className="text-red text-xs italic">
									{errors.current_password.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-6 gap-6">
						<div className="col-span-6 sm:col-span-3">
							<label
								htmlFor="new-password"
								className="block text-sm font-medium text-gray-700"
							>
								New Password
							</label>
							<input
								type="password"
								name="new-password"
								id="new-password"
								autoComplete="given-name"
								className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
								{...register("new_password", {
									required: "New password is required",
								})}
							/>
							{errors.new_password && (
								<p className="text-red text-xs italic">{errors.new_password.message}</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-6 gap-6">
						<div className="col-span-6 sm:col-span-3">
							<label
								htmlFor="confirm-password"
								className="block text-sm font-medium text-gray-700"
							>
								Confirm Password
							</label>
							<input
								type="password"
								name="confirm-password"
								id="confirm-password"
								autoComplete="given-name"
								className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
								{...register("confirm_password", {
									required: "Confirm password is required",
									validate: (value) =>
										value === watch("new_password") || "Le mot de passe est invalide.",
								})}
							/>
							{errors.confirm_password && (
								<p className="text-red text-xs italic">
									{errors.confirm_password.message}
								</p>
							)}
						</div>
					</div>
				</div>
				<div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
					<button
						type="submit"
						disabled={loading}
						className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
					>
						Save
					</button>
				</div>
			</div>
		</form>
	)
}

export default EditProfilePasswordPage
