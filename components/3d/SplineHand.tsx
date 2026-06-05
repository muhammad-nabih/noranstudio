'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function SplineHand() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Animate the container on mount
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
    )

    // Create floating animation
    gsap.to(containerRef.current, {
      y: -20,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 dark:from-primary dark:via-primary/80 dark:to-primary/40"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👋</div>
          <p className="text-white/80 dark:text-white/90 text-lg font-medium">Interactive 3D Hand</p>
          <p className="text-white/60 dark:text-white/70 text-sm mt-2">Spline integration loading...</p>
        </div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse" />
    </div>
  )
}
