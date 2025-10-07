'use client'

import React from 'react'
import {Service} from '@/types/service'
import PageHeader from "@/components/PageHeader";
import ServiceNewsTile from "@/components/news/ServiceNewsTile";
import {PageHeaderStyle} from "@/types/PageHeaderStyle";

interface Props {
    services: Service[];
}

export default function ServiceNewsList({services}: Props) {


    return (

        <>
            <div className="shadow-lg">
                <PageHeader
                    title="Vorgestelle Services"
                    style={PageHeaderStyle.NEWS}
                    subtitle="Aktuelle Website und Internetservices - frisch vorgestellt"
                />
            </div>

            <main className="py-10 px-4 sm:px-6 lg:px-8  ">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                    <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-10"}>
                        {services.map((service) => (
                            <ServiceNewsTile
                                key={service.documentId}
                                service={service}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </>
    );

}
