'use client';

import { Review } from '@/types/review';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { STRAPI_BASEURL } from '@/lib/constants';
import { useState } from 'react';
import * as ReviewAPI from '@/lib/api/review-api';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

interface ReviewListProps {
  reviews: Review[];
  onReviewsChange?: () => void;
}

export function ReviewList({ reviews, onReviewsChange }: ReviewListProps) {
  const t = useTranslations('review');
  const { toast } = useToast();
  const [helpfulLoading, setHelpfulLoading] = useState<string | null>(null);

  const handleMarkHelpful = async (review: Review) => {
    if (helpfulLoading) return;

    setHelpfulLoading(review.documentId);
    try {
      await ReviewAPI.markReviewHelpful(review.documentId, review.helpfulCount);
      toast({
        title: t('thanks'),
        description: t('markedHelpful'),
      });
      onReviewsChange?.();
    } catch {
      toast({
        title: t('common.error'),
        description: t('couldNotMark'),
        variant: 'destructive',
      });
    } finally {
      setHelpfulLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Noch keine Bewertungen</h3>
          <p className="text-muted-foreground">
            Sei der Erste, der diesen Service bewertet!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const avatarUrl = review.member.avatar?.url
          ? `${STRAPI_BASEURL}${review.member.avatar.url}`
          : review.member.avatarUrl;

        const displayName =
          review.member.displayName || review.member.username || 'Anonymous';

        return (
          <Card key={review.documentId} className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              {/* Header with Avatar, Name, and Rating */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold">{displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.voting
                              ? 'fill-primary text-primary'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  {review.reviewtext && (
                    <p className="text-sm text-foreground mt-3 leading-relaxed">
                      {review.reviewtext}
                    </p>
                  )}

                  {/* Helpful Button */}
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkHelpful(review)}
                      disabled={helpfulLoading === review.documentId}
                      className="text-xs"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Hilfreich
                    </Button>
                    {review.helpfulCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {review.helpfulCount} {review.helpfulCount === 1 ? 'Person fand' : 'Personen fanden'} dies hilfreich
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

