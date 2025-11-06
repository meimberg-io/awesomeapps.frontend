import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Locale } from '@/types/locale'
import { TagEditForm } from '@/components/admin/TagEditForm'

interface AdminTagNewPageProps {
  params: Promise<{ locale: Locale }>
}

export default async function AdminTagNewPage({ params }: AdminTagNewPageProps) {
  const { locale } = await params
  const session = await auth()

  if (!session?.strapiJwt) {
    redirect(`/${locale}/auth/signin`)
  }

  return (
    <TagEditForm
      locale={locale}
      jwt={session.strapiJwt}
    />
  )
}

