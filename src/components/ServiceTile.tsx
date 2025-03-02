import React from "react";
import {Service, TagWithCount} from "../types/index";
import Link from "next/link";
import {BASE_URL} from "../pages/_app";

interface ServiceTileProps {
    service: Service,
    selectedTags: TagWithCount[],
    toggleTag: (tag: string) => void;

}


const ServiceTile: React.FC<ServiceTileProps> = ({service, selectedTags, toggleTag}) => {

    return (
        <div className="card w-60 bg-base-100 shadow-xl overflow-hidden">
            <Link href={`/detail/${service.id}`} passHref className="cursor-pointer ">
                <figure className="bg-gray-100 px-7 h-16">
                    <img src={service.logo ? BASE_URL + service.logo.url : ''} alt={service.name} className="max-h-10 w-auto my-4 mx-5"/>
                </figure>
            </Link>
            <Link href={`/detail/${service.id}`} passHref className="cursor-pointer card-body">

                <h2 className="card-title">{service.name}</h2>
                <p className="text-sm mt-1 text-gray-500">{service.description}</p>
            </Link>
            <div className="card-actions bg-blue-200 p-5">
                {service.tags.map((tag) => (
                    <div onClick={() => toggleTag(tag.id)} className="cursor-pointer ">
                        <div key={tag.id} className={
                            selectedTags.some(selectedTag => selectedTag.id === tag.id) ?
                                'badge badge-md border-0 bg-blue-800 text-blue-50 hover:bg-red-700 hover:text-red-100' :
                                'badge badge-md border-0 bg-blue-50 text-blue-800 hover:bg-green-700 hover:text-green-100'
                        }>
                            {tag.name}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default ServiceTile;
