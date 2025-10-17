'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Hero } from "@/components/new/Hero";
import { ServiceCard } from "@/components/new/ServiceCard";
import { FilterSidebar } from "@/components/new/FilterSidebar";
import { Service } from "@/types/service";
import { Tag } from "@/types/tag";
import { fetchServices, fetchTags, searchServices } from "@/lib/strapi";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { renderIcon } from "@/components/util/renderIcon";
import {useTranslations, useLocale} from 'next-intl';
import {Locale} from '@/types/locale';

interface InteractiveServiceListProps {
  initialServices: Service[];
  initialTags: Tag[];
  maintag?: Tag;
}

const InteractiveServiceList = ({ initialServices, initialTags, maintag }: InteractiveServiceListProps) => {
  const router = useRouter();
  const t = useTranslations('filter');
  const locale = useLocale() as Locale;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>(maintag ? [maintag] : []);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingFiltered, setIsLoadingFiltered] = useState(false);
  const [activeTab, setActiveTab] = useState<'featured' | 'all'>('featured');
  const [displayServices, setDisplayServices] = useState<Service[]>(initialServices.filter(s => s.top));

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

    // Show loader immediately
    setIsLoadingFiltered(true);

    setSelectedTags((prev) => {
      const isSelected = prev.some(t => t.documentId === tagId);
      if (isSelected) {
        const newTags = prev.filter((t) => t.documentId !== tagId);
        // If removing the last tag, go back to featured
        if (newTags.length === 0) {
          setActiveTab('featured');
        }
        return newTags;
      } else {
        // Switch to "all" tab when adding a tag (removes featured filter atomically)
        setActiveTab('all');
        return [...prev, tag];
      }
    });
  };

  const handleClearFilters = () => {
    setIsLoadingFiltered(true);
    setActiveTab('featured'); // Reset to featured when clearing all filters
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
      searchServices(searchQuery, locale)
        .then((results) => {
          setServices(results);
          setDisplayServices(results); // Update display immediately after search
        })
        .catch(console.error)
        .finally(() => setIsSearching(false));
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, locale]);

  // Dynamic fetching based on selected tags
  useEffect(() => {
    // Don't fetch if user is searching
    if (searchQuery.trim() !== "") {
      return;
    }

    if (selectedTags.length > 0) {
      setIsLoadingFiltered(true);
      Promise.all([
        fetchServices(selectedTags, locale),
        fetchTags(selectedTags)
      ])
        .then(([newServices, newTags]) => {
          setServices(newServices);
          setTags(newTags);
          setDisplayServices(newServices); // Update display immediately after fetch
        })
        .catch(console.error)
        .finally(() => setIsLoadingFiltered(false));
    } else if (!maintag) {
      // When no tags selected and no search, reset to initial services
      setServices(initialServices);
      setTags(initialTags);
      setDisplayServices(activeTab === 'featured' ? initialServices.filter(s => s.top) : initialServices);
      setIsLoadingFiltered(false);
    }
  }, [selectedTags, maintag, initialServices, initialTags, searchQuery, locale, activeTab]);

  // Update display when tab changes (without tags/search active)
  useEffect(() => {
    if (selectedTags.length === 0 && searchQuery.trim() === "") {
      const filtered = activeTab === 'featured' ? services.filter(s => s.top) : services;
      setDisplayServices(filtered);
    }
  }, [activeTab, services, selectedTags.length, searchQuery]);

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
              {searchQuery.trim() !== "" ? (
                <>
                  <h2 className="text-2xl font-bold mb-2">
                    {isSearching ? t('searchingApps') : t('appsFound', {count: displayServices.length})}
                  </h2>
                  <p className="text-muted-foreground">
                    {t('searchResultsFor')} "{searchQuery}"
                  </p>
                </>
              ) : selectedTags.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <AnimatePresence mode="popLayout">
                      {selectedTags.map((tag) => (
                        <motion.div
                          key={tag.documentId}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.8, x: -10 }}
                          transition={{ 
                            duration: 0.15,
                            ease: "easeOut"
                          }}
                        >
                          <Badge
                            variant="default"
                            className="text-sm px-3 py-1.5 cursor-pointer transition-all hover:bg-destructive hover:text-destructive-foreground group flex items-center gap-2"
                            onClick={() => handleTagChange(tag.documentId)}
                          >
                            {tag.icon && renderIcon(tag.icon, 'text-primary-foreground group-hover:text-destructive-foreground', 16)}
                            <span>{tag.name}</span>
                            <Trash2 className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  {isLoadingFiltered ? (
                    <div className="flex items-center gap-2 h-[20px]">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm text-foreground/70">{t('searchingApps')}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-foreground/70 h-[20px]">
                      {t('appsFound', {count: displayServices.length})}
                    </p>
                  )}
                </>
              ) : (
                <div className="mb-6">
                  <div className="flex items-center gap-4 border-b border-border">
                    <button
                      onClick={() => setActiveTab('featured')}
                      className={`pb-3 px-1 text-lg font-semibold transition-colors relative ${
                        activeTab === 'featured'
                          ? 'text-primary'
                          : 'text-foreground/80 hover:text-foreground'
                      }`}
                    >
                      {t('featuredApps')}
                      {activeTab === 'featured' && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`pb-3 px-1 text-lg font-semibold transition-colors relative ${
                        activeTab === 'all'
                          ? 'text-primary'
                          : 'text-foreground/80 hover:text-foreground'
                      }`}
                    >
                      {t('allApps')}
                      {activeTab === 'all' && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-foreground/70 mt-4">
                    {displayServices.length} {displayServices.length === 1 ? t('app') : t('apps')}
                  </p>
                </div>
              )}
            </div>

            {displayServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {t('noServicesFound')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayServices.map((service) => (
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
      <Footer />
    </div>
  );
};

export default InteractiveServiceList;

