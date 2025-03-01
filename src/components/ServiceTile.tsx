import React from "react";
import {Service, Tag} from "../types/index";

interface ServiceTileProps {
    service: Service,
    onClick: () => void,
    selectedTags: Tag[],
    toggleTag: (tag: Tag) => void;

}



const ServiceTile: React.FC<ServiceTileProps> = ({service, onClick, selectedTags, toggleTag}) => {
    const BASE_URL = (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : 'http://localhost:1337';

    return (
        <div className="card w-60 bg-base-100 shadow-xl cursor-pointer" onClick={onClick}>
            <figure>
                <img src={service.thumbnail ? BASE_URL + service.thumbnail.url : ''} alt={service.name}/>
            </figure>
            <div className="card-body">
                <h2 className="card-title">{service.name}</h2>
                <p>{service.description}</p>
                <div className="card-actions">
                    {service.tags.map((tag) => (
                        <div key={tag.id} className={selectedTags.some(selectedTag => selectedTag.id === tag.id) ? 'badge badge-md bg-blue-50 text-blue-800hover:bg-red-700 hover:text-red-50' : 'badge bg-blue-800 text-blue-50  hover:bg-green-600 hover:text-green-50'} onClick={() => toggleTag(tag)}>
                            {tag.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceTile;
