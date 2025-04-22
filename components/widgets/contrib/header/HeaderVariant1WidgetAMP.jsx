import { Link, Text, Image } from "@/ui"
import { useRouter } from "next/router"

export const config = {
	id: "vactory_header:default",
}

const HeaderComponent = ({ data }) => {
	const props = {
		logo: {
			src: data?.extra_field?.header_logo?.[0]?._default || null,
			width: data?.extra_field?.header_logo?.[0]?.meta?.width,
			height: data?.extra_field?.header_logo?.[0]?.meta?.height,
			alt: data?.extra_field?.header_logo?.[0]?.meta?.alt,
		},
	}

	return <Header {...props} />
}

const Header = ({ logo }) => {
	const router = useRouter()
	const locale = router.locale

	return (
		<header className="bg-primary-700 py-5 text-white">
			<Link href={`/${locale}`} className="flex-shrink-0" isAmp={true}>
				<Text as="span" className="sr-only">
					Factory
				</Text>
				{logo.src && (
					<div className="relative m-auto max-w-xs">
						<Image
							className="w-auto "
							{...logo}
							alt={logo.alt}
							layout="responsive"
							isAmp={true}
						/>
					</div>
				)}
			</Link>
		</header>
	)
}

export default HeaderComponent
