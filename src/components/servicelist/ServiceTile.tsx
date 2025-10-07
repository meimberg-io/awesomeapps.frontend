import React from "react";
import Link from "next/link";
import {Tag} from "@/types/tag";
import {Service} from "@/types/service";
import {STRAPI_BASEURL} from "@/lib/constants";

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


                {/* cardbody */}
                <div className="card-body bg-gray-700 overflow-hidden">
                    <Link href={`/s/${service.slug}`} passHref className="cursor-pointer cardhover hover:no-underline group/cardhover ">
                        <figure className="w-20 h-20 float-end ml-2 mb-2">
                            <img src={iconurl} alt={service.name} className="max-h-10 w-auto my-4 mx-5"/>
                        </figure>
                            <h2 className="card-title text-white group-hover:text-saprimary-400 transition-all-transform duration-300 ease-in-out">
                                {service.name}
                            </h2>
                            <p className="text-md mt-1 text-gray-300">{service.abstract}</p>

                    </Link>

                    <div className="card-actions  text-md">
                        {service.tags.map((tag) => (
                            <div onClick={() => toggleTag(tag.documentId)} key={tag.documentId} className={`cursor-pointer badge badge-lg border-0  
                                ${selectedTags.some(selectedTag => selectedTag.documentId === tag.documentId) ?
                                'bg-sasecondary-800 text-sasecondary-50 hover:bg-red-700 hover:text-red-100' :
                                'bg-gray-500 text-white hover:bg-saprimary-200 hover:text-saprimary-950'
                            }`}>
                                {tag.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </div>
    );
};

export default ServiceTile;
