'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Wand2, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { requestRegeneration, type RegenerateField } from '@/lib/regenerate'

interface RegenerateMenuProps {
  serviceName: string
  align?: 'start' | 'end'
  size?: 'sm' | 'icon'
  className?: string
  iconClassName?: string
  disabled?: boolean
  statusSlug?: string
}

type NewServiceStatus = 'new' | 'pending' | 'finished' | 'error'
type InternalStatus = 'idle' | 'requested' | NewServiceStatus

const fields: RegenerateField[] = [
  'all',
  'url',
  'description',
  'functionality',
  'abstract',
  'pricing',
  'tags',
  'video',
  'shortfacts',
]

export function RegenerateMenu({
  serviceName,
  align = 'end',
  size = 'sm',
  className,
  iconClassName,
  disabled,
  statusSlug,
}: RegenerateMenuProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<InternalStatus>('idle')

  useEffect(() => {
    if (!statusSlug) return
    let timer: NodeJS.Timeout | undefined

    const tick = async () => {
      try {
        const res = await fetch(`/api/new-service/${statusSlug}`)
        if (res.ok) {
          const data = await res.json()
          const s = (data?.newService?.n8nstatus as NewServiceStatus | undefined) ?? 'idle'
          setStatus(s)
        }
      } catch {
        // ignore errors
      }
      timer = setTimeout(tick, 1000)
    }

    tick()
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [statusSlug])

  const handleRequest = async (field: RegenerateField) => {
    setLoading(true)
    try {
      await requestRegeneration(session?.strapiJwt, serviceName, field)
      setStatus('requested')
      toast({
        title: 'Success',
        description: `Service regeneration requested${field !== 'all' ? ` (Field: ${field})` : ''}. Added to queue.`,
      })
      setTimeout(() => router.refresh(), 1000)
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to request app regeneration',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const statusColorClasses: Record<NewServiceStatus, string> = {
    new: 'bg-blue-500 hover:bg-blue-600 border-blue-500 text-white',
    pending: 'bg-yellow-500 hover:bg-yellow-600 border-yellow-500 text-white',
    finished: 'bg-green-500 hover:bg-green-600 border-green-500 text-white',
    error: 'bg-red-500 hover:bg-red-600 border-red-500 text-white',
  }

  const getVisuals = () => {
    if (!statusSlug) {
      return { Icon: Wand2, btnClass: '', spin: loading }
    }
    switch (status) {
      case 'new':
        return { Icon: CheckCircle, btnClass: statusColorClasses.new, spin: false }
      case 'pending':
        return { Icon: Clock, btnClass: statusColorClasses.pending, spin: false }
      case 'error':
        return { Icon: AlertCircle, btnClass: statusColorClasses.error, spin: false }
      case 'finished':
        return { Icon: CheckCircle, btnClass: statusColorClasses.finished, spin: false }
      case 'requested':
        return { Icon: Clock, btnClass: statusColorClasses.pending, spin: false }
      case 'idle':
      default:
        return { Icon: Wand2, btnClass: 'button', spin: loading }
    }
  }

  const { Icon, btnClass, spin } = getVisuals()

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button
          variant={btnClass ? 'outline' : 'ghost'}
          size={size}
          disabled={disabled || loading}
          title='Sync/Regenerate'
          className={`${btnClass} ${className || ''}`}
        >
          <Icon className={`h-4 w-4 ${spin ? 'animate-spin' : ''} ${iconClassName || ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuItem onClick={() => handleRequest('all')}>All</DropdownMenuItem>
        <DropdownMenuSeparator />
        {fields.filter(f => f !== 'all').map(f => (
          <DropdownMenuItem key={f} onClick={() => handleRequest(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default RegenerateMenu


