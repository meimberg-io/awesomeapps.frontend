import {NextApiRequest, NextApiResponse} from 'next';
import {fetchPages, fetchServices} from "@/lib/services";
import {Service} from "@/types/service";
import {Page} from "@/types/page";
import {APP_BASEURL} from "@/lib/constants";


const generateSitemap = (services: Service[], pages: Page[]) => {
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


    return `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <url>
                  <loc>${baseUrl}</loc>
                  <changefreq>daily</changefreq>
                  <priority>1.0</priority>
                </url>
                ${urls_s}
                ${urls_p}
          </urlset>`;
};

// @ts-ignore
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const services = await fetchServices(); // Holt die Dienste aus Strapi
    const pages = await fetchPages(); // Holt die Dienste aus Strapi
    console.log("sitemap.xml",res);
    res.setHeader('Content-Type', 'application/xml');
    res.send(generateSitemap(services, pages));
}