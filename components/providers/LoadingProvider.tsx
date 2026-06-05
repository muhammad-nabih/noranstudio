'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import  Loader from '@/components/common/Loader'
export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true)
    }

    const handleComplete = () => {
      setIsLoading(false)
    }

    // Listen for navigation
    window.addEventListener('beforeunload', handleStart)

    // Simulate loading completion
    const timer = setTimeout(handleComplete, 1000)

    return () => {
      window.removeEventListener('beforeunload', handleStart)
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      {isLoading && <Loader />}
      {children}
    </>
  )
}
