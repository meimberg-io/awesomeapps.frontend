import React, { useEffect, useState } from "react";
import { fetchServices, Service } from "./api/strapi";
import FilterBar from "./components/FilterBar";
import ServiceTile from "./components/ServiceTile";
import ServiceDetail from "./components/ServiceDetail";

const App: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

    useEffect(() => {
        const getServices = async () => {
            try {
                console.info("Daten abgerufen:");

                const data = await fetchServices();
                setServices(data);
            } catch (error) {
                console.error("Fehler beim Abrufen der Daten:", error);
            }
        };
        getServices();
    }, []);

    const filteredServices = selectedTag
        ? services.filter((service) => service.tags.includes(selectedTag))
        : services;
    console.log(services);
    console.log(Array.isArray(services)); // Prüft, ob es ein Array ist
    const tags = Array.from(new Set(services.flatMap((service) => service.tags)));

    const selectedService = services.find((service) => service.id === selectedServiceId);

    return (
        <div className="p-4">
            {selectedService ? (
                <ServiceDetail
                    service={selectedService}
                    onBack={() => setSelectedServiceId(null)}
                />
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-4">Service Übersicht</h1>
                    <FilterBar
                        tags={tags}
                        selectedTag={selectedTag}
                        onTagSelect={setSelectedTag}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredServices.map((service) => (
                            <ServiceTile
                                key={service.id}
                                service={service}
                                onClick={() => setSelectedServiceId(service.id)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default App;