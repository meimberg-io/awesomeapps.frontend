import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Locale } from '@/types/locale'
import { AppsList } from '@/components/admin/AppsList'

interface AdminAppsPageProps {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{
    page?: string
    pageSize?: string
    sort?: string
    search?: string
    top?: string
  }>
}

export default async function AdminAppsPage({ params, searchParams }: AdminAppsPageProps) {
  const { locale } = await params
  const session = await auth()

  if (!session?.strapiJwt) {
    redirect(`/${locale}/auth/signin`)
  }

  const {
    page = '1',
    pageSize = '500',
    sort = 'name:asc',
    search = '',
    top,
  } = await searchParams

  return (
    <AppsList
      locale={locale}
      jwt={session.strapiJwt}
      initialPage={parseInt(page)}
      initialPageSize={parseInt(pageSize)}
      initialSort={sort}
      initialSearch={search}
      initialTop={top === 'true' ? true : top === 'false' ? false : undefined}
    />
  )
}
