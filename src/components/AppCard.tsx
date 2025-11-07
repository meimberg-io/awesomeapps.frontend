'use client';

import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { App } from "@/types/app";
import { renderIcon } from "@/components/util/renderIcon";
import { Tag } from "@/types/tag";
import { getBrandfetchLogoUrl } from "@/lib/utils";
import { STRAPI_BASEURL } from "@/lib/constants";
import { useTranslations } from 'next-intl';

interface AppCardProps {
  app: App;
  onServiceClick: (service: App) => void;
  selectedTags?: Tag[];
}

export const AppCard = ({ app, onServiceClick, selectedTags = [] }: AppCardProps) => {
  const t = useTranslations('common');
  const tService = useTranslations('service');
  const iconurl = app.logo?.url
    ? `${STRAPI_BASEURL}${app.logo.url}`
    : getBrandfetchLogoUrl(app.url);
  
  // Use cached review statistics from backend
  const reviewCount = app.reviewCount || 0;
  const averageRating = app.averageRating || 0;
  
  // Check if app is new (less than 5 days old)
  const isNew = () => {
    const serviceDate = new Date(app.createdAt);
    const now = new Date();
    const daysDiff = (now.getTime() - serviceDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 5;
  };
  
  // Show Top badge if app is top, otherwise show New badge if it's new
  const showNewBadge = !app.top && isNew();

  return (
    <Card 
      className="group relative overflow-hidden hover:shadow-xl hover:brightness-110 transition-all duration-300 cursor-pointer border-border/50 p-6 bg-card"
      onClick={() => onServiceClick(app)}
    >
      {app.top && (
        <Badge 
          variant="secondary" 
          className="absolute top-4 right-4 z-10 text-white"
        >
          {t('top')}
        </Badge>
      )}
      {showNewBadge && (
        <Badge 
          variant="secondary" 
          className="absolute top-4 right-4 z-10 text-white"
          style={{ backgroundColor: 'hsl(20 83% 55%)', border: 'transparent' }}
        >
          {t('new')}
        </Badge>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 flex-shrink-0">
          <img
            src={iconurl}
            alt={`${app.name} Logo - ${app.tags.filter(tag => !tag.excluded)[0]?.name || 'SaaS'} Tool`}
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {app.name}
          </h3>
          {reviewCount > 0 ? (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                <span className="text-sm font-semibold text-primary">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {reviewCount} {reviewCount === 1 ? tService('review') : tService('reviews')}
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">{tService('noReviews')}</span>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-4 leading-relaxed">
        {app.abstract || app.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {app.tags.filter(tag => !tag.excluded).map((tag) => {
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

