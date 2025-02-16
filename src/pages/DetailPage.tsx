import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchServiceDetail } from "../api/services";
import ServiceDetail from "../components/ServiceDetail";
import { Service } from "../types";

const DetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // ID aus der URL holen
    const [service, setService] = useState<Service | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        fetchServiceDetail(id)
            .then(setService)
            .catch(() => setError("Service konnte nicht geladen werden"));
    }, [id]);

    if (error) return <p>{error}</p>;
    if (!service) return <p>Laden...</p>;

    return <ServiceDetail service={service} />;
};

export default DetailPage;
