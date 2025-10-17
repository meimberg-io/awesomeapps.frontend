import {fetchPage} from '@/lib/strapi'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DynamicZoneComponent from '@/components/strapicomponents/dynamiczone/DynamicZoneComponent'
import {notFound} from 'next/navigation'
import {STRAPI_BASEURL, APP_BASEURL} from '@/lib/constants'
import type {Metadata} from 'next'
import {Locale} from '@/types/locale'

type Props = {
    params: Promise<{ slug: string; locale: Locale }>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug, locale} = await params;
    const page = await fetchPage(slug, locale)

    if (!page) {
        return {
            title: 'Seite nicht gefunden - AwesomeApps',
            description: 'Die angeforderte Seite konnte nicht gefunden werden.',
        }
    }

    const keyvisualUrl = page.keyvisual?.url ? `${STRAPI_BASEURL}${page.keyvisual.url}` : null
    const ogLocale = locale === 'de' ? 'de_DE' : 'en_US';
    const canonicalPath = `/${locale}/p/${slug}`;

    return {
        title: `${page.title} | AwesomeApps`,
        description: page.subtitle || page.title,
        openGraph: {
            title: page.title,
            description: page.subtitle || page.title,
            url: `${APP_BASEURL}${canonicalPath}`,
            siteName: 'AwesomeApps',
            type: 'website',
            locale: ogLocale,
            ...(keyvisualUrl && {
                images: [{
                    url: keyvisualUrl,
                    alt: page.title,
                }],
            }),
        },
        twitter: {
            card: 'summary_large_image',
            title: page.title,
            description: page.subtitle || page.title,
            ...(keyvisualUrl && { images: [keyvisualUrl] }),
        },
        alternates: {
            canonical: canonicalPath,
            languages: {
                'en': `/en/p/${slug}`,
                'de': `/de/p/${slug}`,
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
    const page = await fetchPage(slug, locale)

    if (!page) {
        notFound()
    }

    const keyvisualUrl = page.keyvisual?.url ? `${STRAPI_BASEURL}${page.keyvisual.url}` : null;

    return (
        <div className="min-h-screen bg-background">
            <Header/>
            
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 px-6 min-h-[360px] flex items-center">
                {keyvisualUrl ? (
                    <>
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src={keyvisualUrl}
                                alt={page.title}
                                className="w-full h-full object-cover object-center"
                            />
                            {/* Dark overlay for better text readability */}
                            <div className="absolute inset-0 bg-black/50" />
                        </div>
                    </>
                ) : (
                    <>
                        {/* Fallback gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/30 to-transparent" />
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
                    </>
                )}
                
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center">
                        <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${keyvisualUrl ? 'text-white' : 'text-primary-foreground'}`}>
                            {page.title}
                        </h1>
                        {page.subtitle && (
                            <p className={`text-lg md:text-xl max-w-2xl mx-auto ${keyvisualUrl ? 'text-white/90' : 'text-primary-foreground/90'}`}>
                                {page.subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Content */}
            <main className="container mx-auto px-6 py-12 max-w-3xl">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <DynamicZoneComponent blocks={page.content}/>
                </div>
            </main>
            <Footer/>
        </div>
    )
}
