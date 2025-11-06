'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, List, Tag, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Locale } from '@/types/locale'

interface AdminNavProps {
  locale: Locale
}

export function AdminNav({ locale }: AdminNavProps) {
  const pathname = usePathname()
  
  const navItems = [
    {
      label: 'Dashboard',
      href: `/${locale}/admin`,
      icon: LayoutDashboard,
    },
    {
      label: 'Apps',
      href: `/${locale}/admin/apps`,
      icon: Package,
    },
    {
      label: 'App Queue',
      href: `/${locale}/admin/queue`,
      icon: List,
    },
    {
      label: 'Tags',
      href: `/${locale}/admin/tags`,
      icon: Tag,
    },
    {
      label: 'Users',
      href: `/${locale}/admin/users`,
      icon: Users,
    },
  ]
  
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
                           (item.href !== `/${locale}/admin` && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all rounded-md',
                  'relative',
                  isActive 
                    ? 'text-primary bg-accent/50' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                )}
              >
                <Icon className={cn(
                  'h-4 w-4 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )} />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

