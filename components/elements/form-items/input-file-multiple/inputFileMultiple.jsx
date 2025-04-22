import React, { useState, useRef } from "react"
import { useFormContext } from "react-hook-form"
import { useUpdateEffect, useI18n as useTranslation } from "@vactorynext/core/hooks"
import { Icon, Image, Tooltip } from "@/ui"
import {
	vclsx,
	getUploadParams,
	checkFileExistance,
	getFilesInfo,
	formatBytes,
	toBytes,
	convertAcceptedExtention,
} from "@vactorynext/core/utils"

const Extentions = ({ extentions }) => {
	const { t } = useTranslation()
	return (
		<div className="flex items-center space-x-2 rtl:space-x-reverse">
			<p className="text-xs font-semibold text-gray-600">{t("Nx:extentions:")}</p>
			<div className="flex items-center space-x-1 rtl:space-x-reverse">
				{extentions.map((extention, index) => {
					return (
						<p key={index} className="text-xs text-gray-400">
							{extention}
						</p>
					)
				})}
			</div>
		</div>
	)
}

const FileLimit = ({ remainingFiles }) => {
	const { t } = useTranslation()
	return (
		<div className="flex items-center space-x-2 rtl:space-x-reverse ">
			<p className="text-xs font-semibold text-gray-600">{t("Nx:remaining files:")}</p>
			<div className="flex items-center space-x-1 rtl:space-x-reverse">
				<p className="text-xs font-semibold text-gray-400">{remainingFiles}</p>
				<p className="text-xs text-gray-400">{t("Nx:files")}</p>
			</div>
		</div>
	)
}

const FileSize = ({ fileSizeLimit }) => {
	const { t } = useTranslation()
	return (
		<div className="flex items-center space-x-2 rtl:space-x-reverse">
			<p className="text-xs font-semibold text-gray-600">{t("Nx:file size limit:")}</p>
			<div className="flex items-center space-x-1 rtl:space-x-reverse">
				<p className="text-xs font-semibold text-gray-400">{fileSizeLimit}</p>
				<p className="text-xs text-gray-400">{t("Nx:mb")}</p>
			</div>
		</div>
	)
}

const SelectedFile = ({ file, deleteFile, filePreview }) => {
	const { t } = useTranslation()
	return (
		<div className="flex items-center border border-gray-200 bg-gray-50 px-3 py-2.5">
			{filePreview && file.type.includes("image/") && file?.previewUrl && (
				<Image
					src={`/api/proxy${file?.previewUrl}`}
					alt={file?.name || "Image alt"}
					width={100}
					height={100}
					className="mr-2 h-5 w-fit"
				/>
			)}
			<span className="truncate text-sm text-gray-600">{file.name}</span>
			<div className="ml-auto flex items-center space-x-2">
				<p className="whitespace-nowrap text-xs font-medium text-gray-600">
					{formatBytes(file.size)}
				</p>
				<button
					type="button"
					onClick={() => {
						deleteFile(file)
					}}
					aria-label={t("Nx:Remove file")}
				>
					<Icon id="trash" className="h-5 w-5 text-error-500" />
				</button>
				{filePreview && file.type.includes("application/") && file?.previewUrl && (
					<a
						href={`/api/proxy${file?.previewUrl}`}
						download
						rel="noreferrer"
						target="_blank"
					>
						<Tooltip text={t("Nx:preview")} position="topRight">
							<Icon id="eye" className="h-5 w-5" />
						</Tooltip>
					</a>
				)}
			</div>
		</div>
	)
}

