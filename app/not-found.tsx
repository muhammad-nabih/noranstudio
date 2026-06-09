'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Link from 'next/link'
import * as THREE from 'three'

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const knotRef = useRef<THREE.Mesh | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })
  const [hovering, setHovering] = useState(false)

  // Setup Three.js scene (same as before, no font changes)



  return (
    <>
      <div ref={containerRef} className="fixed inset-0 -z-10" />
      <div className="fixed inset-0 bg-gradient-to-br from-background/70 via-background/50 to-background/80 pointer-events-none" />

      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-3xl"
        >
          {/* Glowing 404 with Poppins */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
            className="relative inline-block"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <h1 className="text-[15vw] md:text-[12vw] font-bold tracking-tighter leading-none bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(243,121,167,0.4)]"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
              404
            </h1>
            <motion.div
              animate={{ opacity: hovering ? 0.8 : 0.3, scale: hovering ? 1.2 : 1 }}
              className="absolute inset-0 blur-3xl bg-primary/30 rounded-full -z-10"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-4 space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-semibold text-foreground"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
              Oops! Lost in the&nbsp;
              <span className="italic text-primary">pixels</span>
            </h2>
            <p className="text-foreground/60 text-lg md:text-xl max-w-lg mx-auto"
               style={{ fontFamily: "'Poppins', sans-serif" }}>
              The page you're looking for seems to have wandered off into the creative void.
              <br /> But don't worry — we've got plenty of inspiration to guide you back.
            </p>
          </motion.div>

          {/* Glass card with suggestions */}
    
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-10"
          >
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-primary/40 bg-background/30 backdrop-blur-sm text-primary tracking-wide text-sm transition-all duration-300 hover:bg-primary/20 hover:border-primary/70 hover:scale-105"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span>Browse all campaigns</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '120px' }}
            transition={{ delay: 0.8, duration: 0.9 }}
            className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-12"
          />
        </motion.div>
      </div>
    </>
  )
}