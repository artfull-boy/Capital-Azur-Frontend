import React, { useEffect, useRef } from "react"

import { Link, Icon, Animate } from "@/ui"
import { dlPush } from "@vactorynext/core/lib"
import { vclsx } from "@vactorynext/core/utils"
import { useRouter } from "next/router"

export const config = {
	id: "vactory_default:21",
}

const ToolBox = ({ items }) => {

      
	return (
	  <div className={`bg-white rounded-lg shadow-md p-2 w-fit mx-auto fixed right-0 bottom-[50%] translate-y-[50%] z-50`}>
	    <div className="flex flex-col gap-2">
	      {items.map((item, index) => (
		<ToolBoxItem key={index} item={item} />
	      ))}
	    </div>
	  </div>
	);
      };
      
      // Individual ToolBox item
      const ToolBoxItem = ({ item }) => {
      
	const {
	  title,
	  url,
	  id,
	  target,
	  rel
	} = item;
      
	return (
	  <a
	    href={url || '#'}
	    id={id}
	    className={`text-center uppercase text-blue-500 font-bold text-[14px] py-3 px-8 hover:text-blue-700 transition-colors `}
	    target={target}
	    rel={rel}
	  >
	    {title}
	  </a>
	);
      };

const ToolBoxContainer = ({ data }) => {
	const props = {
		sticky: data?.extra_field?.sticky,
		items: data?.components?.map((item) => ({
			hiddenMobile: item?.hide,
			active: item?.active,
			icon: item?.icon,
			title: item?.link?.title,
			url: item?.link?.url,
			id: item?.link?.attributes?.id,
			className: item?.link?.attributes?.class,
			target: item?.link?.attributes?.target,
			rel: item?.link?.attributes?.rel,
		})),
	}

	return <ToolBox {...props} />
}

export default ToolBoxContainer
