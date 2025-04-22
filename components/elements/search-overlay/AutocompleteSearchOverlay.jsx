import { Fragment } from "react"
import { useI18n } from "@vactorynext/core/hooks"
import { Icon, AutocompleteApi, Button } from "@/ui"
import { Transition } from "@headlessui/react"
import { useRouter } from "next/router"
import { SYSTEM_ROUTES } from "@vactorynext/core/lib"
import { useForm } from "react-hook-form"

export const AutocompleteSearchOverlay = ({ onClose, show }) => {
	const { t } = useI18n()
	const router = useRouter()
	const locale = router.locale
	const {
		handleSubmit,
		register,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: {
			keyword: "",
		},
	})

	const onSubmit = (data) => {
		router.push({
			pathname: `${SYSTEM_ROUTES.search.path}`,
			query: { q: data?.keyword },
		})
	}

	return (
		<Transition
			as={Fragment}
			show={show}
			enter="transition-opacity duration-800"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition-opacity duration-800"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div className="fixed left-0 top-0 z-[95] h-screen w-screen bg-gray-500">
				<div className="flex  h-full w-full items-center justify-center px-12">
					<Button
						className="absolute right-8 top-8 border-0 bg-transparent text-black hover:bg-transparent"
						onClick={() => {
							onClose()
						}}
					>
						<Icon id="x" className="h-12 w-12 text-white"></Icon>
					</Button>
					<form
						className="mx-auto w-full max-w-screen-md"
						onSubmit={handleSubmit(onSubmit)}
					>
						<AutocompleteApi
							{...register("keyword", {})}
							endpoint={`${locale}/search_api_autocomplete/vactory_search`}
							hasError={errors?.keyword}
							control={control}
							placeholder={t("Nx:What are you searching for ?")}
							queryName="q"
							keyValue="value"
							minLength="3"
							errorMessage={errors?.keyword?.message}
							label={t("Nx:What are you searching for ?")}
						/>
						<Button type="submit" variant="primary" className="mt-2">
							{t("Nx:Submit")}
						</Button>
					</form>
				</div>
			</div>
		</Transition>
	)
}
