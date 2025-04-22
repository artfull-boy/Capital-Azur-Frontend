import { useTour } from "@reactour/tour"

export const Badge = ({ children }) => {
	const { showBadge } = useTour()
	const result = Boolean(showBadge)
	if (!result) return null
	return (
		<div className="absolute -left-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-black text-xs text-white">
			{children}
		</div>
	)
}
