// src/app/p/[slug]/page.tsx

import {fetchPage} from '@/lib/strapi'
import Header from '@/components/Header'
import PageHeader, {PageHeaderStyle} from '@/components/PageHeader'
import DynamicZoneComponent from '@/components/strapicomponents/dynamiczone/DynamicZoneComponent'
import {notFound} from 'next/navigation'


export default async function Page({params}: {
    params: Promise<{ slug: string }>
}) {
    const page = await fetchPage((await params).slug)

    if (!page) {
        notFound()
    }

    return (
        <div>
            <Header/>
            <main>
                <div className="relative isolate overflow-hidden pt-16">
                    <div className="shadow-lg">
                        <PageHeader
                            title={page.title}
                            subtitle={page.subtitle}
                            style={PageHeaderStyle.PAGE}
                        />

                        <div className="pt-6 pb-4 sm:pb-6 max-w-3xl gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 mx-auto contentsection">
                            <DynamicZoneComponent blocks={page.content}/>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
