// components/EventsSlider.jsx
import React, { useState } from "react"
import get from "lodash.get"
import { deserialise } from "kitsu-core"
import { Wysiwyg, Heading, Button, Container, Icon } from "@/ui"
import { EventCardOriginal } from "./EventCardOriginal"
import { normalizeNodes } from "./normalizer"

export const config = {
	id: "vactory_event:three-columns",
}

export default function EventsSlider({ data }) {
	// — fetch + normalize —
	const response = deserialise(get(data, "components.0.collection.data", {}))
	const posts = normalizeNodes(response.data)

	// — header fields —
	const title = get(data, "components.0.title", "")
	const rawDesc = get(data, "components.0.description.value.#text", "")
	const description = rawDesc && <Wysiwyg html={rawDesc} className="text-center" />
	const moreUrl = get(data, "components.0.link.url", null)
	const moreLabel = get(data, "components.0.link.title", "")

	// — slider state —
	const [current, setCurrent] = useState(0)
	const count = posts.length

	const next = () => setCurrent((current + 1) % count)
	const prev = () => setCurrent((current - 1 + count) % count)
	const goTo = (idx) => setCurrent(idx)

	return (
		<div className="relative py-24">
			<Container className="relative">
				{/* title */}
				{title && (
					<div className="mb-8 flex items-center justify-start gap-4">
						<span className="block h-0.5 w-12 bg-primary" />
						<Heading level={1} variant={3}>
							{title}
						</Heading>
					</div>
				)}
				{description}

				{/* slider viewport */}
				<div className=" overflow-hidden">
					<div
						className="flex transition-transform duration-500"
						style={{ transform: `translateX(-${current * 100}%)` }}
					>
						{posts.map((post) => (
							<div key={post.id} className="min-w-full px-4">
								<EventCardOriginal
									{...post}
									dateStart={post.dateStart}
									dateEnd={post.dateEnd}
									viewMoreLink={post.url}
								/>
							</div>
						))}
					</div>

					{/* arrows */}
					<button
						onClick={prev}
						aria-label="Previous"
						className="absolute -left-10 top-1/2 z-10 -translate-y-1/2 p-3 text-3xl text-primary"
					>
						<Icon id="chevron-left" />
					</button>
					<button
						onClick={next}
						aria-label="Next"
						className="absolute -right-10 top-1/2 z-10 -translate-y-1/2 p-3 text-3xl text-primary"
					>
						<Icon id="chevron-right" />
					</button>
				</div>

				{/* pagination dots */}
				<div className="mt-6 flex justify-center space-x-2">
					{posts.map((_, idx) => (
						<button
							key={idx}
							onClick={() => goTo(idx)}
							className={`h-3 w-3 rounded-full transition ${
								idx === current ? "bg-primary" : "border border-gray-300 bg-white"
							}`}
							aria-label={`Go to slide ${idx + 1}`}
						/>
					))}
				</div>

				{/* bottom “Voir plus” */}
				{moreUrl && moreLabel && (
					<div className="mt-12 flex justify-center">
						<Button
							className="border border-primary bg-white px-8 py-3 font-semibold uppercase text-primary hover:bg-primary hover:text-white"
							href={moreUrl}
						>
							{moreLabel}
						</Button>
					</div>
				)}
			</Container>
		</div>
	)
}
