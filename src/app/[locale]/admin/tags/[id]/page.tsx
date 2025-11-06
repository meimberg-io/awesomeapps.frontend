import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Locale } from '@/types/locale'
import { getTag } from '@/lib/api/admin-tags-api'
import { TagEditForm } from '@/components/admin/TagEditForm'

interface AdminTagEditPageProps {
  params: Promise<{ locale: Locale; id: string }>
}

export default async function AdminTagEditPage({ params }: AdminTagEditPageProps) {
  const { locale, id } = await params
  const session = await auth()

  if (!session?.strapiJwt) {
    redirect(`/${locale}/auth/signin`)
  }

  const tag = await getTag(session.strapiJwt, id)

  if (!tag) {
    notFound()
  }

  return (
    <TagEditForm
      locale={locale}
      jwt={session.strapiJwt}
      tag={tag}
    />
  )
}

