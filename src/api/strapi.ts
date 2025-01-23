

import { Service, Tag, StrapiResponse } from "../types";

export const fetchServices = async (): Promise<Service[]> => {
    const response = await fetch("http://localhost:1337/api/services?populate=tags");
    if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Daten");
    }

    const json: StrapiResponse<Service> = await response.json();

    return json.data.map((item): Service => ({
        id: item.id,
        documentId: item.documentId,
        name: item.name,
        description: item.description,
        wutz: item.wutz,
        url: item.url,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        publishedAt: item.publishedAt,
        tags: item.tags.map((tag): Tag => ({
            id: tag.id,
            documentId: tag.documentId,
            name: tag.name,
            createdAt: tag.createdAt,
            updatedAt: tag.updatedAt,
            publishedAt: tag.publishedAt,
        })),
    }));
};
