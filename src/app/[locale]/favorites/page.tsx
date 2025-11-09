'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useMember } from '@/contexts/MemberContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Heart, ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { STRAPI_BASEURL } from '@/lib/constants';
import { useState } from 'react';
import { getBrandfetchLogoUrl } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Locale } from '@/types/locale';
import { isTagActive } from '@/lib/tag-utils';

export default function FavoritesPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params?.locale as Locale) || 'de';
  const { status } = useSession();
  const router = useRouter();
  const { favorites, loading, removeFavorite, refreshMember } = useMember();
  const { toast } = useToast();
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleRemoveFavorite = async (serviceDocumentId: string, serviceName: string) => {
    setRemovingId(serviceDocumentId);
    try {
      await removeFavorite(serviceDocumentId);
      // Force refresh to ensure UI updates
      await refreshMember();
      toast({
        title: t('favorites.removed'),
        description: t('favorites.removedDescription', { service: serviceName }),
      });
    } catch {
      toast({
        title: t('common.error'),
        description: t('favorites.errorOccurred'),
        variant: 'destructive',
      });
    } finally {
      setRemovingId(null);
    }
  };

  if (loading || status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">{t('favorites.title')}</h1>
        </div>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">{t('favorites.noFavoritesYet')}</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                {t('favorites.noFavoritesDescription')}
              </p>
              <Button asChild>
                <Link href="/">{t('favorites.discoverApps')}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              {t('favorites.savedCount', { count: favorites.length, plural: favorites.length !== 1 ? 's' : '' })}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((service) => {
                const iconUrl = service.logo?.url 
                  ? `${STRAPI_BASEURL}${service.logo.url}` 
                  : getBrandfetchLogoUrl(service.url);
                const thumbnailUrl = service.thumbnail?.url
                  ? `${STRAPI_BASEURL}${service.thumbnail.url}`
                  : null;
                const activeTags = (service.tags || []).filter(isTagActive);

                return (
                  <Card key={service.documentId} className="overflow-hidden hover:shadow-xl hover:brightness-110 transition-all flex flex-col">
                    {/* Thumbnail */}
                    {thumbnailUrl && (
                      <div className="h-40 bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                        <img
                          src={thumbnailUrl}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <CardContent className="p-6 flex flex-col flex-1">
                      {/* Logo and Title */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 flex-shrink-0 border border-gray-300">
                          <img
                            src={iconUrl}
                            alt={`${service.name} Logo - ${activeTags[0]?.name || 'SaaS'} Tool`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 truncate">
                            {service.name}
                          </h3>
                          {service.top && (
                            <Badge variant="secondary" className="text-xs">
                              Top
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Abstract */}
                      {service.abstract && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {service.abstract}
                        </p>
                      )}

                      {/* Tags */}
                      {activeTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {activeTags.slice(0, 3).map((tag) => (
                            <Badge key={tag.documentId} variant="outline" className="text-xs">
                              {tag.icon} {tag.name}
                            </Badge>
                          ))}
                          {activeTags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{activeTags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Spacer to push actions to bottom */}
                      <div className="flex-1"></div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button asChild className="flex-1" size="sm">
                          <Link href={`/${locale}/s/${service.slug}`}>
                            {t('favorites.details')}
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a href={service.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveFavorite(service.documentId, service.name)}
                          disabled={removingId === service.documentId}
                        >
                          {removingId === service.documentId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

