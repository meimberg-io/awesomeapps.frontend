import React from "react";
import Link from "next/link";
import {STRAPI_BASEURL} from "../pages/_app";
import {Tag} from "../types/tag";
import {Service} from "../types/service";

interface ServiceTileProps {
    service: Service,
    selectedTags: Tag[],
    toggleTag: (tag: string) => void;

}


const ServiceTile: React.FC<ServiceTileProps> = ({service, selectedTags, toggleTag}) => {
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
                    <div onClick={() => toggleTag(tag.documentId)} key={tag.documentId} className={`cursor-pointer badge badge-md border-0 
                        ${selectedTags.some(selectedTag => selectedTag.documentId === tag.documentId) ?
                        'bg-sasecondary-800 text-sasecondary-50 hover:bg-red-700 hover:text-red-100' :
                        'bg-sasecondary-50 text-sasecondary-800 hover:bg-saprimary-200 hover:text-saprimary-950'
                    }`}>
                        {tag.name}
                    </div>
                ))}

            </div>
        </div>
    );
};

export default ServiceTile;
