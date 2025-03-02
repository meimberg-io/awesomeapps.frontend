import "../../styles/index.css"; // oder "../styles/main.css", je nach Struktur
import type { AppProps } from "next/app";



export     const BASE_URL = (typeof process !== 'undefined' && process.env.STRAPI_PUBLIC_BASE_URL) ? process.env.STRAPI_PUBLIC_BASE_URL : 'http://localhost:1337';


export default function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
