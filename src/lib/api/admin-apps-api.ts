import { STRAPI_BASEURL } from '@/lib/constants'
import { Service } from '@/types/service'
import { Tag } from '@/types/tag'

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

interface AppsListParams {
  page?: number
  pageSize?: number
  sort?: string
  filters?: {
    search?: string
    tags?: string[]
    top?: boolean
  }
  locale?: string
}

export interface AppsListResponse {
  data: Service[]
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

export async function getAppsList(
  jwt: string,
  params: AppsListParams = {}
): Promise<AppsListResponse> {
  const {
    page = 1,
    pageSize = 25,
    sort = 'name:asc',
    filters = {},
    locale,
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
      'populate': '*',
    })

    if (locale) {
      queryParams.append('locale', locale)
    }

    // Add filters
    if (filters.search) {
      queryParams.append('filters[$or][0][name][$containsi]', filters.search)
      queryParams.append('filters[$or][1][slug][$containsi]', filters.search)
      queryParams.append('filters[$or][2][url][$containsi]', filters.search)
    }

    if (filters.top !== undefined) {
      queryParams.append('filters[top][$eq]', filters.top.toString())
    }

    if (filters.tags && filters.tags.length > 0) {
      filters.tags.forEach((tagId, index) => {
        queryParams.append(`filters[tags][documentId][$in][${index}]`, tagId)
      })
    }

    const response = await fetch(
      `${STRAPI_BASEURL}/api/services?${queryParams.toString()}`,
      { headers }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch apps')
    }

    const data = await response.json() as StrapiResponse<Service>

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
    console.error('Error fetching apps list:', error)
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

export async function getApp(
  jwt: string,
  id: string,
  locale?: string
): Promise<Service | null> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const queryParams = new URLSearchParams({
      'populate': '*',
    })

    if (locale) {
      queryParams.append('locale', locale)
    }

    const response = await fetch(
      `${STRAPI_BASEURL}/api/services/${id}?${queryParams.toString()}`,
      { headers }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch app')
    }

    const data = await response.json() as { data: Service }
    return data.data || null
  } catch (error) {
    console.error('Error fetching app:', error)
    return null
  }
}

export interface AppWithLocalizations {
  en: Service | null
  de: Service | null
}

export async function getAppWithLocalizations(
  jwt: string,
  id: string
): Promise<AppWithLocalizations> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const queryParams = new URLSearchParams({
      'populate': '*',
    })

    // Fetch both locales in parallel
    const [enResponse, deResponse] = await Promise.all([
      fetch(
        `${STRAPI_BASEURL}/api/services/${id}?${queryParams.toString()}&locale=en`,
        { headers }
      ),
      fetch(
        `${STRAPI_BASEURL}/api/services/${id}?${queryParams.toString()}&locale=de`,
        { headers }
      ),
    ])

    const enData = enResponse.ok ? ((await enResponse.json()) as { data: Service }).data : null
    const deData = deResponse.ok ? ((await deResponse.json()) as { data: Service }).data : null

    return {
      en: enData || null,
      de: deData || null,
    }
  } catch (error) {
    console.error('Error fetching app with localizations:', error)
    return {
      en: null,
      de: null,
    }
  }
}

