import {gql} from "@apollo/client";

export const GET_SERVICES = gql`
    query GetServices($tags: [ID]!, $locale: I18NLocaleCode = "en") {
        servicesbytags(sort: "slug:asc", tags: $tags, locale: $locale) {
            documentId
            name
            slug
            url
            abstract
            createdAt
            updatedAt
            top
            publishdate
            reviewCount
            averageRating
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

export const GET_SERVICES_NEWS = gql`
    query GetServicesNews($limit: Int, $locale: I18NLocaleCode = "en") {
        services(
            sort: "createdAt:desc",
            pagination: {
                limit: $limit
            },
            filters: { 
                publishedAt: {
                    notNull: true
                }
            },
            locale: $locale
        ) {
            documentId
            name
            slug
            url
            abstract
            createdAt
            updatedAt
            top
            publishdate
            reviewCount
            averageRating
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

export const SEARCH_SERVICES = gql`
    query SearchServices($searchQuery: String!, $locale: I18NLocaleCode = "en") {
        services(
            sort: "name:asc",
            filters: {
                name: {
                    containsi: $searchQuery
                },
                publishedAt: {
                    notNull: true
                }
            },
            locale: $locale
        ) {
            documentId
            name
            slug
            url
            abstract
            createdAt
            updatedAt
            top
            publishdate
            reviewCount
            averageRating
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
    query GetServiceDetail($id: ID!, $locale: I18NLocaleCode = "en") {
        service(documentId: $id, locale: $locale) {
            documentId
            name
            abstract
            description
            functionality
            shortfacts
            youtube_title
            youtube_video
            pricing
            top
            publishdate

            url
            tags {
                documentId
                name
                icon
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

            reviews(filters: { isPublished: { eq: true } }, sort: "createdAt:desc") {
                documentId
                reviewtext
                voting
                isPublished
                helpfulCount
                createdAt
                updatedAt
                member {
                    documentId
                    displayName
                    username
                    avatarUrl
                    avatar {
                        url
                    }
                }
            }

        }
    }
`;


export const GET_SERVICE_DETAIL_BY_SLUG = gql`
    query GetServiceDetailBySlug($slug: String!, $locale: I18NLocaleCode = "en") {
        services(filters: { slug: { eq: $slug }, publishedAt: { notNull: true } }, locale: $locale) {
            documentId
            name
            slug
            abstract
            description
            functionality
            youtube_title
            youtube_video
            shortfacts
            pricing
            top
            publishdate          

            url
            tags {
                documentId
                name
                icon
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

            reviews(filters: { isPublished: { eq: true } }, sort: "createdAt:desc") {
                documentId
                reviewtext
                voting
                isPublished
                helpfulCount
                createdAt
                updatedAt
                member {
                    documentId
                    displayName
                    username
                    avatarUrl
                    avatar {
                        url
                    }
                }
            }

        }
    }
`;

