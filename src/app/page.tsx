import {fetchServices, fetchTags} from '@/lib/strapi'
import {Metadata} from "next";
import InteractiveServiceList from "@/components/new/InteractiveServiceList";

export const metadata: Metadata = {
    title: 'AwesomeApps',
    description: 'AwesomeApps ist eine Sammlung von Software-as-a-Service (SaaS) Lösungen.',
}


export default async function HomePage() {
    // Initially only load featured (top) services
    const allServices = await fetchServices([])
    const featuredServices = allServices.filter(service => service.top)
    const initialTags = await fetchTags([])

    return (
        <InteractiveServiceList
            initialServices={featuredServices}
            initialTags={initialTags}
        />
    )
}
