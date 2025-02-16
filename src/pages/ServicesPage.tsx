import React, { useEffect, useState } from "react";
import { fetchServices } from "../api/services";
import ServiceList from "../components/ServiceList";
import FilterBar from "../components/FilterBar";
import {Service} from "../types";
import ThemeSwitcher from "../components/ThemeSwitcher.tsx";
import Header from "../components/Header.tsx";

const ServicesPage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    useEffect(() => {
        fetchServices(selectedTag ?? undefined).then(setServices).catch(console.error);
    }, [selectedTag]);

    return (
        <div>
            <Header />
            <FilterBar tags={["AI", "Cloud", "Automation"]} selectedTag={selectedTag} onSelectTag={setSelectedTag} />
            <ServiceList services={services} />
        </div>
    );
};

export default ServicesPage;
