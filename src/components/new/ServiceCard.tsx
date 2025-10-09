'use client';

import { Star, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Service } from "@/types/service";
import { STRAPI_BASEURL } from "@/lib/constants";

interface ServiceCardProps {
  service: Service;
  onServiceClick: (service: Service) => void;
}

export const ServiceCard = ({ service, onServiceClick }: ServiceCardProps) => {
  const iconurl = service.logo?.url ? `${STRAPI_BASEURL}${service.logo.url}` : "/dummy.svg";
  
  // Mock rating data (will be replaced with real data when backend supports it)
  const mockRating = 4.5;
  const mockReviews = Math.floor(Math.random() * 200) + 50;

  return (
    <Card 
      className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-border/50 p-6 bg-card"
      onClick={() => onServiceClick(service)}
    >
      {service.top && (
        <Badge 
          variant="secondary" 
          className="absolute top-4 right-4 z-10 shadow-sm"
        >
          Featured
        </Badge>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shadow-sm border border-border/50">
          <img
            src={iconurl}
            alt={`${service.name} logo`}
            className="w-12 h-12 object-contain"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {service.name}
          </h3>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="text-sm font-semibold text-primary">{mockRating}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {mockReviews} reviews
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
        {service.abstract || service.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {service.tags.slice(0, 3).map((tag) => (
          <Badge key={tag.documentId} variant="outline" className="text-xs">
            {tag.icon} {tag.name}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          Details anzeigen
        </span>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </Card>
  );
};

