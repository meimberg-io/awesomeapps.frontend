import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Locale } from '@/types/locale'
import { TagsList } from '@/components/admin/TagsList'

interface AdminTagsPageProps {
  params: Promise<{ locale: Locale }>
}

export default async function AdminTagsPage({ params }: AdminTagsPageProps) {
  const { locale } = await params
  const session = await auth()

  if (!session?.strapiJwt) {
    redirect(`/${locale}/auth/signin`)
  }

  return (
    <TagsList
      locale={locale}
      jwt={session.strapiJwt}
    />
  )
}
