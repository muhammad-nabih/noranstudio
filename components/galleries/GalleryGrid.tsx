'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ModalGallery } from './ModalGallery'
import { urlFor } from '@/lib/sanity'
import type { Gallery } from '@/lib/types'

gsap.registerPlugin(ScrollTrigger)

interface GalleryGridProps {
  galleries: Gallery[]
}

export function GalleryGrid({ galleries }: GalleryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const items = containerRef.current.querySelectorAll('[data-gallery-item]')

    items.forEach((item, index) => {
      gsap.fromTo(
        item,
        {
          opacity: 0,
          y: 50,
          rotationX: 90,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [galleries])

  return (
    <div ref={containerRef} className="space-y-12">
      {galleries.map((gallery, index) => (
        <motion.div
          key={gallery._id}
          data-gallery-item
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          className="space-y-4"
        >
          <div>
            <h3 className="text-3xl font-bold mb-2">{gallery.title}</h3>
            {gallery.description && (
              <p className="text-muted-foreground">{gallery.description}</p>
            )}
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.images?.slice(0, 4).map((img, imgIndex) => (
              <motion.div
                key={imgIndex}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative h-48 rounded-lg overflow-hidden cursor-pointer group"
              >
                <Image
                  src={urlFor(img.image).url()}
                  alt={img.alt || `Gallery image ${imgIndex + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold">View More</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View all button */}
          {gallery.images && gallery.images.length > 0 && (
            <div className="pt-4">
              <ModalGallery
                images={gallery.images}
                title={gallery.title}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
