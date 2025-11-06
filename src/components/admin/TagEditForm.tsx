'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Locale } from '@/types/locale'
import { Tag } from '@/types/tag'
import { createTag, updateTag, checkTagNameUniqueness } from '@/lib/api/admin-tags-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save, XCircle } from 'lucide-react'
import { IconSelector } from '@/components/admin/IconSelector'
import Link from 'next/link'

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
    excluded: tag?.excluded || false,
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="excluded"
                checked={formData.excluded}
                onCheckedChange={(checked) => setFormData({ ...formData, excluded: checked === true })}
              />
              <Label htmlFor="excluded" className="cursor-pointer">Excluded</Label>
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

    </div>
  )
}

