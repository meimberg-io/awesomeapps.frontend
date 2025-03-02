import React from "react";
import {Service, TagWithCount} from "../types";
import ServiceTile from "./ServiceTile";

interface Props {
    services: Service[];
    selectedTags: TagWithCount[];
    toggleTag: (tag: string) => void;
}


const ServiceList: React.FC<Props> = ({services, selectedTags, toggleTag}) => {


    return (
        <main className="py-10 px-4 sm:px-6 lg:px-8  ">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {services.map((service) => (
                        <ServiceTile
                            key={service.id}
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
