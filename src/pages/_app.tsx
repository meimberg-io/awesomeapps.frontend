// @ts-ignore
import "../../styles/index.css";
import type {AppProps} from "next/app";
import {useRouter} from "next/router";
import {useEffect} from "react";


export const STRAPI_BASEURL = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_STRAPI_BASEURL) ? process.env.NEXT_PUBLIC_STRAPI_BASEURL : 'http://localhost:1337';
export const APP_BASEURL = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_APP_BASEURL) ? process.env.NEXT_PUBLIC_APP_BASEURL : 'http://localhost:3000';

export default function MyApp({Component, pageProps}: AppProps) {
    const router = useRouter();

    useEffect(() => {
        console.log("Aktuelle Route:", router.pathname);
        console.log("Params:", router.query);
    }, [router]);


    return <Component {...pageProps} />;
}
