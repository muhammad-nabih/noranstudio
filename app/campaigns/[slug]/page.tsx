'use client'

import { useEffect, useRef, useState, use } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import Image from 'next/image'
import Link from 'next/link'
import { getCampaignBySlug } from '@/lib/sanity-queries'
import { getOptimizedImageUrl } from '@/lib/image-optimization'
import type { Campaign } from '@/lib/types'
import { cn } from '@/lib/utils'
import Loader from '@/components/common/Loader'
import BackNav from '@/components/common/BackNav'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>
}

// ─── Three.js Background Canvas ───────────────────────────────────────────────

function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // Floating particles geometry
    const particleCount = 1200
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    const palette = [
      new THREE.Color('#C9A96E'), // gold
      new THREE.Color('#1A1A2E'), // deep navy
      new THREE.Color('#E8DCC8'), // cream
      new THREE.Color('#8B7355'), // warm bronze
    ]

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
      sizes[i] = Math.random() * 3 + 0.5
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(geo, mat)
    scene.add(particles)

    // Floating torus knot
    const torusGeo = new THREE.TorusKnotGeometry(1.5, 0.3, 200, 32)
    const torusMat = new THREE.MeshBasicMaterial({
      color: '#C9A96E',
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    })
    const torus = new THREE.Mesh(torusGeo, torusMat)
    torus.position.set(4, -2, -3)
    scene.add(torus)

    let mouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.5
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.5
    }
    window.addEventListener('mousemove', onMouseMove)

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    let frame = 0
    const animate = () => {
      frame++
      const id = requestAnimationFrame(animate)
      particles.rotation.y += 0.0003
      particles.rotation.x += 0.0001
      torus.rotation.x += 0.003
      torus.rotation.y += 0.005

      camera.position.x += (mouse.x - camera.position.x) * 0.05
      camera.position.y += (-mouse.y - camera.position.y) * 0.05

      renderer.render(scene, camera)
      return id
    }
    const animId = animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  )
}

// ─── Magnetic Cursor ──────────────────────────────────────────────────────────

