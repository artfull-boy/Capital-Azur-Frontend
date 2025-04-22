import { default as BaseNodePage } from "./index"
export { getServerSideProps } from "./index"
import loadThemeLayout from "@/themes/.runtime"

const SlugFunction = (props) => <BaseNodePage {...props} />

// To enable AMP, switch false to "hybrid"
export const config = { amp: false }

export default SlugFunction

SlugFunction.getLayout = function getLayout(page, theme) {
	const Layout = loadThemeLayout(theme)
	return <Layout {...page.props}>{page}</Layout>
}
