import {Tag} from "@/types/tag";
import {App} from "@/types/app";
import {Page} from "@/types/page";
import {Review} from "@/types/review";
import {NewService} from "@/types/newService";
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {STRAPI_BASEURL} from "@/lib/constants";
import {GET_SERVICE_DETAIL, GET_SERVICE_DETAIL_BY_SLUG, GET_SERVICES, GET_SERVICES_NEWS, SEARCH_SERVICES} from "@/lib/graphql/service";
import {GET_TAG_DETAIL_BY_NAME, GET_TAGS} from "@/lib/graphql/tag";
import {GET_PAGES, GET_PAGES_BY_SLUG} from "@/lib/graphql/page";
import {GET_SERVICE_REVIEWS} from "@/lib/graphql/review";
import {GET_NEW_SERVICE_BY_SLUG} from "@/lib/graphql/newService";
import {Locale} from "@/types/locale";

const client = new ApolloClient({
    uri: STRAPI_BASEURL + "/graphql",
    cache: new InMemoryCache(),
});


export const fetchServices = async (tags?: Tag[], locale: Locale = 'en'): Promise<App[]> => {
    const tagIds = tags?.map(tag => tag.documentId) || [];
    
    try {
        const {data} = await client.query({
            query: GET_SERVICES,
            variables: {tags: tagIds, locale},
            fetchPolicy: "no-cache"
        });
        return data.servicesbytags || [];
    } catch (error) {
        console.error(`Error fetching services (${locale}):`, error);
        return [];
    }
};

export const fetchServicesNews = async (locale: Locale = 'en', limit: number = 4): Promise<App[]> => {
    try {
        const {data} = await client.query({
            query: GET_SERVICES_NEWS,
            variables: {limit, locale},
            fetchPolicy: "no-cache"
        });
        return data.services || [];
    } catch (error) {
        console.error(`Error fetching services news (${locale}):`, error);
        return [];
    }
};

export const searchServices = async (searchQuery: string, locale: Locale = 'en'): Promise<App[]> => {
    if (!searchQuery || searchQuery.trim() === "") {
        return [];
    }
    try {
        const {data} = await client.query({
            query: SEARCH_SERVICES,
            variables: {searchQuery: searchQuery.trim(), locale},
            fetchPolicy: "no-cache"
        });
        return data.services || [];
    } catch (error) {
        console.error(`Error searching services (${locale}):`, error);
        return [];
    }
};

export const fetchTags = async (tags?: Tag[], locale: Locale = 'en'): Promise<Tag[]> => {
    const tagIds = tags?.map(tag => tag.documentId) || [];
    const {data} = await client.query({
        query: GET_TAGS,
        variables: {additionalTags: tagIds, locale},
        fetchPolicy: "no-cache"
    });
    const tagsResult: Tag[] = data.tags;
    return tagsResult.filter(tag => tag.count > 0 && !tag.excluded);
};

export const fetchServiceDetail = async (id: string, locale: Locale = 'en'): Promise<App> => {
    const {data} = await client.query({
        query: GET_SERVICE_DETAIL,
        variables: {id, locale},
    });
    return data.service;
};

