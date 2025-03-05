import {client, GET_SERVICES, GET_TAGS, GET_SERVICE_DETAIL, GET_PAGES_BY_SLUG} from "./graphql";
import {Tag} from "../types/tag";
import {Service} from "../types/service";
import {Page} from "../types/page";

export const fetchServices = async (tags?: Tag[]): Promise<Service[]> => {
    const tagIds = tags?.map(tag => tag.documentId) || [];
    const {data} = await client.query({
        query: GET_SERVICES,
        variables: {tags: tagIds},
    });
    return data.services;
};

export const fetchTags = async (tags?: Tag[]): Promise<Tag[]> => {
    const tagIds = tags?.map(tag => tag.documentId) || [];
    const {data} = await client.query({
        query: GET_TAGS,
        variables: {additionalTags: tagIds},
        fetchPolicy: "no-cache"
    });
    const tagsResult: Tag[] = data.tags;
    return tagsResult.filter(tag => tag.count > 0);
};

export const fetchServiceDetail = async (id: string): Promise<Service> => {
    const {data} = await client.query({
        query: GET_SERVICE_DETAIL,
        variables: {id},
    });
    const item: Service = data.service;
    return item;
};


export const fetchPage = async (slug: string): Promise<Page> => {
    const {data} = await client.query({
        query: GET_PAGES_BY_SLUG,
        variables: {slug},
    });
    return data["pages"] && data["pages"].length > 0 ? data["pages"][0] : undefined;
}
