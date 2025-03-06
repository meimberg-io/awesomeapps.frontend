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

    return (
        <div key={service.documentId} className="card bg-base-100 shadow-xl overflow-hidden">
            <Link href={`/s/${service.slug}`} passHref className="cursor-pointer ">
                <figure className="bg-gray-100 px-7 h-16">
                    <img src={service.logo ? STRAPI_BASEURL + service.logo.url : ''} alt={service.name} className="max-h-10 w-auto my-4 mx-5"/>
                </figure>
            </Link>
            <Link href={`/s/${service.slug}`} passHref className="cursor-pointer card-body">

                <h2 className="card-title">{service.name}</h2>
                <p className="text-sm mt-1 text-gray-500">{service.description}</p>
            </Link>
            <div className="card-actions bg-blue-200 p-5">
                {service.tags.map((tag) => (
                    <div onClick={() => toggleTag(tag.documentId)} key={tag.documentId} className={`cursor-pointer badge badge-md border-0 
                        ${selectedTags.some(selectedTag => selectedTag.documentId === tag.documentId) ?
                        'bg-blue-800 text-blue-50 hover:bg-red-700 hover:text-red-100' :
                        'bg-blue-50 text-blue-800 hover:bg-green-700 hover:text-green-100'
                    }`}>
                        {tag.name}
                    </div>
                ))}

            </div>
        </div>
    );
};

export default ServiceTile;
