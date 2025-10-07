import {fetchPages, fetchServices, fetchTags} from "@/lib/strapi";
import {Service} from "@/types/service";
import {Page} from "@/types/page";
import {APP_BASEURL} from "@/lib/constants";
import {NextResponse} from "next/server";
import {Tag} from "@/types/tag";

const generateSitemap = (services: Service[], pages: Page[], tags: Tag[]) => {
    const baseUrl = APP_BASEURL; // Deine Domain

    const entry = (url: string, date: string) => {
        return `<url>
                    <loc>${baseUrl}${url}</loc>
                    <lastmod>${new Date(date).toISOString()}</lastmod>
                    <changefreq>weekly</changefreq>
                    <priority>0.8</priority>
                </url>`;
    }

    const urls_s = services.map(service => {
        return entry("/s/" + service.slug, service.updatedAt);
    }).join('');

    const urls_p = pages.map(x => {
        return entry("/p/" + x.slug, x.updatedAt);
    }).join('');

    const urls_t = tags.map(x => {
        return entry("/t/" + x.name, new Date().toISOString().split('T')[0] + "T00:00:00.000Z");
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <url>
                  <loc>${baseUrl}</loc>
                  <changefreq>daily</changefreq>
                  <priority>1.0</priority>
                </url>
                ${urls_s}
                ${urls_p}
                ${urls_t}
          </urlset>`;
};

export async function GET() {
    const services = await fetchServices();
    const pages = await fetchPages();
    const tags = await fetchTags();

    return new NextResponse(generateSitemap(services, pages, tags), {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
        },
    })
}