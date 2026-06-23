"use client";

import { motion } from "framer-motion";

// lucide-react ships only generic glyphs, so brand marks are drawn as
// minimal custom SVGs to match the reference exactly.

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.2c0-.9.25-1.5 1.6-1.5H16.6V4.1C16.1 4 15.07 3.9 13.9 3.9c-2.5 0-4.2 1.5-4.2 4.3v2.3H7v3h2.7V21h3.8z" />
    </svg>
  );
}

function BehanceIcon() {
  return (
    <span className="text-[13px] font-bold leading-none tracking-tight">
      Be
    </span>
  );
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.8h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.36 4.78 5.43V21h-4v-5.3c0-1.27-.02-2.9-1.77-2.9-1.78 0-2.06 1.39-2.06 2.81V21h-4V9z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const SOCIALS = [
  { label: "Facebook", href: "#", icon: <FacebookIcon /> },
  { label: "Behance", href: "#", icon: <BehanceIcon /> },
  { label: "LinkedIn", href: "#", icon: <LinkedinIcon /> },
  { label: "Instagram", href: "#", icon: <InstagramIcon /> },
];

export default function SocialRail() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
      className="absolute left-0 top-1/2 z-30 hidden -translate-y-[220px] flex-col md:flex "
    >
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          aria-label={s.label}
          className="flex h-14 w-14 items-center justify-center text-foreground/80 transition-colors duration-300 hover:text-accent"
        >
          {s.icon}
        </a>
      ))}
    </motion.div>
  );
}
