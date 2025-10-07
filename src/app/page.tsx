import Header from '@/components/Header'
import {fetchTags} from '@/lib/strapi'
import {Metadata} from "next";
import Tagslist from "@/components/home/Tagslist";
import PageHeader from "@/components/PageHeader";
import {PageHeaderStyle} from "@/types/PageHeaderStyle";

export const metadata: Metadata = {
    title: 'Serviceatlas',
    description: 'Der Serviceatlas ist eine Sammlung von Software-as-a-Service (SaaS) Lösungen.',
}


export default async function HomePage() {
    const initialTags = await fetchTags([])

    return (
        <div>
            <Header/>
            <div className="relative isolate overflow-hidden pt-16  mx-auto">
                <div className="shadow-lg">
                    <PageHeader
                        title="Serviceatlas"
                        subtitle="Kategorieübersicht"

                        style={PageHeaderStyle.NEWS}
                    />
                </div>
            </div>
            <main>
                    <Tagslist tags={initialTags}/>

            </main>
        </div>
    )
}
