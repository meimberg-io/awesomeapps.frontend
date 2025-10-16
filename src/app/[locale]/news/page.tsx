import {fetchServicesNews} from '@/lib/strapi'
import {Metadata} from "next";
import ServiceNewsList from "@/components/news/ServiceNewsList";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {Locale} from '@/types/locale';
import {getTranslations} from 'next-intl/server';

type Props = {
    params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {locale} = await params;
    const t = await getTranslations({locale, namespace: 'meta'});

        const ogLocale = locale === 'de' ? 'de_DE' : 'en_US';
        const canonicalPath = `/${locale}/news`;

        return {
            title: t('newsTitle'),
            description: t('newsDescription'),
            openGraph: {
                title: t('newsTitle'),
                description: t('newsDescription'),
                url: `https://awesomeapps.meimberg.io${canonicalPath}`,
                siteName: 'AwesomeApps',
                type: 'website',
                locale: ogLocale,
            },
            twitter: {
                card: 'summary_large_image',
                title: t('newsTitle'),
                description: t('newsDescription'),
            },
            alternates: {
                canonical: canonicalPath,
                languages: {
                    'en': '/en/news',
                    'de': '/de/news',
                },
            },
            robots: {
                index: true,
                follow: true,
            },
        };
}

export default async function NewsPage({params}: Props) {
    const {locale} = await params;
    const services = await fetchServicesNews(locale);
    return (
        <div>
            <Header/>
            <ServiceNewsList services={services}/>
            <Footer/>
        </div>
    )
}
