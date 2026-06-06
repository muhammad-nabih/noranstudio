'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

import type { Service, Campaign } from '@/lib/types'
import ServiceCard from './ServiceCard'

interface ServicesSectionProps {
  services: Service[]
  campaigns: Campaign[]
}

export default function ServicesSection({ services, campaigns }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const derivedServices: Service[] = services.length > 0
    ? services
    : Array.from(
        new Map(campaigns.filter(c => c.service).map(c => [c.service._id, c.service])).values()
      )

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // ظهور الهيدر
      gsap.fromTo(headingRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' } }
      )

      // ظهور الوصف (مؤخر قليلاً)
      gsap.fromTo(descriptionRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.25, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' } }
      )

      // ظهور البطاقات متتابع
      const cards = gridRef.current?.querySelectorAll('.service-card-animate')
      if (cards && cards.length) {
        gsap.fromTo(cards,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'back.out(0.4)',
            scrollTrigger: { trigger: gridRef.current, start: 'top 80%' } }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [derivedServices.length])

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-32 md:py-40 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D] to-[#1A1008]/20"
    >
      {/* عناصر خلفية فاخرة */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#C9A96E]/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[#8B7355]/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-[1600px] mx-auto">
        {/* الهيدر - بنفس الشكل القديم الجميل */}
        <div ref={headingRef} className="mb-24 md:mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <span className="w-12 h-px bg-[#C9A96E]" />
                <span className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] font-semibold">
                  What We Do
                </span>
              </div>
              {/* الهيدر القديم بالضبط */}
              <h2 className="text-5xl md:text-7xl font-['Playfair_Display'] font-bold text-white leading-tight">
                Our<br />
                <span style={{ WebkitTextStroke: '1px #C9A96E', color: 'transparent' }}>
                  Services
                </span>
              </h2>
            </div>

            {/* الوصف المحسن - ناعم وكبير وأنيق */}
            <div ref={descriptionRef} className="max-w-md md:max-w-sm lg:max-w-md">
              <p className="font-['Playfair_Display'] text-lg md:text-xl text-[#E8DCC8]/80 italic leading-relaxed border-l-2 border-[#C9A96E]/40 pl-6">
                Each discipline approached with the same obsessive attention to craft
              </p>
              <p className="font-['Cormorant_Garamond'] text-base text-[#E8DCC8]/50 mt-4 tracking-wide">
                From intimate portraiture to large-scale commercial campaigns — every frame, every curve, every detail refined until it breathes.
              </p>
            </div>
          </div>
        </div>

        {/* شبكة الخدمات */}
        <div
          ref={gridRef}
          className={cn(
            'grid gap-8 lg:gap-10',
            derivedServices.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' :
            derivedServices.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
            derivedServices.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
            derivedServices.length === 4 ? 'grid-cols-1 md:grid-cols-2' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {derivedServices.map((svc, i) => (
            <div key={svc._id} className="service-card-animate">
              <ServiceCard
                service={svc}
                campaigns={campaigns}
                index={i}
                project={campaigns[i % campaigns.length]}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}