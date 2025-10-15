import {fetchServices, fetchTags} from '@/lib/strapi'
import {Metadata} from "next";
import InteractiveServiceList from "@/components/new/InteractiveServiceList";

export const metadata: Metadata = {
    title: 'AwesomeApps - Best of Breed der Apps & Online Tools',
    description: 'Best of Breed der Apps & Online Tools. Ausführliche Bewertungen, Screenshots und Preise für Business-Software, Produktivitäts-Tools und Cloud-Services.',
    openGraph: {
        title: 'AwesomeApps - Best of Breed der Apps & Online Tools',
        description: 'Finde und vergleiche die besten Software-as-a-Service Lösungen. Mit Bewertungen, Screenshots und Preisen.',
        url: 'https://awesomeapps.meimberg.io',
        siteName: 'AwesomeApps',
        type: 'website',
        locale: 'de_DE',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AwesomeApps - Best of Breed der Apps & Online Tools',
        description: 'Finde und vergleiche die besten Software-as-a-Service Lösungen.',
    },
    alternates: {
        canonical: '/',
    },
}


export default async function HomePage() {
    // Load all services for tab switching
    const allServices = await fetchServices([])
    const initialTags = await fetchTags([])

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "AwesomeApps",
        "url": "https://awesomeapps.meimberg.io",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://awesomeapps.meimberg.io/?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <InteractiveServiceList
                initialServices={allServices}
                initialTags={initialTags}
            />
        </>
    )
}
