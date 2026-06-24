"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// ─── Type ────────────────────────────────────────────────────────────────────
type AboutData = {
  name: string;
  greeting: string;
  role: string;
  location: string;
  heroHeadingLine1: string;
  heroHeadingLine2: string;
  shortBio: string;
  fullBio: string;
  yearsExperience: string;
  brandsCrafted: string;
  photoUrl: string;
};

// ─── Props ───────────────────────────────────────────────────────────────────
interface AboutSectionProps {
  data: AboutData;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function AboutSection({ data }: AboutSectionProps) {
  return (
    <section  className="relative isolate flex min-h-screen w-full items-center overflow-hidden bg-gradient-to-b from-[#2c454c] to-[#86a38d] px-6 py-32 sm:px-10 md:py-44 lg:px-20 lg:py-32">

      {/* LAYER 0 — background images */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image src="/hero/back1.png" alt="" fill priority className="object-cover" />
        <Image src="/hero/back2.png" alt="" fill className="object-cover" />
      </div>

      {/* LAYER 1 — grain */}
      <div className="grain-overlay z-[1]" />

      {/* LAYER 2 — grid lines */}
      <div className="pointer-events-none absolute inset-0 z-[2] hidden md:block">
        <div className="absolute inset-0 grid grid-cols-[64px_1fr]">
          <div />
          <div className="grid grid-cols-4">
            <div className="border-l border-[rgba(255,255,255,0.14)]" />
            <div className="border-l border-[rgba(255,255,255,0.14)]" />
            <div className="border-l border-[rgba(255,255,255,0.14)]" />
            <div className="border-l border-[rgba(255,255,255,0.14)]" />
          </div>
        </div>
        <div className="absolute inset-x-0 top-0 h-px bg-[rgba(255,255,255,0.14)]" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-[rgba(255,255,255,0.14)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[rgba(255,255,255,0.14)]" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 flex items-center justify-center gap-3 md:mb-28 font-[font-aston]"
        >
          <span className="h-[5px] w-[5px] rounded-full bg-[#c7865c]" />
          <span className="font-montserrat text-xs font-medium tracking-[0.35em] text-[#d7ddd9] sm:text-sm">
            ABOUT ME
          </span>
          <span className="h-[5px] w-[5px] rounded-full bg-[#c7865c]" />
        </motion.div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 items-stretch gap-16 lg:grid-cols-2 lg:gap-20">

          {/* ── Left column ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col"
          >
            <h2 className="font-montserrat text-[44px] font-normal uppercase leading-[1.08] tracking-wide sm:text-[60px] lg:text-[68px] xl:text-[76px]">
              <span className="text-[#aec9b8]">{data.heroHeadingLine1} </span>
              <br />
              <span className="text-white">{data.heroHeadingLine2}</span>
            </h2>

            <p className="mt-10 max-w-[560px] font-montserrat text-lg leading-[1.85] text-white sm:text-xl lg:text-[22px]">
              {data.shortBio}
            </p>

            {/* spacer */}
            <div className="flex-1" />

            {/* Stats row */}
            <div className="mt-14 flex items-center gap-10 border-t border-white/15 pt-8">
              <div>
                <p className="font-montserrat text-3xl font-medium text-white sm:text-4xl">
                  {data.yearsExperience}
                </p>
                <p className="mt-1 font-montserrat text-xs uppercase tracking-[0.25em] text-[#d7ddd9]">
                  Years Experience
                </p>
              </div>
              <span className="h-10 w-px bg-white/15" />
              <div>
                <p className="font-montserrat text-3xl font-medium text-white sm:text-4xl">
                  {data.brandsCrafted}
                </p>
                <p className="mt-1 font-montserrat text-xs uppercase tracking-[0.25em] text-[#d7ddd9]">
                  Brands Crafted
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Right column — black card ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{
              y: -6,
              boxShadow: "0 25px 60px -20px rgba(174,201,184,0.4)",
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col justify-between rounded-[34px] bg-[#090f0f] p-10 sm:p-12"
          >
            <div>
              {/* Avatar + greeting */}
              <div className="flex items-center gap-5">
                <div className="relative h-[110px] w-[110px] shrink-0">
                  {/* glow ring */}
                  <motion.span
                    className="absolute -inset-2 rounded-full bg-[#aec9b8]/30 blur-md"
                    animate={{ opacity: [0.25, 0.55, 0.25], scale: [1, 1.08, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* photo */}
                  <motion.div
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-accent relative h-full w-full overflow-hidden rounded-full ring-[3px] ring-white"
                  >
                    <Image
                      src={data.photoUrl}
                      alt={data.name}
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  {/* online dot */}
                  <span className="absolute right-[9px] top-1 flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-white border-2 border-accent ring-4 ring-white/30" />
                  </span>
                </div>

                <span className="font-[virust] italic text-3xl text-[#aec9b8] sm:text-4xl">
                  {data.greeting}
                </span>
              </div>

              {/* Full bio */}
              <p className="mt-8 font-montserrat text-[15px] leading-[1.85] text-white sm:text-[17px]">
                {data.fullBio}
              </p>
            </div>

            {/* Card footer */}
            <div className="mt-10 flex items-center justify-between border-t border-white/15 pt-6">
              <span className="font-montserrat text-xs uppercase tracking-[0.25em] text-[#d7ddd9]">
                {data.role}
              </span>
              <span className="font-montserrat text-xs uppercase tracking-[0.25em] text-[#aec9b8]">
                {data.location}
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}