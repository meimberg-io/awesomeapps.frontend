import {NextResponse} from "next/server";
import {fetchServicesNews} from "@/lib/strapi";
import {APP_BASEURL, STRAPI_BASEURL} from "@/lib/constants";
import {Service} from "@/types/service";

const escapeXml = (text: string | null): string => {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

const generateRssFeed = (services: Service[], locale: 'en' | 'de') => {
    const baseUrl = APP_BASEURL;
    const title = locale === 'en' ? 'Newest Apps and Online Tools - AwesomeApps' : 'Neueste Apps und Online Tools - AwesomeApps';
    const description = locale === 'en' 
        ? 'Latest services and tools added to AwesomeApps' 
        : 'Neueste Services und Tools auf AwesomeApps';
    const language = locale === 'en' ? 'en-US' : 'de-DE';

    const items = services.map(service => {
        const link = `${baseUrl}/${locale}/s/${service.slug}`;
        const pubDate = new Date(service.publishdate || service.updatedAt).toUTCString();
        const imageUrl = service.thumbnail?.url 
            ? (service.thumbnail.url.startsWith('http') 
                ? service.thumbnail.url 
                : `${STRAPI_BASEURL}${service.thumbnail.url}`)
            : '';

        return `
        <item>
            <title>${escapeXml(service.name)}</title>
            <link>${escapeXml(link)}</link>
            <guid isPermaLink="true">${escapeXml(link)}</guid>
            <pubDate>${pubDate}</pubDate>
            <description>${escapeXml(service.abstract)}</description>
            ${imageUrl ? `<enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" />` : ''}
            ${service.tags?.map(tag => `<category>${escapeXml(tag.name)}</category>`).join('') || ''}
        </item>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${escapeXml(title)}</title>
        <link>${baseUrl}/${locale}</link>
        <description>${escapeXml(description)}</description>
        <language>${language}</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${baseUrl}/api/rss/${locale}" rel="self" type="application/rss+xml" />
        ${items}
    </channel>
</rss>`;
};

export async function GET() {
    try {
        const services = await fetchServicesNews('de', 50);

        return new NextResponse(
            generateRssFeed(services, 'de'),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8',
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
                },
            }
        );
    } catch (error) {
        console.error('Error generating RSS feed (de):', error);
        return new NextResponse(
            '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Error</title></channel></rss>',
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8',
                },
            }
        );
    }
}

