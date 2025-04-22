import { Wysiwyg } from "@/ui"

import { ContentCta } from "./ContentCta"

export const config = {
        id: "testParagraph",
}

const ContentCtaWidget = ({ data }) => {
        console.log("ContentCtaWidget", data)
        const props = {
                title: data.components[0].title,
                description: data?.components?.[0]?.description ? (
                        <Wysiwyg html={data?.components?.[0]?.description} className="mb-4" />
                ) : null,
                link: {
                        href: data?.components?.[0]?.link?.url,
                        title: data?.components?.[0]?.link?.title,
                        id: data?.components?.[0]?.link?.id,
                        target: data?.components?.[0]?.link?.target,
                        rel: data?.components?.[0]?.link?.rel,
                        className: data?.components?.[0]?.link?.class,
                },
        }

        return <ContentCta {...props} />
}

export default ContentCtaWidget
