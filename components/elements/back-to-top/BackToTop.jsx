import React, { useState, useEffect } from "react"
import { Icon } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"
import { backtotop } from "./theme"

export const BackToTop = ({ variant = "default" }) => {
	const [showGoTopBtn, setShowGoTopBtn] = useState(false)

	useEffect(() => {
		window.addEventListener("scroll", () => {
			if (window.scrollY > 200) {
				setShowGoTopBtn(true)
			} else {
				setShowGoTopBtn(false)
			}
		})
	}, [])

	const goToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		})
	}

	return (
		<>
			<button
				onClick={goToTop}
				className={vclsx(backtotop[variant].className,"bg-primary p-4 border border-primary group hover:bg-white transition-all duration-300 ease-in-out text-white hover:text-primary", showGoTopBtn && "!flex")}
				aria-label="Go to top"
			>
				<Icon id={"chevron-up"} strokeWidth={0.5} className={`${backtotop[variant].icon.style}`} />
			</button>
		</>
	)
}
