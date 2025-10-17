import {fetchPages, fetchServices} from "@/lib/strapi";
import {Service} from "@/types/service";
import {Page} from "@/types/page";
import {APP_BASEURL} from "@/lib/constants";
import {NextResponse} from "next/server";

const generateSitemap = (
    servicesEn: Service[], 
    servicesDe: Service[], 
    pagesEn: Page[], 
    pagesDe: Page[]
) => {
    const baseUrl = APP_BASEURL;

    const entry = (url: string, date: string, alternates: string = '') => {
        return `<url>
                    <loc>${baseUrl}${url}</loc>
                    <lastmod>${new Date(date).toISOString()}</lastmod>
                    <changefreq>weekly</changefreq>
                    <priority>0.8</priority>
                    ${alternates}
                </url>`;
    }

    // Generate service URLs for both locales with hreflang
    const serviceUrls = servicesEn.map(service => {
        const alternates = `
            <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/s/${service.slug}" />
            <xhtml:link rel="alternate" hreflang="de" href="${baseUrl}/de/s/${service.slug}" />
            <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/s/${service.slug}" />
        `;
        return entry(`/en/s/${service.slug}`, service.updatedAt, alternates);
    }).join('') + servicesDe.map(service => {
        return entry(`/de/s/${service.slug}`, service.updatedAt);
    }).join('');

    // Generate page URLs for both locales with hreflang
    const pageUrls = pagesEn.map(page => {
        const alternates = `
            <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/p/${page.slug}" />
            <xhtml:link rel="alternate" hreflang="de" href="${baseUrl}/de/p/${page.slug}" />
            <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/p/${page.slug}" />
        `;
        return entry(`/en/p/${page.slug}`, page.updatedAt, alternates);
    }).join('') + pagesDe.map(page => {
        return entry(`/de/p/${page.slug}`, page.updatedAt);
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                    xmlns:xhtml="http://www.w3.org/1999/xhtml">
                <url>
                  <loc>${baseUrl}/en</loc>
                  <changefreq>daily</changefreq>
                  <priority>1.0</priority>
                  <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en" />
                  <xhtml:link rel="alternate" hreflang="de" href="${baseUrl}/de" />
                  <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en" />
                </url>
                <url>
                  <loc>${baseUrl}/de</loc>
                  <changefreq>daily</changefreq>
                  <priority>1.0</priority>
                </url>
                ${serviceUrls}
                ${pageUrls}
          </urlset>`;
};

export async function GET() {
    try {
        const [servicesEn, servicesDe, pagesEn, pagesDe] = await Promise.all([
            fetchServices([], 'en'),
            fetchServices([], 'de'),
            fetchPages('en'),
            fetchPages('de')
        ]);

        return new NextResponse(
            generateSitemap(servicesEn, servicesDe, pagesEn, pagesDe), 
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/xml',
                },
            }
        );
    } catch (error) {
        console.error('Error generating sitemap:', error);
        const minimalSitemap = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                    xmlns:xhtml="http://www.w3.org/1999/xhtml">
                <url>
                  <loc>${APP_BASEURL}/en</loc>
                  <changefreq>daily</changefreq>
                  <priority>1.0</priority>
                  <xhtml:link rel="alternate" hreflang="en" href="${APP_BASEURL}/en" />
                  <xhtml:link rel="alternate" hreflang="de" href="${APP_BASEURL}/de" />
                  <xhtml:link rel="alternate" hreflang="x-default" href="${APP_BASEURL}/en" />
                </url>
                <url>
                  <loc>${APP_BASEURL}/de</loc>
                  <changefreq>daily</changefreq>
                  <priority>1.0</priority>
                </url>
          </urlset>`;
        
        return new NextResponse(minimalSitemap, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml',
            },
        });
    }
}