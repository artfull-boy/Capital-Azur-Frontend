/* import React from "react"
import { Form, RenderField } from "../components"
import { Button } from "@/ui"

// eslint-disable-next-line
export default {
	title: "Modules/Webform",
}

const schema = {
	name: {
		type: "text",
		label: "Name",
		placeholder: "Name",
	},
}

export const LayerForm = () => {
	const [showLayerForm, setShowLayerForm] = React.useState(false)
	const [showSuccessModal, setShowSuccessModal] = React.useState(false)

	const Render = (resetForm, isLoading, isSuccess) => {
		React.useEffect(() => {
			if (isSuccess) {
				setShowLayerForm(false)
				setShowSuccessModal(true)
			}
		}, [isSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

		return (
			<div>
				<RenderField
					field={[
						"name",
						{
							...schema.name,
							label: null,
						},
					]}
				/>

				<div>
					<Button type="submit" disabled={isLoading}>
						Submit
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div>
			<Button
				type="button"
				borderRadius="rounded"
				outline="primary"
				onClick={() => setShowLayerForm(true)}
			>
				Open form
			</Button>

			{showLayerForm && (
				<div onClickOutside={() => setShowLayerForm(false)}>
					<div
						p="medium"
						boxShadow={4}
						flexDirection="column"
						bg="white"
						borderRadius="small"
						maxWidth="400px"
						minWidth="400px"
					>
						<Form
							webformId={"test_form"}
							handleSubmitRedirection={false}
							schema={schema}
							render={Render}
						/>
					</div>
				</div>
			)}

			{showSuccessModal && (
				<div onClickOutside={() => setShowSuccessModal(false)}>
					<div>
						<div>
							<p>Thank you for filling our form</p>
						</div>
						<div className="mt-5">
							<Button variant="danger" onClick={() => setShowSuccessModal(false)}>
								Close
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
 */
