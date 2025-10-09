import {fetchPage} from '@/lib/strapi'
import Header from '@/components/Header'
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
        <div className="min-h-screen bg-background">
            <Header/>
            
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 px-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/30 to-transparent" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
                
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
                            {page.title}
                        </h1>
                        {page.subtitle && (
                            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
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
        </div>
    )
}
