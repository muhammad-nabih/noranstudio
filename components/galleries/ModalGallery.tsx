'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import gsap from 'gsap'
import type { ImageAsset } from '@/lib/types'
import { urlFor } from '@/lib/sanity'

interface ModalGalleryProps {
  images: Array<{ image: ImageAsset; alt?: string }>
  title?: string
}

export function ModalGallery({ images, title }: ModalGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="w-full px-6 py-2 bg-primary hover:bg-primary/90 rounded-lg font-semibold transition-colors text-primary-foreground"
      >
        View Gallery
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="relative w-full max-w-4xl max-h-[90vh]">
                {/* Close button */}
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="absolute -top-10 right-0 z-10 text-white hover:text-primary transition-colors"
                >
                  <X size={32} />
                </motion.button>

                {/* Image container */}
                <div className="relative w-full bg-black rounded-lg overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="relative w-full h-[400px] md:h-[600px]"
                    >
                      <Image
                        src={urlFor(images[currentIndex].image).url()}
                        alt={images[currentIndex].alt || `Gallery image ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation buttons */}
                  {images.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-primary/80 hover:bg-primary rounded-full transition-colors"
                      >
                        <ChevronLeft className="text-primary-foreground" size={24} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-primary/80 hover:bg-primary rounded-full transition-colors"
                      >
                        <ChevronRight className="text-primary-foreground" size={24} />
                      </motion.button>

                      {/* Counter */}
                      <div className="absolute bottom-4 left-4 z-10 text-white text-sm font-semibold">
                        {currentIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setCurrentIndex(index)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                          currentIndex === index
                            ? 'ring-2 ring-primary'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={urlFor(img.image).url()}
                          alt={img.alt || `Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
