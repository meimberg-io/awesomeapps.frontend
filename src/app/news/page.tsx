import {fetchServicesNews} from '@/lib/strapi'
import {Metadata} from "next";
import ServiceNewsList from "@/components/news/ServiceNewsList";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: 'AwesomeApps',
    description: 'AwesomeApps ist eine Sammlung von Software-as-a-Service (SaaS) Lösungen.',
}


export default async function NewsPage() {
    const services = await fetchServicesNews();
    return (
        <div>
            <Header/>
            <ServiceNewsList services={services}/>
            <Footer/>
        </div>
    )
}
