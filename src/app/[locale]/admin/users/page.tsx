import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Locale } from '@/types/locale'
import { UsersList } from '@/components/admin/UsersList'

interface AdminUsersPageProps {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{
    page?: string
    pageSize?: string
    sort?: string
    search?: string
    provider?: string
    isActive?: string
  }>
}

export default async function AdminUsersPage({ params, searchParams }: AdminUsersPageProps) {
  const { locale } = await params
  const session = await auth()

  if (!session?.strapiJwt) {
    redirect(`/${locale}/auth/signin`)
  }

  const {
    page = '1',
    pageSize = '25',
    sort = 'createdAt:desc',
    search = '',
    provider,
    isActive,
  } = await searchParams

  return (
    <UsersList
      locale={locale}
      jwt={session.strapiJwt}
      initialPage={parseInt(page)}
      initialPageSize={parseInt(pageSize)}
      initialSort={sort}
      initialSearch={search}
      initialProvider={provider}
      initialIsActive={isActive === 'true' ? true : isActive === 'false' ? false : undefined}
    />
  )
}
