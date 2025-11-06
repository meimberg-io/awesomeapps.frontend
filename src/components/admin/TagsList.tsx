'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Locale } from '@/types/locale'
import { Tag } from '@/types/tag'
import { getTagsList, deleteTag } from '@/lib/api/admin-tags-api'
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
import { Plus, Edit, Trash2, X, Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { renderIcon } from '@/components/util/renderIcon'
import Link from 'next/link'

interface TagsListProps {
  locale: Locale
  jwt: string
}

export function TagsList({ locale, jwt }: TagsListProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [tags, setTags] = useState<Tag[]>([])
  const [filteredTags, setFilteredTags] = useState<Tag[]>([])
  const [search, setSearch] = useState('')
  const [excludedFilter, setExcludedFilter] = useState<'all' | 'excluded' | 'not-excluded'>('all')
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    tag: Tag | null
  }>({ open: false, tag: null })
  const [deleting, setDeleting] = useState(false)

  const fetchTags = async () => {
    setLoading(true)
    try {
      const fetchedTags = await getTagsList(jwt)
      setTags(fetchedTags)
    } catch (error) {
      console.error('Error fetching tags:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch tags',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    let filtered = [...tags]

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(tag =>
        tag.name.toLowerCase().includes(searchLower) ||
        tag.description?.toLowerCase().includes(searchLower)
      )
    }

    // Filter by excluded status
    if (excludedFilter === 'excluded') {
      filtered = filtered.filter(tag => tag.excluded === true)
    } else if (excludedFilter === 'not-excluded') {
      filtered = filtered.filter(tag => tag.excluded !== true)
    }

    // Sort by name
    filtered.sort((a, b) => a.name.localeCompare(b.name))

    setFilteredTags(filtered)
  }, [tags, search, excludedFilter])

  const handleDelete = async () => {
    if (!deleteDialog.tag) return

    setDeleting(true)
    try {
      await deleteTag(jwt, deleteDialog.tag.documentId)
      toast({
        title: 'Success',
        description: 'Tag deleted successfully',
      })
      setDeleteDialog({ open: false, tag: null })
      fetchTags()
    } catch (error: any) {
      console.error('Error deleting tag:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete tag',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tags</h1>
          <p className="text-muted-foreground mt-1">Manage tags for apps</p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/admin/tags/new`}>
            <Plus className="h-4 w-4 mr-2" />
            New Tag
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>List of all tags</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={excludedFilter}
              onValueChange={(value: string) => setExcludedFilter(value as 'all' | 'excluded' | 'not-excluded')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                <SelectItem value="excluded">Excluded Only</SelectItem>
                <SelectItem value="not-excluded">Not Excluded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 w-full animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : filteredTags.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {tags.length === 0 ? 'No tags found' : 'No tags match your filters'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Excluded</TableHead>
                    <TableHead>Connected Apps</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTags.map((tag) => (
                    <TableRow 
                      key={tag.documentId}
                      className="cursor-pointer hover:bg-accent/5"
                      onClick={() => router.push(`/${locale}/admin/tags/${tag.documentId}`)}
                    >
                      <TableCell className="font-medium">{tag.name}</TableCell>
                      <TableCell>
                        {tag.icon ? (
                          <div className="flex items-center">
                            {renderIcon(tag.icon, 'h-5 w-5', 20)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {tag.description ? (
                          <span className="line-clamp-2">{tag.description}</span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {tag.excluded ? (
                          <Badge variant="destructive">Excluded</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{tag.count || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                          >
                            <Link href={`/${locale}/admin/tags/${tag.documentId}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteDialog({ open: true, tag })}
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
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open: boolean) => setDeleteDialog({ open, tag: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteDialog.tag?.name}&quot;? This action
              cannot be undone and will remove the tag from all associated apps.
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

