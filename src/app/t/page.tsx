import Header from '@/components/Header'
import {fetchServices, fetchTags} from '@/lib/strapi'
import InteractiveServiceList from '@/components/servicelist/InteractiveServiceList'
import {Metadata} from "next";


export const metadata: Metadata = {
    title: 'Serviceatlas',
    description: 'Der Serviceatlas ist eine Sammlung von Software-as-a-Service (SaaS) Lösungen.',
}


export default async function HomePage() {
    const initialServices = await fetchServices([])
    const initialTags = await fetchTags([])

    return (
        <div>
            <Header/>
            <main>
                <div className="relative isolate overflow-hidden pt-16">
                    <InteractiveServiceList
                        initialServices={initialServices}
                        initialTags={initialTags}
                    />
                </div>
            </main>
        </div>
    )
}
