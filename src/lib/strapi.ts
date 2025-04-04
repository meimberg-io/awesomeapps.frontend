import {Tag} from "@/types/tag";
import {Service} from "@/types/service";
import {Page} from "@/types/page";
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {STRAPI_BASEURL} from "@/lib/constants";
import {GET_SERVICE_DETAIL, GET_SERVICE_DETAIL_BY_SLUG, GET_SERVICES} from "@/lib/graphql/service";
import {GET_TAGS} from "@/lib/graphql/tag";
import {GET_PAGES, GET_PAGES_BY_SLUG} from "@/lib/graphql/page";
import * as console from "node:console";

const client = new ApolloClient({
    uri: STRAPI_BASEURL + "/graphql",
    cache: new InMemoryCache(),
});


export const fetchServices = async (tags?: Tag[]): Promise<Service[]> => {
    const tagIds = tags?.map(tag => tag.documentId) || [];
    const {data} = await client.query({
        query: GET_SERVICES,
        variables: {tags: tagIds},
        fetchPolicy: "no-cache"
    });
//    console.log("LEN " , data.servicesbytags.length);
    return data.servicesbytags;
};

export const fetchTags = async (tags?: Tag[]): Promise<Tag[]> => {
    const tagIds = tags?.map(tag => tag.documentId) || [];
    const {data} = await client.query({
        query: GET_TAGS,
        variables: {additionalTags: tagIds},
        fetchPolicy: "no-cache"
    });
    const tagsResult: Tag[] = data.tags;
//    console.log("LEN TAG " , tagsResult.length);

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

export const fetchServiceDetailBySlug = async (slug: string): Promise<Service | undefined> => {
    const {data} = await client.query({
        query: GET_SERVICE_DETAIL_BY_SLUG,
        variables: {slug},
        fetchPolicy: "no-cache",
    });
    return data["services"] && data["services"].length > 0 ? data["services"][0] : undefined;
};

export const fetchPage = async (slug: string): Promise<Page | undefined> => {
    const {data} = await client.query({
        query: GET_PAGES_BY_SLUG,
        variables: {slug},
        fetchPolicy: "no-cache",
    });
    return data["pages"] && data["pages"].length > 0 ? data["pages"][0] : undefined;
}

export const fetchPages = async (): Promise<Page[]> => {
    const {data} = await client.query({
        query: GET_PAGES,
        fetchPolicy: "no-cache",
    });
    return data.pages;
}
