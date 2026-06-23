"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="relative isolate flex min-h-screen w-full items-center overflow-hidden bg-gradient-to-b from-[#2c454c] to-[#86a38d] px-6 py-32 sm:px-10 md:py-44 lg:px-20 lg:py-32">
      {/* LAYER 0 — background images */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/hero/back1.png"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <Image src="/hero/back2.png" alt="" fill className="object-cover" />
      </div>

      {/* LAYER 1 — grain (matches hero atmosphere) */}
      <div className="grain-overlay z-[1]" />

      {/* LAYER 2 — column + row grid lines, same system as the hero */}
      <div className="pointer-events-none absolute inset-0 z-[2] hidden md:block">
        <div className="absolute inset-0 grid grid-cols-[64px_1fr]">
          {/* left column: empty (matches navbar logo width / hero rhythm) */}
          <div></div>
          {/* right column: 4 equal parts with left borders */}
          <div className="grid grid-cols-4">
            <div className="border-l border-[rgba(255,255,255,0.14)]" />
            <div className="border-l border-[rgba(255,255,255,0.14)]" />
            <div className="border-l border-[rgba(255,255,255,0.14)]" />
            <div className="border-l border-[rgba(255,255,255,0.14)]" />
          </div>
        </div>
        {/* horizontal line at the very top of the section */}
        <div className="absolute inset-x-0 top-0 h-px bg-[rgba(255,255,255,0.14)]" />
        {/* horizontal line splitting the section in half */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-[rgba(255,255,255,0.14)]" />
        {/* horizontal line at the very bottom of the section */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-[rgba(255,255,255,0.14)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col">
        {/* Eyebrow — centered, anchors the symmetry */}
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

        {/* Symmetric two-column grid — equal widths, shared vertical rhythm */}
        <div className="grid grid-cols-1 items-stretch gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left column — heading, copy, and a footer stat row to balance the card's footer visually */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col"
          >
            <h2 className="font-montserrat text-[44px] font-normal uppercase leading-[1.08] tracking-wide sm:text-[60px] lg:text-[68px] xl:text-[76px]">
              <span className="text-[#aec9b8]">MEET THE </span>
              <span className="text-[#aec9b8]">MIND</span>
              <br />
              <span className="text-white">BEHIND THE WORK</span>
            </h2>

            <p className="mt-10 max-w-[560px] font-montserrat text-lg leading-[1.85] text-white sm:text-xl lg:text-[22px]">
              I don&apos;t create designs just for art or aesthetics. I craft
              visuals that bring brand identity to life, communicate marketing
              messages clearly, and transform ideas into impactful designs that
              truly support goals.
            </p>

            {/* spacer pushes the footer row down so both columns share a baseline */}
            <div className="flex-1" />

            <div className="mt-14 flex items-center gap-10 border-t border-white/15 pt-8">
              <div>
                <p className="font-montserrat text-3xl font-medium text-white sm:text-4xl">
                  2+
                </p>
                <p className="mt-1 font-montserrat text-xs uppercase tracking-[0.25em] text-[#d7ddd9]">
                  Years Experience
                </p>
              </div>
              <span className="h-10 w-px bg-white/15" />
              <div>
                <p className="font-montserrat text-3xl font-medium text-white sm:text-4xl">
                  20+
                </p>
                <p className="mt-1 font-montserrat text-xs uppercase tracking-[0.25em] text-[#d7ddd9]">
                  Brands Crafted
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right column — the black card, now matched in height to the left column */}
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
              <div className="flex items-center gap-5">
                <div className="relative h-[110px] w-[110px] shrink-0">
                  <motion.span
                    className="absolute -inset-2 rounded-full bg-[#aec9b8]/30 blur-md"
                    animate={{
                      opacity: [0.25, 0.55, 0.25],
                      scale: [1, 1.08, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-accent relative h-full w-full overflow-hidden rounded-full ring-[3px] ring-white"
                  >
                    <Image
                      src="/noran.png"
                      alt="Noran Elgeneady"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                  <span className="absolute right-[9px] top-1 flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-white border-2 border-accent ring-4 ring-white/30" />
                  </span>
                </div>
                <span className="font-[virust] italic text-3xl text-[#aec9b8] sm:text-4xl">
                  HI...
                </span>
              </div>

              <p className="mt-8 font-montserrat text-[15px] leading-[1.85] text-white sm:text-[17px]">
                In most of the projects I&apos;ve worked on, I was responsible
                for building the brand from the ground up from developing the
                visual identity and defining the creative direction to creating
                brand guidelines, designing social media assets, and ensuring
                the brand identity was consistently applied across all
                touchpoints.
              </p>
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-white/15 pt-6">
              <span className="font-montserrat text-xs uppercase tracking-[0.25em] text-[#d7ddd9]">
                Graphic Designer
              </span>
              <span className="font-montserrat text-xs uppercase tracking-[0.25em] text-[#aec9b8]">
                Based in EG
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
