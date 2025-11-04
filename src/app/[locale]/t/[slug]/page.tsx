import {fetchServices, fetchTagDetailByName, fetchTags} from '@/lib/strapi'
import InteractiveServiceList from '@/components/new/InteractiveServiceList'
import {Metadata} from "next";
import {notFound} from "next/navigation";
import {Tag} from "@/types/tag";
import {Locale} from "@/types/locale";
import {APP_BASEURL} from '@/lib/constants';
import {getTranslations} from 'next-intl/server';

type Props = {
    params: Promise<{ slug: string; locale: Locale }>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug: tagname, locale} = await params;
    const tag: Tag | undefined = await fetchTagDetailByName(tagname)
    const t = await getTranslations({locale, namespace: 'errors'})

    if (!tag) {
        return {
            title: `${t('categoryNotFound', { category: tagname })} - AwesomeApps`,
            description: t('categoryNotFoundDescription', { category: tagname }),
        }
    }

    const title = `${tag.name} - SaaS Tools & Apps | AwesomeApps`
    const description = tag.description 
        ? tag.description 
        : locale === 'de'
            ? `Entdecke die besten ${tag.name} SaaS-Tools und Online-Apps. Vergleiche Features, Preise und Bewertungen.`
            : `Discover the best ${tag.name} SaaS tools and online apps. Compare features, prices, and reviews.`

    return {
        title,
        description,
        keywords: `${tag.name}, SaaS, Software, Online Tools, Apps`,
        openGraph: {
            title: `${tag.name} Tools`,
            description,
            url: `${APP_BASEURL}/t/${tagname}`,
            siteName: 'AwesomeApps',
            type: 'website',
            locale: 'de_DE',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${tag.name} Tools`,
            description,
        },
        alternates: {
            canonical: `/t/${tagname}`,
        },
        robots: {
            index: true,
            follow: true,
        },
    }
}


// Hauptseite für Service-Detail
export default async function Page({params}: {
    params: Promise<{ slug: string; locale: Locale }>
}) {
    const {slug: tagname, locale} = await params;
    const tag: Tag | undefined = await fetchTagDetailByName(tagname)

    if (!tag) {
        notFound() // 404 Seite
    }

    const initialServices = await fetchServices([tag], locale)
    const initialTags = await fetchTags([tag], locale)

    // BreadcrumbList schema for tag pages
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
            {
                "@type": "ListItem",
                "position": 2,
                "name": tag.name,
                "item": `${APP_BASEURL}/t/${tagname}`
            }
        ]
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <InteractiveServiceList
                initialServices={initialServices}
                initialTags={initialTags}
                maintag={tag}
            />
        </>
    )
}

