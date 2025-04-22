// components/EventCard.jsx
import React from "react"
import { Link, Heading, Text, Image, Button } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export function EventCardOriginal({
  title,
  excerpt,
  image,
  url,
  dateStart,
  dateEnd,
  category = [],
  city,
}) {
  // assume dateStart/dateEnd are e.g. "25 mai", "05 juin"
  const [startDay, startMonth] = (dateStart || "").split(" ")
  const [endDay, endMonth] = (dateEnd || "").split(" ")

  return (
    <div className="group cursor-pointer relative flex overflow-hidden rounded-lg bg-white shadow-lg h-[350px]">
      {/* image + date overlay */}
      <div className="relative w-1/2 aspect-[16/9] overflow-hidden">
        {/* date box */}
        {dateStart && dateEnd && (
          <div className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-lg text-center p-2 w-20">
            <div className="text-2xl font-bold leading-tight">{startDay}</div>
            <div className="uppercase text-xs">{startMonth}</div>
            <div className="my-1 border-t border-white" />
            <div className="text-2xl font-bold leading-tight">{endDay}</div>
            <div className="uppercase text-xs">{endMonth}</div>
          </div>
        )}
        {/* cover image */}
        {image?.src && (
          <Link href={url}>
            <Image
              src={image.src}
              alt={image.alt || title}
              fill
              type="card"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </Link>
        )}
      </div>

      {/* content */}
      <div className="flex w-1/2 flex-col p-6">
      <Heading level={1} variant="5" className="mb-3 group-hover:text-primary uppercase font-bold">
          {title}
        </Heading>
        {/* badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {city && (
            <span className="inline-block bg-red-500 text-white text-[10px] font-semibold uppercase px-2 py-1 rounded-xl">
              {city.name}
            </span>
          )}
          {category.map((term, i) => (
            <span
              key={i}
              className="inline-block bg-blue-900 text-white text-[10px] font-semibold uppercase px-2 py-1 rounded-xl"
            >
              {term.name}
            </span>
          ))}
        </div>

        {/* title & excerpt */}
        
        {excerpt && (
          <Text variant="cardExcerpt" className="mb-10 text-gray-700">
            {excerpt}
          </Text>
        )}

        {/* “Lire plus” button */}
        {url && (
          <div className="mt-auto">
            <Button
              href={url}
              className="bg-primary text-white uppercase font-semibold px-6 py-3"
            >
              Lire plus
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
