'use client';

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tag } from "@/types/tag";
import { App } from "@/types/app";
import { useMemo, useState } from "react";
import { renderIcon } from "@/components/util/renderIcon";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import {useTranslations} from 'next-intl';

interface FilterSidebarProps {
  selectedTags: Tag[];
  onTagChange: (tagId: string) => void;
  availableTags: Tag[];
  services: App[];
  onClearFilters: () => void;
}

export const FilterSidebar = ({
  selectedTags,
  onTagChange,
  availableTags,
  onClearFilters,
}: FilterSidebarProps) => {
  const t = useTranslations('filter');
  const [tagSearch, setTagSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Create a Set for faster lookups
  const selectedTagIds = useMemo(() => {
    return new Set(selectedTags.map(t => t.documentId));
  }, [selectedTags]);

  const filteredTags = useMemo(() => {
    const tags = tagSearch 
      ? availableTags.filter(tag => 
          tag.name.toLowerCase().includes(tagSearch.toLowerCase()) ||
          (tag.description && tag.description.toLowerCase().includes(tagSearch.toLowerCase()))
        )
      : availableTags;
    
    // Sort: selected tags first, then by count descending
    return [...tags].sort((a, b) => {
      const aSelected = selectedTagIds.has(a.documentId);
      const bSelected = selectedTagIds.has(b.documentId);
      
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      
      // If both selected or both not selected, sort by count
      return b.count - a.count;
    });
  }, [availableTags, tagSearch, selectedTagIds]);

  const hasActiveFilters = selectedTags.length > 0;

  return (
    <aside className="w-full lg:w-80 space-y-6">
      <div className="bg-card rounded-xl shadow-sm border border-border/50">
        {/* Mobile: Collapsible header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden w-full flex items-center justify-between p-4 text-left"
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{t('filterByTags')}</h3>
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                {selectedTags.length}
              </span>
            )}
          </div>
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {/* Desktop: Always visible header */}
        <div className="hidden lg:flex items-center justify-between p-6 pb-4">
          <h3 className="font-semibold text-lg">{t('filterByTags')}</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearFilters}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              title={t('clearFilters')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Collapsible content */}
        <div className={`${isOpen ? 'block' : 'hidden'} lg:block p-6 pt-0 lg:pt-0 transition-all duration-200`}>
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder={t('allTags')}
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              className="flex-1"
            />
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  onClearFilters();
                  // Auto-collapse on mobile after clearing filters
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
                className="lg:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
                title={t('clearFilters')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3 pr-4">
              {filteredTags.map((tag) => (
                <div key={tag.documentId} className="flex items-center space-x-2">
                  <Checkbox
                    id={tag.documentId}
                    checked={selectedTagIds.has(tag.documentId)}
                    onCheckedChange={() => {
                      onTagChange(tag.documentId);
                      // Auto-collapse on mobile after selecting a tag
                      if (window.innerWidth < 1024) {
                        setIsOpen(false);
                      }
                    }}
                  />
                  <Label
                    htmlFor={tag.documentId}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1 flex items-center gap-2"
                  >
                    {tag.icon && renderIcon(tag.icon, 'text-primary', 16)}
                    <span className="truncate">{tag.name}</span>
                  </Label>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">
                    ({tag.count})
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <Separator className="hidden lg:block" />

      <div className="hidden lg:block bg-muted/50 rounded-xl p-6">
        <h4 className="font-medium mb-2">💡 {t('tippHeadline')}</h4>
        <p className="text-sm text-muted-foreground">
          {t('tippText')}
        </p>
      </div>
    </aside>
  );
};

