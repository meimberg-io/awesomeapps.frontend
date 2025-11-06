'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { renderIcon } from '@/components/util/renderIcon'
import { Search, X } from 'lucide-react'
import icons from 'lucide-static/icon-nodes.json'

interface IconSelectorProps {
  value: string
  onChange: (iconName: string) => void
  label?: string
}

export function IconSelector({ value, onChange, label = 'Icon' }: IconSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Get all icon names from lucide-static
  const allIconNames = useMemo(() => {
    return Object.keys(icons).sort()
  }, [])

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!search) return allIconNames
    const searchLower = search.toLowerCase()
    return allIconNames.filter(name => 
      name.toLowerCase().includes(searchLower)
    )
  }, [allIconNames, search])

  const handleSelect = (iconName: string) => {
    onChange(iconName)
    setOpen(false)
    setSearch('')
  }

  const handleClear = () => {
    onChange('')
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        {value && (
          <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
            {renderIcon(value, 'h-5 w-5', 20)}
            <span className="text-sm font-mono">{value}</span>
          </div>
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              {value ? 'Change Icon' : 'Select Icon'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Select an Icon</DialogTitle>
              <DialogDescription>
                Search and select an icon from the Lucide icon library
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 flex-1 min-h-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search icons..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>
              <div className="flex-1 overflow-auto border rounded-md p-4">
                {filteredIcons.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No icons found matching &quot;{search}&quot;
                  </div>
                ) : (
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                    {filteredIcons.map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => handleSelect(iconName)}
                        className={`
                          w-12 h-12 p-2 rounded-md border transition-all
                          hover:bg-primary hover:text-primary-foreground hover:border-primary
                          flex items-center justify-center
                          ${value === iconName ? 'bg-primary text-primary-foreground border-primary' : 'bg-background'}
                        `}
                        title={iconName}
                      >
                        <svg
                          width={32}
                          height={32}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {(() => {
                            const iconMap = icons as unknown as Record<string, Array<[string, Record<string, string>]>>;
                            const node = iconMap[iconName] || iconMap['tag'];
                            return node.map(([tag, attrs], i) => {
                              const Tag = tag as keyof JSX.IntrinsicElements;
                              return <Tag key={i} {...attrs} />;
                            });
                          })()}
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Showing {filteredIcons.length} of {allIconNames.length} icons
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

