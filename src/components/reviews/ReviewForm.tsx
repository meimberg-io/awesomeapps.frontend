'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as ReviewAPI from '@/lib/api/review-api';

interface ReviewFormProps {
  serviceDocumentId: string;
  onReviewSubmitted: () => void;
}

export function ReviewForm({ serviceDocumentId, onReviewSubmitted }: ReviewFormProps) {
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
        title: 'Fehler',
        description: 'Bitte wähle eine Bewertung aus.',
        variant: 'destructive',
      });
      return;
    }

    if (!session?.strapiJwt) {
      toast({
        title: 'Nicht angemeldet',
        description: 'Du musst angemeldet sein, um eine Bewertung abzugeben.',
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
        title: 'Bewertung abgegeben',
        description: 'Deine Bewertung wurde erfolgreich gespeichert.',
      });

      // Reset form
      setRating(0);
      setReviewText('');
      onReviewSubmitted();
    } catch (error) {
      toast({
        title: 'Fehler',
        description: error instanceof Error ? error.message : 'Bewertung konnte nicht gespeichert werden.',
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
          <p className="text-muted-foreground">
            Bitte <a href="/auth/signin" className="text-primary hover:underline">melde dich an</a>, um eine Bewertung abzugeben.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bewertung abgeben</CardTitle>
        <CardDescription>
          Teile deine Erfahrungen mit diesem Service
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Deine Bewertung *
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
                  {rating} von 5 Sternen
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label htmlFor="reviewText" className="block text-sm font-medium mb-2">
              Dein Kommentar (optional)
            </label>
            <Textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Schreibe etwas über deine Erfahrungen mit diesem Service..."
              rows={5}
              maxLength={2000}
              disabled={isSubmitting}
            />
            {reviewText.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {reviewText.length} / 2000 Zeichen
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
                Wird gespeichert...
              </>
            ) : (
              'Bewertung absenden'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


