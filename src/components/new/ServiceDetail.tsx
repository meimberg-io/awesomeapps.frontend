'use client';

import { Star, ExternalLink, ArrowLeft, Globe, Heart, MessageSquare, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Service } from "@/types/service";
import { Review } from "@/types/review";
import Header from "@/components/Header";
import DynamicZoneComponent from "@/components/strapicomponents/dynamiczone/DynamicZoneComponent";
import MarkdownRenderer from "@/components/util/MarkdownRenderer";
import { Screenshots } from "@/components/util/Screenshots";
import Youtube from "@/components/Youtube";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewList } from "@/components/reviews/ReviewList";
import { useRouter } from "next/navigation";
import { useMember } from "@/contexts/MemberContext";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { renderIcon } from "@/components/util/renderIcon";
import Link from "next/link";
import { getBrandfetchLogoUrl } from "@/lib/utils";
import { STRAPI_BASEURL } from "@/lib/constants";

interface ServiceDetailProps {
  service: Service;
  initialReviews: Review[];
}

export const ServiceDetail = ({ service, initialReviews }: ServiceDetailProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { addFavorite, removeFavorite, isFavorite } = useMember();
  const { toast } = useToast();
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [regenerateStatus, setRegenerateStatus] = useState<'idle' | 'loading' | 'requested'>('idle');
  const reviews = initialReviews;
  const iconurl = service.logo?.url 
    ? `${STRAPI_BASEURL}${service.logo.url}` 
    : getBrandfetchLogoUrl(service.url);

  const favorite = isFavorite(service.documentId);
  const isAdmin = session?.user?.email === 'oli@meimberg.io';
  
  // Calculate real rating from reviews
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.voting, 0) / reviews.length
    : 0;
  const displayRating = averageRating > 0 ? averageRating.toFixed(1) : 'Keine';

  const handleReviewSubmitted = () => {
    // Trigger a page refresh to get updated reviews
    router.refresh();
  };

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
    } catch {
      toast({
        title: "Fehler",
        description: "Es ist ein Fehler aufgetreten. Bitte versuche es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerateStatus('loading');
    try {
      const response = await fetch(
        `https://n8n.meimberg.io/webhook/559994f0-0fb1-4a0f-83b7-1c2b7c10563d?service=${encodeURIComponent(service.name)}`
      );
      
      if (response.ok) {
        setRegenerateStatus('requested');
        toast({
          title: "Erfolg",
          description: "Service-Regenerierung wurde angefordert.",
        });
      } else {
        throw new Error('Request failed');
      }
    } catch {
      setRegenerateStatus('idle');
      toast({
        title: "Fehler",
        description: "Die Anfrage konnte nicht verarbeitet werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Colored Header Section */}
      <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-b border-border/50">
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Übersicht
          </Button>

          {/* Header Section with Logo and Title */}
          <div className="flex items-start gap-6 pb-8">
            <div className="w-24 h-24 flex-shrink-0 border border-gray-300">
              <img
                src={iconurl}
                alt={`${service.name} logo`}
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold">{service.name}</h1>
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRegenerate}
                    disabled={regenerateStatus === 'loading' || regenerateStatus === 'requested'}
                    title={regenerateStatus === 'loading' ? 'Wird geladen...' : regenerateStatus === 'requested' ? 'Angefordert' : 'Service regenerieren'}
                    className={regenerateStatus === 'requested' ? 'bg-green-600 hover:bg-green-700 border-green-600 text-white' : ''}
                  >
                    <RefreshCw className={`h-5 w-5 ${regenerateStatus === 'loading' ? 'animate-spin' : ''}`} />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleFavorite}
                  disabled={isTogglingFavorite}
                  title={favorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
                  className={favorite ? "bg-green-700 hover:bg-green-800 border-green-700 text-white" : ""}
                >
                  <Heart className={`h-5 w-5 ${favorite ? 'fill-current' : ''}`} />
                </Button>
              </div>
              <div className="flex items-center gap-4 flex-wrap mb-4">
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-bold text-lg text-primary">{displayRating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({reviews.length} {reviews.length === 1 ? 'Bewertung' : 'Bewertungen'})
                  </span>
                </div>
                {reviews.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Bewertungen ansehen
                  </Button>
                )}
                {service.top && (
                  <Badge variant="secondary" className="text-sm">Featured</Badge>
                )}
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-8">
                {service.tags.map((tag) => (
                  <Link key={tag.documentId} href={`/t/${tag.name}`}>
                    <Badge variant="outline" className="text-sm font-normal bg-background border-border/50 text-foreground/70 hover:bg-primary/5 hover:border-primary/30 transition-colors cursor-pointer">
                      {tag.icon && renderIcon(tag.icon, 'inline-block mr-1', 14)}
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="space-y-8">
          {/* Rich Content Section */}
          <div className="relative">
            {/* Floating Info Card */}
            {service.shortfacts && (
              <div className="float-right w-80 ml-8 mb-8 bg-white dark:bg-slate-900 border border-border/50 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-primary/20 to-primary/15 px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <h3 className="text-base font-semibold text-primary">Shortfacts</h3>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {service.shortfacts}
                    </p>
                  </div>
                  <Separator />
                  <div>
               
                    <a 
                      href={service.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors group"
                    >
                      <Globe className="h-4 w-4 text-muted-foreground" /><span className="break-all">{service.url}</span>
                      <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="prose prose-slate dark:prose-invert max-w-none">
              {service.description && (
                <div className="mb-10">
                  <MarkdownRenderer content={service.description}/>
                </div>
              )}

              {service.functionality && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Funktionen und Einsatzmöglichkeiten</h2>
                  <MarkdownRenderer content={service.functionality}/>
                </div>
              )}
              {service.pricing && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Preise</h2>
                  <MarkdownRenderer content={service.pricing}/>
                  <div className="mt-6 p-4 bg-muted/50 border-l-4 border-primary/40 rounded-r">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Die Preise können je nach Region variieren. Wir übernehmen keine Gewähr auf die Korrektheit der Preise. 
                      Für aktuelle Informationen siehe: <a href={service.url} className="text-primary hover:underline font-medium">{service.url}</a>
                    </p>
                  </div>
                </div>
              )}

              {/* Article content */}
              {service.articlecontent && (
                <div className="mb-10">
                  <DynamicZoneComponent blocks={service.articlecontent}/>
                </div>
              )}
            </div>

            {/* Clear float and add full-width media sections */}
            <div className="clear-both pt-8">
              {/* Screenshots */}
              {(service.screenshots && service.screenshots.length > 0) && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">Screenshots</h2>
                  <Screenshots service={service}/>
                </div>
              )}

              {/* Video Section */}
              {service.youtube_video && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">Video</h2>
                  <Youtube video={service.youtube_video} title={service.youtube_title}/>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-16" />

          {/* Reviews Section */}
          <div id="reviews-section" className="scroll-mt-8">
            <div className="mb-10">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Bewertungen</h2>
                </div>
                <Button 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  variant={showReviewForm ? "outline" : "default"}
                  size="default"
                >
                  {showReviewForm ? "Abbrechen" : "Bewertung abgeben"}
                </Button>
              </div>
              <p className="text-muted-foreground text-base">
                Was sagen andere Nutzer über {service.name}?
              </p>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="mb-8">
                <ReviewForm 
                  serviceDocumentId={service.documentId}
                  onReviewSubmitted={() => {
                    handleReviewSubmitted();
                    setShowReviewForm(false);
                  }}
                />
              </div>
            )}

            {/* Reviews List */}
            <div className="mb-8">
              <ReviewList 
                reviews={reviews}
                onReviewsChange={handleReviewSubmitted}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex gap-4 flex-wrap justify-center">
              <Button className="min-w-[200px]" size="lg" asChild>
                <a href={service.url} target="_blank" rel="noopener noreferrer">
                  Jetzt ausprobieren
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;

