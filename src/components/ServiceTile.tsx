import React from "react";
import {Service, Tag} from "../types/index";
import {BASE_URL} from "../App.tsx";

interface ServiceTileProps {
    service: Service,
    onClick: () => void,
    selectedTags: Tag[],
    toggleTag: (tag: Tag) => void;

}



const ServiceTile: React.FC<ServiceTileProps> = ({service, onClick, selectedTags, toggleTag}) => {

    return (
        <div className="card w-60 bg-base-100 shadow-xl cursor-pointer overflow-hidden" onClick={onClick}>
            <figure className="bg-gray-100 px-7 h-16">
                <img src={service.logo ? BASE_URL + service.logo.url : ''} alt={service.name} className="max-h-10 w-auto my-4 mx-5"/>
            </figure>
            <div className="card-body">
                <h2 className="card-title">{service.name}</h2>
                <p className="text-sm mt-1 text-gray-500">{service.description}</p>

            </div>
            <div className="card-actions bg-blue-200 p-5">
                {service.tags.map((tag) => (
                    <div key={tag.id} className={
                            selectedTags.some(selectedTag => selectedTag.id === tag.id) ?
                                'badge badge-md border-0 bg-blue-50 text-blue-800 hover:bg-red-700 hover:text-red-50' :
                                'badge badge-md border-0 bg-blue-800 text-blue-50  hover:bg-green-600 hover:text-green-50'} onClick={() => toggleTag(tag)
                    }>
                        {tag.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceTile;
