import { vclsx } from "@vactorynext/core/utils"
import { dotsloader, spinner, pulse } from "./theme"
import BaseLoadingOverlay from "react-loading-overlay-nextgen"

export const LoadingOverlay = ({
	children,
	//defaultStyle,
	minHeight = 200,
	background = "rgba(0, 0, 0, 0.1)",
	spinner,
	loader,
	pulse,
	...rest
}) => {
	return (
		<BaseLoadingOverlay
			spinner={
				(spinner && <Spinner {...rest} />) ||
				(loader && <DotsLoader {...rest} />) ||
				(pulse && <Pulse {...rest} />)
			}
			styles={{
				wrapper: (base) => ({
					...base,
					// height: defaultStyle.wrapper.height,
					// width: defaultStyle.wrapper.width,
					minHeight: minHeight,
				}),
				overlay: (base) => ({
					...base,
					background: background,
				}),
			}}
			{...rest}
		>
			{children}
		</BaseLoadingOverlay>
	)
}

const Spinner = ({ variant = "default" }) => {
	return (
		<div className={vclsx(spinner[variant].wrapper)}>
			<div className={spinner[variant].loader}></div>
		</div>
	)
}

const DotsLoader = ({ variant = "default" }) => {
	return (
		<div className={vclsx(dotsloader[variant].wrapper)}>
			<div
				className={`${dotsloader[variant].dots} ${dotsloader[variant].animation.firstDot}`}
			></div>
			<div
				className={`${dotsloader[variant].dots} ${dotsloader[variant].animation.secondeDot}`}
			></div>
			<div
				className={`${dotsloader[variant].dots} ${dotsloader[variant].animation.thirdDot}`}
			></div>
		</div>
	)
}

const Pulse = ({ variant = "default" }) => {
	return (
		<div className={vclsx(pulse[variant].wrapper)}>
			<div className={pulse[variant].profileImage}></div>
			<div className={pulse[variant].container.wrapper}>
				<div className={pulse[variant].container.title}></div>
				<div className={pulse[variant].container.paragraph.wrapper}>
					<div className={pulse[variant].container.paragraph.line1.wrapper}>
						<div className={pulse[variant].container.paragraph.line1.grid1}></div>
						<div className={pulse[variant].container.paragraph.line1.grid2}></div>
					</div>
					<div className={pulse[variant].container.paragraph.line2}></div>
				</div>
			</div>
		</div>
	)
}
