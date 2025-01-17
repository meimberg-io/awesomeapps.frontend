import React from "react";
import { Service } from "../data/services";

interface ServiceTileProps {
    service: Service;
    onClick: () => void;
}

const ServiceTile: React.FC<ServiceTileProps> = ({ service, onClick }) => {
    return (
        <div className="card w-60 bg-base-100 shadow-xl cursor-pointer" onClick={onClick}>
            <figure>
                <img src={service.image} alt={service.name} />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{service.name}</h2>
                <p>{service.description}</p>
                <div className="card-actions">
                    {service.tags.map((tag) => (
                        <div key={tag} className="badge badge-secondary">
                            {tag}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceTile;
