import Document, { Html, Head, Main, NextScript } from "next/document"
// @TODO: add an option to add more RTL languages; ar is not the only one

export default class AppDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx)
		return {
			...initialProps,
			locale: ctx?.locale,
			styles: ctx?.query?.amp ? null : initialProps.styles, // Drop parsed CSS in AMP, let the AMP theme handle loading this.
		}
	}

	render() {
		const pageProps = this.props?.__NEXT_DATA__?.props?.pageProps

		return (
			<Html
				className={pageProps?.document?.htmlClass ?? ""}
				dir={this.props.locale === "ar" ? "rtl" : "ltr"}
				lang={this.props.locale}
			>
				<Head>
					<link rel="preconnect" href="https://www.googletagmanager.com" />
				</Head>
				<body className={pageProps?.document?.bodyClass ?? ""}>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
