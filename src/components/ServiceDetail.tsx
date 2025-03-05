import React from "react";
import {Service} from "../types/service";
interface Props {
    service: Service;
}

const ServiceDetail: React.FC<Props> = ({ service }) => {
    return (
        <div>
            <h1>{service.name}</h1>
            <p>{service.description}</p>
            <h3>Tags</h3>
            <ul>
                {service.tags.map(tag => (
                    <li key={tag.documentId}>{tag.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ServiceDetail;
