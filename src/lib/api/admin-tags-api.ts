import { STRAPI_BASEURL } from '@/lib/constants'
import { Tag, TagStatus } from '@/types/tag'

interface StrapiResponse<T> {
  data: T[]
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export async function getTagsList(jwt: string): Promise<Tag[]> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const response = await fetch(
      `${STRAPI_BASEURL}/api/tags?sort=name:asc`,
      { headers }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch tags')
    }

    const data = await response.json()
    
    // Handle both array and StrapiResponse format
    if (Array.isArray(data)) {
      return data
    } else if (data.data && Array.isArray(data.data)) {
      return data.data
    } else {
      console.error('Unexpected response format:', data)
      return []
    }
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

export async function getTag(
  jwt: string,
  id: string
): Promise<Tag | null> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const response = await fetch(
      `${STRAPI_BASEURL}/api/tags/${id}?populate[services][count]=true`,
      { headers }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch tag')
    }

    const data = await response.json() as { data: Tag & { services: { count: number } } }
    const tag = data.data
    return {
      ...tag,
      count: tag.services?.count || 0,
    }
  } catch (error) {
    console.error('Error fetching tag:', error)
    return null
  }
}

export async function createTag(
  jwt: string,
  tagData: Partial<Tag>
): Promise<Tag | null> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const payload = {
      name: tagData.name,
      description: tagData.description,
      icon: tagData.icon,
      tagStatus: (tagData.tagStatus as TagStatus | undefined) ?? 'active',
    }
    const sanitizedPayload = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined && value !== null)
    )

    const response = await fetch(
      `${STRAPI_BASEURL}/api/tags`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: sanitizedPayload }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to create tag')
    }

    const data = await response.json() as { data: Tag }
    return data.data || null
  } catch (error) {
    console.error('Error creating tag:', error)
    throw error
  }
}

export async function updateTag(
  jwt: string,
  id: string,
  tagData: Partial<Tag>
): Promise<Tag | null> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const payload = {
      name: tagData.name,
      description: tagData.description,
      icon: tagData.icon,
      tagStatus: tagData.tagStatus as TagStatus | undefined,
    }
    const sanitizedPayload = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined && value !== null)
    )

    const response = await fetch(
      `${STRAPI_BASEURL}/api/tags/${id}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({ data: sanitizedPayload }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to update tag')
    }

    const data = await response.json() as { data: Tag }
    return data.data || null
  } catch (error) {
    console.error('Error updating tag:', error)
    throw error
  }
}

export async function deleteTag(
  jwt: string,
  id: string
): Promise<boolean> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const response = await fetch(
      `${STRAPI_BASEURL}/api/tags/${id}`,
      {
        method: 'DELETE',
        headers,
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete tag')
    }

    return true
  } catch (error) {
    console.error('Error deleting tag:', error)
    throw error
  }
}

export async function checkTagNameUniqueness(
  jwt: string,
  name: string,
  excludeId?: string
): Promise<boolean> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const queryParams = new URLSearchParams({
      'filters[name][$eq]': name,
    })

    if (excludeId) {
      queryParams.append('filters[documentId][$ne]', excludeId)
    }

    const response = await fetch(
      `${STRAPI_BASEURL}/api/tags?${queryParams.toString()}&pagination[pageSize]=1`,
      { headers }
    )

    if (!response.ok) {
      throw new Error('Failed to check tag name uniqueness')
    }

    const data = await response.json() as StrapiResponse<Tag>
    return (data.data || []).length === 0
  } catch (error) {
    console.error('Error checking tag name uniqueness:', error)
    return false
  }
}
