import { STRAPI_BASEURL } from '@/lib/constants'
import { App } from '@/types/app'
import { NewService } from '@/types/newService'

interface AdminStats {
  totalApps: number
  totalUsers: number
  queuePending: number
  queueErrors: number
}

interface StrapiResponse<T> {
  data: T[]
  meta?: {
    pagination?: {
      total: number
    }
  }
}

export async function getAdminStats(jwt: string): Promise<AdminStats> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const [appsRes, membersRes, queueRes] = await Promise.all([
      fetch(`${STRAPI_BASEURL}/api/services?pagination[pageSize]=1`, { headers }),
      fetch(`${STRAPI_BASEURL}/api/members?pagination[pageSize]=1`, { headers }),
      fetch(`${STRAPI_BASEURL}/api/new-services?pagination[pageSize]=100`, { headers }),
    ])

    if (!appsRes.ok || !membersRes.ok || !queueRes.ok) {
      throw new Error('Failed to fetch statistics')
    }

    const [appsData, membersData, queueData] = await Promise.all([
      appsRes.json() as Promise<StrapiResponse<App>>,
      membersRes.json() as Promise<StrapiResponse<unknown>>,
      queueRes.json() as Promise<StrapiResponse<NewService>>,
    ])

    const queuePending = queueData.data.filter(item => item.n8nstatus === 'pending').length
    const queueErrors = queueData.data.filter(item => item.n8nstatus === 'error').length

    return {
      totalApps: appsData.meta?.pagination?.total || 0,
      totalUsers: membersData.meta?.pagination?.total || 0,
      queuePending,
      queueErrors,
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return {
      totalApps: 0,
      totalUsers: 0,
      queuePending: 0,
      queueErrors: 0,
    }
  }
}

export async function getRecentApps(jwt: string, limit: number = 10): Promise<App[]> {
  const headers = {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }

  try {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    const url =
      `${STRAPI_BASEURL}/api/services` +
      `?filters[createdAt][$gte]=${encodeURIComponent(twoWeeksAgo)}` +
      `&sort=createdAt:desc` +
      `&pagination[pageSize]=${limit}` +
      `&populate=*`
    const response = await fetch(url, { headers })

    if (!response.ok) {
      throw new Error('Failed to fetch recent apps')
    }

    const data = await response.json() as StrapiResponse<App>
    return data.data || []
  } catch (error) {
    console.error('Error fetching recent apps:', error)
    return []
  }
}

