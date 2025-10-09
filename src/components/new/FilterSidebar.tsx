'use client';

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag } from "@/types/tag";
import { Service } from "@/types/service";
import { useMemo, useState } from "react";

interface FilterSidebarProps {
  selectedTags: Tag[];
  onTagChange: (tagId: string) => void;
  availableTags: Tag[];
  services: Service[];
}

export const FilterSidebar = ({
  selectedTags,
  onTagChange,
  availableTags,
}: FilterSidebarProps) => {
  const [tagSearch, setTagSearch] = useState("");

  const filteredTags = useMemo(() => {
    if (!tagSearch) return availableTags;
    return availableTags.filter(tag => 
      tag.name.toLowerCase().includes(tagSearch.toLowerCase()) ||
      (tag.description && tag.description.toLowerCase().includes(tagSearch.toLowerCase()))
    );
  }, [availableTags, tagSearch]);

  return (
    <aside className="w-full lg:w-64 space-y-6">
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
        <h3 className="font-semibold text-lg mb-4">Kategorien & Tags</h3>
        <Input
          placeholder="Tag suchen..."
          value={tagSearch}
          onChange={(e) => setTagSearch(e.target.value)}
          className="mb-4"
        />
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {filteredTags.map((tag) => (
              <div key={tag.documentId} className="flex items-center space-x-2">
                <Checkbox
                  id={tag.documentId}
                  checked={selectedTags.some(t => t.documentId === tag.documentId)}
                  onCheckedChange={() => onTagChange(tag.documentId)}
                />
                <Label
                  htmlFor={tag.documentId}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {tag.icon} {tag.name}
                </Label>
                <span className="text-xs text-muted-foreground">
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
          Nutzen Sie die Filter, um schnell die passenden Services für Ihre Anforderungen zu finden.
        </p>
      </div>
    </aside>
  );
};

