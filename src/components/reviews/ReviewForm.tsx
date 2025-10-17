'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as ReviewAPI from '@/lib/api/review-api';
import { useTranslations } from 'next-intl';

interface ReviewFormProps {
  serviceDocumentId: string;
  onReviewSubmitted: () => void;
}

export function ReviewForm({ serviceDocumentId, onReviewSubmitted }: ReviewFormProps) {
  const t = useTranslations('review');
  const { data: session } = useSession();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: t('error'),
        description: t('selectRating'),
        variant: 'destructive',
      });
      return;
    }

    if (!session?.strapiJwt) {
      toast({
        title: t('notLoggedIn'),
        description: t('mustBeLoggedIn'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await ReviewAPI.createReview(
        serviceDocumentId,
        rating,
        reviewText.trim() || null,
        session.strapiJwt
      );

      toast({
        title: t('reviewSubmitted'),
        description: t('reviewSaved'),
      });

      // Reset form
      setRating(0);
      setReviewText('');
      onReviewSubmitted();
    } catch (error) {
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('reviewSaveError'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('pleaseSignIn').replace('/auth/signin', '<a href="/auth/signin" class="text-primary hover:underline">') + '</a>' }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('giveReview')}</CardTitle>
        <CardDescription>
          {t('shareExperience')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('yourRating')}
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-all hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-muted-foreground ml-2">
                  {t('starsOf', { rating })}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label htmlFor="reviewText" className="block text-sm font-medium mb-2">
              {t('yourComment')}
            </label>
            <Textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={t('experiencePlaceholder')}
              rows={5}
              maxLength={2000}
              disabled={isSubmitting}
            />
            {reviewText.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {reviewText.length} / 2000 {t('characters')}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('saving')}
              </>
            ) : (
              t('submitReview')
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


