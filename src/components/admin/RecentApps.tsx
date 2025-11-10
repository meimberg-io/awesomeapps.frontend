'use client'

import Link from 'next/link'
import { Locale } from '@/types/locale'
import { App } from '@/types/app'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RegenerateMenu } from '@/components/RegenerateMenu'
import { STRAPI_BASEURL } from '@/lib/constants'
import { getBrandfetchLogoUrl } from '@/lib/utils'

interface RecentAppsProps {
  apps: App[]
  locale: Locale
  isLoading?: boolean
}

export function RecentApps({ apps, locale, isLoading = false }: RecentAppsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Apps</CardTitle>
          <CardDescription>Recently created or updated apps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (apps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Apps</CardTitle>
          <CardDescription>Recently created or updated apps</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No apps found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Apps</CardTitle>
        <CardDescription>Recently created or updated apps</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.map((app) => (
              <TableRow key={app.documentId}>
                <TableCell>
                  <div className="w-8 h-8 flex-shrink-0 border border-gray-200 dark:border-gray-700 rounded bg-background">
                    <img
                      src={app.logo?.url ? `${STRAPI_BASEURL}${app.logo.url}` : getBrandfetchLogoUrl(app.url)}
                      alt={`${app.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <Link
                    href={`/${locale}/admin/apps/${app.documentId}`}
                    className="hover:underline"
                  >
                    {app.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{app.slug}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(app.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(app.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <RegenerateMenu serviceName={app.name} align="end" size="sm" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

