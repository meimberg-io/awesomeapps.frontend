import "../../styles/index.css"; // oder "../styles/main.css", je nach Struktur
import type { AppProps } from "next/app";



export     const BASE_URL = (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : 'http://localhost:1337';


export default function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
