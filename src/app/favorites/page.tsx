'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMember } from '@/contexts/MemberContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Heart, ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { STRAPI_BASEURL } from '@/lib/constants';
import { useState } from 'react';

export default function FavoritesPage() {
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
        title: 'Entfernt',
        description: `${serviceName} wurde aus deinen Favoriten entfernt.`,
      });
    } catch {
      toast({
        title: 'Fehler',
        description: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.',
        variant: 'destructive',
      });
    } finally {
      setRemovingId(null);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Meine Favoriten</h1>
        </div>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Noch keine Favoriten</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Du hast noch keine Services als Favoriten gespeichert. Durchstöbere unsere
                Sammlung und markiere deine Lieblings-Apps!
              </p>
              <Button asChild>
                <Link href="/">Services entdecken</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              Du hast {favorites.length} Service{favorites.length !== 1 ? 's' : ''} als Favoriten gespeichert
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((service) => {
                const iconUrl = service.logo?.url
                  ? `${STRAPI_BASEURL}${service.logo.url}`
                  : '/dummy.svg';
                const thumbnailUrl = service.thumbnail?.url
                  ? `${STRAPI_BASEURL}${service.thumbnail.url}`
                  : null;

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
                        <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border border-border/50">
                          <img
                            src={iconUrl}
                            alt={`${service.name} logo`}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 truncate">
                            {service.name}
                          </h3>
                          {service.top && (
                            <Badge variant="secondary" className="text-xs">
                              Featured
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
                      {service.tags && service.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {service.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag.documentId} variant="outline" className="text-xs">
                              {tag.icon} {tag.name}
                            </Badge>
                          ))}
                          {service.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{service.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Spacer to push actions to bottom */}
                      <div className="flex-1"></div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button asChild className="flex-1" size="sm">
                          <Link href={`/s/${service.slug}`}>
                            Details
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
    </div>
  );
}

