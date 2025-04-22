import { useState, useEffect, useRef } from "react"
import { Icon } from "@/ui"
import Image from "next/image"

export const config = {
	id: "vactory_dynamic_sliders:7",
}
export default function CovidSlider({ data }) {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [isHovering, setIsHovering] = useState(false)
	const [isInView, setIsInView] = useState(false)
	const sliderRef = useRef(null)
	const autoSwipeInterval = 5000
	const slides = data.components.map((element) => {
		return {
			title: element?.title,
			description: element?.description,
			image: element?.image[0]?._default,
			altImage: element?.image[0]?.meta?.alt,
			width: element?.image[0]?.meta?.width,
			height: element?.image[0]?.meta?.height,
		}
	})

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
	}

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
	}

	useEffect(() => {
		if (isHovering) return

		const interval = setInterval(() => {
			nextSlide()
		}, autoSwipeInterval)

		return () => clearInterval(interval)
	}, [isHovering, currentSlide])
	// Intersection Observer to detect when slider is in view
	useEffect(() => {
		if (!sliderRef.current) return

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsInView(entry.isIntersecting)
			},
			{ threshold: 0.3 } // Consider in view when 30% visible
		)

		observer.observe(sliderRef.current)

		return () => {
			if (sliderRef.current) {
				observer.unobserve(sliderRef.current)
			}
		}
	}, [])

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (!isInView) return
			if (e.key === "ArrowLeft") prevSlide()
			if (e.key === "ArrowRight") nextSlide()
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [isInView])

	return (
		<div
			ref={sliderRef}
			className="relative mx-auto h-[500px] w-full overflow-hidden rounded-lg bg-stone-300"
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
		>
			<div className="absolute bottom-0 left-0 h-full w-full transition-all duration-300 ease-in-out">
				<Image
					width={slides[currentSlide].width}
					height={slides[currentSlide].height}
					src={slides[currentSlide].image}
					alt={slides[currentSlide].image?.alt}
					className="h-full w-full object-cover transition-all duration-300 ease-in-out"
				/>
			</div>
			<div className="absolute left-[76px] top-1/2 flex  h-fit -translate-y-1/2 items-center justify-center transition-all duration-300 ease-in-out">
				<div className="flex">
					<div className="flex w-[570px] flex-col justify-center bg-white p-8 transition-all duration-300 ease-in-out">
						<div className="mb-6 border-l-4 border-blue-500 pl-4">
							<h2 className="mb-4 text-3xl font-bold text-black">
								{slides[currentSlide].title}
							</h2>
						</div>
						<p className="text-lg text-gray-800">{slides[currentSlide].description}</p>
					</div>
				</div>
			</div>
			<button
				onClick={prevSlide}
				className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center justify-center"
			>
				<Icon id="chevron-left" width={30} height={30} className="text-primary" />
			</button>

			<button
				onClick={nextSlide}
				className="absolute right-4 top-1/2  flex -translate-y-1/2 items-center justify-center"
			>
				<Icon id="chevron-right" width={30} height={30} className="text-blue-500" />
			</button>

			<div className="absolute bottom-0 left-0 right-0 flex justify-center transition-all duration-300 ease-in-out">
				{slides.map((_, index) => (
					<button
						key={index}
						onClick={() => setCurrentSlide(index)}
						className={`h-2 w-[276px] rounded-full transition-all  duration-300 ease-in-out 
              ${index === currentSlide ? "" : "bg-gray-300"}`}
						style={
							index === currentSlide
								? { background: "linear-gradient(138.5deg, #A2CFFF 0%, #017CFE 94.59%)" }
								: {}
						}
					/>
				))}
			</div>
		</div>
	)
}
