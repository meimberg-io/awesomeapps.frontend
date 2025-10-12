// Test the regular Strapi services query (not custom servicesbytags)
const https = require('https');

const strapiUrl = 'https://serviceatlas-strapi.meimberg.io';
const graphqlUrl = strapiUrl + '/graphql';

const query = {
    query: `
        query GetServices {
            services(pagination: { limit: 5 }, filters: { publishedAt: { notNull: true } }) {
                documentId
                name
                slug
                top
            }
        }
    `
};

const postData = JSON.stringify(query);

console.log(`\n${'='.repeat(70)}`);
console.log(`Testing REGULAR services query (not custom resolver)`);
console.log(`${graphqlUrl}`);
console.log(`${'='.repeat(70)}\n`);

const url = new URL(graphqlUrl);

const options = {
    hostname: url.hostname,
    port: 443,
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
                    if (err.extensions) {
                        console.log(`     Extensions:`, err.extensions);
                    }
                });
                
                if (response.errors.some(e => e.message.includes('Forbidden'))) {
                    console.log('\n⚠️  PERMISSIONS ISSUE DETECTED!');
                    console.log('   Go to Strapi Admin → Settings → Users & Permissions → Roles → Public');
                    console.log('   Enable: Service → find');
                }
            } else if (response.data && response.data.services) {
                const services = response.data.services;
                console.log(`✅ Regular services query works!`);
                console.log(`   Found: ${services.length} services`);
                
                if (services.length > 0) {
                    console.log('\nServices:');
                    services.forEach((s, i) => {
                        console.log(`   ${i+1}. ${s.name} (${s.slug})`);
                    });
                }
                
                console.log('\n📝 This means:');
                console.log('   - GraphQL is working');
                console.log('   - Basic permissions are set');
                console.log('   - The issue is specific to the custom "servicesbytags" resolver');
            } else {
                console.log('Unexpected response:', JSON.stringify(response, null, 2));
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

