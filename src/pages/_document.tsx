import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en" data-theme="dark">
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" type="image/svg+xml" href="/logo.svg" />
                <title>Serviceatlas</title>
            </Head>
            <body className="h-full">
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}
