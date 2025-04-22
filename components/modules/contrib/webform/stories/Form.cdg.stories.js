import React from "react"
import { Form } from "../components"

// eslint-disable-next-line
export default {
	title: "Modules/Webform",
}

export const Inline = () => (
	<Form
		webformId={"contact"}
		schema={{
			nom: {
				type: "text",
				label: "Nom",
				validation: {
					required: true,
					requiredError: 'Le champ "Nom" est requis',
				},
			},
			prenom: {
				type: "text",
				label: "Prénom",
				validation: {
					required: true,
					requiredError: 'Le champ "Prénom" est requis',
				},
			},
			select: {
				type: "select",
				label: "Vous êtes",
				options: [
					{
						value: "",
						label: "Sélectionner",
					},
					{
						value: "Investisseurs institutionnels",
					},
					{
						value: "Investisseurs corporates",
					},
					{
						value: "Investisseurs particuliers",
					},
					{
						value: "_other_",
						label: "Autre...",
					},
				],
				validation: {
					required: true,
					requiredError: 'Le champ "Vous êtes" est requis',
				},
			},
			email: {
				type: "text",
				label: "Adresse email",
				validation: {
					required: true,
					requiredError: "Le champ email est requis",
					pattern: "/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i",
					patternError: "Le mail n'est pas valide",
				},
			},
			phoneNumber: {
				type: "text",
				label: "Téléphone",
				htmlInputType: "tel",
				validation: {
					required: true,
					requiredError: 'Le champ "Téléphone" est requis',
					pattern: "/(\\+212|0)([ \\-_/]*)(\\d[ \\-_/]*){9}/",
					patternError:
						"Le champ 'Téléphone' n'est pas un numéro de téléphone Marocain valide",
				},
			},
			object: {
				type: "text",
				label: "Objet de la demande",
				validation: {
					required: true,
					requiredError: 'Le champ "Objet de la demande" est requis',
				},
			},
			about: {
				type: "textArea",
				label: "Message",
				validation: {
					required: true,
					requiredError: 'Le champ "Objet de la demande" est requis',
				},
			},
			agree: {
				type: "checkbox",
				label:
					"J'ai lu et j'accepte les conditions générales d'utilisation, notamment la mention relative à la protection des données personnelles.",
				validation: {
					required: true,
					requiredError: "Ce champ est requis",
				},
			},
			do_you_agree: {
				type: "radios",
				label: "Do you agree radio",
				validation: {
					required: true,
					requiredError: "Ce champ est requis",
				},
				options: [
					{
						label: "Yes",
						value: "yes",
					},
					{
						label: "No",
						value: "no",
					},
				],
			},

			// documents: {
			// 	type: "upload",
			// 	label: "Documents",
			// 	helperText:
			// 		"N'hésitez pas à joindre à votre dossier de candidature les documents complémentaires, photos, vidéos, et/ou articles de presse, etc. que vous jugez utiles pour illustrer vos réponses.",
			// 	isMultiple: true,
			// 	validation: {
			// 		maxFiles: 10,
			// 		maxSizeBytes: 2097152,
			// 		extensions: ".jpg,.jpeg,.png,.pdf",
			// 	},
			// 	maxSizeMb: 2,
			// 	extensionsClean: "jpg jpeg png pdf",
			// },
			captcha: {
				type: "captcha",
				// label: 'Captcha',
				helperText: "Please check reCaptcha",
				validation: {
					required: true,
					requiredError: "Ce champ est requis",
				},
			},
		}}
		buttons={{
			submit: {
				leftIcon: "floppy-disk",
			},
			reset: {
				hidden: true,
			},
		}}
		styles={{
			submitButton: {
				outline: "primary",
				borderRadius: "rounded",
				width: "100%",
				size: "large",
				justifyContent: "center",
				pt: "10px",
				pb: "10px",
				transition: "all .2s",
			},
			submitButtonLeftIcon: {
				size: "18px",
			},
			formControlLayout: {
				inner: {
					width: "100%",
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "space-between",
					"&&.ui-form__formControlInner_noLabel": {
						ml: ["0px", "33.33%"],
						width: "auto",
					},
				},
				label: {
					flexBasis: ["100%", "33.33%"],
				},
				field: {
					flexGrow: 1,
				},
			},
		}}
	></Form>
)
