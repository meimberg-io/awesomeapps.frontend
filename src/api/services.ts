import { client, GET_SERVICES, GET_TAGS, GET_SERVICE_DETAIL } from "./graphql";
import {Service, Tag} from "../types";
import {StrapiService, StrapiTag} from "../types/strapi.ts";

export const fetchServices = async (tags?: Tag[]): Promise<Service[]> => {
    const tagIds = tags?.map(tag => tag.id) || [];


    const { data } = await client.query({
        query: GET_SERVICES,
        variables: { tags: tagIds },
    });

    return data.services.map((item: StrapiService) => ({
        id: item.documentId,
        name: item.name,
        description: item.description,
        thumbnail: item.thumbnail,
        tags: item.tags.map((tag: StrapiTag) => ({
            id: tag.documentId,
            name: tag.name,
        }))

    }));
};

export const fetchTags = async (tags?: Tag[]): Promise<Tag[]> => {
    const tagIds = tags?.map(tag => tag.id) || [];
    const { data } = await client.query({
        query: GET_TAGS,
        variables: { additionalTags: tagIds },
        fetchPolicy: "no-cache"
    });

    return data.tags.map((tag: StrapiTag) => ({
        id: tag.documentId,
        name: tag.name,
        count: tag.count,
        selected: false

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
        tags: item.tags.map((tag: StrapiTag) => ({
            id: tag.documentId,
            name: tag.name,
            count: tag.count,
            selected: false
        })),
        thumbnail: item.thumbnail[0]
    };
};
