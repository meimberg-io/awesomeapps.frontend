'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Locale } from '@/types/locale'
import { NewService } from '@/types/newService'
import { getQueueList, updateQueueItem, deleteQueueItem, type QueueListResponse } from '@/lib/api/admin-queue-api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface QueueListProps {
  locale: Locale
  jwt: string
  initialPage: number
  initialPageSize: number
  initialStatus?: 'new' | 'pending' | 'finished' | 'error'
}

export function QueueList({
  locale,
  jwt,
  initialPage,
  initialPageSize,
  initialStatus,
}: QueueListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<QueueListResponse | null>(null)
  const [status, setStatus] = useState<'new' | 'pending' | 'finished' | 'error' | undefined>(initialStatus)
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    item: NewService | null
  }>({ open: false, item: null })
  const [deleting, setDeleting] = useState(false)

  const fetchQueue = async () => {
    setLoading(true)
    try {
      const result = await getQueueList(jwt, {
        page,
        pageSize,
        status,
      })
      setData(result)
    } catch (error) {
      console.error('Error fetching queue:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch queue items',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue()
  }, [page, pageSize, status])

  const handleStatusChange = (newStatus: string) => {
    const statusValue = newStatus === 'all' ? undefined : newStatus as 'new' | 'pending' | 'finished' | 'error'
    setStatus(statusValue)
    setPage(1)
    updateURL({ status: statusValue === undefined ? undefined : statusValue, page: '1' })
  }

  const handlePageSize = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
    updateURL({ pageSize: newPageSize.toString(), page: '1' })
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
    router.push(`/${locale}/admin/queue?${newParams.toString()}`)
  }

  const handleStatusUpdate = async (item: NewService, newStatus: 'new' | 'pending' | 'finished' | 'error') => {
    try {
      await updateQueueItem(jwt, item.documentId, { n8nstatus: newStatus })
      toast({
        title: 'Success',
        description: 'Status updated successfully',
      })
      fetchQueue()
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.item) return

    setDeleting(true)
    try {
      await deleteQueueItem(jwt, deleteDialog.item.documentId)
      toast({
        title: 'Success',
        description: 'Queue item deleted successfully',
      })
      setDeleteDialog({ open: false, item: null })
      fetchQueue()
    } catch (error) {
      console.error('Error deleting queue item:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete queue item',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'finished':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">App Queue</h1>
        <p className="text-muted-foreground mt-1">Manage apps pending import/update</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            <Select
              value={status === undefined ? 'all' : status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
                <SelectItem value="error">Error</SelectItem>
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
              No queue items found
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Slug</TableHead>
                      <TableHead>Field</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="w-[200px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((item) => (
                      <TableRow key={item.documentId}>
                        <TableCell className="font-medium">{item.slug}</TableCell>
                        <TableCell className="text-muted-foreground">{item.field}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(item.n8nstatus)} text-white`}
                            variant="secondary"
                          >
                            {item.n8nstatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={item.n8nstatus}
                              onValueChange={(value: string) => handleStatusUpdate(item, value as 'new' | 'pending' | 'finished' | 'error')}
                            >
                              <SelectTrigger className="w-[120px] h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="finished">Finished</SelectItem>
                                <SelectItem value="error">Error</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                            >
                              <Link href={`/${locale}/admin/queue/${item.documentId}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteDialog({ open: true, item })}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
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
                    {data.pagination.total} items
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

      <AlertDialog open={deleteDialog.open} onOpenChange={(open: boolean) => setDeleteDialog({ open, item: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Queue Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the queue item &quot;{deleteDialog.item?.slug}&quot;? This action
              cannot be undone.
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

