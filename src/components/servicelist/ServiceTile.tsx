import React from "react";
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

    const handleCardClick = (e: React.MouseEvent) => {
        // Only navigate if not clicking on a badge
        const target = e.target as HTMLElement;
        if (!target.closest('.badge')) {
            window.location.href = `/s/${service.slug}`;
        }
    };

    return (
        <div 
            key={service.documentId} 
            onClick={handleCardClick}
            className="card shadow-xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300"
        >
            <div className="flex flex-col h-full ">

                {/* Card Header */}
                <div className="bg-gray-600 px-6 py-4 flex items-center gap-4 transition-colors duration-300 group-hover:bg-gray-550 ">
                    <h2 className="card-title text-white group-hover:text-saprimary-400 transition-colors duration-300 flex-grow">
                        {service.name}
                    </h2>
                    <figure className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-white rounded-full p-2">
                        <img src={iconurl} alt={service.name} className="max-h-12 max-w-12 w-auto h-auto object-contain  transition-transform duration-300"/>
                    </figure>
                </div>

                {/* Card Body */}
                <div className="card-body bg-gray-700 overflow-hidden transition-colors duration-300 group-hover:bg-gray-650">
                    <p className="text-md text-gray-300 transition-colors duration-300 group-hover:text-gray-100">{service.abstract}</p>

                    <div className="card-actions text-md">
                        {service.tags.map((tag) => (
                            <div 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTag(tag.documentId);
                                }} 
                                key={tag.documentId} 
                                className={`cursor-pointer badge badge-lg border-0  
                                ${selectedTags.some(selectedTag => selectedTag.documentId === tag.documentId) ?
                                'bg-saprimary-200 text-saprimary-950 hover:bg-red-700 hover:text-red-100' :
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
