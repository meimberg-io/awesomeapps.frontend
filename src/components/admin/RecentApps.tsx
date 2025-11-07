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
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.map((app) => (
              <TableRow key={app.documentId}>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

