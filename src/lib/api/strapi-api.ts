import { STRAPI_BASEURL } from "@/lib/constants";
import { Member } from "@/types/member";
import { Service } from "@/types/service";

/**
 * Authenticate member with Strapi and get JWT
 */
export async function authenticateMember(session: any) {
  const response = await fetch(`${STRAPI_BASEURL}/api/members/me`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: session.user.email,
      name: session.user.name,
      picture: session.user.image,
      provider: session.provider || 'google',
      sub: session.sub,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to authenticate with Strapi');
  }

  return response.json();
}

/**
 * Update member profile
 */
export async function updateMemberProfile(
  memberId: number,
  data: {
    username?: string;
    displayName?: string;
    bio?: string;
  },
  jwt: string
): Promise<{ data: Member }> {
  const response = await fetch(`${STRAPI_BASEURL}/api/members/${memberId}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to update profile');
  }

  return response.json();
}

/**
 * Add service to favorites
 */
export async function addFavorite(
  memberId: number,
  serviceDocumentId: string,
  jwt: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${STRAPI_BASEURL}/api/members/${memberId}/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify({ serviceDocumentId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to add favorite');
  }

  return response.json();
}

/**
 * Remove service from favorites
 */
export async function removeFavorite(
  memberId: number,
  serviceDocumentId: string,
  jwt: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${STRAPI_BASEURL}/api/members/${memberId}/favorites/${serviceDocumentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to remove favorite');
  }

  return response.json();
}

/**
 * Get member favorites
 */
export async function getFavorites(
  memberId: number,
  jwt: string
): Promise<{ data: Service[] }> {
  const response = await fetch(`${STRAPI_BASEURL}/api/members/${memberId}/favorites`, {
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch favorites');
  }

  return response.json();
}

/**
 * Check if service is favorited
 */
export async function checkFavorite(
  memberId: number,
  serviceDocumentId: string,
  jwt: string
): Promise<{ isFavorite: boolean }> {
  const response = await fetch(`${STRAPI_BASEURL}/api/members/${memberId}/favorites/${serviceDocumentId}/check`, {
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    return { isFavorite: false };
  }

  return response.json();
}

/**
 * Get member profile with statistics
 */
export async function getMemberProfile(
  memberId: number,
  jwt: string
): Promise<{ data: Member & { statistics: any } }> {
  const response = await fetch(`${STRAPI_BASEURL}/api/members/${memberId}/profile`, {
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch profile');
  }

  return response.json();
}

/**
 * Get member reviews
 */
export async function getMemberReviews(
  memberId: number,
  jwt: string
): Promise<{ data: any[] }> {
  const response = await fetch(`${STRAPI_BASEURL}/api/members/${memberId}/reviews`, {
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch reviews');
  }

  return response.json();
}

