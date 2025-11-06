import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Locale } from '@/types/locale'
import { AppEditForm } from '@/components/admin/AppEditForm'

interface AdminAppNewPageProps {
  params: Promise<{ locale: Locale }>
}

export default async function AdminAppNewPage({ params }: AdminAppNewPageProps) {
  const { locale } = await params
  const session = await auth()

  if (!session?.strapiJwt) {
    redirect(`/${locale}/auth/signin`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AppEditForm
        locale={locale}
        jwt={session.strapiJwt}
      />
    </div>
  )
}

