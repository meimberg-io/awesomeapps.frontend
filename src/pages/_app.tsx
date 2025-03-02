import "../../styles/index.css"; // oder "../styles/main.css", je nach Struktur
import type {AppProps} from "next/app";


export const BASE_URL = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WWW_BASEURL) ? process.env.NEXT_PUBLIC_WWW_BASEURL : 'http://localhost:1337';
export const STRAPI_API = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_STRAPI_API) ? process.env.NEXT_PUBLIC_STRAPI_API : 'http://localhost:1337/graphql';

console.log("NEXT_PUBLIC_STRAPI_BASEURL: ", process.env.NEXT_PUBLIC_STRAPI_BASEURL)

export default function MyApp({Component, pageProps}: AppProps) {
    return <Component {...pageProps} />;
}
