import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {STRAPI_BASEURL} from "@/lib/constants";

export const client = new ApolloClient({
    uri: STRAPI_BASEURL + "/graphql",
    cache: new InMemoryCache(),
});

export const GET_SERVICES = gql`
    query GetServices($tags: [ID]!) {
        servicesbytags(sort: "slug:asc", tags: $tags) {
            documentId
            name
            slug
            abstract
            updatedAt
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
            abstract
            longdescription
            description
            functionality
            shortfacts
            pricing
            articlecontent {
                __typename
                ... on ComponentSharedRichText {
                    body
                }
                ... on ComponentSharedMedia {
                    file {
                        url
                        alternativeText
                        mime
                    }
                }
                ... on ComponentSharedQuote {
                    title
                    body
                }
                ... on ComponentSharedSlider {
                    files {
                        url
                        alternativeText
                    }

                }
            }

            url
            tags {
                documentId
                name
            }
            thumbnail {
                url
            }
            screenshots {
                url
            }

            logo {
                url
            }

        }
    }
`;


export const GET_SERVICE_DETAIL_BY_SLUG = gql`
    query GetServiceDetailBySlug($slug: String!) {
        services(filters: { slug: { eq: $slug } }) {
            documentId
            name
            slug
            abstract
            longdescription
            description
            functionality
            shortfacts
            pricing
            articlecontent {
                __typename
                ... on ComponentSharedRichText {
                    body
                }
                ... on ComponentSharedMedia {
                    file {
                        url
                        alternativeText
                        mime
                    }
                }
                ... on ComponentSharedQuote {
                    title
                    body
                }
                ... on ComponentSharedSlider {
                    files {
                        url
                        alternativeText
                    }

                }
            }

            url
            tags {
                documentId
                name
            }
            thumbnail {
                url
            }
            screenshots {
                url
                caption
                documentId
                ext
                mime
                width
                height
            }
            logo {
                url
            }

        }
    }
`;


export const GET_PAGES_BY_SLUG = gql`
    query GetPages($slug: String!) {

        pages(filters: { slug: { eq: $slug } }) {
            documentId
            title
            subtitle
            keyvisual {
                url
                mime
            }
            content {
                __typename
                ... on ComponentSharedRichText {
                    body
                }
                ... on ComponentSharedMedia {
                    file {
                        url
                        alternativeText
                        mime
                    }
                }
                ... on ComponentSharedQuote {
                    title
                    body
                }
                ... on ComponentSharedSlider {
                    files {
                        url
                        alternativeText
                    }

                }
            }


        }
    }
`;

export const GET_PAGES = gql`
    query GetPages {
        pages{
            documentId
            slug
            title
            subtitle
            updatedAt
        }
    }
`;
