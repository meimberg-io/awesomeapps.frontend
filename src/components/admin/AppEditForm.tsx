'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Locale } from '@/types/locale'
import { App } from '@/types/app'
import { Tag, TagStatus } from '@/types/tag'
import { resolveTagStatus, isTagExcluded } from '@/lib/tag-utils'
import { createAppWithLocalizations, updateAppWithLocalizations, getTags, checkUniqueness } from '@/lib/api/admin-apps-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save, X, XCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Checkbox } from '@/components/ui/checkbox'
import { MarkdownEditor } from '@/components/admin/MarkdownEditor'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { MultipleImageUpload } from '@/components/admin/MultipleImageUpload'
import { getBrandfetchLogoUrl } from '@/lib/utils'
import { Image } from '@/types/image'

interface AppEditFormProps {
  locale: Locale
  jwt: string
  appEn?: App | null
  appDe?: App | null
}

export function AppEditForm({ locale, jwt, appEn, appDe }: AppEditFormProps) {
  const app = appEn || appDe // Use English version as primary for non-localized fields
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [tagsLoading, setTagsLoading] = useState(true)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [logo, setLogo] = useState<Image | null>(app?.logo || null)
  const [screenshots, setScreenshots] = useState<Image[]>(app?.screenshots || [])
  const [formData, setFormData] = useState(() => {
    // Use publishdate if available, otherwise fall back to createdAt
    const dateValue = app?.publishdate || app?.createdAt
    const publishdateValue = dateValue ? (() => {
      try {
        // If it's already in YYYY-MM-DD format, use it directly
        if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return dateValue
        }
        // Otherwise, try to parse it as a date
        const date = new Date(dateValue)
        if (isNaN(date.getTime())) {
          return ''
        }
        return date.toISOString().split('T')[0]
      } catch {
        return ''
      }
    })() : ''
    
    return {
      // Non-localized fields
      name: app?.name || '',
      slug: app?.slug || '',
      url: app?.url || '',
      youtube_video: app?.youtube_video || '',
      youtube_title: app?.youtube_title || '',
      top: app?.top || false,
      publishdate: publishdateValue,
      // Localized fields - English
      abstract_en: appEn?.abstract || '',
      shortfacts_en: appEn?.shortfacts || '',
      pricing_en: appEn?.pricing || '',
      description_en: appEn?.description || '',
      functionality_en: appEn?.functionality || '',
      // Localized fields - German
      abstract_de: appDe?.abstract || '',
      shortfacts_de: appDe?.shortfacts || '',
      pricing_de: appDe?.pricing || '',
      description_de: appDe?.description || '',
      functionality_de: appDe?.functionality || '',
    }
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const isNew = !appEn && !appDe

  useEffect(() => {
    const loadTags = async () => {
      setTagsLoading(true)
      try {
        const fetchedTags = await getTags(jwt)
        setTags(fetchedTags || [])
      } catch (error) {
        console.error('Error loading tags:', error)
        toast({
          title: 'Error',
          description: 'Failed to load tags',
          variant: 'destructive',
        })
      } finally {
        setTagsLoading(false)
      }
    }
    loadTags()

    // Tags are not localized, use from either version
    if (appEn?.tags) {
      setSelectedTagIds(appEn.tags.map(tag => tag.documentId))
    } else if (appDe?.tags) {
      setSelectedTagIds(appDe.tags.map(tag => tag.documentId))
    }
  }, [jwt, appEn, appDe])

  const handleNameChange = async (value: string) => {
    setFormData({ ...formData, name: value })
    if (!isNew && app && value !== app.name) {
      const isUnique = await checkUniqueness(jwt, 'name', value, app.documentId)
      if (!isUnique) {
        setValidationErrors({ ...validationErrors, name: 'Name must be unique' })
      } else {
        const newErrors = { ...validationErrors }
        delete newErrors.name
        setValidationErrors(newErrors)
      }
    }
  }

  const handleSlugChange = async (value: string) => {
    setFormData({ ...formData, slug: value })
    if (!isNew && app && value !== app.slug) {
      const isUnique = await checkUniqueness(jwt, 'slug', value, app.documentId)
      if (!isUnique) {
        setValidationErrors({ ...validationErrors, slug: 'Slug must be unique' })
      } else {
        const newErrors = { ...validationErrors }
        delete newErrors.slug
        setValidationErrors(newErrors)
      }
    }
  }

  const handleUrlChange = async (value: string) => {
    setFormData({ ...formData, url: value })
    if (!isNew && app && value !== app.url) {
      const isUnique = await checkUniqueness(jwt, 'url', value, app.documentId)
      if (!isUnique) {
        setValidationErrors({ ...validationErrors, url: 'URL must be unique' })
      } else {
        const newErrors = { ...validationErrors }
        delete newErrors.url
        setValidationErrors(newErrors)
      }
    }
  }

  const statusStyles: Record<TagStatus, string> = {
    active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200',
    proposed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
    excluded: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200',
  }

  // Helper: get Strapi file relation reference (id preferred, fallback to documentId)
  const getFileRef = (img: unknown): string | number | null => {
    if (img && typeof img === 'object') {
      const o = img as Record<string, unknown>
      const id = o['id']
      const documentId = o['documentId']
      if (typeof id === 'string' || typeof id === 'number') return id
      if (typeof documentId === 'string') return documentId
    }
    return null
  }
  const isNonNull = <T,>(v: T | null | undefined): v is T => v !== null && v !== undefined

  const toggleTag = (tag: Tag, force = false) => {
    const status = resolveTagStatus(tag)
    if (!force && status === 'excluded') {
      return
    }
    const tagId = tag.documentId
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const handleSubmit = async (e: React.FormEvent, closeAfterSave: boolean = false) => {
    e.preventDefault()
    setLoading(true)

    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fix validation errors before saving',
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    try {
      // Common fields (not localized)
      const commonData: Record<string, unknown> = {
        name: formData.name,
        slug: formData.slug,
        url: formData.url,
        youtube_video: formData.youtube_video || null,
        youtube_title: formData.youtube_title || null,
        top: formData.top,
        publishdate: formData.publishdate || null,
        tags: selectedTagIds.length > 0 ? selectedTagIds : undefined,
        // Strapi media relations: use documentId or id
        logo: logo ? getFileRef(logo) : null,
        screenshots:
          screenshots.length > 0
            ? screenshots.map(img => getFileRef(img)).filter(isNonNull)
            : undefined,
      }

      // English data
      const enData: Record<string, unknown> = {
        ...commonData,
        abstract: formData.abstract_en || null,
        shortfacts: formData.shortfacts_en || null,
        pricing: formData.pricing_en || null,
        description: formData.description_en || null,
        functionality: formData.functionality_en || null,
      }

      // German data
      const deData: Record<string, unknown> = {
        ...commonData,
        abstract: formData.abstract_de || null,
        shortfacts: formData.shortfacts_de || null,
        pricing: formData.pricing_de || null,
        description: formData.description_de || null,
        functionality: formData.functionality_de || null,
      }

      if (isNew) {
        await createAppWithLocalizations(jwt, enData, deData)
        toast({
          title: 'Success',
          description: 'App created successfully',
        })
      } else {
        const documentId = appEn?.documentId || appDe?.documentId || ''
        if (!documentId) {
          throw new Error('Document ID is required for update')
        }
        await updateAppWithLocalizations(jwt, documentId, enData, deData)
        toast({
          title: 'Success',
          description: 'App updated successfully',
        })
      }

      if (closeAfterSave) {
        router.push(`/${locale}/admin/apps`)
        router.refresh()
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error('Error saving app:', error)
      const message = error instanceof Error ? error.message : 'Failed to save app'
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
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/${locale}/admin/apps`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Apps
          </Link>
        </Button>
        <div className="text-right">
          <h1 className="text-3xl font-bold">
            {isNew ? 'New App' : (app?.name || appEn?.name || appDe?.name || 'Edit App')}
          </h1>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Basic app information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className={validationErrors.name ? 'border-destructive' : ''}
              />
              {validationErrors.name && (
                <p className="text-sm text-destructive">{validationErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                required
                className={validationErrors.slug ? 'border-destructive' : ''}
              />
              {validationErrors.slug && (
                <p className="text-sm text-destructive">{validationErrors.slug}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => handleUrlChange(e.target.value)}
                required
                className={validationErrors.url ? 'border-destructive' : ''}
              />
              {validationErrors.url && (
                <p className="text-sm text-destructive">{validationErrors.url}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishdate">Publish Date</Label>
              <Input
                id="publishdate"
                type="date"
                value={formData.publishdate}
                onChange={(e) => setFormData({ ...formData, publishdate: e.target.value })}
              />
            </div>

          </CardContent>
          <CardFooter className="bg-muted/50 pt-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="top"
                checked={formData.top}
                onCheckedChange={(checked) => setFormData({ ...formData, top: checked === true })}
              />
              <Label htmlFor="top" className="cursor-pointer">Mark as Top App</Label>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle>Content</CardTitle>
            <CardDescription>Description, abstract, short facts, functionality, and pricing (English and German)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Column headers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="font-bold text-sm">English</div>
              <div className="font-bold text-sm">German</div>
            </div>

            {/* Abstract */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="abstract_en">Abstract</Label>
                <Textarea
                  id="abstract_en"
                  value={formData.abstract_en}
                  onChange={(e) => setFormData({ ...formData, abstract_en: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="abstract_de">Abstract</Label>
                <Textarea
                  id="abstract_de"
                  value={formData.abstract_de}
                  onChange={(e) => setFormData({ ...formData, abstract_de: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MarkdownEditor
                id="description_en"
                label="Description"
                value={formData.description_en}
                onChange={(value) => setFormData({ ...formData, description_en: value })}
                rows={12}
                placeholder="Enter markdown content..."
              />
              <MarkdownEditor
                id="description_de"
                label="Description"
                value={formData.description_de}
                onChange={(value) => setFormData({ ...formData, description_de: value })}
                rows={12}
                placeholder="Enter markdown content..."
              />
            </div>

            {/* Short Facts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shortfacts_en">Short Facts</Label>
                <Textarea
                  id="shortfacts_en"
                  value={formData.shortfacts_en}
                  onChange={(e) => setFormData({ ...formData, shortfacts_en: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortfacts_de">Short Facts</Label>
                <Textarea
                  id="shortfacts_de"
                  value={formData.shortfacts_de}
                  onChange={(e) => setFormData({ ...formData, shortfacts_de: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            {/* Functionality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MarkdownEditor
                id="functionality_en"
                label="Functionality"
                value={formData.functionality_en}
                onChange={(value) => setFormData({ ...formData, functionality_en: value })}
                rows={12}
                placeholder="Enter markdown content..."
              />
              <MarkdownEditor
                id="functionality_de"
                label="Functionality"
                value={formData.functionality_de}
                onChange={(value) => setFormData({ ...formData, functionality_de: value })}
                rows={12}
                placeholder="Enter markdown content..."
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MarkdownEditor
                id="pricing_en"
                label="Pricing"
                value={formData.pricing_en}
                onChange={(value) => setFormData({ ...formData, pricing_en: value })}
                rows={8}
                placeholder="Enter markdown content..."
              />
              <MarkdownEditor
                id="pricing_de"
                label="Pricing"
                value={formData.pricing_de}
                onChange={(value) => setFormData({ ...formData, pricing_de: value })}
                rows={8}
                placeholder="Enter markdown content..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle>Tags</CardTitle>
            <CardDescription>Manage tags for this app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 p-4 border rounded-md min-h-[100px] bg-background">
                {tagsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading tags...</p>
                ) : tags.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tags available</p>
                ) : (
                  tags.map((tag) => {
                    const status = resolveTagStatus(tag)
                    const isSelected = selectedTagIds.includes(tag.documentId)
                    const textColorClass =
                      status === 'active'
                        ? 'text-blue-600'
                        : status === 'proposed'
                        ? 'text-emerald-600'
                        : 'text-red-600'
                    return (
                    <div
                      key={tag.documentId}
                      className="flex items-center gap-2 p-2 border rounded bg-card"
                    >
                      <Checkbox
                        id={`tag-${tag.documentId}`}
                        checked={isSelected}
                        onCheckedChange={() => toggleTag(tag)}
                        disabled={isTagExcluded(tag)}
                      />
                      <Label
                        htmlFor={`tag-${tag.documentId}`}
                        className={`cursor-pointer text-sm flex items-center gap-2 ${textColorClass}`}
                      >
                        <CheckCircle className={`h-3.5 w-3.5 ${textColorClass}`} />
                        {tag.name}
                      </Label>
                    </div>
                  )
                  })
                )}
              </div>
              {selectedTagIds.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 items-center">

                  {tags
                    .filter(tag => selectedTagIds.includes(tag.documentId))
                    .map((tag) => {
                      const status = resolveTagStatus(tag)
                      return (
                        <Badge
                          key={tag.documentId}
                          variant="outline"
                          className={`${statusStyles[status]} flex items-center gap-2 text-sm px-3 py-1.5 rounded-md`}
                        >
                          <span>{tag.name}</span>
                          <button
                            type="button"
                            onClick={() => toggleTag(tag, true)}
                            className="ml-1 hover:text-destructive flex items-center justify-center"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )
                    })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle>Media</CardTitle>
            <CardDescription>Logo and screenshots</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <ImageUpload
                label="Logo (Optional)"
                value={logo}
                onChange={setLogo}
                jwt={jwt}
              />
              {!logo && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-muted-foreground">No logo uploaded. Brandfetch fallback will be used:</p>
                  <img
                    src={getBrandfetchLogoUrl(app?.url || formData.url)}
                    alt="Logo (Brandfetch)"
                    className="h-20 w-20 object-contain rounded border"
                  />
                </div>
              )}
            </div>

            <MultipleImageUpload
              label="Screenshots"
              value={screenshots}
              onChange={setScreenshots}
              jwt={jwt}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle>YouTube</CardTitle>
            <CardDescription>YouTube video information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="youtube_video">YouTube Video ID</Label>
              <Input
                id="youtube_video"
                value={formData.youtube_video}
                onChange={(e) => setFormData({ ...formData, youtube_video: e.target.value })}
                placeholder="e.g., dQw4w9WgXcQ"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube_title">YouTube Title</Label>
              <Input
                id="youtube_title"
                value={formData.youtube_title}
                onChange={(e) => setFormData({ ...formData, youtube_title: e.target.value })}
              />
            </div>

            {formData.youtube_video && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden border bg-muted">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${formData.youtube_video}`}
                    title={formData.youtube_title || 'YouTube video player'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${locale}/admin/apps`)}
            disabled={loading}
            className="bg-gray-700 text-white hover:bg-gray-800 border-gray-700"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e, false)}
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button
              type="submit"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : isNew ? 'Create & Close' : 'Save & Close'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
