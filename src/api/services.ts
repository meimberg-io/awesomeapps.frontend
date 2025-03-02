import {client, GET_SERVICES, GET_TAGS, GET_SERVICE_DETAIL} from "./graphql";
import {Service, Tag, TagWithCount} from "../types";
import {StrapiService, StrapiTag} from "../types/strapi.ts";

export const fetchServices = async (tags?: Tag[]): Promise<Service[]> => {
    const tagIds = tags?.map(tag => tag.id) || [];


    const {data} = await client.query({
        query: GET_SERVICES,
        variables: {tags: tagIds},
    });

    return data.services.map((item: StrapiService) => ({
        id: item.documentId,
        name: item.name,
        description: item.description,
        thumbnail: item.thumbnail,
        logo: item.logo,
        tags: item.tags.map((tag: StrapiTag) => ({
            id: tag.documentId,
            name: tag.name,
        }))

    }));
};

export const fetchTags = async (tags?: TagWithCount[]): Promise<TagWithCount[]> => {
    const tagIds = tags?.map(tag => tag.id) || [];
    const {data} = await client.query({
        query: GET_TAGS,
        variables: {additionalTags: tagIds},
        fetchPolicy: "no-cache"
    });

    const tagsResult: TagWithCount[] = data.tags.map((tag: StrapiTag): TagWithCount => ({
        id: tag.documentId,
        name: tag.name,
        count: tag.count,
        selected: false
    }));

    return tagsResult.filter(tag => tag.count > 0);
};

export const fetchServiceDetail = async (id: string): Promise<Service> => {
    const {data} = await client.query({
        query: GET_SERVICE_DETAIL,
        variables: {id},
    });

    const item: StrapiService = data.service;

    return {
        id: item.documentId,
        name: item.name,
        description: item.description,
        longdesc: item.longdesc,
        url: item.url,
        thumbnail: item.thumbnail,
        logo: item.logo,
        tags: item.tags.map((tag: StrapiTag) => ({
            id: tag.documentId,
            name: tag.name
        })),

    };
};
