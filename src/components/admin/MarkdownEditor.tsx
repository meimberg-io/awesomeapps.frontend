'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import MarkdownRenderer from '@/components/util/MarkdownRenderer'
import { Eye, FileText } from 'lucide-react'

interface MarkdownEditorProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
}

export function MarkdownEditor({
  id,
  label,
  value,
  onChange,
  rows = 12,
  placeholder,
}: MarkdownEditorProps) {
  const [view, setView] = useState<'edit' | 'preview'>('preview')

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setView(view === 'edit' ? 'preview' : 'edit')}
        >
          {view === 'edit' ? (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {view === 'edit' ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder || 'Enter markdown...'}
          className="font-mono text-sm"
        />
      ) : (
        <div className="min-h-[200px] p-4 border rounded-md bg-background">
          {value ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p className="text-sm text-muted-foreground">No content to preview</p>
          )}
        </div>
      )}
    </div>
  )
}

