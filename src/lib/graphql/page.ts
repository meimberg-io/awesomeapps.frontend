import {gql} from "@apollo/client";

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
