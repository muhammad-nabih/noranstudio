'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { cn } from '@/lib/utils'

import type { Service, Campaign } from '@/lib/types'

interface ServicesSectionProps {
  services: Service[]
  campaigns: Campaign[]
}

type CardSize = 'large' | 'small' | 'wide'

interface SlottedService {
  _id: string
  title: string
  description?: string
  order?: number
  size: CardSize
  index: number
  campaignCount: number
  coverImageUrl?: string
}

export default function ServicesSection({ services, campaigns }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef    = useRef<HTMLDivElement>(null)
  const cardsRef   = useRef<HTMLDivElement>(null)

  const derivedServices: Service[] = services.length > 0
    ? services
    : Array.from(
        new Map(
          campaigns
            .filter(c => c.service)
            .map(c => [c.service._id, c.service])
        ).values()
      )

  const slotted: SlottedService[] = derivedServices.map((svc, i) => {
    const svcProjects = campaigns.filter(c => c.service?._id === svc._id)
    const coverImageUrl = svcProjects[0]?.heroImage?.asset?.url ?? undefined

    let size: CardSize = 'small'
    if (i === 0) size = 'large'
    else if (derivedServices.length >= 3 && i === derivedServices.length - 1) size = 'wide'
    else size = 'small'

    return {
      _id: svc._id,
      title: svc.title,
      description: svc.description,
      order: svc.order,
      size,
      index: i,
      campaignCount: svcProjects.length,
      coverImageUrl,
    }
  })

  const totalStr = String(derivedServices.length).padStart(2, '0')

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Animations...
      gsap.fromTo('.sv-eyebrow-line',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )
      gsap.fromTo('.sv-eyebrow-text, .sv-eyebrow-count',
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )
      gsap.fromTo('.sv-rotated-label',
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )
      gsap.fromTo('.sv-title-line',
        { yPercent: 110 },
        { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.15, delay: 0.1,
          scrollTrigger: { trigger: headRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.sv-divider',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 1.2, ease: 'power3.inOut', delay: 0.3,
          scrollTrigger: { trigger: headRef.current, start: 'top 82%' } }
      )
      gsap.fromTo('.sv-desc',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', delay: 0.4,
          scrollTrigger: { trigger: headRef.current, start: 'top 82%' } }
      )
      const cards = cardsRef.current?.querySelectorAll('.sv-card')
      if (cards?.length) {
        gsap.fromTo(cards,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: cardsRef.current, start: 'top 78%' } }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [derivedServices.length])

  // Helper to build grid layout based on number of services
  const renderGrid = () => {
    const count = slotted.length
    if (count === 1) {
      return (
        <div className="grid grid-cols-1">
          <ServiceCardShell svc={slotted[0]} isLarge />
        </div>
      )
    }
    if (count === 2) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          {slotted.map(svc => <ServiceCardShell key={svc._id} svc={svc} />)}
        </div>
      )
    }
    if (count === 3) {
      // Large on left, two small on right stacked
      return (
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-0.5">
          <ServiceCardShell svc={slotted[0]} isLarge />
          <div className="flex flex-col gap-0.5">
            {slotted.slice(1).map(svc => <ServiceCardShell key={svc._id} svc={svc} />)}
          </div>
        </div>
      )
    }
    if (count === 4) {
      // Large top-left, two small right, wide bottom
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 auto-rows-min">
          <div className="md:row-span-2">
            <ServiceCardShell svc={slotted[0]} isLarge />
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-0.5">
            {slotted.slice(1, 3).map(svc => <ServiceCardShell key={svc._id} svc={svc} />)}
            <div className="md:col-span-2">
              <ServiceCardShell svc={slotted[3]} isWide />
            </div>
          </div>
        </div>
      )
    }
    // 5+ services: first large, next two small, then a wide, then rest in pairs
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 auto-rows-min">
        <div className="md:row-span-2">
          <ServiceCardShell svc={slotted[0]} isLarge />
        </div>
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-0.5">
          {slotted.slice(1, 3).map(svc => <ServiceCardShell key={svc._id} svc={svc} />)}
          {slotted[3] && <div className="md:col-span-2"><ServiceCardShell svc={slotted[3]} isWide /></div>}
          {slotted.length > 4 && (
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-0.5 mt-0.5">
              {slotted.slice(4).map(svc => <ServiceCardShell key={svc._id} svc={svc} />)}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-28 md:py-40 overflow-hidden bg-background "
    >
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(243,121,167,0.013) 80px, rgba(243,121,167,0.013) 81px),
            repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(243,121,167,0.013) 80px, rgba(243,121,167,0.013) 81px)
          `,
        }}
      />
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/4 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="relative z-10 max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-12">
          <span className="sv-eyebrow-line block w-10 h-px bg-primary origin-left" />
          <span className="sv-eyebrow-text text-primary text-[10px] tracking-[0.5em] uppercase font-['Cormorant_Garamond'] opacity-0">
            What We Do
          </span>
          <span className="sv-eyebrow-count ml-auto font-['Playfair_Display'] italic text-[13px] text-foreground/20 tracking-[0.1em] opacity-0">
            {totalStr} disciplines
          </span>
        </div>

        {/* Heading block */}
        <div ref={headRef} className="grid grid-cols-[auto_1fr] gap-x-12 items-end mb-16 md:mb-20">
          <div
            className="sv-rotated-label opacity-0 hidden md:flex"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              fontSize: '10px',
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.15)',
              paddingBottom: '8px',
              borderLeft: '1px solid rgba(243,121,167,0.18)',
              paddingLeft: '14px',
              alignSelf: 'stretch',
              alignItems: 'center',
            }}
          >
            Noran Elgeneady · Studio
          </div>

          <div className="flex flex-col gap-6">
            <h2
              className="font-['Playfair_Display'] font-bold leading-[0.92] text-foreground"
              style={{ fontSize: 'clamp(52px, 7.5vw, 88px)' }}
            >
              <div className="overflow-hidden"><span className="sv-title-line block">Our</span></div>
              <div className="overflow-hidden">
                <span className="sv-title-line block" style={{ color: 'transparent', WebkitTextStroke: '1px var(--primary, #f379a7)' }}>
                  Services
                </span>
              </div>
            </h2>

            <div className="flex items-end gap-8">
              <div className="sv-divider h-px bg-gradient-to-r from-primary to-transparent w-20 origin-left" />
              <p className="sv-desc font-['Playfair_Display'] italic text-base md:text-lg text-foreground/40 leading-relaxed border-l-2 border-primary/25 pl-5 max-w-sm opacity-0">
                Each discipline approached with the same obsessive attention to craft
              </p>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div ref={cardsRef} className="services-grid">
          {renderGrid()}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   ServiceCardShell (Improved Hover & Symmetry)
───────────────────────────────────────────────────────── */
interface ShellProps {
  svc: SlottedService
  isLarge?: boolean
  isWide?: boolean
}

function ServiceCardShell({ svc, isLarge, isWide }: ShellProps) {
  const idxLabel  = String(svc.index + 1).padStart(2, '0')
  const minH      = isLarge ? 'min-h-[520px] md:min-h-[580px]' : isWide ? 'min-h-[260px]' : 'min-h-[320px]'
  const titleSize = isLarge ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'

  return (
    <div
      className={cn(
        'sv-card group relative overflow-hidden bg-background cursor-pointer mb-',
        'border border-primary/5 hover:border-primary/25',
        'flex flex-col justify-end',
        'p-6 md:p-8',
        'transition-all duration-500 ease-out',
        minH,
      )}
    >
      {/* Cover image with improved reveal */}
      {svc.coverImageUrl && (
        <div className="absolute inset-0 z-0 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100 opacity-50">
          <Image
            src={svc.coverImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
      )}

      {/* Overlay — softer on hover, text remains readable */}
      <div
        className="absolute inset-0 z-[1] transition-colors duration-500"
        style={{
          background: `linear-gradient(to top, 
            rgba(3,2,2,0.95) 0%, 
            rgba(3,2,2,0.6) 50%, 
            rgba(3,2,2,0.2) 100%)`,
        }}
      />

      {/* Top metadata */}
      <span className="absolute top-5 left-6 z-[4] font-['Playfair_Display'] italic text-[11px] text-primary/40 group-hover:text-primary/70 transition-colors duration-300">
        — {idxLabel}
      </span>

      {/* Content */}
      <div className={cn('relative z-[4]', isWide && 'flex items-end justify-between gap-6 flex-wrap')}>
        <div className="flex flex-col">
          <h3 className={cn(
            "font-['Playfair_Display'] font-bold text-foreground leading-tight mb-3 transition-colors duration-300",
            titleSize,
          )}>
            {svc.title}
          </h3>

          {!isWide && svc.description && (
            <p className="font-['Cormorant_Garamond'] font-light text-sm md:text-base leading-relaxed text-foreground/50 group-hover:text-foreground/80 transition-colors duration-500 max-w-[320px]">
              {svc.description}
            </p>
          )}
        </div>

        {/* Footer row */}
        <div className={cn(
          'flex items-center justify-between gap-4 w-full',
          !isWide && 'mt-5 pt-4 border-t border-primary/10 group-hover:border-primary/25 transition-colors duration-500',
        )}>
          {!isWide && (
            <span className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 group-hover:text-primary/60 transition-colors duration-400">
              {svc.campaignCount > 0 ? `${svc.campaignCount} project${svc.campaignCount > 1 ? 's' : ''}` : 'Explore'}
            </span>
          )}
          <div className="w-9 h-9 border border-primary/20 flex items-center justify-center text-primary/40 text-lg group-hover:bg-primary/10 group-hover:border-primary/40 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 rounded-sm">
            →
          </div>
        </div>
      </div>
    </div>
  )
}