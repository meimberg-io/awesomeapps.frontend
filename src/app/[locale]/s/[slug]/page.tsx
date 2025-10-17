import {fetchServiceDetailBySlug, fetchServiceReviews, fetchNewServiceBySlug} from '@/lib/strapi'
import ServiceDetail from '@/components/new/ServiceDetail'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import { getBrandfetchLogoUrl } from '@/lib/utils'
import { STRAPI_BASEURL, APP_BASEURL } from '@/lib/constants'
import {Locale} from '@/types/locale'

type Props = {
    params: Promise<{ slug: string; locale: Locale }>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug, locale} = await params;
    const service = await fetchServiceDetailBySlug(slug, locale)

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
    
    const logoUrl = service.logo?.url 
        ? `${STRAPI_BASEURL}${service.logo.url}` 
        : getBrandfetchLogoUrl(service.url);

    const ogLocale = locale === 'de' ? 'de_DE' : 'en_US';
    const canonicalPath = `/${locale}/s/${slug}`;

    return {
        title,
        description,
        keywords: service.tags.map(tag => tag.name).join(', '),
        authors: [{ name: 'AwesomeApps' }],
        openGraph: {
            title: `${service.name} - SaaS Tool`,
            description: service.abstract ?? description,
            url: `${APP_BASEURL}${canonicalPath}`,
            siteName: 'AwesomeApps',
            type: 'website',
            locale: ogLocale,
            images: [{
                url: logoUrl,
                width: 800,
                height: 600,
                alt: `${service.name} Logo - ${service.tags[0]?.name || 'SaaS'} Tool`,
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${service.name}`,
            description: service.abstract ?? description,
            images: [logoUrl],
        },
        alternates: {
            canonical: canonicalPath,
            languages: {
                'en': `/en/s/${slug}`,
                'de': `/de/s/${slug}`,
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    }
}

export default async function Page({params}: Props) {
    const {slug, locale} = await params;
    const service = await fetchServiceDetailBySlug(slug, locale)

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

    // Prefer Strapi logo, fallback to Brandfetch
    const logoUrl = service.logo?.url 
        ? `${STRAPI_BASEURL}${service.logo.url}` 
        : getBrandfetchLogoUrl(service.url);

    // Structured data (JSON-LD) for SEO
    const softwareApplicationSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": service.name,
        "description": service.abstract || service.description || `${service.name} - Software-as-a-Service`,
        "url": `${APP_BASEURL}/s/${service.slug}`,
        "applicationCategory": "WebApplication",
        "operatingSystem": "Web-based",
        ...(service.tags.length > 0 && {
            "applicationSubCategory": service.tags[0].name
        }),
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
        },
        "image": logoUrl,
        "softwareHelp": {
            "@type": "WebPage",
            "url": service.url
        },
        ...(service.publishdate && {
            "datePublished": service.publishdate
        }),
        ...(service.updatedAt && {
            "dateModified": service.updatedAt
        }),
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

    // BreadcrumbList schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": APP_BASEURL
            },
            ...(service.tags.length > 0 ? [{
                "@type": "ListItem",
                "position": 2,
                "name": service.tags[0].name,
                "item": `${APP_BASEURL}/t/${service.tags[0].name}`
            }] : []),
            {
                "@type": "ListItem",
                "position": service.tags.length > 0 ? 3 : 2,
                "name": service.name,
                "item": `${APP_BASEURL}/s/${service.slug}`
            }
        ]
    }

    const structuredData = [softwareApplicationSchema, breadcrumbSchema]

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
