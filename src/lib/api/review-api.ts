import { STRAPI_BASEURL } from "@/lib/constants";
import { Review } from "@/types/review";

/**
 * Create a new review
 */
export async function createReview(
  serviceDocumentId: string,
  voting: number,
  reviewtext: string | null,
  jwt: string
): Promise<{ data: Review }> {
  const response = await fetch(`${STRAPI_BASEURL}/api/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      data: {
        service: serviceDocumentId,
        voting,
        reviewtext: reviewtext || null,
        isPublished: true,
        helpfulCount: 0,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to create review');
  }

  return response.json();
}

/**
 * Update an existing review
 */
export async function updateReview(
  reviewDocumentId: string,
  voting: number,
  reviewtext: string | null,
  jwt: string
): Promise<{ data: Review }> {
  const response = await fetch(`${STRAPI_BASEURL}/api/reviews/${reviewDocumentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      data: {
        voting,
        reviewtext: reviewtext || null,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to update review');
  }

  return response.json();
}

/**
 * Delete a review
 */
export async function deleteReview(
  reviewDocumentId: string,
  jwt: string
): Promise<void> {
  const response = await fetch(`${STRAPI_BASEURL}/api/reviews/${reviewDocumentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to delete review');
  }
}

/**
 * Mark review as helpful
 */
export async function markReviewHelpful(
  reviewDocumentId: string,
  currentCount: number
): Promise<{ data: Review }> {
  const response = await fetch(`${STRAPI_BASEURL}/api/reviews/${reviewDocumentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        helpfulCount: currentCount + 1,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to mark review as helpful');
  }

  return response.json();
}

