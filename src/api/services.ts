import { client, GET_SERVICES, GET_SERVICE_DETAIL } from "./graphql";
import {Service, Tag} from "../types";
import {StrapiService} from "../types/strapi.ts";

export const fetchServices = async (tag?: string): Promise<Service[]> => {
    const { data } = await client.query({
        query: GET_SERVICES,
        variables: { tag },
    });

    return data.services.map((item: StrapiService) => ({
        id: item.documentId,
        name: item.name,
        description: item.description,
        thumbnail: item.thumbnail[0],
        tags: item.tags.map((tag: Tag) => ({
            id: tag.id,
            name: tag.name,
        }))

    }));
};

export const fetchServiceDetail = async (id: string): Promise<Service> => {
    const { data } = await client.query({
        query: GET_SERVICE_DETAIL,
        variables: { id },
    });

    const item : StrapiService = data.service.data;
    return {
        id: item.documentId,
        name: item.name,
        description: item.description,
        tags: item.tags.map((tag: Tag) => ({
            id: tag.id,
            name: tag.name,
        })),
        thumbnail: item.thumbnail[0]
    };
};
