import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const FormStepper = ({ pages, currentStep, goToStep = null }) => {
	const { t } = useTranslation()

	const stepsItems = Object.keys(pages || [])
	const steps = !pages?.webform_preview?.preview?.enable
		? stepsItems.filter((stepsItem) => stepsItem !== "webform_preview")
		: null

	const style = {
		Li: "min-h-[72px] relative text-center block shrink grow onlyMobile:grow-0 basis-auto whitespace-nowrap after:content-[''] after:w-[28px] after:h-[28px] after:absolute after:right-[-4px] after:top-[6px] after:border-r after:border-t after:border-primary after:rounded-[1px] after:rotate-45",
		LiActive: "after:bg-primary",
		Icon: "relative mx-auto w-[32px] h-[32px] text-primary",
		IconActive: "!text-white",
		Button:
			"group block relative px-[10px] min-h-[72px] before:content-[''] before:block before:w-full before:h-full before:absolute before:top-0 before:left-[-10px] before:border-t before:border-b before:border-primary",
		ButtonActive:
			"cursor-pointer before:bg-primary before:!left-[0px] before:w-[calc(100%)]",
		ButtonCurrent: "before:!w-[calc(100%-10px)]",
		ButtonText:
			"relative z-10 flex items-center justify-center w-full px-[10px] h-[40px] text-primary",
		ButtonTextActive: "!text-white",
	}

	return (
		<nav aria-label="Progress" className="mb-5">
			<ol className="flex items-center ">
				{steps.map((step, index) => (
					<li
						key={step}
						className={vclsx(
							style.Li,
							(index == 0 || index < currentStep || index == currentStep) &&
								style.LiActive,
							index != currentStep && "onlyMobile:!hidden"
						)}
					>
						<div
							onClick={() => {
								if (typeof goToStep === "function") {
									goToStep(index)
								}
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" && typeof goToStep === "function") {
									goToStep(index)
								}
							}}
							role="button"
							tabIndex={0}
							className={vclsx(
								"hoppa",
								style.Button,
								index == currentStep && style.ButtonCurrent,
								(index == currentStep || index < currentStep) && style.ButtonActive,
								index == currentStep + 1 && "cursor-pointer"
							)}
						>
							{pages[step].icon !== "" ? (
								<Icon
									id={pages[step].icon}
									className={vclsx(
										style.Icon,
										(index == 0 || index < currentStep || index == currentStep) &&
											style.IconActive
									)}
								/>
							) : null}
							<span
								className={vclsx(
									style.ButtonText,
									(index == 0 || index < currentStep || index == currentStep) &&
										style.ButtonTextActive
								)}
							>
								{pages[step]["title"]
									? t(`Nx:${pages[step]["title"]}`)
									: t(`Nx:${pages[step]?.preview?.label}`)}
							</span>
						</div>
					</li>
				))}
			</ol>
		</nav>
	)
}