function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [cursorText, setCursorText] = useState('')

  useEffect(() => {
    const cursor = cursorRef.current
    const dot = cursorDotRef.current
    if (!cursor || !dot) return

    let cx = 0, cy = 0, dx = 0, dy = 0

    const move = (e: MouseEvent) => {
      dx = e.clientX
      dy = e.clientY
      dot.style.transform = `translate(${dx - 4}px, ${dy - 4}px)`
    }
    window.addEventListener('mousemove', move)

    const raf = () => {
      cx += (dx - cx) * 0.12
      cy += (dy - cy) * 0.12
      cursor.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`
      requestAnimationFrame(raf)
    }
    raf()

    const addHover = (el: Element) => {
      el.addEventListener('mouseenter', () => { setIsHovering(true) })
      el.addEventListener('mouseleave', () => { setIsHovering(false) })
    }

    document.querySelectorAll('a, button, [data-cursor]').forEach(addHover)

    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-[#C9A96E] rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ transition: 'opacity 0.3s' }}
      />
      <div
        ref={cursorRef}
        className={cn(
          'fixed top-0 left-0 rounded-full pointer-events-none z-[9998] border border-[#C9A96E] transition-all duration-300 mix-blend-difference',
          isHovering ? 'w-16 h-16 bg-[#C9A96E]/20' : 'w-10 h-10'
        )}
      />
    </>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection({ campaign }: { campaign: Campaign }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title char split animation
      const title = titleRef.current
      if (!title) return

      const chars = title.querySelectorAll('.char')
      gsap.fromTo(
        chars,
        { y: 120, opacity: 0, rotateX: -80 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.04,
          ease: 'power4.out',
          delay: 0.3,
        }
      )
    }, heroRef)
    return () => ctx.revert()
  }, [])

  const titleText = campaign?.title || 'Campaign'
  const words = titleText.split(' ')

  const heroImageUrl = campaign?.heroImage
    ? getOptimizedImageUrl(campaign.heroImage, { width: 1920, height: 1080 })
    : null

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden">
      {/* Parallax image */}
      <motion.div ref={imageRef} style={{ y, scale }} className="absolute inset-0 z-[1]">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={campaign?.title || ''}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0D0D0D] via-[#1A1008] to-[#0D0D0D]" />
        )}
        {/* Cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/60 via-transparent to-[#0D0D0D]/20" />
      </motion.div>

      {/* Hero content */}
      <motion.div
        style={{ opacity }}
        className="relative z-[2] h-full flex flex-col justify-end pb-24 px-8 md:px-20 max-w-[1600px] mx-auto"
      >
        {/* Service badge */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="w-12 h-[1px] bg-[#C9A96E]" />
          <span className="text-[#C9A96E] text-xs tracking-[0.35em] uppercase font-light font-['Cormorant_Garamond']">
            {(campaign as any)?.service?.title || 'Campaign'}
          </span>
        </motion.div>

        {/* Title with perspective chars */}
        <div className="overflow-hidden" style={{ perspective: '800px' }}>
          <h1
            ref={titleRef}
            className="text-[clamp(3rem,9vw,9rem)] font-['Playfair_Display'] font-bold leading-[0.9] text-white mb-8 tracking-tight"
          >
            {words.map((word, wi) => (
              <span key={wi} className="inline-block mr-[0.2em]">
                {word.split('').map((char, ci) => (
                  <span key={ci} className="char inline-block" style={{ transformOrigin: 'bottom center' }}>
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </div>

        {/* Meta info row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-wrap items-center gap-8 text-[#E8DCC8]/60 text-sm"
        >
          {(campaign as any)?.clientName && (
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#C9A96E]" />
              Client: <span className="text-[#C9A96E] ml-1">{(campaign as any).clientName}</span>
            </span>
          )}
          {(campaign as any)?.year && (
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#C9A96E]" />
              Year: <span className="text-[#C9A96E] ml-1">{(campaign as any).year}</span>
            </span>
          )}
          {(campaign as any)?.behanceUrl && (
            <a
              href={(campaign as any).behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#C9A96E] transition-colors duration-300"
            >
              <span className="w-1 h-1 rounded-full bg-[#C9A96E]" />
              View on Behance ↗
            </a>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-8 z-[2] flex flex-col items-center gap-2"
      >
        <span className="text-[#C9A96E]/50 text-[10px] tracking-[0.3em] uppercase rotate-90 origin-center mb-4">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-[#C9A96E]/50 to-transparent relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-[#C9A96E]"
            animate={{ height: ['0%', '100%'], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}

// ─── Description Section ──────────────────────────────────────────────────────

function DescriptionSection({ campaign }: { campaign: Campaign }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.desc-line',
        { y: '100%', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )

      gsap.fromTo(
        '.desc-number',
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-40 px-8 md:px-20 max-w-[1600px] mx-auto">
      {/* Decorative number */}
      <div className="desc-number absolute top-20 right-8 md:right-20 text-[20vw] font-['Playfair_Display'] font-bold text-white/[0.02] select-none leading-none pointer-events-none">
        01
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 md:gap-32 items-start relative z-10">
        {/* Left column */}
        <div>
          <div className="overflow-hidden mb-4">
            <div className="desc-line flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#C9A96E]" />
              <span className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase font-light">About</span>
            </div>
          </div>
          <div className="overflow-hidden">
            <h2 className="desc-line text-4xl md:text-5xl font-['Playfair_Display'] text-white font-bold leading-tight">
              The<br />Story
            </h2>
          </div>
        </div>

        {/* Right column - description */}
        <div>
          <div className="overflow-hidden mb-8">
            <p ref={textRef} className="desc-line text-[#E8DCC8]/75 text-lg md:text-xl leading-[1.9] font-['Cormorant_Garamond'] font-light">
              {campaign?.shortDescription  || 'A compelling visual narrative that transcends conventional boundaries, crafted with meticulous attention to every detail.'}
            </p>
          </div>

          {/* Horizontal rule */}
          <motion.div
            className="desc-line h-[1px] bg-gradient-to-r from-[#C9A96E]/60 via-[#C9A96E]/20 to-transparent mb-8"
          />

          {/* Stats row */}
          <div className="desc-line grid grid-cols-3 gap-8">
            {[
              { label: 'Images', value: (campaign as any)?.gallery?.length || '—' },
              { label: 'Year', value: (campaign as any)?.year || '2024' },
              { label: 'Type', value: (campaign as any)?.service?.title || 'Creative' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-['Playfair_Display'] text-[#C9A96E] font-bold">{stat.value}</div>
                <div className="text-[#E8DCC8]/40 text-xs tracking-[0.2em] uppercase mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Gallery Section ──────────────────────────────────────────────────────────

function GalleryImage({ src, alt, index }: { src: string; alt: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(
      ref.current,
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
        },
      }
    )
  }, [])

  return (
    <motion.div
      ref={ref}
      className="group relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="relative overflow-hidden bg-[#1A1008]" style={{ aspectRatio: index % 5 === 0 ? '16/9' : index % 3 === 0 ? '4/5' : '3/4' }}>
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            'object-cover transition-transform duration-700 group-hover:scale-105',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          sizes="(max-width: 768px) 100vw, 50vw"
          onLoad={() => setLoaded(true)}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#C9A96E]/0 group-hover:bg-[#C9A96E]/10 transition-all duration-500" />
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0D0D0D]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Number */}
        <div className="absolute bottom-4 right-4 text-white/0 group-hover:text-white/60 text-xs font-['Cormorant_Garamond'] tracking-widest transition-all duration-500">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>
      {/* Gold bottom line */}
      <div className="h-[1px] w-0 group-hover:w-full bg-[#C9A96E] transition-all duration-500" />
    </motion.div>
  )
}

function GallerySection({ campaign }: { campaign: Campaign }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const images = (campaign as any)?.gallery || []

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-header',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  if (!images.length) return null

  // Build masonry-like grid layout
  const getGridClass = (i: number) => {
    const patterns = [
      'col-span-2 row-span-2', // large
      'col-span-1 row-span-1', // small
      'col-span-1 row-span-2', // tall
      'col-span-1 row-span-1', // small
      'col-span-1 row-span-1', // small
    ]
    return patterns[i % patterns.length]
  }

  return (
    <section ref={sectionRef} className="py-20 w-full md:px-20  mx-auto bg-black">
      {/* Header */}
      <div className="gallery-header mb-16 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[#C9A96E]" />
            <span className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase">Gallery</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-['Playfair_Display'] font-bold text-white leading-tight">
            Visual<br />Journey
          </h2>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-[#C9A96E] text-5xl font-['Playfair_Display']">{String(images.length).padStart(2, '0')}</div>
          <div className="text-[#E8DCC8]/40 text-xs tracking-[0.2em] uppercase">Frames</div>
        </div>
      </div>

      {/* Masonry grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">
        {images.map((img: any, i: number) => {
          const src = getOptimizedImageUrl(img, { width: 1200, height: 900 })
          const alt = img?.alt || `Gallery image ${i + 1}`
          const gridClass = getGridClass(i)
          return (
            <div key={i} className={cn('overflow-hidden', gridClass)}>
              <GalleryImage src={src} alt={alt} index={i} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─── Marquee Strip ────────────────────────────────────────────────────────────

function MarqueeStrip({ text = 'CAMPAIGN — VISUAL EXCELLENCE — PHOTOGRAPHY — CREATIVE DIRECTION —' }) {
  return (
    <div className="relative py-6 overflow-hidden border-y border-[#C9A96E]/20 my-20">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-[#C9A96E]/30 text-sm tracking-[0.4em] uppercase font-['Cormorant_Garamond'] font-light flex-shrink-0">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Behance CTA Section ──────────────────────────────────────────────────────

function CTASection({ campaign }: { campaign: Campaign }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cta-content', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' }
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="py-32 px-8 md:px-20 max-w-[1600px] mx-auto">
      <div className="cta-content relative border border-[#C9A96E]/20 p-12 md:p-20 overflow-hidden">
        {/* Corner decorations */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-8 h-8`}>
            <div className={`absolute w-full h-[1px] bg-[#C9A96E] ${i < 2 ? 'top-0' : 'bottom-0'}`} />
            <div className={`absolute h-full w-[1px] bg-[#C9A96E] ${i % 2 === 0 ? 'left-0' : 'right-0'}`} />
          </div>
        ))}

        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-12 h-[1px] bg-[#C9A96E]" />
            <span className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase">Explore More</span>
            <span className="w-12 h-[1px] bg-[#C9A96E]" />
          </div>
          <h2 className="text-4xl md:text-6xl font-['Playfair_Display'] font-bold text-white mb-6 leading-tight">
            See the Full<br />
            <span className="text-[#C9A96E]">Project</span>
          </h2>
          {(campaign as any)?.behanceUrl && (
            <motion.a
              href={(campaign as any).behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 mt-8 px-10 py-4 border border-[#C9A96E] text-[#C9A96E] text-sm tracking-[0.3em] uppercase font-['Cormorant_Garamond'] hover:bg-[#C9A96E] hover:text-[#0D0D0D] transition-all duration-400 group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View on Behance
              <span className="group-hover:translate-x-1 transition-transform duration-300">↗</span>
            </motion.a>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Navigation ───────────────────────────────────────────────────────────────


// ─── Loading Skeleton ─────────────────────────────────────────────────────────


// ─── Page Transition ──────────────────────────────────────────────────────────

function PageReveal() {
  return (
    <motion.div
      className="fixed inset-0 bg-[#0D0D0D] z-[150] origin-bottom"
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
    />
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CampaignSlugPage({ params }: PageProps) {

  const { slug } = use(params)

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const data = await getCampaignBySlug(slug)
        setCampaign(data)
      } catch (e) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchCampaign()
  }, [slug])

  // Smooth scroll setup
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => { document.documentElement.style.scrollBehavior = '' }
  }, [])

  if (loading) return <Loader />

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-['Playfair_Display'] text-white mb-4">404</h1>
          <p className="text-[#C9A96E]">Campaign not found</p>
          <Link href="/" className="mt-8 inline-block text-[#E8DCC8]/60 hover:text-[#C9A96E] transition-colors">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Global font imports */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:wght@300;400;600&display=swap');

        html {
          background-color: #0D0D0D;
        }

        ::-webkit-scrollbar {
          width: 3px;
        }
        ::-webkit-scrollbar-track {
          background: #0D0D0D;
        }
        ::-webkit-scrollbar-thumb {
          background: #C9A96E;
        }

        ::selection {
          background: #C9A96E;
          color: #0D0D0D;
        }
      `}</style>

      {/* Page reveal animation */}
      <PageReveal />

      {/* Custom cursor (desktop only) */}
      <div className="hidden md:block">
        <MagneticCursor />
      </div>

      {/* Three.js bg */}
      <ThreeBackground />

      {/* Navigation */}
      <BackNav />

      {/* Main content */}
      <main className="relative z-[10] bg-transparent">
        <HeroSection campaign={campaign} />
        <DescriptionSection campaign={campaign} />
        {/* <MarqueeStrip text={`${campaign.title.toUpperCase()} — VISUAL EXCELLENCE — CREATIVE DIRECTION — PHOTOGRAPHY —`} /> */}
        <GallerySection campaign={campaign} />
        <CTASection campaign={campaign} />

        {/* Footer */}
        <footer className="border-t border-[#C9A96E]/10 py-12 px-8 md:px-20 bg-[#1c1a17]">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[#E8DCC8]/30 text-xs tracking-[0.2em] uppercase">
              © {new Date().getFullYear()} — All rights reserved
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[#C9A96E]/30" />
              <span className="text-[#C9A96E]/40 text-xs tracking-[0.3em] uppercase">Photography Portfolio</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}