import React from "react";
import { Service } from "../data/services";

interface ServiceDetailProps {
    service: Service;
    onBack: () => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onBack }) => {
    return (
        <div className="p-4">
            <button className="btn btn-secondary mb-4" onClick={onBack}>
                Zurück
            </button>
            <h1 className="text-3xl font-bold">{service.name}</h1>
            <p className="mt-2">{service.description}</p>
            <div className="flex gap-2 mt-4">
                {service.tags.map((tag) => (
                    <div key={tag} className="badge badge-secondary">
                        {tag}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceDetail;
