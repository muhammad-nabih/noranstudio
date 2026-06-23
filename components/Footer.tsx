"use client";

import { motion } from "framer-motion";
import type { FooterData, SocialLink } from "@/sanity/lib/types";

// ─── Fallback data ────────────────────────────────────────────────────────────

const FALLBACK: FooterData = {
  ctaTagline: "Start a project",
  ctaHeading: "Let's create something remarkable.",
  email: "noran@example.com",
  ctaButtonLabel: "Get in touch",
  logoText: "Noran",
  logoSubtext: "Elgeneady",
  navigationLinks: [
    { label: "WORK", href: "/#work" },
    { label: "ABOUT", href: "/#about" },
    { label: "STUDIO", href: "/campaigns" },
    { label: "CASES", href: "/cases-studies" },
    { label: "CONTACT", href: "/#contact" },
  ],
  socialLinks: [
    { platform: "Instagram", label: "IG", url: "https://instagram.com" },
    { platform: "Behance", label: "BE", url: "https://behance.net" },
    { platform: "LinkedIn", label: "LI", url: "https://linkedin.com" },
  ],
  copyrightText: "© 2025 Noran Elgeneady. All rights reserved.",
};

// ─── Merge helper ─────────────────────────────────────────────────────────────

function mergeWithFallback(data?: FooterData | null): FooterData {
  if (!data) return FALLBACK;
  return {
    ctaTagline: data.ctaTagline ?? FALLBACK.ctaTagline,
    ctaHeading: data.ctaHeading ?? FALLBACK.ctaHeading,
    email: data.email ?? FALLBACK.email,
    ctaButtonLabel: data.ctaButtonLabel ?? FALLBACK.ctaButtonLabel,
    logoText: data.logoText ?? FALLBACK.logoText,
    logoSubtext: data.logoSubtext ?? FALLBACK.logoSubtext,
    navigationLinks: data.navigationLinks?.length
      ? data.navigationLinks
      : FALLBACK.navigationLinks,
    socialLinks: data.socialLinks?.length
      ? data.socialLinks
      : FALLBACK.socialLinks,
    copyrightText: data.copyrightText ?? FALLBACK.copyrightText,
  };
}

// ─── Fade-up animation props helper ──────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE, delay },
    viewport: { once: true as const },
  };
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider({ delay = 0 }: { delay?: number }) {
  return (
    <motion.hr
      className="border-none h-px bg-primary/20 w-full"
      initial={{ scaleX: 0, originX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 1, ease: EASE, delay }}
      viewport={{ once: true }}
    />
  );
}

// ─── CTA Button ──────────────────────────────────────────────────────────────

function CTAButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="
        group relative inline-flex items-center gap-2
        px-7 py-3.5 rounded-full
        border border-accent/50 text-sm font-medium
        tracking-[0.1em] uppercase text-foreground
        overflow-hidden transition-colors duration-300
        hover:text-background
      "
    >
      <span
        className="
          absolute inset-0 bg-accent rounded-full
          scale-x-0 origin-left
          transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:scale-x-100
        "
      />
      <span className="relative z-10">{label}</span>
      <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}

// ─── Social Pill ─────────────────────────────────────────────────────────────

function SocialPill({ link }: { link: SocialLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group inline-flex items-center gap-1.5
        px-4 py-2 rounded-full
        border border-primary/20 text-xs font-mono
        tracking-widest uppercase text-foreground/50
        hover:text-foreground hover:border-accent/40
        transition-all duration-300
      "
    >
      {link.label}
      <span className="opacity-0 -translate-x-1 text-accent transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
        ↗
      </span>
    </a>
  );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────

interface FooterProps {
  data?: FooterData | null;
}

export default function Footer({ data }: FooterProps) {
  const d = mergeWithFallback(data);

  return (
    <footer className="relative w-full bg-background text-foreground overflow-hidden font-[virust] uppercase">
      {/* subtle ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[0.07]"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, #c07d51, transparent)",
        }}
      />

      <div className="relative z-10  mx-auto px-6 md:px-12 lg:px-20">
        {/* ── CTA section ── */}
        <div className="pt-24 pb-20 md:pt-32 md:pb-28 space-y-8 font-[astroScript]">
          <motion.p
            className="text-[11px] tracking-[0.3em] uppercase text-accent font-mono"
            {...fadeUp(0)}
          >
            {d.ctaTagline}
          </motion.p>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.08] tracking-tight text-foreground max-w-3xl"
            {...fadeUp(0.1)}
          >
            {d.ctaHeading}
          </motion.h2>

          <motion.div
            className="flex flex-wrap items-center gap-5 pt-2"
            {...fadeUp(0.2)}
          >
            <CTAButton
              label={d.ctaButtonLabel ?? "Get in touch"}
              href={`mailto:${d.email}`}
            />

            <a
              href={`mailto:${d.email}`}
              className="text-sm font-mono text-foreground/40 hover:text-accent transition-colors duration-300"
            >
              {d.email}
            </a>
          </motion.div>
        </div>

        <Divider />

        {/* ── Bottom row ── */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center">
          {/* Logo */}
          <motion.div {...fadeUp(0.1)}>
            <p
              className="text-2xl font-extralight tracking-[0.15em] text-foreground leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {d.logoText}
            </p>
            <p
              className="text-2xl font-extralight tracking-[0.15em] text-accent leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {d.logoSubtext}
            </p>
          </motion.div>

          {/* Nav */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-7 gap-y-2 md:justify-center"
          >
            {d.navigationLinks?.map((link, i) => (
              <motion.a
                key={link.href + i}
                href={link.href}
                className="text-[11px] tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground transition-colors duration-300"
                {...fadeUp(0.1 + i * 0.05)}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex flex-wrap gap-2 md:justify-end">
            {d.socialLinks?.map((link, i) => (
              <motion.div key={link.platform + i} {...fadeUp(0.15 + i * 0.06)}>
                <SocialPill link={link} />
              </motion.div>
            ))}
          </div>
        </div>

        <Divider delay={0.05} />

        {/* ── Copyright row ── */}
        <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <motion.p
            className="text-[11px] text-foreground/25 font-mono tracking-wide"
            {...fadeUp(0.2)}
          >
            {d.copyrightText}
          </motion.p>

          <motion.p
            className="text-[11px] text-foreground/20 font-mono tracking-wide"
            {...fadeUp(0.3)}
          >
            Crafted by{" "}
            <a
              href="https://github.com/muhammad-nabih"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/35 hover:text-accent transition-colors duration-300"
            >
              Mohamed Nabih
            </a>
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
