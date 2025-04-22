import React from "react"
import {
	Container,
	Wysiwyg,
	Heading,
	Image,
	Accordion,
	CustomAnimation,
	Icon,
	Tabs,
	Text,
	fadeInRightAnimation,
} from "@/ui"
import { ParagraphsController } from "@vactorynext/core/paragraphs"
import DF_DEV_MAPPING from "@/runtime/widgets.dev.json"
import { useAmp } from "next/amp"
import { Widgets } from "@/runtime/widgets"

const HelpCenterNode = ({ node }) => {
	const { title, body } = node
	const isAmp = useAmp()
	return (
		<Container className="py-11">
			{title && <Heading>{title}</Heading>}
			{body && <Wysiwyg html={body?.processed} className="prose max-w-none" />}

			<div className="vactory-paragrphs-wrapper relative">
				{node?.field_vactory_paragraphs &&
					(node?.field_sticky_ancre ? (
						<div className="container flex flex-row">
							<div className="md:basis-3/4">
								{node?.field_vactory_paragraphs.map((paragraph) => (
									<ParagraphsController
										key={paragraph.id}
										data={paragraph}
										hasAMP={false}
										isAmp={isAmp}
										DF_DEV_MAPPING={DF_DEV_MAPPING}
										ContainerComponent={Container}
										ImageComponent={Image}
										Widgets={Widgets}
										IconComponent={Icon}
										HeadingComponent={Heading}
										TextComponent={Text}
										TabsComponent={Tabs}
										AccordionComponent={Accordion}
									/>
								))}
							</div>
						</div>
					) : (
						<>
							{node?.field_vactory_paragraphs.map((paragraph) => (
								<React.Fragment key={paragraph.id}>
									<ParagraphsController
										key={paragraph.id}
										data={paragraph}
										hasAMP={false}
										isAmp={isAmp}
										DF_DEV_MAPPING={DF_DEV_MAPPING}
										ContainerComponent={Container}
										ImageComponent={Image}
										Widgets={Widgets}
										IconComponent={Icon}
										HeadingComponent={Heading}
										TextComponent={Text}
										TabsComponent={Tabs}
										AccordionComponent={Accordion}
										isAnimated={true}
										AnimationComponent={CustomAnimation}
										animationKeyframe={fadeInRightAnimation}
									/>
								</React.Fragment>
							))}
						</>
					))}
			</div>
		</Container>
	)
}

export const config = {
	id: "node--vactory_help_center",
	params: {
		fields: {
			"node--vactory_help_center":
				"title,body,field_vactory_paragraphs,node_bg_image,node_class,node_body_class,node_banner_title,node_banner_image,node_banner_mobile_image,field_sticky_ancre,field_df_sticky",
			"media--image": "thumbnail",
			"file--image": "uri",
			"paragraph--vactory_component":
				"drupal_internal__id,paragraph_section,paragraph_identifier,paragraph_container,field_animation,container_spacing,paragraph_css_class,paragraph_background_color,paragraph_background_image,field_vactory_component,field_vactory_title,field_background_color,field_paragraph_hide_lg,field_paragraph_hide_sm,field_position_image_x,field_position_image_y,field_size_image,field_vactory_flag,field_vactory_flag_2,paragraph_background_parallax",
			"paragraph--vactory_paragraph_multi_template":
				"drupal_internal__id,paragraph_section,paragraph_identifier,paragraph_container,field_animation,container_spacing,paragraph_css_class,paragraph_background_color,paragraph_background_image,field_vactory_component,field_vactory_title,field_paragraph_introduction,field_vactory_paragraph_tab,field_background_color,field_multi_paragraph_type,field_paragraph_hide_lg,field_paragraph_hide_sm,field_position_image_x,field_position_image_y,field_size_image,field_vactory_flag,field_vactory_flag_2,paragraph_background_parallax",
		},
		include:
			"field_vactory_paragraphs,field_vactory_paragraphs.field_vactory_paragraph_tab,field_vactory_paragraphs.paragraph_background_image,field_vactory_paragraphs.paragraph_background_image.thumbnail,node_bg_image,node_bg_image.thumbnail,node_banner_image,node_banner_mobile_image,node_banner_image.thumbnail,node_banner_mobile_image.thumbnail",
	},
}

export default HelpCenterNode
