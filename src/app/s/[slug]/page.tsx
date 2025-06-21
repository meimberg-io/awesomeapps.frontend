import {fetchServiceDetailBySlug} from '@/lib/strapi'
import Header from '@/components/Header'
import PageHeader from '@/components/PageHeader'
import ServiceDetail from '@/components/servicedetail/ServiceDetail'
import {ArrowRightCircleIcon} from '@heroicons/react/20/solid'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import {PageHeaderStyle} from "@/types/PageHeaderStyle";

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
            url: `https://serviceatlas.meimberg.io/s/${(await params).slug}`,
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

    return (
        <>
            <Header/>

            <div className="relative isolate overflow-hidden pt-16 mb-16 mx-auto">
                <div className="shadow-lg">
                    <PageHeader
                        title={service.name}
                        subtitle={service.abstract}
                        icon={service.logo}
                        style={PageHeaderStyle.SERVICE}
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-x-2 gap-y-16 lg:mx-auto max-w-screen-2xl lg:mx-0 lg:grid-cols-2 lg:items-start lg:gap-y-10">
                <div className="col-span-2 lg:gap-x-2 lg:pr-8">
                    <ServiceDetail service={service}/>
                </div>

                <div className="lg:sticky w-96 lg:top-12 pt-8 lg:col-start-3 rotate-3 lg:overflow-hidden">
                    <div className="mb-16 px-4 pb-12 max-w-full">
                        <div className="card bg-sasecondary-50 shadow-xl overflow-hidden">
                            <div className="card-body">
                                <h3 className="mt-0 text-sasecondary-600">{service.name}</h3>
                                <p className="text-md mt-1 text-blue-700 mb-0">{service.shortfacts}</p>
                            </div>
                            <Link
                                className="card-actions bg-sasecondary-400 hover:bg-saprimary-500 p-5 hover:no-underline"
                                href={service.url}
                                target="_blank"
                            >
                                <ArrowRightCircleIcon
                                    aria-hidden="true"
                                    className="size-6 text-sasecondary-50 hover:text-saprimary-50"
                                />
                                <span className="text-white hover:text-saprimary-50">{service.url}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
