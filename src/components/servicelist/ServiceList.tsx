import React from "react";
import ServiceTile from "../ServiceTile";
import {Tag} from "../../types/tag";
import {Service} from "../../types/service";

interface Props {
    services: Service[];
    selectedTags: Tag[];
    toggleTag: (tag: string) => void;
}


const ServiceList: React.FC<Props> = ({services, selectedTags, toggleTag}) => {


    return (
        <main className="py-10 px-4 sm:px-6 lg:px-8  ">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                    {services.map((service) => (
                        <ServiceTile
                            key={service.documentId}
                            service={service}
                            selectedTags={selectedTags}
                            toggleTag={toggleTag}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default ServiceList;
