'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { getOptimizedImageUrl } from '@/lib/image-optimization'
import type { Service, Campaign } from '@/lib/types'

interface ServiceCardProps {
  service: Service
  campaigns: Campaign[]
  index: number
  project?: Campaign
}

const SERVICE_ACCENTS = [
  { number: '01', color: '#C9A96E', dim: '#C9A96E80' },
  { number: '02', color: '#D4B97A', dim: '#D4B97A80' },
  { number: '03', color: '#BF9E5F', dim: '#BF9E5F80' },
  { number: '04', color: '#A8884D', dim: '#A8884D80' },
]

export function ServiceCard({ service, campaigns, index, project }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const accent = SERVICE_ACCENTS[index % SERVICE_ACCENTS.length]

  // Get campaigns that belong to this service (limit to 2 for layout)
  const svcCampaigns = campaigns.filter(c => c.service?._id === service._id).slice(0, 2)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: cardRef.current, start: 'top 82%' },
          delay: index * 0.12,
        }
      )
    })
    return () => ctx.revert()
  }, [index])

  // Image parallax only on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !imgRef.current) return
    const { left, top, width, height } = cardRef.current.getBoundingClientRect()
    const nx = ((e.clientX - left) / width - 0.5) * 8
    const ny = ((e.clientY - top) / height - 0.5) * 8
    gsap.to(imgRef.current, { x: nx, y: ny, duration: 0.6, ease: 'power2.out' })
  }

  const handleMouseLeave = () => {
    if (!imgRef.current) return
    gsap.to(imgRef.current, { x: 0, y: 0, duration: 0.8, ease: 'power3.out' })
    setIsHovered(false)
  }

  const slugOf = (c: Campaign) => typeof c.slug === 'string' ? c.slug : c.slug?.current
  const displayImage = project?.heroImage || svcCampaigns[0]?.heroImage

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-sm bg-[#1A1008]/40 border border-[#C9A96E]/10 hover:border-[#C9A96E]/30 transition-all duration-500 overflow-hidden"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 z-20" style={{ background: accent.color }} />

      {/* Image Section (without overlay) */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
        {displayImage ? (
          <div ref={imgRef} className="w-full h-full">
            <Image
              src={getOptimizedImageUrl(displayImage, { width: 600, height: 450 })}
              alt={service.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-[#0D0D0D]" />
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-px" style={{ background: accent.color }} />
              <span className="text-[10px] tracking-[0.3em] uppercase font-['Cormorant_Garamond']" style={{ color: accent.dim }}>
                Service
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-['Playfair_Display'] font-bold text-white">
              {service.title}
            </h3>
          </div>
          <div
            className="w-8 h-8 border flex items-center justify-center transition-all duration-300 group-hover:rotate-45"
            style={{ borderColor: `${accent.color}40`, color: accent.color }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        <p className="text-[#E8DCC8]/60 text-sm leading-relaxed font-['Cormorant_Garamond'] font-light line-clamp-2">
          {service.description}
        </p>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 delay-100 z-20" style={{ background: `${accent.color}60` }} />

      {/* FULL CARD OVERLAY (blur + dark) on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(6px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-[#0D0D0D]/80 flex flex-col items-center justify-center gap-5 z-30"
          >
            {/* Square-style buttons with arrows */}
            <Link
              href={`/campaigns/${project?.slug?.current}`}
         
              className="group/btn w-56 flex items-center justify-between px-6 py-3 border border-[#C9A96E]/40 bg-transparent hover:bg-[#C9A96E]/10 transition-all duration-300 rounded-sm text-[#E8DCC8] text-sm uppercase tracking-[0.15em] font-['Cormorant_Garamond']"
         
            >
              <span>View Portfolio</span>
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            {project?.behanceUrl && (
              <Link
                href={project.behanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn w-56 flex items-center justify-between px-6 py-3 border border-[#C9A96E]/40 bg-transparent hover:bg-[#C9A96E]/10 transition-all duration-300 rounded-sm text-[#E8DCC8] text-sm uppercase tracking-[0.15em] font-['Cormorant_Garamond']"
              >
                <span>View on Behance</span>
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ServiceCard