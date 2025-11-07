'use client'

import React from 'react'
import {App} from '@/types/app'
import ServiceNewsTile from "@/components/news/ServiceNewsTile"
import Image from "next/image"
import heroBackground from "@/assets/header_01.jpg";
import {useTranslations} from 'next-intl';
import {Locale} from '@/types/locale';

interface Props {
    services: App[];
    locale: Locale;
}

export default function ServiceNewsList({services, locale}: Props) {
    const t = useTranslations('news');
    
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 px-6">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={heroBackground}
                        alt={t('title')}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/50" />
                {/* Optional gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/30 to-transparent" />
                
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
                            {t('title')}
                        </h1>
                        <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <main className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {services.map((service) => (
                        <ServiceNewsTile
                            key={service.documentId}
                            service={service}
                            locale={locale}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
