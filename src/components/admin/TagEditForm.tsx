'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Locale } from '@/types/locale'
import { Tag, TagStatus } from '@/types/tag'
import { App } from '@/types/app'
import { resolveTagStatus } from '@/lib/tag-utils'
import { createTag, updateTag, checkTagNameUniqueness } from '@/lib/api/admin-tags-api'
import { getAppsList } from '@/lib/api/admin-apps-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save, XCircle } from 'lucide-react'
import { IconSelector } from '@/components/admin/IconSelector'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { STRAPI_BASEURL } from '@/lib/constants'
import { getBrandfetchLogoUrl } from '@/lib/utils'

interface TagEditFormProps {
  locale: Locale
  jwt: string
  tag?: Tag
}

export function TagEditForm({ locale, jwt, tag }: TagEditFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    name: tag?.name || '',
    description: tag?.description || '',
    icon: tag?.icon || '',
    tagStatus: (tag ? resolveTagStatus(tag) : 'active') as TagStatus,
  })

  const handleNameChange = async (value: string) => {
    setFormData({ ...formData, name: value })
    
    // Check uniqueness on blur if name changed
    if (!isNew && value !== tag?.name) {
      const isUnique = await checkTagNameUniqueness(jwt, value, tag.documentId)
      if (!isUnique) {
        setValidationErrors({ ...validationErrors, name: 'Name must be unique' })
      } else {
        const newErrors = { ...validationErrors }
        delete newErrors.name
        setValidationErrors(newErrors)
      }
    } else if (isNew && value) {
      // For new tags, check uniqueness
      const isUnique = await checkTagNameUniqueness(jwt, value)
      if (!isUnique) {
        setValidationErrors({ ...validationErrors, name: 'Name must be unique' })
      } else {
        const newErrors = { ...validationErrors }
        delete newErrors.name
        setValidationErrors(newErrors)
      }
    }
  }

  const isNew = !tag
  const [connectedAppsLoading, setConnectedAppsLoading] = useState(false)
  const [connectedApps, setConnectedApps] = useState<App[]>([])

  useEffect(() => {
    const fetchConnected = async () => {
      if (!tag) return
      setConnectedAppsLoading(true)
      try {
        const res = await getAppsList(jwt, {
          page: 1,
          pageSize: 100,
          filters: { tags: [tag.documentId] },
          locale,
          sort: 'updatedAt:desc',
        })
        setConnectedApps(res.data)
      } finally {
        setConnectedAppsLoading(false)
      }
    }
    fetchConnected()
  }, [jwt, tag?.documentId, locale])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Final uniqueness check before submit
    if (formData.name) {
      const isUnique = isNew
        ? await checkTagNameUniqueness(jwt, formData.name)
        : await checkTagNameUniqueness(jwt, formData.name, tag.documentId)
      
      if (!isUnique) {
        setValidationErrors({ ...validationErrors, name: 'Name must be unique' })
        toast({
          title: 'Validation Error',
          description: 'Tag name must be unique',
          variant: 'destructive',
        })
        return
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fix validation errors before saving',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      if (isNew) {
        await createTag(jwt, formData)
        toast({
          title: 'Success',
          description: 'Tag created successfully',
        })
      } else {
        await updateTag(jwt, tag.documentId, formData)
        toast({
          title: 'Success',
          description: 'Tag updated successfully',
        })
      }
      router.push(`/${locale}/admin/tags`)
      router.refresh()
    } catch (error) {
      console.error('Error saving tag:', error)
      const message = error instanceof Error ? error.message : 'Failed to save tag'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="container mx-auto px-4 pt-8 pb-16 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/${locale}/admin/tags`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tags
          </Link>
        </Button>
        <div className="text-right">
          <h1 className="text-3xl font-bold">
            {isNew ? 'New Tag' : (tag?.name || 'Edit Tag')}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle>{tag?.name || 'New Tag'}</CardTitle>
            <CardDescription>Tag details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={(e) => handleNameChange(e.target.value)}
                required
              />
              {validationErrors.name && (
                <p className="text-sm text-destructive">{validationErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <IconSelector
              value={formData.icon}
              onChange={(iconName) => setFormData({ ...formData, icon: iconName })}
              label="Icon"
            />
          </CardContent>
          <CardFooter className="bg-muted/50 pt-6">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.tagStatus}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, tagStatus: value as TagStatus })
                }
              >
                <SelectTrigger id="status" className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="proposed">Proposed</SelectItem>
                  <SelectItem value="excluded">Excluded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardFooter>
        </Card>

        <div className="flex justify-between items-center mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${locale}/admin/tags`)}
            disabled={loading}
            className="bg-gray-700 text-white hover:bg-gray-800 border-gray-700"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : isNew ? 'Create Tag' : 'Save Changes'}
          </Button>
        </div>
      </form>

      {!isNew && (
        <Card className="mt-8">
          <CardHeader className="bg-muted/50">
            <CardTitle>Connected Apps</CardTitle>
            <CardDescription>Only current locale</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {connectedAppsLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 w-full animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : connectedApps.length === 0 ? (
              <p className="text-sm text-muted-foreground">No connected apps.</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {connectedApps.map((app) => (
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
                          <Link href={`/${locale}/admin/apps/${app.documentId}`} className="hover:underline">
                            {app.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{app.slug}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(app.updatedAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

