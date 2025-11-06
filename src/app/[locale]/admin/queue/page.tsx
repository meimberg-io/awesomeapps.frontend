import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Locale } from '@/types/locale'
import { QueueList } from '@/components/admin/QueueList'

interface AdminQueuePageProps {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{
    page?: string
    pageSize?: string
    status?: string
  }>
}

export default async function AdminQueuePage({ params, searchParams }: AdminQueuePageProps) {
  const { locale } = await params
  const session = await auth()

  if (!session?.strapiJwt) {
    redirect(`/${locale}/auth/signin`)
  }

  const {
    page = '1',
    pageSize = '25',
    status,
  } = await searchParams

  return (
    <QueueList
      locale={locale}
      jwt={session.strapiJwt}
      initialPage={parseInt(page)}
      initialPageSize={parseInt(pageSize)}
      initialStatus={status as 'new' | 'pending' | 'finished' | 'error' | undefined}
    />
  )
}
