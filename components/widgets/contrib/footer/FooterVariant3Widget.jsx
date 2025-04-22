import React from "react"
import { useMenu } from "@vactorynext/core/hooks"
import { Text, Icon, Link, Wysiwyg, Image, ThemeChanger, Container } from "@/ui"
import { vclsx } from "@vactorynext/core/utils"

export const config = {
  id: "vactory_footer:footer-variant3",
  lazy: false,
}

export const Footer = ({
  logo,
  use_menu,
  copyrights,
  signateur,
  social_medias,
  enableFooterBottom,
}) => {
  const footerMenu = useMenu(use_menu)

  const logoContent = {
    src: logo?._default || null,
    width: logo?.meta?.width,
    height: logo?.meta?.height,
    alt: logo?.meta?.alt,
  }

  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <Container>
        <div className="flex flex-col items-center justify-between md:flex-row">
          {/* YouTube icon on the left */}
          <div className="mb-4 md:mb-0">

                  <Link
                    href={"https://www.youtube.com/channel/UCzjsY4LvL_i0DzlKNX3qXwg"}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Icon
                      id={"youtube"}
                      width="24px"
                      height="24px"
                    />
                  </Link>

              
          </div>

          {/* Navigation links in the center */}
          <nav className="mb-4 flex flex-wrap justify-center md:mb-0">
            {footerMenu?.map((link, i) => (
              <Link
                key={i}
                variant="body2"
                href={link.url}
                target="_self"
                className="mx-3 font-medium text-gray-800 uppercase text-sm hover:text-blue-500"
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* No top button as requested */}
        </div>

        {/* Bottom copyright section */}
        <div className="mt-6 flex flex-col items-center justify-between border-t border-gray-100 pt-6 md:flex-row">
          <Text as="p" className="mb-2 text-sm text-gray-500 md:mb-0">
            {copyrights || "Capital Azur 2020 © All rights reserved"}
          </Text>
          
          <div className="text-sm text-gray-500">
            {signateur || (
              <div className="flex items-center">
                <span>Conception et développement</span>
                <span className="ml-2 bg-blue-500 text-white px-2 py-0.5 text-xs rounded">VOID</span>
              </div>
            )}
          </div>
        </div>
      </Container>
    </footer>
  )
}

const FooterVariant3Widget = ({ data }) => {
  const themeSwitcher = data?.extra_field?.enableThemeSwitcher
  const props = {
    logo: data?.extra_field?.logo?.[0],
    use_menu: data?.extra_field?.use_menu,
    copyrights: data?.extra_field?.copyrights,
    enableFooterBottom: data?.extra_field?.enableFooterBottom,
    signateur: (
      <div className="flex items-center text-sm text-gray-500">
        <span>Conception et développement</span>
        <span className="ml-2 bg-blue-500 text-white px-2 py-0.5 text-xs rounded">VOID</span>
      </div>
    ),
    social_medias: data?.components.map((item) => ({
      link: item?.cta_social,
      icon: item?.icon,
    })),
  }

  return (
    <>
      <Footer {...props} />
      {themeSwitcher ? <ThemeChanger /> : null}
    </>
  )
}

export default FooterVariant3Widget