export async function createApp(
  jwt: string,
  appData: Partial<Service>,
  locale?: string
): Promise<Service | null> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const queryParams = new URLSearchParams()
    if (locale) {
      queryParams.append('locale', locale)
    }

    const response = await fetch(
      `${STRAPI_BASEURL}/api/services${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: appData }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to create app')
    }

    const data = await response.json() as { data: Service }
    return data.data || null
  } catch (error) {
    console.error('Error creating app:', error)
    throw error
  }
}

export async function createAppWithLocalizations(
  jwt: string,
  enData: Partial<Service>,
  deData: Partial<Service>
): Promise<{ en: Service | null; de: Service | null }> {
  try {
    // Create English version first (default locale)
    const enApp = await createApp(jwt, enData, 'en')
    
    if (!enApp) {
      throw new Error('Failed to create English version')
    }

    // Create German localization
    let deApp: Service | null = null
    try {
      // Use the documentId from the English version to create the German localization
      const deDataWithLocalization = {
        ...deData,
        localizations: [enApp.documentId], // Link to English version
      }
      
      deApp = await createApp(jwt, deDataWithLocalization, 'de')
    } catch (error) {
      console.error('Error creating German localization:', error)
      // Continue even if German version fails
    }

    return {
      en: enApp,
      de: deApp,
    }
  } catch (error) {
    console.error('Error creating app with localizations:', error)
    throw error
  }
}

export async function updateApp(
  jwt: string,
  id: string,
  appData: Partial<Service>,
  locale?: string
): Promise<Service | null> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const queryParams = new URLSearchParams()
    if (locale) {
      queryParams.append('locale', locale)
    }

    const response = await fetch(
      `${STRAPI_BASEURL}/api/services/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({ data: appData }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to update app')
    }

    const data = await response.json() as { data: Service }
    return data.data || null
  } catch (error) {
    console.error('Error updating app:', error)
    throw error
  }
}

export async function updateAppWithLocalizations(
  jwt: string,
  documentId: string,
  enData: Partial<Service>,
  deData: Partial<Service>
): Promise<{ en: Service | null; de: Service | null }> {
  try {
    // First, get both versions to find their IDs
    const localizations = await getAppWithLocalizations(jwt, documentId)
    
    // Update English version
    let enApp: Service | null = null
    if (localizations.en) {
      enApp = await updateApp(jwt, localizations.en.documentId, enData, 'en')
    } else {
      // Create English version if it doesn't exist
      enApp = await createApp(jwt, enData, 'en')
    }

    // Update or create German localization
    let deApp: Service | null = null
    if (localizations.de) {
      // Update existing German version
      deApp = await updateApp(jwt, localizations.de.documentId, deData, 'de')
    } else if (enApp) {
      // Create German localization if it doesn't exist
      try {
        const deDataWithLocalization = {
          ...deData,
          localizations: [enApp.documentId],
        }
        deApp = await createApp(jwt, deDataWithLocalization, 'de')
      } catch (error) {
        console.error('Error creating German localization:', error)
      }
    }

    return {
      en: enApp,
      de: deApp,
    }
  } catch (error) {
    console.error('Error updating app with localizations:', error)
    throw error
  }
}

export async function deleteApp(
  jwt: string,
  id: string
): Promise<boolean> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const response = await fetch(
      `${STRAPI_BASEURL}/api/services/${id}`,
      {
        method: 'DELETE',
        headers,
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete app')
    }

    return true
  } catch (error) {
    console.error('Error deleting app:', error)
    throw error
  }
}

export async function checkUniqueness(
  jwt: string,
  field: 'name' | 'slug' | 'url',
  value: string,
  excludeId?: string
): Promise<boolean> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const queryParams = new URLSearchParams({
      [`filters[${field}][$eq]`]: value,
    })

    if (excludeId) {
      queryParams.append('filters[id][$ne]', excludeId)
    }

    const response = await fetch(
      `${STRAPI_BASEURL}/api/services?${queryParams.toString()}`,
      { headers }
    )

    if (!response.ok) {
      return false
    }

    const data = await response.json() as StrapiResponse<Service>
    return (data.data?.length || 0) === 0
  } catch (error) {
    console.error('Error checking uniqueness:', error)
    return false
  }
}

export async function getTags(jwt: string): Promise<Tag[]> {
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
      const errorText = await response.text()
      console.error('Failed to fetch tags:', response.status, errorText)
      throw new Error('Failed to fetch tags')
    }

    const responseData = await response.json()
    
    // Handle both array and StrapiResponse format
    if (Array.isArray(responseData)) {
      return responseData
    } else if (responseData.data && Array.isArray(responseData.data)) {
      return responseData.data
    } else {
      console.error('Unexpected response format:', responseData)
      return []
    }
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

