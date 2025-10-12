// Simple test to check GraphQL servicesbytags query
// Usage: node test-graphql.cjs <STRAPI_URL>
// Example: node test-graphql.cjs https://api.awesomeapps.meimberg.io

const https = require('https');
const http = require('http');

const strapiUrl = process.argv[2] || 'http://localhost:1337';
const graphqlUrl = strapiUrl + '/graphql';

const query = {
    query: `
        query GetServices($tags: [ID]!) {
            servicesbytags(sort: "slug:asc", tags: $tags) {
                documentId
                name
                slug
                top
            }
        }
    `,
    variables: { tags: [] }
};

const postData = JSON.stringify(query);

console.log(`\n${'='.repeat(70)}`);
console.log(`Testing: ${graphqlUrl}`);
console.log(`${'='.repeat(70)}\n`);

const url = new URL(graphqlUrl);
const httpModule = url.protocol === 'https:' ? https : http;

const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = httpModule.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}\n`);
        
        try {
            const response = JSON.parse(data);
            
            if (response.errors) {
                console.log('❌ GraphQL Errors:');
                response.errors.forEach(err => {
                    console.log(`   - ${err.message}`);
                    if (err.extensions) {
                        console.log(`     Code: ${err.extensions.code}`);
                    }
                });
            }
            
            if (response.data && response.data.servicesbytags !== undefined) {
                const services = response.data.servicesbytags;
                console.log(`✅ Query succeeded!`);
                console.log(`   Found: ${services.length} services\n`);
                
                if (services.length > 0) {
                    console.log('First 5 services:');
                    services.slice(0, 5).forEach((s, i) => {
                        console.log(`   ${i+1}. ${s.name} (${s.slug}) - Featured: ${s.top || false}`);
                    });
                    
                    const featured = services.filter(s => s.top);
                    console.log(`\n📊 Summary:`);
                    console.log(`   Total: ${services.length}`);
                    console.log(`   Featured: ${featured.length}`);
                } else {
                    console.log('\n⚠️  WARNING: Query succeeded but returned 0 services!');
                    console.log('   Possible causes:');
                    console.log('   - No published services in database');
                    console.log('   - Permissions blocking data');
                    console.log('   - Resolver returning empty array');
                }
            } else {
                console.log('❌ Unexpected response format:');
                console.log(JSON.stringify(response, null, 2));
            }
        } catch (err) {
            console.log('❌ Failed to parse response:');
            console.log(data);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request failed:');
    console.error(`   ${error.message}`);
});

req.write(postData);
req.end();

