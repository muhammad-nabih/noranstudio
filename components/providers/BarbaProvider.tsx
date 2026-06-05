'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function BarbaProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Add smooth page transitions with scroll reset
    const handleRouteChange = () => {
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0)
      }
    }

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  return <>{children}</>
}
