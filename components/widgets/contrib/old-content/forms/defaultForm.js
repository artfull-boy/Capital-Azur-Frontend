/**
 * PLEASE DO NOT USE THIS COMPONENT
 */
/* eslint-disable */

import {
	Input,
	InputPassword,
	InputRadio,
	CheckboxInput,
	Button,
	Icon,
	Heading,
	InputFile,
	Tooltip,
} from "@/ui"
import { useForm } from "react-hook-form"

const genders = [
	{ label: "Madame", value: "madame", checked: true },
	{ label: "Monsieur", value: "monsieur", checked: false },
]

export const DefaultForm = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm()

	const onSubmit = (data) => {
		console.log(data)
	}
	return (
		<div className="mx-auto my-24 max-w-screen-sm">
			<div className="mb-12">
				<Heading className="mb-6" level={3}>
					Inscription
				</Heading>
				<p className="text-sm font-light">
					Inscrivez-vous au programme La Boite Rose et profitez de + de 400€ d'avantages
					avec des conseils d'experts personnalisés envoyés par email, des bons plans, des
					offres exclusives, des guides pédagogiques, des échantillons et bien entendu,
					tous vos coffrets de bienvenue !
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="mb-8 flex items-center space-x-6">
					<Input
						hasError={errors.firstName ? true : false}
						errorMessage={errors?.firstName?.message}
						variant="rounded"
						label="Prenom"
						placeholder="Enter your first name"
						prefix={<Icon id="user" className="h-4 w-4 text-gray-500" />}
						register={register("firstName", {
							required: "first name field is required",
						})}
					/>
					<Input
						hasError={errors.lastName ? true : false}
						errorMessage={errors?.lastName?.message}
						variant="rounded"
						label="Nom"
						placeholder="Enter your last name"
						prefix={<Icon id="user" className="h-4 w-4 text-gray-500" />}
						register={register("lastName", {
							required: "last name field is required",
						})}
					/>
				</div>
				<div className="relative mb-8">
					<Input
						hasError={errors.email ? true : false}
						errorMessage={errors?.email?.message}
						variant="rounded"
						label="Email"
						placeholder="Enter your last name"
						prefix={<Icon id="mail" className="h-4 w-4 text-gray-500" />}
						sufix={
							<Tooltip
								size="xsmall"
								text="this the info about this input"
								position="topCenter"
							>
								<Icon id="information-circle" className="h-4 w-4" />
							</Tooltip>
						}
						register={register("email", {
							required: "Email field is required",
							pattern: {
								value:
									/^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/gm,
								message: 'Email must respect this form "email@xyz.com"',
							},
						})}
					/>
				</div>
				<div className="relative mb-8 flex items-center space-x-6">
					<InputPassword
						hasError={errors.password ? true : false}
						errorMessage={errors?.password?.message}
						variant="rounded"
						label="Mot de passe*"
						placeholder="Enter your first name"
						prefix={<Icon id="lock-closed" className="h-4 w-4 text-gray-500" />}
						register={register("password", {
							required: "Password field is required",
						})}
					/>
					<Input
						hasError={errors.cpassword ? true : false}
						errorMessage={errors?.cpassword?.message}
						type="password"
						variant="rounded"
						label="Confirmer le mot de passe"
						placeholder="Confirmer ton mot de pass"
						prefix={<Icon id="link" className="h-4 w-4 text-gray-500" />}
						sufix={
							watch().password === watch().cpassword &&
							watch().cpassword != "" &&
							watch().cpassword && (
								<Icon id="check-circle" className="h-4 w-4 text-success-500 " />
							)
						}
						register={register("cpassword", {
							required: "Password field is required",
						})}
					/>
				</div>
				<div className="relative mb-8">
					<InputRadio
						label="Civilité"
						options={genders}
						register={register("gender")}
					></InputRadio>
				</div>
				<div className="relative">
					<InputFile
						hasError={errors.file ? true : false}
						errorMessage={errors?.file?.message}
						variant="rounded"
						label="Pieces jointe"
						register={register("file", { required: "file field is required" })}
					/>
				</div>
				<div className="my-10">
					<p className="text-sm font-light">
						Je m’inscris au programme de la Boite Rose et demande à recevoir, à mon
						domicile ou par l’intermédiaire d’un professionnel de santé, les coffrets de
						la Boite Rose, ou de ses partenaires, contenant notamment des guides, des
						produits, des échantillons, des cadeaux et des coupons de réduction.
					</p>
				</div>
				<div className="mb-12">
					<CheckboxInput
						register={register("accepted", {
							required: {
								value: true,
								message: "You must accept terms and conditions",
							},
						})}
						label={
							<span className="text-xs font-light">
								J’accepte les conditions générales d’utilisation du site La Boite Rose*
							</span>
						}
					></CheckboxInput>
				</div>
				<Button
					type="submit"
					variant="primary"
					className="rounded-md pr-6"
					icon={<Icon className="rtl-icon h-6 w-12" id="arrow-narrow-right"></Icon>}
				>
					je m'inscris au programme La Boîte Rose
				</Button>
			</form>
		</div>
	)
}

export default DefaultForm
