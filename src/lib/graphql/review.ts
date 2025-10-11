import {gql} from "@apollo/client";

export const GET_SERVICE_REVIEWS = gql`
    query GetServiceReviews($serviceId: ID!) {
        reviews(
            filters: { 
                service: { 
                    documentId: { eq: $serviceId } 
                },
                isPublished: { eq: true }
            },
            sort: "createdAt:desc"
        ) {
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
`;

export const CREATE_REVIEW = gql`
    mutation CreateReview($data: ReviewInput!) {
        createReview(data: $data) {
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
            }
        }
    }
`;

export const UPDATE_REVIEW_HELPFUL_COUNT = gql`
    mutation UpdateReviewHelpfulCount($documentId: ID!, $helpfulCount: Int!) {
        updateReview(documentId: $documentId, data: { helpfulCount: $helpfulCount }) {
            documentId
            helpfulCount
        }
    }
`;

