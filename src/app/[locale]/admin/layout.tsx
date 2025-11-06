import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { isAdminEmail } from '@/lib/config/admin'
import { AdminNav } from '@/components/admin/AdminNav'
import Header from '@/components/Header'
import { Locale } from '@/types/locale'

interface AdminLayoutProps {
  children: ReactNode
  params: Promise<{ locale: Locale }>
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = await params
  const session = await auth()
  
  // Check if user is authenticated
  if (!session?.user) {
    redirect(`/${locale}/auth/signin`)
  }
  
  // Check if user is admin
  if (!session.user.email || !isAdminEmail(session.user.email)) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">403 - Forbidden</h1>
          <p className="text-muted-foreground">You do not have permission to access this section.</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-primary" />
      <AdminNav locale={locale} jwt={session.strapiJwt as string} />
      <main>{children}</main>
    </div>
  )
}

