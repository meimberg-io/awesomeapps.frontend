'use client'

import React from 'react'
import {Service} from '@/types/service'
import ServiceNewsTile from "@/components/news/ServiceNewsTile";

interface Props {
    services: Service[];
}

export default function ServiceNewsList({services}: Props) {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 px-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/30 to-transparent" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
                
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
                            Vorgestellte Services
                        </h1>
                        <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                            Aktuelle Websites und Internetservices - frisch vorgestellt
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <main className="container mx-auto px-6 py-12">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">
                        {services.length} Services gefunden
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {services.map((service) => (
                        <ServiceNewsTile
                            key={service.documentId}
                            service={service}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
