import { Button, Heading, Text, Container } from "@/ui"

export const ContentCta = ({ title, description, link, className }) => {
	return (
		<Container className={`my-24 flex flex-col items-start justify-center gap-[25px] ${className}`}>
			{title && (
				<div className="flex items-center gap-[16px]">
					<span className="block h-[3px] w-[44px] bg-primary"></span>
					<Heading level={1} variant={3}>
						{title}
					</Heading>
					
				</div>
			)}
			{description && 
			<Text className=" leading-7">{description.props.html}</Text>
			}
			{link?.href && link?.title && (
				<div className="text-center self-center">
					<Button {...link}>{link.title}</Button>
				</div>
			)}
		</Container>
	)
}
