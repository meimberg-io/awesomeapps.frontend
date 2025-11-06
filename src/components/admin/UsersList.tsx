'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Locale } from '@/types/locale'
import { Member } from '@/types/member'
import { getUsersList, type UsersListResponse } from '@/lib/api/admin-users-api'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface UsersListProps {
  locale: Locale
  jwt: string
  initialPage: number
  initialPageSize: number
  initialSort: string
  initialSearch: string
  initialProvider?: string
  initialIsActive?: boolean
}

export function UsersList({
  locale,
  jwt,
  initialPage,
  initialPageSize,
  initialSort,
  initialSearch,
  initialProvider,
  initialIsActive,
}: UsersListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<UsersListResponse | null>(null)
  const [search, setSearch] = useState(initialSearch)
  const [sort, setSort] = useState(initialSort)
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [providerFilter, setProviderFilter] = useState<string | undefined>(initialProvider)
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(initialIsActive)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const result = await getUsersList(jwt, {
        page,
        pageSize,
        sort,
        filters: {
          search: search || undefined,
          provider: providerFilter,
          isActive: activeFilter,
        },
      })
      setData(result)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, pageSize, sort, search, providerFilter, activeFilter])

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

  const handleProviderFilter = (value: string) => {
    const providerValue = value === 'all' ? undefined : value
    setProviderFilter(providerValue)
    setPage(1)
    updateURL({ provider: providerValue, page: '1' })
  }

  const handleActiveFilter = (value: string) => {
    const activeValue = value === 'all' ? undefined : value === 'true'
    setActiveFilter(activeValue)
    setPage(1)
    updateURL({ isActive: activeValue === undefined ? undefined : activeValue.toString(), page: '1' })
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
    router.push(`/${locale}/admin/users?${newParams.toString()}`)
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
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1">View and manage users/members</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={providerFilter || 'all'}
              onValueChange={handleProviderFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="github">GitHub</SelectItem>
                <SelectItem value="azure-ad">Azure AD</SelectItem>
                <SelectItem value="local">Local</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={activeFilter === undefined ? 'all' : activeFilter ? 'true' : 'false'}
              onValueChange={handleActiveFilter}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
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
              No users found
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <button
                          onClick={() => handleSortClick('username')}
                          className="flex items-center gap-2 hover:text-foreground"
                        >
                          Name {getSortIcon('username')}
                        </button>
                      </TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Display Name</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSortClick('lastlogin')}
                          className="flex items-center gap-2 hover:text-foreground"
                        >
                          Last Login {getSortIcon('lastlogin')}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSortClick('createdAt')}
                          className="flex items-center gap-2 hover:text-foreground"
                        >
                          Created {getSortIcon('createdAt')}
                        </button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((user) => (
                      <TableRow key={user.documentId}>
                        <TableCell className="font-medium">
                          {user.username || user.displayName || '-'}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.displayName || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user.oauthProvider || 'local'}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.lastlogin
                            ? new Date(user.lastlogin).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {user.isActive !== false ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
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
                    {data.pagination.total} users
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
    </div>
  )
}

