'use client';

import { Star, ExternalLink, ArrowLeft, Globe, Heart, MessageSquare, RefreshCw, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { App } from "@/types/app";
import { Review } from "@/types/review";
import { NewService } from "@/types/newService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarkdownRenderer from "@/components/util/MarkdownRenderer";
import { Screenshots } from "@/components/util/Screenshots";
import Youtube from "@/components/Youtube";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewList } from "@/components/reviews/ReviewList";
import { useRouter } from "next/navigation";
import { useMember } from "@/contexts/MemberContext";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { renderIcon } from "@/components/util/renderIcon";
import Link from "next/link";
import { getBrandfetchLogoUrl } from "@/lib/utils";
import { STRAPI_BASEURL } from "@/lib/constants";
import { useTranslations } from "next-intl";

interface ServiceDetailProps {
  service: App;
  initialReviews: Review[];
  newService?: NewService;
}

export const AppDetail = ({ service, initialReviews, newService }: ServiceDetailProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { addFavorite, removeFavorite, isFavorite } = useMember();
  const { toast } = useToast();
  const t = useTranslations('serviceDetail');
  const tReview = useTranslations('review');
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [regenerateStatus, setRegenerateStatus] = useState<'idle' | 'loading' | 'requested'>('idle');
  const [currentNewService, setCurrentNewService] = useState(newService);
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
  const displayRating = averageRating > 0 ? averageRating.toFixed(1) : t('noRating');

  // Sync currentNewService with prop changes
  useEffect(() => {
    setCurrentNewService(newService);
  }, [newService]);

  // Poll for newService status updates
  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    const shouldPoll = currentNewService && 
      (currentNewService.n8nstatus === 'new' || currentNewService.n8nstatus === 'pending');
    
    if (!shouldPoll) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/new-service/${service.slug}`);
        if (response.ok) {
          const data = await response.json();
          if (data.newService) {
            setCurrentNewService(data.newService);
            // Stop polling if status is finished or error
            if (data.newService.n8nstatus === 'finished' || data.newService.n8nstatus === 'error') {
              clearInterval(pollInterval);
            }
          }
        }
      } catch {
        // Silently handle polling errors
      }
    }, 1000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [isAdmin, currentNewService, service.slug]);

  // Determine button state based on newService status
  const getRegenerateButtonState = () => {
    if (!currentNewService) {
      return {
        icon: RefreshCw,
        className: '',
        disabled: regenerateStatus === 'loading' || regenerateStatus === 'requested',
        title: regenerateStatus === 'loading' ? 'Wird geladen...' : regenerateStatus === 'requested' ? 'Angefordert' : 'App regenerieren'
      };
    }

    switch (currentNewService.n8nstatus) {
      case 'new':
        return {
          icon: CheckCircle,
          className: 'bg-green-600 hover:bg-green-700 border-green-600 text-white',
          disabled: true,
          title: 'Neu - Wird verarbeitet'
        };
      case 'pending':
        return {
          icon: Clock,
          className: 'bg-yellow-600 hover:bg-yellow-700 border-yellow-600 text-white',
          disabled: true,
          title: 'In Bearbeitung'
        };
      case 'error':
        return {
          icon: AlertCircle,
          className: 'bg-red-600 hover:bg-red-700 border-red-600 text-white',
          disabled: true,
          title: 'Fehler bei der Verarbeitung'
        };
      case 'finished':
        return {
          icon: RefreshCw,
          className: '',
          disabled: regenerateStatus === 'loading' || regenerateStatus === 'requested',
          title: regenerateStatus === 'loading' ? 'Wird geladen...' : regenerateStatus === 'requested' ? 'Angefordert' : 'App regenerieren'
        };
      default:
        return {
          icon: RefreshCw,
          className: '',
          disabled: regenerateStatus === 'loading' || regenerateStatus === 'requested',
          title: 'App regenerieren'
        };
    }
  };

  const buttonState = getRegenerateButtonState();
  const RegenerateIcon = buttonState.icon;

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

  const handleRegenerate = async (field: string) => {
    setRegenerateStatus('loading');
    try {
      const url = `https://n8n.meimberg.io/webhook/a2e23025-297f-4b92-8473-8db6b8cfd2aa?service=${encodeURIComponent(service.name)}&fields=${encodeURIComponent(field)}`;
      const response = await fetch(url);
      
      if (response.ok) {
        setRegenerateStatus('requested');
        toast({
          title: "Erfolg",
          description: `Service-Regenerierung wurde angefordert${field !== 'all' ? ` (Feld: ${field})` : ''}.`,
        });
        // Start polling for status by refreshing to get initial newService entry
        setTimeout(() => router.refresh(), 1000);
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
            {t('backToOverview')}
          </Button>

          {/* Header Section with Logo and Title */}
          <div className="flex items-start gap-6 pb-8">
            <div className="w-24 h-24 flex-shrink-0 border border-gray-300">
              <img
                src={iconurl}
                alt={`${service.name} Logo - ${service.tags.filter(tag => !tag.excluded)[0]?.name || 'SaaS'} Tool`}
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold">{service.name}</h1>
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={buttonState.disabled}
                        title={buttonState.title}
                        className={buttonState.className}
                      >
                        <RegenerateIcon className={`h-5 w-5 ${regenerateStatus === 'loading' ? 'animate-spin' : ''}`} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => handleRegenerate('all')}>
                        All
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleRegenerate('url')}>
                        URL
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRegenerate('description')}>
                        Description
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRegenerate('functionality')}>
                        Functionality
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRegenerate('abstract')}>
                        Abstract
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRegenerate('pricing')}>
                        Pricing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRegenerate('tags')}>
                        Tags
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRegenerate('video')}>
                        Video
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRegenerate('shortfacts')}>
                        Shortfacts
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleFavorite}
                  disabled={isTogglingFavorite}
                  title={favorite ? t('removeFromFavorites') : t('addToFavorites')}
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
                    ({reviews.length} {reviews.length === 1 ? tReview('reviewSingular') : tReview('reviewPlural')})
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
                    {t('viewReviews')}
                  </Button>
                )}
                {service.top && (
                  <Badge variant="secondary" className="text-sm">Top</Badge>
                )}
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-8">
                {service.tags.filter(tag => !tag.excluded).map((tag) => (
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
              <div 
                className="float-right w-80 ml-8 mb-8 bg-white dark:bg-slate-900 border border-border/50 rounded-lg overflow-hidden"
                itemScope 
                itemType="https://schema.org/Question"
              >
                <div className="bg-gradient-to-r from-primary/20 to-primary/15 px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <h3 className="text-base font-semibold text-primary" itemProp="name">{t('whatIs', { service: service.name })}</h3>
                  </div>
                </div>
                <div className="p-6 space-y-5" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <div>
                    <p className="text-sm leading-relaxed text-muted-foreground" itemProp="text">
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
                <div className="mb-10" itemScope itemType="https://schema.org/Question">
                  <h2 className="text-2xl font-bold mb-4 text-foreground" itemProp="name">{t('whatFeatures', { service: service.name })}</h2>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <div itemProp="text">
                      <MarkdownRenderer content={service.functionality}/>
                    </div>
                  </div>
                </div>
              )}
              {service.pricing && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">{t('prices')}</h2>
                  <MarkdownRenderer content={service.pricing}/>
                  <div className="mt-6 p-4 bg-muted/50 border-l-4 border-primary/40 rounded-r">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t('priceDisclaimer')} <a href={service.url} className="text-primary hover:underline font-medium">{service.url}</a>
                    </p>
                  </div>
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
                  <h2 className="text-3xl font-bold text-foreground">{tReview('reviewPlural')}</h2>
                </div>
                <Button 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  variant={showReviewForm ? "outline" : "default"}
                  size="default"
                >
                  {showReviewForm ? t('cancel') : t('giveReview')}
                </Button>
              </div>
              <p className="text-muted-foreground text-base">
                {t('whatOthersSay', { service: service.name })}
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
                  {t('tryNow')}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('back')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppDetail;

