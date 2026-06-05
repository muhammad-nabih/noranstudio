'use client'

import type { Service } from '@/lib/types'
export default function Footer({ services }: { services: Service[] }) {
    return (
      <footer className="border-t border-[#C9A96E]/10 py-16 px-8 md:px-20">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 border border-[#C9A96E]/60 rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#C9A96E] rotate-45" />
              </div>
              <span className="text-white font-['Playfair_Display'] text-lg">Studio</span>
            </div>
            <p className="text-[#E8DCC8]/30 text-xs leading-relaxed font-['Cormorant_Garamond'] font-light max-w-[200px]">
              Visual artistry crafted with purpose and passion.
            </p>
          </div>
  
          {/* Services list */}
          <div>
            <div className="text-[#C9A96E]/50 text-xs tracking-[0.3em] uppercase mb-5 font-['Cormorant_Garamond']">Services</div>
            <div className="flex flex-col gap-2">
              {services.map((s, i) => (
                <a
                  key={i}
                  href="#services"
                  className="text-[#E8DCC8]/30 hover:text-[#C9A96E] text-sm font-['Cormorant_Garamond'] transition-colors duration-300"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>
  
          {/* Links */}
          <div>
            <div className="text-[#C9A96E]/50 text-xs tracking-[0.3em] uppercase mb-5 font-['Cormorant_Garamond']">Navigate</div>
            <div className="flex flex-col gap-2">
              {['Work', 'Services', 'About', 'Contact'].map((l, i) => (
                <a key={i} href={`#${l.toLowerCase()}`} className="text-[#E8DCC8]/30 hover:text-[#C9A96E] text-sm font-['Cormorant_Garamond'] transition-colors duration-300">
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
  
        <div className="max-w-[1600px] mx-auto mt-12 pt-8 border-t border-[#C9A96E]/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[#E8DCC8]/20 text-xs tracking-[0.2em] uppercase font-['Cormorant_Garamond']">
            © {new Date().getFullYear()} Studio. All rights reserved.
          </span>
          <div className="flex items-center gap-2">
            <span className="w-4 h-px bg-[#C9A96E]/30" />
            <span className="text-[#C9A96E]/30 text-xs tracking-[0.3em] uppercase font-['Cormorant_Garamond']">Photography & Creative Direction</span>
          </div>
        </div>
      </footer>
    )
  }
  