export const fetchServiceDetailBySlug = async (slug: string, locale: Locale = 'en'): Promise<App | undefined> => {
    try {
        const {data} = await client.query({
            query: GET_SERVICE_DETAIL_BY_SLUG,
            variables: {slug, locale},
            fetchPolicy: "no-cache",
        });
        
        // If app found, return it
        if (data["services"] && data["services"].length > 0) {
            return data["services"][0];
        }
        
        // Entity-level fallback: if requested locale has no content, try 'en'
        if (locale !== 'en') {
            console.warn(`Service "${slug}" not found for locale "${locale}", falling back to "en"`);
            const fallbackData = await client.query({
                query: GET_SERVICE_DETAIL_BY_SLUG,
                variables: {slug, locale: 'en'},
                fetchPolicy: "no-cache",
            });
            return fallbackData.data["services"] && fallbackData.data["services"].length > 0 
                ? fallbackData.data["services"][0] 
                : undefined;
        }
        
        return undefined;
    } catch (error) {
        console.error(`Error fetching service detail by slug (${slug}, ${locale}):`, error);
        // Try fallback on error
        if (locale !== 'en') {
            try {
                const fallbackData = await client.query({
                    query: GET_SERVICE_DETAIL_BY_SLUG,
                    variables: {slug, locale: 'en'},
                    fetchPolicy: "no-cache",
                });
                return fallbackData.data["services"] && fallbackData.data["services"].length > 0 
                    ? fallbackData.data["services"][0] 
                    : undefined;
            } catch (fallbackError) {
                console.error(`Fallback fetch also failed:`, fallbackError);
                return undefined;
            }
        }
        return undefined;
    }
};

export const fetchTagDetailByName = async (name: string): Promise<Tag | undefined> => {
    const {data} = await client.query({
        query: GET_TAG_DETAIL_BY_NAME,
        variables: {name},
        fetchPolicy: "no-cache",
    });
    return data["tags"] && data["tags"].length > 0 ? data["tags"][0] : undefined;
};

export const fetchPage = async (slug: string, locale: Locale = 'en'): Promise<Page | undefined> => {
    try {
        const {data} = await client.query({
            query: GET_PAGES_BY_SLUG,
            variables: {slug, locale},
            fetchPolicy: "no-cache",
        });
        
        // If page found, return it
        if (data["pages"] && data["pages"].length > 0) {
            return data["pages"][0];
        }
        
        // Entity-level fallback: if requested locale has no content, try 'en'
        if (locale !== 'en') {
            console.warn(`Page "${slug}" not found for locale "${locale}", falling back to "en"`);
            const fallbackData = await client.query({
                query: GET_PAGES_BY_SLUG,
                variables: {slug, locale: 'en'},
                fetchPolicy: "no-cache",
            });
            return fallbackData.data["pages"] && fallbackData.data["pages"].length > 0 
                ? fallbackData.data["pages"][0] 
                : undefined;
        }
        
        return undefined;
    } catch (error) {
        console.error(`Error fetching page (${slug}, ${locale}):`, error);
        // Try fallback on error
        if (locale !== 'en') {
            try {
                const fallbackData = await client.query({
                    query: GET_PAGES_BY_SLUG,
                    variables: {slug, locale: 'en'},
                    fetchPolicy: "no-cache",
                });
                return fallbackData.data["pages"] && fallbackData.data["pages"].length > 0 
                    ? fallbackData.data["pages"][0] 
                    : undefined;
            } catch (fallbackError) {
                console.error(`Fallback fetch also failed:`, fallbackError);
                return undefined;
            }
        }
        return undefined;
    }
}

export const fetchPages = async (locale: Locale = 'en'): Promise<Page[]> => {
    try {
        const {data} = await client.query({
            query: GET_PAGES,
            variables: {locale},
            fetchPolicy: "no-cache",
        });
        return data.pages || [];
    } catch (error) {
        console.error(`Error fetching pages (${locale}):`, error);
        return [];
    }
}

export const fetchServiceReviews = async (serviceDocumentId: string): Promise<Review[]> => {
    const {data} = await client.query({
        query: GET_SERVICE_REVIEWS,
        variables: {serviceId: serviceDocumentId},
        fetchPolicy: "no-cache",
    });
    return data.reviews || [];
};

export const fetchNewServiceBySlug = async (slug: string): Promise<NewService | undefined> => {
    try {
        const {data} = await client.query({
            query: GET_NEW_SERVICE_BY_SLUG,
            variables: {slug},
            fetchPolicy: "no-cache",
        });
        return data["newServices"] && data["newServices"].length > 0 ? data["newServices"][0] : undefined;
    } catch (error) {
        console.error("Error fetching NewService:", error);
        return undefined;
    }
};
