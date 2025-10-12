import {fetchServices, fetchTags} from '@/lib/strapi'
import {Metadata} from "next";
import InteractiveServiceList from "@/components/new/InteractiveServiceList";

export const metadata: Metadata = {
    title: 'AwesomeApps - Entdecke die besten SaaS & Online Tools',
    description: 'Finde und vergleiche die besten Software-as-a-Service (SaaS) Lösungen und Online Tools. Ausführliche Bewertungen, Screenshots und Preise für Business-Software, Produktivitäts-Tools und Cloud-Services.',
    openGraph: {
        title: 'AwesomeApps - Die besten SaaS & Online Tools',
        description: 'Finde und vergleiche die besten Software-as-a-Service Lösungen. Mit Bewertungen, Screenshots und Preisen.',
        url: 'https://awesomeapps.meimberg.io',
        siteName: 'AwesomeApps',
        type: 'website',
        locale: 'de_DE',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AwesomeApps - Die besten SaaS & Online Tools',
        description: 'Finde und vergleiche die besten Software-as-a-Service Lösungen.',
    },
    alternates: {
        canonical: '/',
    },
}


export default async function HomePage() {
    // Initially load only featured (top) services
    const allServices = await fetchServices([])
    const featuredServices = allServices.filter(service => service.top)
    const initialTags = await fetchTags([])

    return (
        <InteractiveServiceList
            initialServices={featuredServices}
            initialTags={initialTags}
        />
    )
}
