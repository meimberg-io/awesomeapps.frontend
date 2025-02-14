import React from "react";
import { Service } from "../types/index";

interface ServiceTileProps {
    service: Service;
    onClick: () => void;
}

const ServiceTile: React.FC<ServiceTileProps> = ({ service, onClick }) => {
    return (
        <div className="card w-60 bg-base-100 shadow-xl cursor-pointer" onClick={onClick}>
            <figure>
                <img src={service.thumbnail.url} alt={service.name} />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{service.name}</h2>
                <p>{service.description}</p>
                <div className="card-actions">
                    {service.tags.map((tag) => (
                        <div key={tag.id} className="badge badge-secondary">
                            {tag.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceTile;
