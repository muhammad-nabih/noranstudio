"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SocialLinks, { type SocialLink } from "./SocialLinks";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface HeroProps {
  socialLinks?: SocialLink[];
}

export default function Hero({ socialLinks }: HeroProps) {
  return (
  <section
      id="top"
      className="relative isolate flex min-h-[100vh] w-full flex-col overflow-hidden bg-background"
    >
      {/* LAYER 1 — background images */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero/back1.png"
          alt=""
          fill
          priority
          className="object-cover z-10"
        />
        <Image
          src="/hero/back2.png"
          alt=""
          fill
          className="object-cover z-20"
        />
        <Image
          src="/hero/back3.png"
          alt=""
          fill
          className="object-cover z-30"
        />
      </div>

      {/* LAYER 2 — grain */}
      <div className="grain-overlay z-[1]" />

      {/* LAYER 3 — column grid lines */}
      <div className="pointer-events-none absolute inset-0 z-[2] hidden md:block">
        <div className="absolute inset-0 grid grid-cols-[64px_1fr]">
          <div />
          <div className="grid grid-cols-4 ">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="border-l border-[rgba(142,169,148,0.18)]"
              />
            ))}
          </div>
        </div>
        <div className="absolute inset-x-0 top-0 h-px bg-[rgba(142,169,148,0.18)]" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-[rgba(142,169,148,0.18)]" />
      </div>

      {/* LAYER 4 — Social Rail (vertical icons) */}
      <div className="absolute left-4 md:left-[15px] top-[200px] -translate-y-1/2 z-[6] pointer-events-auto">
  <SocialLinks links={socialLinks ?? []} direction="vertical" />
</div>

      {/* LAYER 5 — name + role */}
      <div className="absolute top-[46%] left-0 right-0 z-[5] -translate-y-1/2 mx-auto w-full max-w-[1700px] px-4 sm:px-10">
        <div className="flex flex-col items-center justify-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="font-display lowercase select-none text-[clamp(2.2rem,8.5vw,6rem)] italic leading-[0.9] text-white font-[virust]"
          >
            NORAN ELGNEADY
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease: "easeOut" }}
            className="relative mt-2 self-end mr-[10%] md:mr-[15%] lg:mr-[20%]"
          >
            <span className="bg-accent px-4 py-1.5 font-display text-[clamp(0.95rem,2vw,1.15rem)] italic text-white font-[dd]">
              Graphic Designer
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}