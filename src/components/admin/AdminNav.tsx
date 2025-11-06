'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, List, Tag, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Locale } from '@/types/locale'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { createQueueItem } from '@/lib/api/admin-queue-api'

interface AdminNavProps {
  locale: Locale
  jwt: string
}

export function AdminNav({ locale, jwt }: AdminNavProps) {
  const pathname = usePathname()
  const { toast } = useToast()
  const [newServiceName, setNewServiceName] = useState('')
  const [addingNew, setAddingNew] = useState(false)
  
  const toSlug = (name: string) =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  
  const handleQueueNewService = async () => {
    const name = newServiceName.trim()
    if (!name || !jwt) return
    setAddingNew(true)
    try {
      const slug = toSlug(name)
      await createQueueItem(jwt, {
        slug,
        field: '',
        n8nstatus: 'new',
      })
      toast({
        title: 'Queued',
        description: `Queued "${name}" (${slug})`,
      })
      setNewServiceName('')
    } catch (error) {
      console.error('Error queuing new service from nav:', error)
      toast({
        title: 'Error',
        description: 'Failed to queue new service',
        variant: 'destructive',
      })
    } finally {
      setAddingNew(false)
    }
  }
  
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
        <div className="flex items-center justify-between gap-3 py-2">
          <div className="flex items-center gap-1 overflow-x-auto">
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
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleQueueNewService()
            }}
            className="flex items-center gap-2"
          >
            <Input
              placeholder="New App..."
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              className="w-[220px]"
            />
            <Button
              type="submit"
              size="sm"
              disabled={addingNew || newServiceName.trim() === '' || !jwt}
            >
              {addingNew ? 'Queuing...' : 'Queue'}
            </Button>
          </form>
        </div>
      </div>
    </nav>
  )
}

