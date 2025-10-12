const { ApolloClient, InMemoryCache, gql } = require("@apollo/client");

// Replace with your actual production URL
const PROD_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_BASEURL || 'http://localhost:1337';

const client = new ApolloClient({
    uri: PROD_STRAPI_URL + "/graphql",
    cache: new InMemoryCache(),
});

const GET_SERVICES = gql`
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

async function testQuery() {
    console.log(`Testing GraphQL query against: ${PROD_STRAPI_URL}/graphql`);
    console.log('Query: servicesbytags with empty tags array');
    
    try {
        const { data, errors } = await client.query({
            query: GET_SERVICES,
            variables: { tags: [] },
            fetchPolicy: "no-cache"
        });

        console.log('\n=== RESULT ===');
        if (errors) {
            console.error('GraphQL Errors:', JSON.stringify(errors, null, 2));
        }
        
        if (data && data.servicesbytags) {
            console.log(`✅ Success! Found ${data.servicesbytags.length} services`);
            console.log('\nFirst 3 services:');
            data.servicesbytags.slice(0, 3).forEach(s => {
                console.log(`  - ${s.name} (${s.slug})`);
            });
        } else {
            console.log('❌ No data returned');
            console.log('Full response:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.networkError) {
            console.error('Network Error:', error.networkError);
        }
        if (error.graphQLErrors) {
            console.error('GraphQL Errors:', error.graphQLErrors);
        }
    }
}

testQuery();

