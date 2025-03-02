import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {STRAPI_API} from "../pages/_app";

export const client = new ApolloClient({
    uri: STRAPI_API,
    cache: new InMemoryCache(),
});

export const GET_SERVICES = gql`
    query GetServices($tags: [ID]!) {
        services(tags: $tags) {
            documentId
            name
            description
            tags {
                documentId
                name
            }
            thumbnail {
                url
            }
            logo {
                url
            }
        }

    }
`;

export const GET_TAGS = gql`
    query GetTags($additionalTags: [ID]!) {
        tags(sort: "name:asc") {
            documentId
            name
            count(additionalTags: $additionalTags)
        }
    }
`;

export const GET_SERVICE_DETAIL = gql`
    query GetServiceDetail($id: ID!) {
        service(documentId: $id) {
            documentId
            name
            description
            longdesc
            url
            tags {
                documentId
                name
            }
            thumbnail {
                url
            }

            logo {
                url
            }

        }
    }
`;
