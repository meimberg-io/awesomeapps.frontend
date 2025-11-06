import { STRAPI_BASEURL } from '@/lib/constants'
import { Member } from '@/types/member'

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

export interface UsersListResponse {
  data: Member[]
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

export async function getUsersList(
  jwt: string,
  params: {
    page?: number
    pageSize?: number
    sort?: string
    filters?: {
      search?: string
      provider?: string
      isActive?: boolean
    }
  } = {}
): Promise<UsersListResponse> {
  const {
    page = 1,
    pageSize = 25,
    sort = 'createdAt:desc',
    filters = {},
  } = params

  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const queryParams = new URLSearchParams({
      'pagination[page]': page.toString(),
      'pagination[pageSize]': pageSize.toString(),
      sort,
    })

    if (filters.search) {
      queryParams.append('filters[$or][0][email][$containsi]', filters.search)
      queryParams.append('filters[$or][1][username][$containsi]', filters.search)
      queryParams.append('filters[$or][2][displayName][$containsi]', filters.search)
    }

    if (filters.provider) {
      queryParams.append('filters[oauthProvider][$eq]', filters.provider)
    }

    if (filters.isActive !== undefined) {
      queryParams.append('filters[isActive][$eq]', filters.isActive.toString())
    }

    const response = await fetch(
      `${STRAPI_BASEURL}/api/members?${queryParams.toString()}`,
      { headers }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }

    const data = await response.json() as StrapiResponse<Member>

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
    console.error('Error fetching users:', error)
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

export async function getUser(
  jwt: string,
  id: string
): Promise<Member | null> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const response = await fetch(
      `${STRAPI_BASEURL}/api/members/${id}?populate=*`,
      { headers }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }

    const data = await response.json() as { data: Member }
    return data.data || null
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function updateUser(
  jwt: string,
  id: string,
  data: Partial<Member>
): Promise<Member | null> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const response = await fetch(
      `${STRAPI_BASEURL}/api/members/${id}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({ data }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to update user')
    }

    const result = await response.json() as { data: Member }
    return result.data || null
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

export async function deleteUser(
  jwt: string,
  id: string
): Promise<boolean> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const response = await fetch(
      `${STRAPI_BASEURL}/api/members/${id}`,
      {
        method: 'DELETE',
        headers,
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete user')
    }

    return true
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}
