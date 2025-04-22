import {
	Button,
	CustomAnimation,
	fadeInDownRightAnimation,
	Container,
	Icon,
	Heading,
      } from "@/ui"
      import { useRef, useEffect, useState } from "react"
      import CountUp from "react-countup"
      
      export const KeyFigures = ({ items }) => {
	const ref = useRef(null)
	const [myElementIsVisible, setMyElementIsVisible] = useState(false)
      
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
	      decimals={2}
	      separator=" "
	    ></CountUp>
	  )
	}
      
	return (
	  <Container className="flex flex-col items-center justify-center gap-8 py-24">
	    <div className="flex items-center gap-[16px] uppercase">
	      <span className="block h-[3px] w-[44px] bg-primary"></span>
	      <Heading level={1} variant={3} className="font-600 uppercase">
		La banque en quelques chiffres
	      </Heading>
	    </div>
	    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" ref={ref}>
	      <CustomAnimation keyFrame={fadeInDownRightAnimation} cascade={true}>
		{items?.map((item) => (
		  <div
		    key={item.id}
		    className="flex flex-col items-center justify-center rounded-lg border-[1px] 
			       border-primary bg-white p-8 text-center shadow-lg 
			       transition-all duration-300 ease-in-out hover:-translate-y-2 
			       hover:shadow-xl"
		  >
		    <div className="mb-3 font-bold">
		      <span
			className="inline-block text-[100px] font-bold text-transparent"
			style={{
			  WebkitTextStroke: "2px #3B82F6",
			  textShadow: "2px 2px 0 #fff",
			}}
		      >
			{myElementIsVisible ? animatedNumber(item) : <span>0</span>}
		      </span>
		    </div>
		    <p className="text-lg font-semibold text-gray-800">{item.description}</p>
		  </div>
		))}
	      </CustomAnimation>
	    </div>
      
	    <Button className="flex gap-3">
	      Communication financière 2019 <Icon id="download" width={14} height={14} />
	    </Button>
	  </Container>
	)
      }