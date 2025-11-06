import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Locale } from '@/types/locale'
import { getQueueItem } from '@/lib/api/admin-queue-api'
import { QueueEditForm } from '@/components/admin/QueueEditForm'

interface AdminQueueEditPageProps {
  params: Promise<{ locale: Locale; id: string }>
}

export default async function AdminQueueEditPage({ params }: AdminQueueEditPageProps) {
  const { locale, id } = await params
  const session = await auth()

  if (!session?.strapiJwt) {
    redirect(`/${locale}/auth/signin`)
  }

  const queueItem = await getQueueItem(session.strapiJwt, id)

  if (!queueItem) {
    notFound()
  }

  return (
    <QueueEditForm
      locale={locale}
      jwt={session.strapiJwt}
      queueItem={queueItem}
    />
  )
}

