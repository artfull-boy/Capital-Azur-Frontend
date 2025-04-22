import { React, useRef, useEffect, useState } from "react"
import CountUp from "react-countup"
// Use real data instead of this fake one
import { data } from "./mock-data"

const KeyFigures = ({ items = data }) => {
	const ref = useRef(null)
	const [myElementIsVisible, setMyElementIsVisible] = useState(false)

	// Fucntionality to run the aniamtion when reaching the element
	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			const entry = entries[0]
			entry.isIntersecting && setMyElementIsVisible(entry.isIntersecting)
		})
		observer.observe(ref.current)
	}, [])

	let animatedNumber = (item) => {
		return Number.isInteger(Number(item.number)) ? (
			<CountUp start={0} end={item.number} duration={1.5} separator=" "></CountUp>
		) : (
			<CountUp
				start={0}
				end={item.number}
				duration={1.5}
				decimal=","
				decimals={1}
				separator=" "
			></CountUp>
		)
	}

	return (
		<div className="flex flex-wrap justify-between gap-2" ref={ref}>
			{items.map((item) => {
				return (
					<div
						className="flex w-[48%] flex-col items-center rounded bg-gray-200 px-4 py-5 sm:w-[49%] md:w-full md:flex-1"
						key={item.id}
					>
						<h3 className="mb-3 text-center text-2xl font-semibold text-primary-600">
							{item.textPrefix && <span className="mr-1">{item.textPrefix}</span>}
							{myElementIsVisible ? animatedNumber(item) : <span>0</span>}
							{item.textSuffix && <span className="ml-1">{item.textSuffix}</span>}
						</h3>
						<p className="text-center text-sm text-gray-600">{item.description}</p>
					</div>
				)
			})}
		</div>
	)
}

export default KeyFigures
