import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Locale } from '@/types/locale'
import { getAppWithLocalizations } from '@/lib/api/admin-apps-api'
import { AppEditForm } from '@/components/admin/AppEditForm'

interface AdminAppEditPageProps {
  params: Promise<{ locale: Locale; id: string }>
}

export default async function AdminAppEditPage({ params }: AdminAppEditPageProps) {
  const { locale, id } = await params
  const session = await auth()

  if (!session?.strapiJwt) {
    redirect(`/${locale}/auth/signin`)
  }

  const localizations = await getAppWithLocalizations(session.strapiJwt, id)

  if (!localizations.en && !localizations.de) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AppEditForm
        locale={locale}
        jwt={session.strapiJwt}
        appEn={localizations.en}
        appDe={localizations.de}
      />
    </div>
  )
}

