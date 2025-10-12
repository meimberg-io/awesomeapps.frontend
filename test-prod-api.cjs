const { ApolloClient, InMemoryCache, gql } = require("@apollo/client");

// ⚠️ REPLACE THIS WITH YOUR ACTUAL PRODUCTION STRAPI URL
const PROD_STRAPI_URL = process.env.PROD_STRAPI_URL || 'https://your-prod-strapi-url-here.com';

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
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing GraphQL query against:`);
    console.log(`${PROD_STRAPI_URL}/graphql`);
    console.log(`${'='.repeat(60)}\n`);
    console.log('Query: servicesbytags with empty tags array\n');
    
    try {
        const { data, errors } = await client.query({
            query: GET_SERVICES,
            variables: { tags: [] },
            fetchPolicy: "no-cache"
        });

        console.log('=== RESULT ===\n');
        if (errors) {
            console.error('❌ GraphQL Errors:', JSON.stringify(errors, null, 2));
        }
        
        if (data && data.servicesbytags) {
            console.log(`✅ Success! Found ${data.servicesbytags.length} services\n`);
            
            if (data.servicesbytags.length > 0) {
                console.log('First 5 services:');
                data.servicesbytags.slice(0, 5).forEach((s, i) => {
                    console.log(`  ${i+1}. ${s.name} (${s.slug}) - Top: ${s.top || false}`);
                });
                
                const topServices = data.servicesbytags.filter(s => s.top);
                console.log(`\n📊 Stats:`);
                console.log(`   Total services: ${data.servicesbytags.length}`);
                console.log(`   Featured (top) services: ${topServices.length}`);
            } else {
                console.log('⚠️  Query succeeded but returned 0 services!');
                console.log('   This means the GraphQL resolver is working but returning empty array');
            }
        } else {
            console.log('❌ No data returned or data.servicesbytags is null/undefined');
            console.log('Full response:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('\n❌ ERROR:\n');
        console.error('Message:', error.message);
        if (error.networkError) {
            console.error('\nNetwork Error:', error.networkError.message || error.networkError);
        }
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            console.error('\nGraphQL Errors:', JSON.stringify(error.graphQLErrors, null, 2));
        }
    }
}

testQuery();
