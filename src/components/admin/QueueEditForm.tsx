'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Locale } from '@/types/locale'
import { NewService } from '@/types/newService'
import { updateQueueItem } from '@/lib/api/admin-queue-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface QueueEditFormProps {
  locale: Locale
  jwt: string
  queueItem: NewService
}

export function QueueEditForm({ locale, jwt, queueItem }: QueueEditFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    slug: queueItem.slug || '',
    field: queueItem.field || '',
    n8nstatus: queueItem.n8nstatus || 'new',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateQueueItem(jwt, queueItem.documentId, formData)
      toast({
        title: 'Success',
        description: 'Queue item updated successfully',
      })
      router.push(`/${locale}/admin/queue`)
      router.refresh()
    } catch (error: any) {
      console.error('Error saving queue item:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to save queue item',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/${locale}/admin/queue`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Queue
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Queue Item</h1>
          <p className="text-muted-foreground mt-1">
            Editing: {queueItem.slug}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle>Queue Item Information</CardTitle>
            <CardDescription>Queue item details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field">Field</Label>
              <Input
                id="field"
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.n8nstatus}
                onValueChange={(value: string) => setFormData({ ...formData, n8nstatus: value as NewService['n8nstatus'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="finished">Finished</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${locale}/admin/queue`)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}

