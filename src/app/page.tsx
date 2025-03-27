import Header from '@/components/Header'
import { fetchServices, fetchTags } from '@/lib/strapi'
import InteractiveServiceList from '@/components/servicelist/InteractiveServiceList'

export default async function HomePage() {
    const initialServices = await fetchServices([])
    const initialTags = await fetchTags([])

    return (
        <div>
            <Header />
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
