'use client';

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Hero } from "@/components/new/Hero";
import { ServiceCard } from "@/components/new/ServiceCard";
import { FilterSidebar } from "@/components/new/FilterSidebar";
import { Service } from "@/types/service";
import { Tag } from "@/types/tag";
import { fetchServices, fetchTags } from "@/lib/strapi";

interface InteractiveServiceListProps {
  initialServices: Service[];
  initialTags: Tag[];
  maintag?: Tag;
}

const InteractiveServiceList = ({ initialServices, initialTags, maintag }: InteractiveServiceListProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>(maintag ? [maintag] : []);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [tags, setTags] = useState<Tag[]>(initialTags);

  const handleTagChange = (tagId: string) => {
    const tag = tags.find(t => t.documentId === tagId);
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

  const handleClearFilters = () => {
    setSelectedTags([]);
  };

  // Dynamic fetching based on selected tags (like old frontend)
  // Only fetch when tags are selected, not on initial mount with empty tags
  useEffect(() => {
    if (selectedTags.length > 0) {
      fetchServices(selectedTags).then(setServices).catch(console.error);
      fetchTags(selectedTags).then(setTags).catch(console.error);
    } else if (!maintag) {
      // When no tags selected and no maintag, reset to initial featured services
      setServices(initialServices);
      setTags(initialTags);
    }
  }, [selectedTags, maintag, initialServices, initialTags]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        searchQuery === "" ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.abstract && service.abstract.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        service.tags.some((tag) =>
          tag.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesSearch;
    });
  }, [searchQuery, services]);

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
            availableTags={tags}
            services={services}
            onClearFilters={handleClearFilters}
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
                    selectedTags={selectedTags}
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

