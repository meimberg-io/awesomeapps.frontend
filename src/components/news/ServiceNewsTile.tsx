"use client"
import React from "react";
import Link from "next/link";
import {Tag} from "@/types/tag";
import {Service} from "@/types/service";
import {STRAPI_BASEURL} from "@/lib/constants";

interface ServiceTileProps {
    service: Service,

}


const ServiceTile: React.FC<ServiceTileProps> = ({service}) => {
    const iconurl = service.logo?.url ? `${STRAPI_BASEURL}${service.logo.url}` : "/dummy.svg";

    return (
        <div key={service.documentId} className="card shadow-xl overflow-hidden transition-all-transform duration-300 ease-in-out">

            <div className="flex flex-col h-full group ">


                <Link href={`/s/${service.slug}`} passHref className="cursor-pointer ">
                    <figure className="bg-gray-200 px-7 h-16 group-hover:bg-saprimary-200 transition-all-transform duration-300 ease-in-out">
                        <img src={iconurl} alt={service.name} className="max-h-10 w-auto my-4 mx-5"/>
                    </figure>
                </Link>

                {/* cardbody */}
                <Link href={`/s/${service.slug}`} passHref className="cursor-pointer card-body bg-gray-50 hover:no-underline group/card">
                    <h2 className="card-title text-sasecondary-500 group-hover:text-saprimary-400 transition-all-transform duration-300 ease-in-out">
                        {service.name}
                    </h2>
                    <p className="text-sm mt-1 text-gray-500">{service.abstract}</p>
                </Link>
            </div>

            {/* cardfooter */}

            <div className="card-actions bg-sasecondary-200 p-5 :">
                {service.tags.map((tag) => (
                    <Link href={"/t/" + tag.name} key={tag.documentId}>
                        <div className={`cursor-pointer badge badge-md border-0 bg-sasecondary-50 text-sasecondary-800 hover:bg-saprimary-200 hover:text-saprimary-950`}>
                            {tag.name}
                        </div>
                    </Link>
                ))}

            </div>
        </div>
    );
};

export default ServiceTile;
