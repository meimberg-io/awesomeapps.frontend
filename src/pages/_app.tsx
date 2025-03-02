import "../../styles/index.css"; // oder "../styles/main.css", je nach Struktur
import type {AppProps} from "next/app";


export const STRAPI_BASEURL = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_STRAPI_BASEURL) ? process.env.NEXT_PUBLIC_STRAPI_BASEURL : 'http://localhost:1337';

console.log("NEXT_PUBLIC_STRAPI_BASEURL: ", process.env.NEXT_PUBLIC_STRAPI_BASEURL)

export default function MyApp({Component, pageProps}: AppProps) {
    return <Component {...pageProps} />;
}
