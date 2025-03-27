import {gql} from "@apollo/client";

export const GET_TAGS = gql`
    query GetTags($additionalTags: [ID]!) {
        tags(sort: "name:asc") {
            documentId
            name
            description
            icon
            count(additionalTags: $additionalTags)
        }
    }
`;

