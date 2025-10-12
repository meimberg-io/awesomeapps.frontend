'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Hero } from "@/components/new/Hero";
import { ServiceCard } from "@/components/new/ServiceCard";
import { FilterSidebar } from "@/components/new/FilterSidebar";
import { Service } from "@/types/service";
import { Tag } from "@/types/tag";
import { fetchServices, fetchTags, searchServices } from "@/lib/strapi";

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
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Clear tag filters when user starts searching
    if (query.trim() !== "") {
      setSelectedTags([]);
    }
  };

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

  // Search effect with debouncing
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const debounceTimer = setTimeout(() => {
      searchServices(searchQuery)
        .then(setServices)
        .catch(console.error)
        .finally(() => setIsSearching(false));
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Dynamic fetching based on selected tags
  useEffect(() => {
    // Don't fetch if user is searching
    if (searchQuery.trim() !== "") {
      return;
    }

    if (selectedTags.length > 0) {
      fetchServices(selectedTags).then(setServices).catch(console.error);
      fetchTags(selectedTags).then(setTags).catch(console.error);
    } else if (!maintag) {
      // When no tags selected and no search, reset to initial services
      setServices(initialServices);
      setTags(initialTags);
    }
  }, [selectedTags, maintag, initialServices, initialTags, searchQuery]);

  const filteredServices = services;

  const handleServiceClick = (service: Service) => {
    router.push(`/s/${service.slug}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero searchQuery={searchQuery} onSearchChange={handleSearchChange} />

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
                {isSearching ? "Suche läuft..." : `${filteredServices.length} Services gefunden`}
              </h2>
              <p className="text-muted-foreground">
                {searchQuery.trim() !== "" 
                  ? `Suchergebnisse für "${searchQuery}"` 
                  : "Entdecken Sie die besten digitalen Dienste für Ihre Anforderungen"
                }
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

