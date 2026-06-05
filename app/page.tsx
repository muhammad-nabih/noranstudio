'use client'

import { useEffect, useRef, useState, use } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import Image from 'next/image'
import Link from 'next/link'
import { getAllCampaigns, getFeaturedCampaigns } from '@/lib/sanity-queries'
import { getOptimizedImageUrl } from '@/lib/image-optimization'
import type { Campaign, Service } from '@/lib/types'
import { cn } from '@/lib/utils'
import AboutStrip from '@/components/AboutStrip'
import Loader from '@/components/common/Loader'
import ServiceCard from '@/components/ServiceCard'
import WorkSection from '@/components/WorkSection'
import ServicesSection from '@/components/ServicesSection'
import Footer from '@/components/Footer'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Color Palette ────────────────────────────────────────────────────────────
// #0D0D0D  — Obsidian black (bg)
// #C9A96E  — Warm gold (primary accent)
// #E8DCC8  — Aged cream (body text)
// #1A1008  — Dark amber (surfaces)
// #8B7355  — Bronze (secondary accent)

// ═══════════════════════════════════════════════════════════════════════════════
// THREE.JS BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════════

function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 6

    // ── Particles ──────────────────────────────────────────────────────────────
    const count = 1800
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const palette = [
      new THREE.Color('#C9A96E'),
      new THREE.Color('#8B7355'),
      new THREE.Color('#E8DCC8'),
      new THREE.Color('#1A1A2E'),
    ]

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15
      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b
    }

    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const pMat = new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.5, sizeAttenuation: true })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // ── Wireframe Icosahedron ──────────────────────────────────────────────────
    const icoGeo = new THREE.IcosahedronGeometry(2.5, 1)
    const icoMat = new THREE.MeshBasicMaterial({ color: '#C9A96E', wireframe: true, transparent: true, opacity: 0.04 })
    const ico = new THREE.Mesh(icoGeo, icoMat)
    ico.position.set(-5, 2, -4)
    scene.add(ico)

    // ── Ring ──────────────────────────────────────────────────────────────────
    const ringGeo = new THREE.TorusGeometry(3, 0.02, 16, 100)
    const ringMat = new THREE.MeshBasicMaterial({ color: '#C9A96E', transparent: true, opacity: 0.06 })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.position.set(6, -3, -5)
    ring.rotation.x = Math.PI / 4
    scene.add(ring)

    let mx = 0, my = 0
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 0.6
      my = (e.clientY / window.innerHeight - 0.5) * 0.6
    }
    window.addEventListener('mousemove', onMouse)

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    let raf: number
    const animate = () => {
      raf = requestAnimationFrame(animate)
      particles.rotation.y += 0.0002
      particles.rotation.x += 0.00008
      ico.rotation.y += 0.004; ico.rotation.x += 0.002
      ring.rotation.z += 0.003
      camera.position.x += (mx - camera.position.x) * 0.04
      camera.position.y += (-my - camera.position.y) * 0.04
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.65 }} />
}

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM CURSOR
// ═══════════════════════════════════════════════════════════════════════════════

function MagneticCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [hov, setHov] = useState(false)

  useEffect(() => {
    const dot = dotRef.current; const ring = ringRef.current
    if (!dot || !ring) return
    let cx = 0, cy = 0, dx = 0, dy = 0

    const move = (e: MouseEvent) => {
      dx = e.clientX; dy = e.clientY
      dot.style.transform = `translate(${dx - 4}px, ${dy - 4}px)`
    }
    window.addEventListener('mousemove', move)

    const loop = () => {
      cx += (dx - cx) * 0.1; cy += (dy - cy) * 0.1
      ring.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`
      requestAnimationFrame(loop)
    }
    loop()

    const els = document.querySelectorAll('a, button, [data-hover]')
    els.forEach(el => {
      el.addEventListener('mouseenter', () => setHov(true))
      el.addEventListener('mouseleave', () => setHov(false))
    })

    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      <div ref={dotRef}  className="fixed top-0 left-0 w-2 h-2 bg-[#C9A96E] rounded-full pointer-events-none z-[9999] mix-blend-difference" />
      <div ref={ringRef} className={cn('fixed top-0 left-0 rounded-full pointer-events-none z-[9998] border border-[#C9A96E] transition-all duration-300 mix-blend-difference', hov ? 'w-14 h-14 bg-[#C9A96E]/10' : 'w-10 h-10')} />
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE REVEAL
// ═══════════════════════════════════════════════════════════════════════════════

function PageReveal() {
  return (
    <motion.div
      className="fixed inset-0 z-[200] origin-top"
      style={{ background: 'linear-gradient(180deg, #0D0D0D 0%, #1A1008 100%)' }}
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const navLinks = [
    { label: 'Work',     href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About',    href: '#about' },
    { label: 'Contact',  href: '#contact' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] px-8 md:px-20 py-5 flex items-center justify-between transition-all duration-500',
          scrolled ? 'bg-[#0D0D0D]/85 backdrop-blur-2xl border-b border-[#C9A96E]/10' : ''
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border border-[#C9A96E]/60 rotate-45 group-hover:rotate-[135deg] transition-transform duration-700 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#C9A96E] rotate-45" />
          </div>
          <span className="text-white font-['Playfair_Display'] text-lg tracking-wide">Studio</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((l, i) => (
            <a
              key={i}
              href={l.href}
              className="text-[#E8DCC8]/50 hover:text-[#C9A96E] text-xs tracking-[0.25em] uppercase transition-colors duration-300 font-['Cormorant_Garamond']"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="#contact"
          className="hidden md:flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#C9A96E] border border-[#C9A96E]/40 px-5 py-2.5 hover:bg-[#C9A96E] hover:text-[#0D0D0D] transition-all duration-300 font-['Cormorant_Garamond']"
        >
          Get in touch
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }} className="w-6 h-px bg-[#C9A96E] block transition-all" />
          <motion.span animate={{ opacity: menuOpen ? 0 : 1 }} className="w-6 h-px bg-[#C9A96E] block" />
          <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }} className="w-6 h-px bg-[#C9A96E] block transition-all" />
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={  { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[99] bg-[#0D0D0D]/97 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((l, i) => (
              <motion.a
                key={i}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.2 }}
                className="text-4xl font-['Playfair_Display'] text-white hover:text-[#C9A96E] transition-colors duration-300"
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function HeroSection({ featured }: { featured: Campaign[] }) {
  const heroRef   = useRef<HTMLDivElement>(null)
  const titleRef  = useRef<HTMLDivElement>(null)
  const imageRef  = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yParallax = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const opacity   = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // ── GSAP hero entrance ─────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.3 })

      tl.fromTo('.hero-eyebrow', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
        .fromTo('.hero-char',
          { y: 140, opacity: 0, rotateX: -90 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.3, stagger: 0.03, ease: 'power4.out' },
          '-=0.4'
        )
        .fromTo('.hero-sub',  { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.6')
        .fromTo('.hero-ctas', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
        .fromTo('.hero-scroll-line', { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: 'power3.inOut' }, '-=0.4')
    }, heroRef)
    return () => ctx.revert()
  }, [])

  // ── Auto-rotate featured images ────────────────────────────────────────────
  useEffect(() => {
    if (!featured.length) return
    const id = setInterval(() => setActiveIdx(i => (i + 1) % featured.length), 4000)
    return () => clearInterval(id)
  }, [featured])

  const heroLine1 = 'Visual'
  const heroLine2 = 'Artistry'

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden flex items-center">

      {/* ── Background slideshow ────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-[1]">
        <AnimatePresence mode="wait">
          {featured.map((c, i) =>
            i === activeIdx && c.heroImage ? (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1,  scale: 1 }}
                exit={{   opacity: 0,  scale: 0.98 }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={getOptimizedImageUrl(c.heroImage, { width: 1920, height: 1080 })}
                  alt={c.title}
                  fill priority
                  className="object-cover"
                  sizes="100vw"
                />
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        {/* Layered overlays */}
        <div className="absolute inset-0 bg-gradient-to-t  from-[#0D0D0D] via-[#0D0D0D]/55 to-[#0D0D0D]/10" />
        <div className="absolute inset-0 bg-gradient-to-r  from-[#0D0D0D]/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[#0D0D0D]/20" />
      </div>

      {/* ── Slide indicators ───────────────────────────────────────────────── */}
      {featured.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[3] flex gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={cn('h-px transition-all duration-500', i === activeIdx ? 'w-10 bg-[#C9A96E]' : 'w-4 bg-[#E8DCC8]/30')}
            />
          ))}
        </div>
      )}

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <motion.div
        style={{ opacity }}
        className="relative z-[2] w-full px-8 md:px-20 max-w-[1600px] mx-auto pt-32"
      >
        {/* Eyebrow */}
        <div className="hero-eyebrow flex items-center gap-3 mb-8">
          <span className="w-10 h-px bg-[#C9A96E]" />
          <span className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond']">
            Photography & Creative Direction
          </span>
        </div>

        {/* Main title — split chars */}
        <div ref={titleRef} className="mb-10" style={{ perspective: '1000px' }}>
          <div className="overflow-hidden">
            <h1 className="text-[clamp(4rem,12vw,12rem)] font-['Playfair_Display'] font-black leading-[0.85] text-white">
              {heroLine1.split('').map((ch, i) => (
                <span key={i} className="hero-char inline-block" style={{ transformOrigin: 'bottom center' }}>{ch}</span>
              ))}
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="text-[clamp(4rem,12vw,12rem)] font-['Playfair_Display'] font-black leading-[0.85]"
                style={{ WebkitTextStroke: '1px #C9A96E', color: 'transparent' }}>
              {heroLine2.split('').map((ch, i) => (
                <span key={i} className="hero-char inline-block" style={{ transformOrigin: 'bottom center' }}>{ch}</span>
              ))}
            </h1>
          </div>
        </div>

        {/* Sub + CTA row */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-10 md:gap-20">
          <p className="hero-sub text-[#E8DCC8]/60 text-base md:text-lg leading-relaxed max-w-sm font-['Cormorant_Garamond'] font-light">
            Crafting visual narratives that transcend the ordinary — where light, form, and emotion converge into timeless imagery.
          </p>
          <div className="hero-ctas flex flex-wrap items-center gap-4">
            <Link
              href="#work"
              className="group flex items-center gap-3 bg-[#C9A96E] text-[#0D0D0D] text-xs tracking-[0.3em] uppercase px-8 py-4 font-['Cormorant_Garamond'] hover:bg-[#E8DCC8] transition-colors duration-300"
            >
              View Work
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
            <Link
              href="#services"
              className="flex items-center gap-3 border border-[#C9A96E]/40 text-[#C9A96E] text-xs tracking-[0.3em] uppercase px-8 py-4 font-['Cormorant_Garamond'] hover:border-[#C9A96E] transition-colors duration-300"
            >
              Our Services
            </Link>
          </div>
        </div>

        {/* Active campaign title */}
        {featured[activeIdx] && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{   opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-16 flex items-center gap-4"
            >
              <span className="text-[#C9A96E]/40 text-xs tracking-[0.3em] uppercase">Now viewing</span>
              <span className="text-[#E8DCC8]/60 text-sm font-['Cormorant_Garamond']">{featured[activeIdx].title}</span>
              <Link
                href={`/campaigns/${typeof featured[activeIdx].slug === 'string' ? featured[activeIdx].slug : featured[activeIdx].slug?.current}`}
                className="text-[#C9A96E] text-xs hover:underline underline-offset-4"
              >
                Open →
              </Link>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute right-8 bottom-20 z-[2] flex flex-col items-center gap-3">
        <span className="text-[#C9A96E]/40 text-[9px] tracking-[0.4em] uppercase" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
        <div className="hero-scroll-line w-px h-20 bg-gradient-to-b from-[#C9A96E]/50 to-transparent origin-top relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-[#C9A96E]"
            animate={{ height: ['0%', '100%'], opacity: [1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATS STRIP
// ═══════════════════════════════════════════════════════════════════════════════

function StatsStrip({ totalCampaigns }: { totalCampaigns: number }) {
  const ref = useRef<HTMLDivElement>(null)

  const stats = [
    { value: totalCampaigns, suffix: '+', label: 'Campaigns' },
    { value: 2,   suffix: '+', label: 'Years Experience' },
    { value: 20, suffix: '+', label: 'Happy Clients' },
    { value: 4,   suffix: '',  label: 'Services' },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      stats.forEach((s, i) => {
        const el = document.querySelector(`.stat-num-${i}`)
        if (!el) return
        const obj = { v: 0 }
        gsap.to(obj, {
          v: s.value,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
          onUpdate: () => { el.textContent = Math.ceil(obj.v) + s.suffix },
        })
      })

      gsap.fromTo('.stat-item',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%' } }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="relative py-16 border-y border-[#C9A96E]/10 overflow-hidden">
      {/* Background grain */}
      <div className="absolute inset-0 bg-[#1A1008]/30" />
      <div className="relative max-w-[1600px] mx-auto px-8 md:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="stat-item text-center md:text-left">
              <div className={`stat-num-${i} text-5xl md:text-6xl font-['Playfair_Display'] font-bold text-[#C9A96E]`}>0</div>
              <div className="text-[#E8DCC8]/40 text-xs tracking-[0.25em] uppercase mt-1 font-['Cormorant_Garamond']">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES SECTION  ← الجزء الأهم — كل service بشخصيتها
// ═══════════════════════════════════════════════════════════════════════════════

const SERVICE_ACCENTS = [
  { color: '#C9A96E', dim: '#8B7355', number: '01' },
  { color: '#E8DCC8', dim: '#A89880', number: '02' },
  { color: '#8B7355', dim: '#6B5840', number: '03' },
  { color: '#C9A96E', dim: '#8B7355', number: '04' },
  { color: '#E8DCC8', dim: '#A89880', number: '05' },
]


function MarqueeStrip() {
  const text = 'PHOTOGRAPHY — CREATIVE DIRECTION — VISUAL STORYTELLING — CAMPAIGNS — EDITORIAL — PORTRAITS —'
  return (
    <div className="relative py-5 overflow-hidden border-y border-[#C9A96E]/15">
      <div className="absolute inset-0 bg-[#1A1008]/20" />
      <motion.div
        className="flex gap-0 whitespace-nowrap relative"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-[#C9A96E]/25 text-xs tracking-[0.45em] uppercase font-['Cormorant_Garamond'] flex-shrink-0 px-8">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// WORK / CAMPAIGNS GRID
// ═══════════════════════════════════════════════════════════════════════════════

function CampaignCard({ campaign, index }: { campaign: Campaign; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const slug = typeof campaign.slug === 'string' ? campaign.slug : campaign.slug?.current

  // Alternating sizes for visual rhythm
  const isLarge  = index % 5 === 0
  const isMedium = index % 5 === 2

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current,
        { opacity: 0, y: 50, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 88%' },
          delay: (index % 3) * 0.1,
        }
      )
    })
    return () => ctx.revert()
  }, [index])

  return (
    <motion.div
      ref={ref}
      className={cn(
        'group relative overflow-hidden cursor-pointer',
        isLarge  ? 'md:col-span-2 md:row-span-2' : '',
        isMedium ? 'md:col-span-1 md:row-span-2' : '',
      )}
    >
      <Link href={`/campaigns/${slug}`}>
        <div
          className="relative overflow-hidden bg-[#1A1008]"
          style={{ aspectRatio: isLarge ? '16/9' : isMedium ? '3/4' : '4/5' }}
        >
          {/* Image */}
          {campaign.heroImage && (
            <Image
              src={getOptimizedImageUrl(campaign.heroImage, { width: isLarge ? 1200 : 700, height: isLarge ? 675 : 900 })}
              alt={campaign.title}
              fill
              className={cn('object-cover transition-all duration-700 group-hover:scale-106', loaded ? 'opacity-100' : 'opacity-0')}
              sizes={isLarge ? '(max-width:768px) 100vw, 66vw' : '(max-width:768px) 100vw, 33vw'}
              onLoad={() => setLoaded(true)}
            />
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/90 via-[#0D0D0D]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Service badge */}
          {campaign.service?.title && (
            <div className="absolute top-4 left-4 bg-[#0D0D0D]/70 backdrop-blur-sm border border-[#C9A96E]/20 px-3 py-1">
              <span className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase font-['Cormorant_Garamond']">
                {campaign.service.title}
              </span>
            </div>
          )}

          {/* Featured star */}
          {campaign.featured && (
            <div className="absolute top-4 right-4 w-7 h-7 bg-[#C9A96E] flex items-center justify-center">
              <span className="text-[#0D0D0D] text-xs">★</span>
            </div>
          )}

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-white font-['Playfair_Display'] font-bold text-lg leading-tight mb-1">
                  {campaign.title}
                </h3>
                <p className="text-[#E8DCC8]/50 text-xs font-['Cormorant_Garamond'] line-clamp-1">
                  {campaign.shortDescription}
                </p>
              </div>
              <div className="flex-shrink-0 w-9 h-9 border border-[#C9A96E]/50 flex items-center justify-center text-[#C9A96E] opacity-0 group-hover:opacity-100 transition-all duration-400 group-hover:bg-[#C9A96E] group-hover:text-[#0D0D0D]">
                →
              </div>
            </div>
          </div>

          {/* Gold scan line on hover */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-[#C9A96E]/40 pointer-events-none"
            initial={{ top: '0%' }}
            whileHover={{ top: '100%' }}
            transition={{ duration: 0.8, ease: 'linear' }}
          />
        </div>

        {/* Bottom meta */}
        <div className="flex items-center justify-between pt-3 px-1">
          <span className="text-[#E8DCC8]/30 text-[10px] tracking-[0.2em] uppercase font-['Cormorant_Garamond']">
            {campaign.clientName || 'Client'}
            {campaign.year && ` · ${campaign.year}`}
          </span>
          <span className="text-[#C9A96E]/40 text-[10px] font-['Cormorant_Garamond']">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}


function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-el',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: 'top 75%' } }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" ref={ref} className="py-40 px-8 md:px-20">
      <div className="max-w-[1600px] mx-auto">
        <div className="relative border border-[#C9A96E]/15 p-12 md:p-24 overflow-hidden">

          {/* Corner decorations */}
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((p, i) => (
            <div key={i} className={`absolute ${p} w-10 h-10`}>
              <div className={`absolute w-full h-px bg-[#C9A96E] ${i < 2 ? 'top-0' : 'bottom-0'}`} />
              <div className={`absolute h-full w-px bg-[#C9A96E] ${i % 2 === 0 ? 'left-0' : 'right-0'}`} />
            </div>
          ))}

          {/* BG text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[20vw] font-['Playfair_Display'] font-black text-white/[0.02]">Hello</span>
          </div>

          <div className="relative z-10 text-center">
            <div className="contact-el flex items-center justify-center gap-3 mb-6">
              <span className="w-12 h-px bg-[#C9A96E]" />
              <span className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond']">Get In Touch</span>
              <span className="w-12 h-px bg-[#C9A96E]" />
            </div>

            <h2 className="contact-el text-5xl md:text-7xl font-['Playfair_Display'] font-bold text-white leading-tight mb-4">
              Let's Create<br />
              <span style={{ WebkitTextStroke: '1px #C9A96E', color: 'transparent' }}>Together</span>
            </h2>

            <p className="contact-el text-[#E8DCC8]/50 text-base font-['Cormorant_Garamond'] font-light mb-12 max-w-sm mx-auto">
              Ready to tell your story? Let's discuss how we can bring your vision to life.
            </p>

            <div className="contact-el flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:hello@studio.com"
                className="group flex items-center gap-3 bg-[#C9A96E] text-[#0D0D0D] text-xs tracking-[0.3em] uppercase px-10 py-4 font-['Cormorant_Garamond'] hover:bg-[#E8DCC8] transition-colors duration-300"
              >
                Send a Message
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 border border-[#C9A96E]/40 text-[#C9A96E] text-xs tracking-[0.3em] uppercase px-10 py-4 font-['Cormorant_Garamond'] hover:border-[#C9A96E] transition-colors duration-300"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}





// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [featured,  setFeatured]  = useState<Campaign[]>([])
  const [services,  setServices]  = useState<Service[]>([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [all, feat] = await Promise.all([
          getAllCampaigns(),
          getFeaturedCampaigns(),
        ])
        setCampaigns(all)
        setFeatured(feat.length ? feat : all.slice(0, 3))

        // Derive unique services from campaigns (sorted by first appearance)
        const seen = new Map<string, Service>()
        all.forEach(c => { if (c.service && !seen.has(c.service._id)) seen.set(c.service._id, c.service) })
        setServices(Array.from(seen.values()))
      } catch (e) {
        console.error('Failed to load data:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => { document.documentElement.style.scrollBehavior = '' }
  }, [])

  if (loading) return <Loader />

  return (
    <>
      {/* ── Global styles ──────────────────────────────────────────────────── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

        html { background-color: #0D0D0D; }

        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-track { background: #0D0D0D; }
        ::-webkit-scrollbar-thumb { background: #C9A96E; }
        ::selection { background: #C9A96E; color: #0D0D0D; }

        * { cursor: none !important; }
        @media (max-width: 768px) { * { cursor: auto !important; } }
      `}</style>

      {/* ── Page reveal ───────────────────────────────────────────────────── */}
      <PageReveal />

      {/* ── Custom cursor (desktop only) ──────────────────────────────────── */}
      <div className="hidden md:block">
        <MagneticCursor />
      </div>

      {/* ── Three.js background ───────────────────────────────────────────── */}
      <ThreeBackground />

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <main className="relative z-[10]">
        <HeroSection featured={featured} />

        <StatsStrip totalCampaigns={campaigns.length} />

        <MarqueeStrip />

        <ServicesSection services={services} campaigns={campaigns} />

        <MarqueeStrip />

        <WorkSection campaigns={campaigns} />

        <AboutStrip />

        <ContactSection />

        <Footer services={services} />
      </main>
    </>
  )
}