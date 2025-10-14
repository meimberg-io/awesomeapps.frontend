'use client';

import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Service } from "@/types/service";
import { renderIcon } from "@/components/util/renderIcon";
import { Tag } from "@/types/tag";
import { getBrandfetchLogoUrl } from "@/lib/utils";
import { STRAPI_BASEURL } from "@/lib/constants";

interface ServiceCardProps {
  service: Service;
  onServiceClick: (service: Service) => void;
  selectedTags?: Tag[];
}

export const ServiceCard = ({ service, onServiceClick, selectedTags = [] }: ServiceCardProps) => {
  const iconurl = service.logo?.url 
    ? `${STRAPI_BASEURL}${service.logo.url}` 
    : getBrandfetchLogoUrl(service.url);
  
  // Use cached review statistics from backend
  const reviewCount = service.reviewCount || 0;
  const averageRating = service.averageRating || 0;

  return (
    <Card 
      className="group relative overflow-hidden hover:shadow-xl hover:brightness-110 transition-all duration-300 cursor-pointer border-border/50 p-6 bg-card"
      onClick={() => onServiceClick(service)}
    >
      {service.top && (
        <Badge 
          variant="secondary" 
          className="absolute top-4 right-4 z-10"
        >
          Featured
        </Badge>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 flex-shrink-0">
          <img
            src={iconurl}
            alt={`${service.name} logo`}
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {service.name}
          </h3>
          {reviewCount > 0 ? (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                <span className="text-sm font-semibold text-primary">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">No reviews yet</span>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
        {service.abstract || service.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {service.tags.map((tag) => {
          const isSelected = selectedTags.some(selectedTag => selectedTag.documentId === tag.documentId);
          return (
            <Badge 
              key={tag.documentId} 
              variant={isSelected ? "default" : "outline"} 
              className={`text-xs flex items-center gap-1 transition-colors ${
                isSelected ? 'bg-primary text-primary-foreground' : ''
              }`}
            >
              {tag.icon && renderIcon(tag.icon, isSelected ? 'text-primary-foreground' : 'text-primary', 14)}
              {tag.name}
            </Badge>
          );
        })}
      </div>
    </Card>
  );
};

