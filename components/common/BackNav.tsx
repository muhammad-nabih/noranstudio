

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

function BackNav() {
    const [scrolled, setScrolled] = useState(false)
  
    useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > 50)
      window.addEventListener('scroll', onScroll)
      return () => window.removeEventListener('scroll', onScroll)
    }, [])
  
    return (
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] px-8 md:px-20 py-6 flex items-center justify-between transition-all duration-500',
          scrolled ? 'bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-[#C9A96E]/10' : ''
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-3 text-[#E8DCC8]/60 hover:text-[#C9A96E] transition-colors duration-300 text-sm tracking-[0.15em] uppercase group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
          Back
        </Link>
  
        <div className="text-[#C9A96E]/40 text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond']">
          Portfolio
        </div>
      </motion.nav>
    )
  }


  export default BackNav; 