import {gql} from "@apollo/client";

export const GET_NEW_SERVICE_BY_SLUG = gql`
    query GetNewServiceBySlug($slug: String!) {
        newServices(filters: { slug: { eq: $slug }, publishedAt: { notNull: true } }) {
            documentId
            slug
            field
            n8nstatus
            createdAt
            updatedAt
            errorMessage
        }
    }
`;

