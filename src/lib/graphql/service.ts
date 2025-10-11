import {gql} from "@apollo/client";

export const GET_SERVICES = gql`
    query GetServices($tags: [ID]!) {
        servicesbytags(sort: "slug:asc", tags: $tags) {
            documentId
            name
            slug
            abstract
            updatedAt
            top
            publishdate
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

export const GET_SERVICES_NEWS = gql`
    query GetServicesNews($limit: Int) {
        services(
            sort: "publishdate:desc", 
            pagination: {
                limit: $limit
            },
            filters: { 
                publishdate: { 
                    notNull:true 
                } 
            }
        ) {
            documentId
            name
            slug
            abstract
            updatedAt
            top
            publishdate
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

export const SEARCH_SERVICES = gql`
    query SearchServices($searchQuery: String!) {
        services(
            sort: "name:asc",
            filters: {
                name: {
                    containsi: $searchQuery
                }
            }
        ) {
            documentId
            name
            slug
            abstract
            updatedAt
            top
            publishdate
            tags {
                documentId
                name
                icon
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
            youtube_title
            youtube_video
            pricing
            top
            publishdate
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
            youtube_title
            youtube_video
            shortfacts
            pricing
            top
            publishdate
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

