// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import cn from 'classnames';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { label: 'studio',     href: '/campaigns' },
    { label: 'Work',       href: '#work' },
    { label: 'Services',   href: '#services' },
    { label: 'About',      href: '#about' },
    { label: 'Contact',    href: '#contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
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
          <span className="text-white font-['Playfair_Display'] text-lg tracking-wide">Noran Studio</span>
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
          aria-label="Open menu"
          type="button"
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
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
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
                exit={{ opacity: 0, y: 20 }}
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
  );
}

export default Navbar;