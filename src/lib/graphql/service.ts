import {gql} from "@apollo/client";

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


export const GET_TAG_DETAIL_BY_NAME = gql`
    query GetTagDetailByName($name: String!) {
        tags(filters: { name: { eq: $name } }) {
            documentId
            name            
            description
            icon
        }
    }
`;
