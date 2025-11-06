'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { STRAPI_BASEURL } from '@/lib/constants'
import { Image } from '@/types/image'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface MultipleImageUploadProps {
  label: string
  value: Image[]
  onChange: (images: Image[]) => void
  jwt: string
  onUpload?: (file: File) => Promise<Image | null>
  maxSize?: number // in MB
  acceptedTypes?: string[]
}

export function MultipleImageUpload({
  label,
  value,
  onChange,
  jwt,
  onUpload,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
}: MultipleImageUploadProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFile = async (file: File) => {
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: `Please upload an image file (${acceptedTypes.join(', ')})`,
        variant: 'destructive',
      })
      return
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      toast({
        title: 'File too large',
        description: `File size must be less than ${maxSize}MB`,
        variant: 'destructive',
      })
      return
    }

    setUploading(true)
    try {
      const uploadFn = onUpload || (async (file: File) => {
        const formData = new FormData()
        formData.append('files', file)
        formData.append('fileInfo', JSON.stringify({
          alternativeText: file.name,
          caption: file.name,
        }))

        const response = await fetch(
          `${STRAPI_BASEURL}/api/upload`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${jwt}`,
            },
            body: formData,
          }
        )

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error?.message || 'Failed to upload image')
        }

        const data = await response.json() as Image[]
        return data[0] || null
      })

      const uploadedImage = await uploadFn(file)
      if (uploadedImage) {
        onChange([...value, uploadedImage])
        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
        })
      }
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      Array.from(files).forEach(file => handleFile(file))
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(file => handleFile(file))
    }
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...value]
    const [removed] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, removed)
    onChange(newImages)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        className={`border-2 border-dashed rounded-md p-4 transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-border bg-muted/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {value.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {value.map((image, index) => (
                <div key={image.documentId || index} className="relative">
                  <img
                    src={`${STRAPI_BASEURL}${image.url}`}
                    alt={image.alternativeText || `Image ${index + 1}`}
                    className="h-24 w-24 object-contain rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => handleRemove(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute -top-2 left-2 h-6 w-6 rounded-full p-0"
                      onClick={() => handleReorder(index, index - 1)}
                      title="Move left"
                    >
                      ←
                    </Button>
                  )}
                  {index < value.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute -bottom-2 left-2 h-6 w-6 rounded-full p-0"
                      onClick={() => handleReorder(index, index + 1)}
                      title="Move right"
                    >
                      →
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Add More Images'}
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Drag and drop images here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                Accepted: {acceptedTypes.map(t => t.split('/')[1]).join(', ')} • Max {maxSize}MB per image
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Select Images'}
            </Button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>
    </div>
  )
}

