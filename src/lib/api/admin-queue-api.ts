import { STRAPI_BASEURL } from '@/lib/constants'
import { NewService } from '@/types/newService'

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

export interface QueueListResponse {
  data: NewService[]
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

export async function getQueueList(
  jwt: string,
  params: {
    page?: number
    pageSize?: number
    status?: 'new' | 'pending' | 'finished' | 'error'
  } = {}
): Promise<QueueListResponse> {
  const { page = 1, pageSize = 25, status } = params

  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const queryParams = new URLSearchParams({
      'pagination[page]': page.toString(),
      'pagination[pageSize]': pageSize.toString(),
      'sort': 'createdAt:desc',
    })

    if (status) {
      queryParams.append('filters[n8nstatus][$eq]', status)
    }

    const response = await fetch(
      `${STRAPI_BASEURL}/api/new-services?${queryParams.toString()}`,
      { headers }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch queue items')
    }

    const data = await response.json() as StrapiResponse<NewService>

    return {
      data: data.data || [],
      pagination: data.meta?.pagination || {
        page: 1,
        pageSize: 25,
        pageCount: 1,
        total: 0,
      },
    }
  } catch (error) {
    console.error('Error fetching queue list:', error)
    return {
      data: [],
      pagination: {
        page: 1,
        pageSize: 25,
        pageCount: 1,
        total: 0,
      },
    }
  }
}

export async function getQueueItem(
  jwt: string,
  id: string
): Promise<NewService | null> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const response = await fetch(
      `${STRAPI_BASEURL}/api/new-services/${id}`,
      { headers }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch queue item')
    }

    const data = await response.json() as { data: NewService }
    return data.data || null
  } catch (error) {
    console.error('Error fetching queue item:', error)
    return null
  }
}

export async function updateQueueItem(
  jwt: string,
  id: string,
  data: Partial<NewService>
): Promise<NewService | null> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const response = await fetch(
      `${STRAPI_BASEURL}/api/new-services/${id}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({ data }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to update queue item')
    }

    const result = await response.json() as { data: NewService }
    return result.data || null
  } catch (error) {
    console.error('Error updating queue item:', error)
    throw error
  }
}

export async function deleteQueueItem(
  jwt: string,
  id: string
): Promise<boolean> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const response = await fetch(
      `${STRAPI_BASEURL}/api/new-services/${id}`,
      {
        method: 'DELETE',
        headers,
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete queue item')
    }

    return true
  } catch (error) {
    console.error('Error deleting queue item:', error)
    throw error
  }
}

export async function createQueueItem(
  jwt: string,
  data: {
    slug: string
    field: string
    n8nstatus?: 'new' | 'pending' | 'finished' | 'error'
  }
): Promise<NewService | null> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const response = await fetch(
      `${STRAPI_BASEURL}/api/new-services`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          data: {
            slug: data.slug,
            field: data.field,
            n8nstatus: data.n8nstatus || 'new',
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to create queue item')
    }

    const result = await response.json() as { data: NewService }
    return result.data || null
  } catch (error) {
    console.error('Error creating queue item:', error)
    throw error
  }
}

