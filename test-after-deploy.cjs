// Test script to verify the fix after deployment
const https = require('https');

const strapiUrl = 'https://serviceatlas-strapi.meimberg.io';
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

const options = {
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = https.request(options, (res) => {
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
                });
                return;
            }
            
            if (response.data && response.data.servicesbytags !== undefined) {
                const services = response.data.servicesbytags;
                
                if (services.length === 0) {
                    console.log('❌ STILL BROKEN: Query returns 0 services');
                    console.log('   Check Strapi logs for debug output');
                } else {
                    console.log(`✅ SUCCESS! Found: ${services.length} services\n`);
                    
                    console.log('First 5 services:');
                    services.slice(0, 5).forEach((s, i) => {
                        console.log(`   ${i+1}. ${s.name} (${s.slug})`);
                    });
                    
                    const featured = services.filter(s => s.top);
                    console.log(`\n📊 Summary:`);
                    console.log(`   Total: ${services.length}`);
                    console.log(`   Featured: ${featured.length}`);
                    console.log(`\n🎉 The fix is working!`);
                }
            }
        } catch (err) {
            console.log('❌ Failed to parse response');
            console.log(err.message);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request failed:');
    console.error(`   ${error.message}`);
});

req.write(postData);
req.end();

