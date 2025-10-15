import {fetchServiceDetailBySlug, fetchServiceReviews, fetchNewServiceBySlug} from '@/lib/strapi'
import ServiceDetail from '@/components/new/ServiceDetail'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import { getBrandfetchLogoUrl } from '@/lib/utils'

// Dynamische Metadaten für SEO, SSR-kompatibel
type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const service = await fetchServiceDetailBySlug((await params).slug)

    if (!service) {
        return {
            title: 'Service nicht gefunden - AwesomeApps',
            description: 'Der angeforderte Service konnte nicht gefunden werden.',
        }
    }

    const title = `${service.name} - Bewertung, Features & Preise | AwesomeApps`
    const description = service.abstract 
        ? `${service.abstract.substring(0, 155)}...`
        : `Erfahre mehr über ${service.name}. Detaillierte Bewertungen, Features, Screenshots und Preisinformationen.`
    
    const logoUrl = getBrandfetchLogoUrl(service.url);

    return {
        title,
        description,
        keywords: service.tags.map(tag => tag.name).join(', '),
        authors: [{ name: 'AwesomeApps' }],
        openGraph: {
            title: `${service.name} - SaaS Tool`,
            description: service.abstract ?? description,
            url: `https://awesomeapps.meimberg.io/s/${(await params).slug}`,
            siteName: 'AwesomeApps',
            type: 'website',
            locale: 'de_DE',
            images: [{
                url: logoUrl,
                width: 800,
                height: 600,
                alt: `${service.name} Logo`,
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${service.name}`,
            description: service.abstract ?? description,
            images: [logoUrl],
        },
        alternates: {
            canonical: `/s/${(await params).slug}`,
        },
        robots: {
            index: true,
            follow: true,
        },
    }
}

// Hauptseite für Service-Detail
export default async function Page({params}: {
    params: Promise<{ slug: string }>
}) {
    const service = await fetchServiceDetailBySlug((await params).slug)

    if (!service) {
        notFound() // 404 Seite
    }

    // Fetch reviews on the server
    const reviews = await fetchServiceReviews(service.documentId)
    
    // Fetch newService status
    const newService = await fetchNewServiceBySlug(service.slug)

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.voting, 0) / reviews.length
        : 0

    const logoUrl = getBrandfetchLogoUrl(service.url);

    // Structured data (JSON-LD) for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": service.name,
        "description": service.abstract || service.description || `${service.name} - Software-as-a-Service`,
        "url": service.url,
        "applicationCategory": "WebApplication",
        "operatingSystem": "Web-based",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
        },
        "image": logoUrl,
        ...(reviews.length > 0 && {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": averageRating.toFixed(1),
                "reviewCount": reviews.length,
                "bestRating": "5",
                "worstRating": "1"
            }
        }),
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <ServiceDetail service={service} initialReviews={reviews} newService={newService} />
        </>
    )
}
