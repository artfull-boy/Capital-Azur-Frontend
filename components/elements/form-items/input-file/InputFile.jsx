import { forwardRef, useRef, useState } from "react"

import { Icon, Button } from "@/ui"
import { useI18n as useTranslation } from "@vactorynext/core/hooks"
import { vclsx } from "@vactorynext/core/utils"

import { inputFile } from "./theme"

export const InputFile = forwardRef(
	(
		{
			isMultiple = true,
			label,
			variant = "default",
			placeholder,
			addonAfter,
			addonBefore,
			prefix,
			hasError,
			errorMessage,
			description,
			props,
			name,
		},
		// eslint-disable-next-line no-unused-vars
		ref
	) => {
		const { t } = useTranslation()

		const [choosedFiles, setChoosedFiles] = useState([])
		const inputFileRef = useRef()

		const onInputChange = (e) => {
			var inputElement = e.target.files
			setChoosedFiles((prev) => {
				return [...prev, inputElement[0]]
			})
		}

		const handleDeleteFile = (fileName) => {
			setChoosedFiles((prev) => {
				return prev.filter((choosedFile) => {
					return choosedFile.name !== fileName
				})
			})
		}

		const handleButtonClick = () => {
			inputFileRef.current.click()
		}

		// const handleDeleteSelectedFile = () => {
		// 	setChoosedFiles([])
		// 	inputFileRef.current.value = ""
		// }

		return (
			<div className="mb-4 w-full">
				{label && (
					<div className={vclsx(inputFile[variant].label)}>
						<label htmlFor={name}>{label}</label>
					</div>
				)}
				<div
					className={vclsx(
						inputFile[variant].wrapper,
						hasError && inputFile[variant].hasError,
						"overflow-hidden"
					)}
				>
					{addonBefore && (
						<div className={vclsx("flex", inputFile[variant].addonBefore)}>
							{addonBefore}
						</div>
					)}
					<span
						className={vclsx(
							addonBefore
								? inputFile[variant].inputWrapper.inside
								: addonAfter
									? inputFile[variant].inputWrapper.left
									: addonBefore
										? inputFile[variant].inputWrapper.right
										: inputFile[variant].inputWrapper.full
						)}
					>
						{prefix && <div className={vclsx(inputFile[variant].prefix)}>{prefix}</div>}
						<div className="relative min-w-0 overflow-hidden">
							<input
								multiple
								className="absolute left-0 top-0 h-0 w-0"
								type="file"
								placeholder={placeholder}
								onChange={onInputChange}
								accept={".jpg,.jpeg,.png,.pdf"}
								ref={(e) => {
									inputFileRef.current = e
								}}
								id={name}
								name={name}
								{...props}
							/>

							<div className={vclsx(inputFile[variant].file)}>
								{choosedFiles.length > 0 ? (
									choosedFiles.map((choosedFile, index) => {
										return (
											<SelectedInput
												key={index}
												file={choosedFile.name}
												deleteFile={handleDeleteFile}
											/>
										)
									})
								) : (
									<p className="text-black">Choose a file</p>
								)}
							</div>
						</div>
					</span>

					{choosedFiles.length !== 0 && (
						<div className={vclsx(inputFile[variant].sufix)}>
							<span className="flex h-5 w-5 items-center justify-center rounded-full bg-black p-1 text-sm text-white">
								{choosedFiles.length}
							</span>
						</div>
					)}

					<div className={vclsx("flex", inputFile[variant].addonAfter)}>
						{isMultiple && choosedFiles.length !== 0 ? (
							<Button
								onClick={handleButtonClick}
								className="h-full"
								aria-label={t("Nx:Add more file")}
							>
								<Icon id="plus" className="h-5 w-5" />
							</Button>
						) : !isMultiple && choosedFiles.length !== 0 ? (
							<Button
								onClick={handleButtonClick}
								className="h-full"
								aria-label={t("Nx:Remove file")}
							>
								<Icon id="trash" className="h-5 w-5" />
							</Button>
						) : (
							<Button
								onClick={handleButtonClick}
								className="h-full"
								aria-label={t("Nx:Add new file")}
							>
								<Icon id="upload" className="h-5 w-5" />
							</Button>
						)}
					</div>
				</div>
				{errorMessage && hasError && (
					<p className={inputFile[variant].errorMessage}>{errorMessage}</p>
				)}
				{description && <p className={inputFile[variant].description}>{description}</p>}
			</div>
		)
	}
)

const formatFilename = (fileName) => {
	var split = fileName.split(".")
	var filename = split[0]
	var extension = split[1]
	if (filename.length > 10) {
		filename = filename.substring(0, 10)
	}
	return `${filename}.${extension}`
}

// const readFileAsync = (file) => {
// 	return new Promise((resolve, reject) => {
// 		let reader = new FileReader()

// 		reader.onload = () => {
// 			resolve(reader.result)
// 		}

// 		reader.onerror = reject
// 		reader.readAsArrayBuffer(file)
// 	})
// }

const SelectedInput = ({ file, deleteFile }) => {
	const { t } = useTranslation()
	return (
		<div className="relative flex items-center gap-2 rounded border border-gray-200 px-2 py-1.5 shadow">
			<Icon id="document-text" className="h-4 w-4" />
			<span className="whitespace-nowrap text-xs">{formatFilename(file)}</span>
			<button
				onClick={() => {
					deleteFile(file)
				}}
				className="rounded-full bg-black p-0.5 "
				aria-label={t("Nx:Remove file")}
			>
				<Icon id="x" className="h-2 w-2 text-white" />
			</button>
		</div>
	)
}
