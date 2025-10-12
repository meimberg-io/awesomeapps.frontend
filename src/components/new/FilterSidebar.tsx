'use client';

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tag } from "@/types/tag";
import { Service } from "@/types/service";
import { useMemo, useState } from "react";
import { renderIcon } from "@/components/util/renderIcon";
import { X } from "lucide-react";

interface FilterSidebarProps {
  selectedTags: Tag[];
  onTagChange: (tagId: string) => void;
  availableTags: Tag[];
  services: Service[];
  onClearFilters: () => void;
}

export const FilterSidebar = ({
  selectedTags,
  onTagChange,
  availableTags,
  onClearFilters,
}: FilterSidebarProps) => {
  const [tagSearch, setTagSearch] = useState("");

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
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Kategorien</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearFilters}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              title="Filter zurücksetzen"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Input
          placeholder="Tag suchen..."
          value={tagSearch}
          onChange={(e) => setTagSearch(e.target.value)}
          className="mb-4"
        />
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-4">
            {filteredTags.map((tag) => (
              <div key={tag.documentId} className="flex items-center space-x-2">
                <Checkbox
                  id={tag.documentId}
                  checked={selectedTagIds.has(tag.documentId)}
                  onCheckedChange={() => onTagChange(tag.documentId)}
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

      <Separator />

      <div className="bg-muted/50 rounded-xl p-6">
        <h4 className="font-medium mb-2">💡 Tipp</h4>
        <p className="text-sm text-muted-foreground">
          Nutzen Sie die Filter, um schnell die passenden Service für Ihre Anforderungen zu finden.
        </p>
      </div>
    </aside>
  );
};

