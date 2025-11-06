import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Locale } from '@/types/locale'
import { getAdminStats, getRecentApps } from '@/lib/api/admin-api'
import { DashboardStats } from '@/components/admin/DashboardStats'
import { RecentApps } from '@/components/admin/RecentApps'
import { Button } from '@/components/ui/button'
import { List, Tag } from 'lucide-react'
import Link from 'next/link'

interface AdminDashboardProps {
  params: Promise<{ locale: Locale }>
}

export default async function AdminDashboard({ params }: AdminDashboardProps) {
  const { locale } = await params
  const session = await auth()

  if (!session?.strapiJwt) {
    redirect(`/${locale}/auth/signin`)
  }

  const [stats, recentApps] = await Promise.all([
    getAdminStats(session.strapiJwt),
    getRecentApps(session.strapiJwt, 10),
  ])

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of key metrics and recent activity
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/${locale}/admin/queue`}>
              <List className="h-4 w-4 mr-2" />
              View Queue
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${locale}/admin/tags`}>
              <Tag className="h-4 w-4 mr-2" />
              Manage Tags
            </Link>
          </Button>
        </div>
      </div>

      <DashboardStats
        totalApps={stats.totalApps}
        totalUsers={stats.totalUsers}
        queuePending={stats.queuePending}
        queueErrors={stats.queueErrors}
      />

      <RecentApps apps={recentApps} locale={locale} />
    </div>
  )
}

