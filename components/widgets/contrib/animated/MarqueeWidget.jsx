import React from "react"
import Marquee from "react-fast-marquee"

export const config = {
	id: "vactory_default:55",
}

const MyComponent = ({ content }) => {
	return <div className="text-7xl font-bold uppercase">{content}</div>
}

const MarqueeElement = ({ children }) => {
	return <div className="mr-12 flex-1">{children}</div>
}

const MarqueeComponent = ({ pauseOnHover, numberPerView, children }) => {
	const childs = Array.from({ length: numberPerView }, (_, i) => {
		return React.cloneElement(<MarqueeElement key={i}>{children}</MarqueeElement>)
	})
	return (
		<Marquee pauseOnHover={pauseOnHover} className="flex" speed={200} gradient={false}>
			{childs}
		</Marquee>
	)
}

const MarqueeContainer = ({ data }) => {
	const config = {
		numberPerView: data.components[0]?.numberPerView,
		pauseOnHover: data.components[0]?.pauseOnHover,
	}
	const content = data.components[0]?.content
	return (
		<MarqueeComponent {...config}>
			<MyComponent content={content} />
		</MarqueeComponent>
	)
}

export default MarqueeContainer
