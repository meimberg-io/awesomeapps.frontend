import {fetchServicesNews} from '@/lib/strapi'
import {Metadata} from "next";
import ServiceNewsList from "@/components/news/ServiceNewsList";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: 'Neu vorgestellte Apps | AwesomeApps',
    description: 'Aktuelle Websites und Internetservices - frisch vorgestellt. Entdecke die neuesten SaaS-Tools und Online-Apps mit ausführlichen Bewertungen und Screenshots.',
    openGraph: {
        title: 'Neu vorgestellte Apps',
        description: 'Aktuelle Websites und Internetservices - frisch vorgestellt',
        url: 'https://awesomeapps.meimberg.io/news',
        siteName: 'AwesomeApps',
        type: 'website',
        locale: 'de_DE',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Neu vorgestellte Apps',
        description: 'Aktuelle Websites und Internetservices - frisch vorgestellt',
    },
    alternates: {
        canonical: '/news',
    },
    robots: {
        index: true,
        follow: true,
    },
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
