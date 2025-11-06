'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export function useAdminAuth() {
  const { data: session, status } = useSession()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
      return
    }

    if (status === 'unauthenticated' || !session?.user?.email) {
      setIsAuthorized(false)
      setIsLoading(false)
      return
    }

    // Check authorization via API route (server-side only)
    fetch('/api/admin/check')
      .then(res => res.json())
      .then(data => {
        setIsAuthorized(data.isAuthorized || false)
        setIsLoading(false)
      })
      .catch(() => {
        setIsAuthorized(false)
        setIsLoading(false)
      })
  }, [session, status])

  return { isAuthorized, isLoading }
}

