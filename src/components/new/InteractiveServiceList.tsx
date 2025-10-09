'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Hero } from "@/components/new/Hero";
import { ServiceCard } from "@/components/new/ServiceCard";
import { FilterSidebar } from "@/components/new/FilterSidebar";
import { Service } from "@/types/service";
import { Tag } from "@/types/tag";

interface InteractiveServiceListProps {
  initialServices: Service[];
  initialTags: Tag[];
  maintag?: Tag;
}

const InteractiveServiceList = ({ initialServices, initialTags, maintag }: InteractiveServiceListProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>(maintag ? [maintag] : []);

  const handleTagChange = (tagId: string) => {
    const tag = initialTags.find(t => t.documentId === tagId);
    if (!tag) return;

    setSelectedTags((prev) => {
      const isSelected = prev.some(t => t.documentId === tagId);
      if (isSelected) {
        return prev.filter((t) => t.documentId !== tagId);
      } else {
        return [...prev, tag];
      }
    });
  };

  const filteredServices = useMemo(() => {
    return initialServices.filter((service) => {
      const matchesSearch =
        searchQuery === "" ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.abstract && service.abstract.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        service.tags.some((tag) =>
          tag.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some(selectedTag =>
          service.tags.some(serviceTag => serviceTag.documentId === selectedTag.documentId)
        );

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags, initialServices]);

  const handleServiceClick = (service: Service) => {
    router.push(`/s/${service.slug}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            selectedTags={selectedTags}
            onTagChange={handleTagChange}
            availableTags={initialTags}
            services={initialServices}
          />

          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {filteredServices.length} Services gefunden
              </h2>
              <p className="text-muted-foreground">
                Entdecken Sie die besten digitalen Dienste für Ihre Anforderungen
              </p>
            </div>

            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Keine Services gefunden. Versuchen Sie andere Filter oder Suchbegriffe.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.documentId}
                    service={service}
                    onServiceClick={handleServiceClick}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default InteractiveServiceList;

