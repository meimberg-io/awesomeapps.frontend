'use client';

import { Star, ExternalLink, ArrowLeft, Globe, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Service } from "@/types/service";
import { STRAPI_BASEURL } from "@/lib/constants";
import Header from "@/components/Header";
import DynamicZoneComponent from "@/components/strapicomponents/dynamiczone/DynamicZoneComponent";
import MarkdownRenderer from "@/components/util/MarkdownRenderer";
import { Screenshots } from "@/components/util/Screenshots";
import Youtube from "@/components/Youtube";
import { useRouter } from "next/navigation";
import { useMember } from "@/contexts/MemberContext";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ServiceDetailProps {
  service: Service;
}

export const ServiceDetail = ({ service }: ServiceDetailProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { addFavorite, removeFavorite, isFavorite } = useMember();
  const { toast } = useToast();
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const iconurl = service.logo?.url ? `${STRAPI_BASEURL}${service.logo.url}` : "/dummy.svg";
  
  // Mock rating data (deterministic to avoid hydration errors)
  const mockRating = 4.5;
  const idHash = service.documentId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const mockReviews = (idHash * 37) % 150 + 50;

  const favorite = isFavorite(service.documentId);

  const handleToggleFavorite = async () => {
    if (!session) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Bitte melden Sie sich an, um Favoriten zu speichern.",
        variant: "destructive",
      });
      return;
    }

    setIsTogglingFavorite(true);
    try {
      if (favorite) {
        await removeFavorite(service.documentId);
        toast({
          title: "Entfernt",
          description: `${service.name} wurde aus deinen Favoriten entfernt.`,
        });
      } else {
        await addFavorite(service.documentId);
        toast({
          title: "Hinzugefügt",
          description: `${service.name} wurde zu deinen Favoriten hinzugefügt.`,
        });
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Es ist ein Fehler aufgetreten. Bitte versuche es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Übersicht
        </Button>

        <div className="space-y-8">
          {/* Header Section with Logo and Title */}
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 flex-shrink-0 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shadow-lg border border-border/50">
              <img
                src={iconurl}
                alt={`${service.name} logo`}
                className="w-12 h-12 object-contain"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold">{service.name}</h1>
                <Button
                  variant={favorite ? "default" : "outline"}
                  size="icon"
                  onClick={handleToggleFavorite}
                  disabled={isTogglingFavorite}
                  title={favorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
                >
                  <Heart className={`h-5 w-5 ${favorite ? 'fill-current' : ''}`} />
                </Button>
              </div>
              <div className="flex items-center gap-4 flex-wrap mb-4">
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-bold text-lg text-primary">{mockRating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({mockReviews} reviews)
                  </span>
                </div>
                {service.top && (
                  <Badge variant="secondary" className="text-sm">Featured</Badge>
                )}
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <Badge key={tag.documentId} variant="outline" className="text-sm">
                    {tag.icon} {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* App URL Section */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Website besuchen</p>
                  <p className="text-lg font-semibold text-foreground break-all">{service.url}</p>
                </div>
              </div>
              <Button size="lg" className="px-8" asChild>
                <a href={service.url} target="_blank" rel="noopener noreferrer">
                  App öffnen
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Rich Content Section */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {service.abstract && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Über {service.name}</h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {service.abstract}
                </p>
              </div>
            )}

            {service.description && (
              <div className="mb-8">
                <MarkdownRenderer content={service.description}/>
              </div>
            )}

            {service.functionality && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3">Funktionen und Einsatzmöglichkeiten</h3>
                <MarkdownRenderer content={service.functionality}/>
              </div>
            )}

            {service.shortfacts && (
              <div className="bg-muted/50 border border-border rounded-lg p-6 my-6">
                <h4 className="font-semibold mb-2 text-base">💡 Kurz & Knapp</h4>
                <p className="text-sm text-muted-foreground">
                  {service.shortfacts}
                </p>
              </div>
            )}

            {/* Screenshots */}
            {(service.screenshots && service.screenshots.length > 0) && (
              <div className="my-8">
                <Screenshots service={service}/>
              </div>
            )}

            {/* Video Section */}
            {service.youtube_video && (
              <div className="my-8">
                <Youtube video={service.youtube_video} title={service.youtube_title}/>
              </div>
            )}

            {service.pricing && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3">Preise</h3>
                <MarkdownRenderer content={service.pricing}/>
                <p className="mt-4 text-sm text-right italic text-muted-foreground">
                  Die Preise können je nach Region variieren. Wir übernehmen keine Gewähr auf die Korrektheit der Preise. 
                  Für aktuelle Informationen siehe: <a href={service.url} className="text-primary hover:underline">{service.url}</a>
                </p>
              </div>
            )}

            {/* Article content */}
            {service.articlecontent && (
              <div className="mb-8">
                <DynamicZoneComponent blocks={service.articlecontent}/>
              </div>
            )}
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3 pb-8 flex-wrap">
            <Button className="flex-1 min-w-[200px]" size="lg" asChild>
              <a href={service.url} target="_blank" rel="noopener noreferrer">
                Jetzt ausprobieren
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.back()}>
              Zurück
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;

