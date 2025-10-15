'use client';

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import heroBackground from "@/assets/header_01.jpg";

interface HeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const Hero = ({ searchQuery, onSearchChange }: HeroProps) => {
  return (
    <section className="relative overflow-hidden py-20 px-6">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={heroBackground}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      </div>
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Optional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/30 to-transparent" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
            AwesomeApps
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
          The fine selection of truly awesome apps and services
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-card/95 backdrop-blur-sm p-2 rounded-xl shadow-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Suche nach Services, Tags oder Kategorien..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 border-0 focus-visible:ring-0 bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

