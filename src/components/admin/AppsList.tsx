'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Locale } from '@/types/locale'
import { Service } from '@/types/service'
import { getAppsList, deleteApp, type AppsListResponse } from '@/lib/api/admin-apps-api'
import { createQueueItem } from '@/lib/api/admin-queue-api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Edit, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

interface AppsListProps {
  locale: Locale
  jwt: string
  initialPage: number
  initialPageSize: number
  initialSort: string
  initialSearch: string
  initialTop?: boolean
}

export function AppsList({
  locale,
  jwt,
  initialPage,
  initialPageSize,
  initialSort,
  initialSearch,
  initialTop,
}: AppsListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AppsListResponse | null>(null)
  const [search, setSearch] = useState(initialSearch)
  const [sort, setSort] = useState(initialSort)
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [topFilter, setTopFilter] = useState<boolean | undefined>(initialTop)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    app: Service | null
  }>({ open: false, app: null })
  const [deleting, setDeleting] = useState(false)
  const [syncStatuses, setSyncStatuses] = useState<Record<string, 'idle' | 'loading'>>({})

  const handleRegenerate = async (app: Service, field: string) => {
    const statusKey = app.documentId
    setSyncStatuses({ ...syncStatuses, [statusKey]: 'loading' })
    
    try {
      // Create queue item in Strapi
      // If "all" is selected, don't put anything in the field
      await createQueueItem(jwt, {
        slug: app.name,
        field: field === 'all' ? '' : field,
        n8nstatus: 'new',
      })
      
      toast({
        title: 'Success',
        description: `Service regeneration requested${field !== 'all' ? ` (Field: ${field})` : ''}. Added to queue.`,
      })
      setTimeout(() => router.refresh(), 1000)
    } catch (error) {
      console.error('Error regenerating service:', error)
      toast({
        title: 'Error',
        description: 'Failed to request service regeneration',
        variant: 'destructive',
      })
    } finally {
      setSyncStatuses({ ...syncStatuses, [statusKey]: 'idle' })
    }
  }

  const fetchApps = async () => {
    setLoading(true)
    try {
      const result = await getAppsList(jwt, {
        page,
        pageSize,
        sort,
        filters: {
          search: search || undefined,
          top: topFilter,
        },
        locale,
      })
      setData(result)
    } catch (error) {
      console.error('Error fetching apps:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch apps',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApps()
  }, [page, pageSize, sort, search, topFilter])

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
    updateURL({ search: value, page: '1' })
  }

  const handleSort = (newSort: string) => {
    setSort(newSort)
    setPage(1)
    updateURL({ sort: newSort, page: '1' })
  }

  const handlePageSize = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
    updateURL({ pageSize: newPageSize.toString(), page: '1' })
  }

  const handleTopFilter = (value: boolean | undefined) => {
    setTopFilter(value)
    setPage(1)
    updateURL({ top: value === undefined ? undefined : value.toString(), page: '1' })
  }

  const updateURL = (params: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        newParams.delete(key)
      } else {
        newParams.set(key, value)
      }
    })
    router.push(`/${locale}/admin/apps?${newParams.toString()}`)
  }

  const handleDelete = async () => {
    if (!deleteDialog.app) return

    setDeleting(true)
    try {
      await deleteApp(jwt, deleteDialog.app.documentId)
      toast({
        title: 'Success',
        description: 'App deleted successfully',
      })
      setDeleteDialog({ open: false, app: null })
      fetchApps()
    } catch (error) {
      console.error('Error deleting app:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete app',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
    }
  }

  const getSortIcon = (field: string) => {
    const [currentField, currentOrder] = sort.split(':')
    if (currentField === field) {
      return currentOrder === 'asc' ? '↑' : '↓'
    }
    return <ArrowUpDown className="h-4 w-4 inline" />
  }

  const handleSortClick = (field: string) => {
    const [currentField, currentOrder] = sort.split(':')
    if (currentField === field) {
      handleSort(`${field}:${currentOrder === 'asc' ? 'desc' : 'asc'}`)
    } else {
      handleSort(`${field}:asc`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Apps</h1>
          <p className="text-muted-foreground mt-1">Manage all apps</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href={`/${locale}/admin/apps/new`}>
              <Plus className="h-4 w-4 mr-2" />
              New App
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search apps..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={topFilter === undefined ? 'all' : topFilter ? 'true' : 'false'}
              onValueChange={(value: string) =>
                handleTopFilter(value === 'all' ? undefined : value === 'true')
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Top" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Apps</SelectItem>
                <SelectItem value="true">Top Apps</SelectItem>
                <SelectItem value="false">Not Top Apps</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={pageSize.toString()}
              onValueChange={(value: string) => handlePageSize(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
                <SelectItem value="500">500 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 w-full animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : !data || data.data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No apps found
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead className="w-[200px]">
                        <button
                          onClick={() => handleSortClick('name')}
                          className="flex items-center gap-2 hover:text-foreground"
                        >
                          Name {getSortIcon('name')}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSortClick('slug')}
                          className="flex items-center gap-2 hover:text-foreground"
                        >
                          Slug {getSortIcon('slug')}
                        </button>
                      </TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSortClick('createdAt')}
                          className="flex items-center gap-2 hover:text-foreground"
                        >
                          Created {getSortIcon('createdAt')}
                        </button>
                      </TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Top</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((app, index) => (
                      <TableRow 
                        key={app.documentId}
                        className="cursor-pointer hover:bg-accent/5"
                        onClick={() => router.push(`/${locale}/admin/apps/${app.documentId}`)}
                      >
                        <TableCell className="text-muted-foreground text-sm">
                          {((page - 1) * pageSize) + index + 1}
                        </TableCell>
                        <TableCell className="font-medium">{app.name}</TableCell>
                        <TableCell className="text-muted-foreground">{app.slug}</TableCell>
                        <TableCell>
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {app.url}
                          </a>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {app.tags?.map((tag) => (
                              <Badge key={tag.documentId} variant="outline" className="font-normal">
                                {tag.name}
                              </Badge>
                            ))}
                            {(!app.tags || app.tags.length === 0) && (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {app.top ? (
                            <Badge variant="default">Top</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                            >
                              <Link href={`/${locale}/admin/apps/${app.documentId}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteDialog({ open: true, app })}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={syncStatuses[app.documentId] === 'loading'}
                                  title="Sync/Regenerate"
                                >
                                  <RefreshCw 
                                    className={`h-4 w-4 ${syncStatuses[app.documentId] === 'loading' ? 'animate-spin' : ''}`} 
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleRegenerate(app, 'all')}>
                                  All
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleRegenerate(app, 'url')}>
                                  URL
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRegenerate(app, 'description')}>
                                  Description
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRegenerate(app, 'functionality')}>
                                  Functionality
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRegenerate(app, 'abstract')}>
                                  Abstract
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRegenerate(app, 'pricing')}>
                                  Pricing
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRegenerate(app, 'tags')}>
                                  Tags
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRegenerate(app, 'video')}>
                                  Video
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRegenerate(app, 'shortfacts')}>
                                  Shortfacts
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {data.pagination.pageCount > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {((page - 1) * pageSize) + 1} to{' '}
                    {Math.min(page * pageSize, data.pagination.total)} of{' '}
                    {data.pagination.total} apps
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPage(page - 1)
                        updateURL({ page: (page - 1).toString() })
                      }}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="text-sm">
                      Page {page} of {data.pagination.pageCount}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPage(page + 1)
                        updateURL({ page: (page + 1).toString() })
                      }}
                      disabled={page >= data.pagination.pageCount}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open: boolean) => setDeleteDialog({ open, app: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete App</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteDialog.app?.name}&quot;? This action
              cannot be undone and will permanently delete the app.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

