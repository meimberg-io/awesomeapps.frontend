import React from "react";
import {Service, Tag} from "../types";
import ServiceTile from "./ServiceTile.tsx";
import {useNavigate} from "react-router-dom";

interface Props {
    services: Service[];
    selectedTags: Tag[];
    toggleTag: (tag: Tag) => void;
}


const ServiceList: React.FC<Props> = ({services, selectedTags, toggleTag}) => {

    const navigate = useNavigate();

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
                            onClick={() => navigate(`/detail/${service.id}`)}
                        />

                    ))}


                </div>
            </div>


        </main>
    );
};

export default ServiceList;
