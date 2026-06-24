'use client';

import { motion } from 'framer-motion';
import type { FooterData } from '@/sanity/lib/types';
import SocialLinks, { type SocialLink } from './SocialLinks';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE, delay },
    viewport: { once: true as const },
  };
}

function Divider({ delay = 0 }: { delay?: number }) {
  return (
    <motion.hr
      className="bg-primary/20 h-px w-full border-none"
      initial={{ scaleX: 0, originX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 1, ease: EASE, delay }}
      viewport={{ once: true }}
    />
  );
}

interface FooterProps {
  data?: FooterData | null;
  socialLinks?: SocialLink[];
}

export default function Footer({ data, socialLinks }: FooterProps) {
  const d = data;

  return (
    <footer className="bg-background text-foreground relative w-full overflow-hidden font-[virust] uppercase">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[0.07]"
        style={{
          background:
            'radial-gradient(ellipse 60% 100% at 50% 0%,rgba(192, 125, 81, 0.57), transparent)',
        }}
      />

      <div className="relative z-10 mx-auto px-6 md:px-12 lg:px-20">
        <Divider />

        {/* Bottom row */}
        <div className="grid grid-cols-1 items-center gap-8 py-10 text-center md:grid-cols-3 md:gap-4 md:text-left">
          {/* Logo */}
          <motion.div {...fadeUp(0.1)}>
            <p
              className="text-foreground text-2xl leading-tight font-extralight tracking-[0.15em]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {d?.logoText}
            </p>
            <p
              className="text-accent text-2xl leading-tight font-extralight tracking-[0.15em]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {d?.logoSubtext}
            </p>
          </motion.div>

          {/* Nav */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap justify-center gap-x-6 gap-y-3"
          >
            {d?.navigationLinks?.map((link, i) => (
              <motion.a
                key={link.href + i}
                href={link.href}
                className="text-foreground/40 hover:text-foreground text-[11px] tracking-[0.2em] uppercase transition-colors duration-300"
                {...fadeUp(0.1 + i * 0.05)}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          {/* Social — horizontal icons */}
          <div className="flex justify-center md:justify-end">
            <SocialLinks links={socialLinks ?? []} direction="horizontal" />
          </div>
        </div>

        <Divider delay={0.05} />

        {/* Copyright row */}
        <div className="flex flex-col items-center justify-center gap-3 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <motion.p
            className="text-foreground/25 font-mono text-[11px] tracking-wide"
            {...fadeUp(0.2)}
          >
            {d?.copyrightText}
          </motion.p>

          <motion.p
            className="text-foreground/20 font-mono text-[11px] tracking-wide"
            {...fadeUp(0.3)}
          >
            Crafted by{' '}
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
