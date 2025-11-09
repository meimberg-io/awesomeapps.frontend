import {gql} from "@apollo/client";

export const GET_TAGS = gql`
    query GetTags($additionalTags: [ID]!, $locale: I18NLocaleCode = "en") {
        tags(sort: "name:asc") {
            documentId
            name
            description
            icon
        tagStatus
            count(additionalTags: $additionalTags, locale: $locale)
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
        tagStatus
        }
    }
`;
