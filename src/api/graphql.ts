import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export const client = new ApolloClient({
    uri: "http://localhost:1337/graphql",
    cache: new InMemoryCache(),
});

export const GET_SERVICES = gql`
    query GetServices($tag: String) {
        services(filters: { tags: { name: { eq: $tag } } }) {
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
        }
        
    }
`;

export const GET_SERVICE_DETAIL = gql`
    query GetServiceDetail($id: ID!) {
        service(id: $id) {
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
             
            
         
        }
    }
`;
