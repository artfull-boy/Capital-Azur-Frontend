import React, { useState, useEffect } from "react"
import { Button, Icon, Link, Text, Wysiwyg } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
import { useI18n } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_default:89",
}

const Countdown = ({ intro, date, link }) => {
	const day = 0
	const month = 0

	const { t } = useI18n()

	// State for toggling modal in mobile
	const [toggleModal, setToggleModal] = useState(false)

	// State for countdown units
	const [countdownUnits, setCountdownUnits] = useState([
		{ labelLg: t("Nx:days"), labelSm: t("Nx:d"), value: 0 },
		{ labelLg: t("Nx:hours"), labelSm: t("Nx:h"), value: 0 },
		{ labelLg: t("Nx:minutes"), labelSm: t("Nx:m"), value: 0 },
		{ labelLg: t("Nx:seconds"), labelSm: t("Nx:s"), value: 0 },
	])

	// State for countdown status
	const [isCounting, setIsCounting] = useState(true)

	// Get current year
	const currentYear = new Date().getFullYear()

	useEffect(() => {
		const countdown = () => {
			const dateAtm = new Date()
			let givingDate = new Date(date)

			if (dateAtm > givingDate) {
				givingDate = new Date(currentYear + 1, month - 1, day)
			}

			if (dateAtm.getFullYear() === givingDate.getFullYear() + 1) {
				givingDate = new Date(currentYear, month - 1, day)
			}

			const currentTime = dateAtm.getTime()
			const givingDateTime = givingDate.getTime()

			const timeRemaining =
				givingDateTime >= currentTime ? givingDateTime - currentTime : 0

			let seconds = Math.floor(timeRemaining / 1000)
			let minutes = Math.floor(seconds / 60)
			let hours = Math.floor(minutes / 60)
			let days = Math.floor(hours / 24)

			seconds %= 60
			minutes %= 60
			hours %= 24

			setCountdownUnits([
				{ labelLg: t("Nx:days"), labelSm: t("Nx:d"), value: days },
				{ labelLg: t("Nx:hours"), labelSm: t("Nx:h"), value: hours },
				{ labelLg: t("Nx:minutes"), labelSm: t("Nx:m"), value: minutes },
				{ labelLg: t("Nx:seconds"), labelSm: t("Nx:s"), value: seconds },
			])

			timeRemaining === 0 ? setIsCounting(false) : setIsCounting(true)
		}

		const intervalId = setInterval(() => {
			if (isCounting) {
				countdown()
			}
		}, 1000)

		return () => {
			clearInterval(intervalId)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentYear, date, isCounting, day, month])

	return (
		<>
			{isCounting && (
				<div
					className={vclsx(
						"fixed z-10 max-w-sm bg-white lg:left-0 lg:top-52 lg:z-50 lg:w-80 lgDown:bottom-3 lgDown:flex lgDown:items-stretch lgDown:shadow-[0px_0px_2px_#C1C1C1]",
						toggleModal
							? "left-4 h-[70px] w-auto justify-end overflow-hidden rounded"
							: "left-1/2 w-[calc(100%-20px)] justify-between lgDown:-translate-x-1/2"
					)}
				>
					<div
						className="flex items-center bg-primary px-4 lg:hidden"
						onClick={() => setToggleModal(false)}
						onKeyDown={(e) => e.key === "Enter" && setToggleModal(false)}
						role="button"
						tabIndex={0}
					>
						<Icon id="clock" className="h-10 w-10 text-white" />
					</div>
					<div
						className={vclsx(
							toggleModal ? "hidden" : "px-4 py-2 lg:bg-primary-500 lg:p-5"
						)}
					>
						{intro && intro}
						<div className="flex justify-between lg:gap-3 lg:text-white">
							{countdownUnits.map((unit, index) => (
								<div key={index} className="flex items-center lg:flex-1 lg:flex-col">
									<Text as="span" className="text-2xl font-bold lg:text-5xl">
										{unit.value}
									</Text>
									<Text as="span" className="text-2xl font-bold lg:hidden">
										{unit.labelSm}
									</Text>
									<Text as="span" className="hidden text-sm lg:inline-block">
										{unit.labelLg}
									</Text>
								</div>
							))}
						</div>
						<div className="hidden text-white lg:my-5 lg:flex lg:items-center">
							<Icon id="calendar" width="30" height="30" />
							<Text as="span" className="ml-4 flex-grow">
								Fin: {date}
							</Text>
						</div>
						{link.href && (
							<div className="hidden lg:block">
								<Button variant="white">
									<Link {...link}>{link.title}</Link>
								</Button>
							</div>
						)}
					</div>
					<div
						onClick={() => setToggleModal(true)}
						onKeyDown={(e) => e.key === "Enter" && setToggleModal(true)}
						role="button"
						tabIndex={0}
						className={vclsx(
							toggleModal ? "hidden" : "flex items-center bg-primary px-4 lg:hidden"
						)}
					>
						<Icon id="minus" className="h-10 w-10 text-white" />
					</div>
				</div>
			)}
		</>
	)
}

const CountdownContainer = ({ data }) => {
	const props = {
		intro: data?.components?.[0]?.intro?.value?.["#text"] ? (
			<Wysiwyg
				className="mb-2 lg:mb-4 lg:text-white lgDown:text-center"
				html={data?.components?.[0]?.intro?.value?.["#text"]}
			/>
		) : null,
		date: data?.components[0]?.date,
		link: {
			href: data?.components?.[0]?.link?.url || null,
			title: data?.components?.[0]?.link?.title,
			id: data?.components?.[0]?.link?.attributes?.id,
			rel: data?.components?.[0]?.link?.attributes?.rel,
			target: data?.components?.[0]?.link?.attributes?.target || "_self",
			className: data?.components?.[0]?.link?.attributes?.class,
		},
	}

	return <Countdown {...props} />
}

export default CountdownContainer