export const InputFileMultiple = ({
	name,
	label,
	labelDisplay = "default",
	validations, // react-hook-form validations
	url,
	accept, // accept array of extentions
	limitFiles,
	fileSizeLimit,
	filePreview,
	defaultValue = [], // default value must be an array of files
}) => {
	const { t } = useTranslation()
	const inputFileRef = useRef(null)
	const [isLoading, setIsLoading] = useState(false)
	const {
		register,
		getValues,
		setValue,
		setError,
		clearErrors,
		formState: { errors },
	} = useFormContext()

	const [selectedFiles, setSelectedFiles] = useState(() => {
		const registeredValue = getValues(name)
		if (registeredValue !== undefined) {
			return [...getValues(name)]
		} else {
			setValue(name, defaultValue)
			return [...defaultValue]
		}
	})

	const hasError = () => {
		if (errors[name] !== undefined) {
			return true
		} else {
			return false
		}
	}

	useUpdateEffect(() => {
		if (typeof getValues(name) === "string") {
			setSelectedFiles([])
		}
	}, [getValues(name)])

	useUpdateEffect(() => {
		setValue(name, selectedFiles)
	}, [selectedFiles])

	const handleChange = async (e) => {
		const file = e.target.files[0]
		if (file.size > toBytes(fileSizeLimit)) {
			setError(name, { message: t("Nx:file must be less than 2 mo") })
		} else {
			if (checkFileExistance(selectedFiles, file) === undefined) {
				setIsLoading(true)
				getUploadParams(file, url)
					.then((s_file) => {
						const r_file = getFilesInfo(s_file)
						setSelectedFiles((prev) => {
							return [r_file, ...prev]
						})
						clearErrors(name)
						setIsLoading(false)
					})
					.catch(() => {
						setError(name, { message: t("Nx:upload failed") })
						setIsLoading(false)
					})
			} else {
				setError(name, { message: t("Nx:file alraedy exits") })
			}
		}

		e.target.value = []
	}

	const handleDeleteFile = (file) => {
		setSelectedFiles((prev) => {
			return prev.filter((stateFile) => {
				return file !== stateFile
			})
		})
	}

	const openFiles = () => {
		if (limitFiles > selectedFiles.length) {
			inputFileRef.current.click()
		} else {
			setError(name, { message: t("Nx:you've reached the file size limit") })
		}
	}

	return (
		<div
			className={vclsx(
				"mb-4 w-full",
				["after", "default"].indexOf(labelDisplay) > -1 && "flex flex-wrap",
				labelDisplay == "default" && "md:items-center"
			)}
		>
			{label && labelDisplay !== "none" && (
				<label
					className={vclsx(
						labelDisplay == "invisible" && "sr-only",
						labelDisplay == "default" &&
							"shrink-0 grow md:max-w-1/5 md:basis-1/5 md:pr-5",
						labelDisplay == "after" && "order-2 mt-4"
					)}
					htmlFor={name}
				>
					{label}
				</label>
			)}
			<div
				className={vclsx(
					"relative w-full",
					labelDisplay == "default" && "shrink-0 grow md:max-w-4/5 md:basis-4/5",
					labelDisplay == "after" && "order-1"
				)}
			>
				<div className="relative flex items-center">
					<div
						className={vclsx(
							"flex-1 border-y border-l px-3 py-3",
							hasError() && "border-error-500"
						)}
					>
						{isLoading ? (
							<p className="text-sm text-gray-600">{t("Nx:uploading...")}</p>
						) : (
							<p className="text-sm text-gray-600">{t("Nx:select file")}</p>
						)}
					</div>
					<button
						type="button"
						disabled={isLoading}
						onClick={openFiles}
						className="absolute right-0 flex h-full items-center justify-center bg-black px-3 py-2 text-white"
						aria-label={t("Nx:Add file")}
					>
						{isLoading ? (
							<div>
								<Icon id="minus-circle" className="h-5 w-5 animate-spin" />
							</div>
						) : (
							<>
								{selectedFiles.length === 0 ? (
									<Icon id="download" className="h-5 w-5" />
								) : (
									<Icon id="plus" className="h-5 w-5" />
								)}
							</>
						)}
					</button>
				</div>
				<input
					ref={inputFileRef}
					type="file"
					className="absolute h-0 w-0"
					id={name}
					name={name}
					accept={convertAcceptedExtention(accept)}
					onChange={handleChange}
					aria-label={label}
				/>
				<input
					type={"hidden"}
					className="absolute h-0 w-0"
					{...register(name, validations)}
				/>
				{hasError() ? (
					<span className="text-xs text-error-500">{errors[name].message}</span>
				) : (
					<div className="mt-2 flex flex-col">
						<FileLimit remainingFiles={limitFiles - selectedFiles.length} />
						<Extentions extentions={accept} />
						<FileSize fileSizeLimit={fileSizeLimit} />
					</div>
				)}
				<div className="my-3 flex flex-col space-y-2">
					{selectedFiles.map((file, index) => {
						return (
							<SelectedFile
								key={index}
								file={file}
								filePreview={filePreview}
								deleteFile={handleDeleteFile}
							/>
						)
					})}
				</div>
			</div>
		</div>
	)
}
