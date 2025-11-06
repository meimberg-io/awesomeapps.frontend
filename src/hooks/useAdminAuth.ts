'use client'

import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import { isAdminEmail } from '@/lib/config/admin'

export function useAdminAuth() {
  const { data: session, status } = useSession()
  
  const isAuthorized = useMemo(() => {
    if (status === 'loading') return false
    if (status === 'unauthenticated') return false
    if (!session?.user?.email) return false
    
    return isAdminEmail(session.user.email)
  }, [session, status])
  
  return {
    isAuthorized,
    isLoading: status === 'loading',
  }
}

