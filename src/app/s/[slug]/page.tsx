import {fetchServiceDetailBySlug, fetchServiceReviews} from '@/lib/strapi'
import ServiceDetail from '@/components/new/ServiceDetail'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'

// Dynamische Metadaten für SEO, SSR-kompatibel
type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const service = await fetchServiceDetailBySlug((await params).slug)

    if (!service) {
        return {
            title: 'Nicht gefunden',
            description: 'Der angeforderte Service konnte nicht gefunden werden.',
        }
    }

    return {
        title: service.name,
        description: service.abstract ?? undefined,
        openGraph: {
            title: service.name,
            description: service.abstract ?? undefined,
            url: `https://awesomeapps.meimberg.io/s/${(await params).slug}`,
            images: service.logo?.url ? [{
                url: service.logo.url,
                width: service.logo.width ? Number(service.logo.width) : undefined,
                height: service.logo.height ? Number(service.logo.height) : undefined,
                alt: service.name,
            }] : [],
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

    return <ServiceDetail service={service} initialReviews={reviews} />
}
