/**
 * PLEASE DO NOT USE THIS COMPONENT
 */
/* eslint-disable */
import { render } from "nprogress"
import React, { useRef, useState } from "react"
import { useForm, Controller } from "react-hook-form"

import { Input } from "@vactory/ui/input"
import { Select } from "@vactory/ui/select"
import { Icon } from "@vactory/ui/icon"
import { Tooltip } from "@vactory/ui/tooltip"
import { Button } from "@vactory/ui/button"

const roles = [
	{
		value: "admin",
		content: "Adminaaaaaaaa",
	},
	{
		value: "user",
		content: "User",
	},
	{
		value: "manager",
		content: "Manager",
	},
]

const cities = [
	{
		value: "casablanca",
		content: "Casablanca",
	},
	{
		value: "agadir",
		content: "Agadir",
	},
	{
		value: "rabat",
		content: "Rabat",
	},
]

export const InlineForm = () => {
	const { register, handleSubmit, control } = useForm()
	const handleFormSubmit = (data) => {
		console.log(data)
	}
	return (
		<div className="mx-auto my-24 max-w-screen-sm">
			<form className="flex space-x-4" onSubmit={handleSubmit(handleFormSubmit)}>
				<Input
					variant="inline"
					label="Identifiant :"
					prefix={<Icon id="user" className="h-4 w-4"></Icon>}
					sufix={
						<Tooltip
							size="xsmall"
							text="this the info about this input"
							position="topCenter"
						>
							<Icon id="information-circle" className="h-4 w-4" />
						</Tooltip>
					}
					register={register("identifiant")}
					placeholder="Saisir votre identifiant ..."
					addonBefore={
						<Controller
							control={control}
							name="city"
							register={register("city")}
							render={({ field: { onChange, onBlur, value } }) => (
								<Select
									variant="inputAddon"
									onChange={onChange}
									onBlur={onBlur}
									checked={value}
									list={cities}
								/>
							)}
						/>
					}
				/>

				<Button type="submit" variant="primary" className="rounded-md px-8">
					Submit
				</Button>
			</form>
		</div>
	)
}

export default InlineForm
