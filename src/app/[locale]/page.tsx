import {fetchServices, fetchTags} from '@/lib/strapi'
import {Metadata} from "next";
import InteractiveServiceList from "@/components/new/InteractiveServiceList";
import {Locale} from '@/types/locale';
import {getTranslations} from 'next-intl/server';
import {Service} from '@/types/service';

type Props = {
    params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {locale} = await params;
    const t = await getTranslations({locale, namespace: 'meta'});

        const ogLocale = locale === 'de' ? 'de_DE' : 'en_US';
        const canonicalPath = `/${locale}`;

        return {
            title: t('homeTitle'),
            description: t('homeDescription'),
            openGraph: {
                title: t('homeTitle'),
                description: t('homeDescription'),
                url: `https://awesomeapps.meimberg.io${canonicalPath}`,
                siteName: 'AwesomeApps',
                type: 'website',
                locale: ogLocale,
            },
            twitter: {
                card: 'summary_large_image',
                title: t('homeTitle'),
                description: t('homeDescription'),
            },
            alternates: {
                canonical: canonicalPath,
                languages: {
                    'en': '/en',
                    'de': '/de',
                },
            },
        };
}

export default async function HomePage({params}: Props) {
    const {locale} = await params;
    
    let allServices: Service[];
    try {
        allServices = await fetchServices([], locale);
    } catch (error) {
        console.error('Failed to fetch services:', error);
        allServices = [];
    }
    
    const initialTags = await fetchTags([])

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "AwesomeApps",
        "url": "https://awesomeapps.meimberg.io",
        "inLanguage": locale,
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
