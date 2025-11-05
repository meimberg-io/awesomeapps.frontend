"use client"
import React from "react";
import Link from "next/link";
import {Service} from "@/types/service";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { getBrandfetchLogoUrl } from "@/lib/utils";
import { STRAPI_BASEURL } from "@/lib/constants";
import { renderIcon } from "@/components/util/renderIcon";

interface ServiceTileProps {
    service: Service;
    locale?: string;
}

const ServiceTile: React.FC<ServiceTileProps> = ({service, locale = 'en'}) => {
    const iconurl = service.logo?.url 
        ? `${STRAPI_BASEURL}${service.logo.url}` 
        : getBrandfetchLogoUrl(service.url);
    
    const dateLocale = locale === 'de' ? 'de-DE' : 'en-US';
    const publishDate = service.publishdate 
        ? new Date(service.publishdate).toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })
        : new Date(service.updatedAt).toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <Link href={`s/${service.slug}`} className="block">
            <Card className="group relative overflow-hidden hover:shadow-xl hover:brightness-110 transition-all duration-300 cursor-pointer border-border/50 bg-card h-full flex flex-col">
                {/* Logo Header */}
                <div className="px-7 py-4 flex items-center justify-center border-b border-border/50">
                    <div className="w-16 h-16 border border-gray-300">
                        <img 
                            src={iconurl} 
                            alt={`${service.name} Logo - ${service.tags.filter(tag => !tag.excluded)[0]?.name || 'SaaS'} Tool`}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {service.name}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                        {service.abstract}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {service.tags.filter(tag => !tag.excluded).slice(0, 3).map((tag) => (
                            <Badge 
                                key={tag.documentId} 
                                variant="default" 
                                className="text-xs flex items-center gap-1"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = `/t/${tag.name}`;
                                }}
                            >
                                {tag.icon && renderIcon(tag.icon, 'text-primary-foreground', 14)}
                                {tag.name}
                            </Badge>
                        ))}
                    </div>

                    {/* Publish Date */}
                    <div className="flex items-center gap-2 pt-4 mt-4 border-t border-border/50">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            {publishDate}
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default ServiceTile;
