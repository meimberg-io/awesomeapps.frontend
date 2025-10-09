import {fetchServices, fetchTags} from '@/lib/strapi'
import {Metadata} from "next";
import InteractiveServiceList from "@/components/new/InteractiveServiceList";

export const metadata: Metadata = {
    title: 'Serviceatlas',
    description: 'Der Serviceatlas ist eine Sammlung von Software-as-a-Service (SaaS) Lösungen.',
}


export default async function HomePage() {
    const initialServices = await fetchServices([])
    const initialTags = await fetchTags([])

    return (
        <InteractiveServiceList
            initialServices={initialServices}
            initialTags={initialTags}
        />
    )
}
