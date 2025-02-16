import React from "react";
import {Service} from "../types";
import ServiceTile from "./ServiceTile.tsx";

interface Props {
    services: Service[];
}


const ServiceList: React.FC<Props> = ({services}) => {
    function setSelectedServiceId(id: string) {
        console.log(id);
    }

    return (

        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Service Übersicht</h1>


            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {services.map((service) => (
                    <ServiceTile
                        key={service.id}
                        service={service}
      
                        
                                                onClick={() => setSelectedServiceId(service.id)}
                        
                    />
                ))}


            </div>
        </div>


    );
};

export default ServiceList;
