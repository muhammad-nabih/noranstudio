"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function AboutStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Subtle vertical parallax on the portrait col
  const yImg = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  // Text slides in from left on scroll
  const xLeft = useTransform(scrollYProgress, [0, 0.4], ["-4%", "0%"]);

  /* ── GSAP entrance timeline ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      tlRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
        },
      });

      tlRef.current
        // eyebrow line grows in
        .fromTo(
          ".ab-eyebrow-line",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.7, ease: "power3.out" }
        )
        .fromTo(
          ".ab-eyebrow-text",
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        )
        // "Hi, I'm" mask reveal
        .fromTo(
          ".ab-hi",
          { yPercent: 105 },
          { yPercent: 0, duration: 0.85, ease: "power4.out" },
          "-=0.2"
        )
        // Name mask reveal
        .fromTo(
          ".ab-name",
          { yPercent: 105 },
          { yPercent: 0, duration: 0.9, ease: "power4.out" },
          "-=0.55"
        )
        // Divider expands
        .fromTo(
          ".ab-divider",
          { width: 0 },
          { width: 180, duration: 1.1, ease: "power3.inOut" },
          "-=0.3"
        )
        // Body text
        .fromTo(
          ".ab-body",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" },
          "-=0.55"
        )
        // Tagline
        .fromTo(
          ".ab-tagline",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.4"
        )
        // Badge
        .fromTo(
          ".ab-badge",
          { opacity: 0, x: 16 },
          { opacity: 1, x: 0, duration: 0.75, ease: "back.out(1.4)" },
          "-=0.3"
        )
        // Portrait fades in
        .fromTo(
          ".ab-portrait",
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" },
          "-=1.2"
        )
        // Corner brackets slide in
        .fromTo(
          ".ab-corner-tl",
          { opacity: 0, x: -10, y: -10 },
          { opacity: 1, x: 0, y: 0, duration: 0.65, ease: "power3.out" },
          "-=0.9"
        )
        .fromTo(
          ".ab-corner-br",
          { opacity: 0, x: 10, y: 10 },
          { opacity: 1, x: 0, y: 0, duration: 0.65, ease: "power3.out" },
          "-=0.55"
        )
        // Pills stagger in
        .fromTo(
          ".ab-pill",
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.3)",
            stagger: 0.15,
          },
          "-=0.4"
        )
        // Ghost name watermark
        .fromTo(
          ".ab-name-bg",
          { opacity: 0 },
          { opacity: 1, duration: 1.2, ease: "power2.out" },
          "-=0.8"
        );

      /* shimmer loop on portrait */
      const shimmerLoop = () => {
        gsap.fromTo(
          ".ab-shimmer",
          { top: "-2px", opacity: 0 },
          {
            top: "102%",
            opacity: 0.55,
            duration: 2.4,
            ease: "none",
            onComplete: () => gsap.delayedCall(3.5, shimmerLoop),
          }
        );
      };
      gsap.delayedCall(2.8, shimmerLoop);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const pills = [
    { num: "∞", label: "Possibilities" },
    { num: "3+", label: "Years Crafting" },
    { num: "◈", label: "Brand Identity" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-background"
    >
      {/* ── Subtle grid bg ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 80px,rgba(243,121,167,0.015) 80px,rgba(243,121,167,0.015) 81px)," +
            "repeating-linear-gradient(90deg,transparent,transparent 80px,rgba(243,121,167,0.015) 80px,rgba(243,121,167,0.015) 81px)",
        }}
      />

      {/* ─────────────────────────────────────────────────────────
          LEFT — Portrait (full-bleed, no box)
      ───────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden min-h-[520px] md:min-h-screen">
        {/* Parallax wrapper */}
        <motion.div
          style={{ y: yImg }}
          className="absolute inset-[-8%] w-[116%] h-[116%]"
        >
          <Image
            src="/noran-genedy.png"
            alt="Noran Elgeneady"
            fill
            className="ab-portrait object-cover object-top opacity-0"
            priority
          />
        </motion.div>

        {/* Fade edges so portrait bleeds into bg */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background:
              "linear-gradient(to right, transparent 55%, var(--background, #0c0a0b) 100%)," +
              "linear-gradient(to top, var(--background, #0c0a0b) 0%, transparent 18%)," +
              "linear-gradient(to bottom, var(--background, #0c0a0b) 0%, transparent 12%)",
          }}
        />

        {/* Corner brackets */}
        <div className="ab-corner-tl absolute top-5 left-5 w-12 h-12 border-t border-l border-primary z-[5] opacity-0" />
        <div className="ab-corner-br absolute bottom-5 right-5 w-12 h-12 border-b border-r border-primary z-[5] opacity-0" />

        {/* Shimmer sweep */}
        <div
          className="ab-shimmer absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent z-[6]"
          style={{ top: "-2px" }}
        />

        {/* Floating stat pills */}
        {pills.map((p, i) => (
          <div
            key={i}
            className={`ab-pill absolute z-[5] opacity-0 backdrop-blur-sm
              bg-background/70 border border-primary/20 px-4 py-3
              ${i === 0 ? "top-[18%] left-[10%]" : ""}
              ${i === 1 ? "top-[46%] right-[10%]" : ""}
              ${i === 2 ? "bottom-[22%] left-[8%]" : ""}
            `}
          >
            <span className="block font-['Playfair_Display'] text-xl font-bold text-primary leading-none">
              {p.num}
            </span>
            <span className="block text-[9px] tracking-[0.35em] uppercase text-foreground/35 mt-1">
              {p.label}
            </span>
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────
          RIGHT — Text
      ───────────────────────────────────────────────────────── */}
      <motion.div
        style={{ x: xLeft }}
        className="relative flex flex-col justify-center px-12 md:px-16 py-24 z-10"
      >
        {/* Ghost watermark name behind text */}
        <span
          className="ab-name-bg absolute -bottom-4 -right-8 font-['Playfair_Display'] font-bold italic text-[130px] leading-none select-none pointer-events-none opacity-0"
          style={{
            color: "transparent",
            WebkitTextStroke: "1px rgba(243,121,167,0.06)",
            whiteSpace: "nowrap",
          }}
          aria-hidden="true"
        >
          Noran
        </span>

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <span className="ab-eyebrow-line block w-7 h-px bg-primary origin-left" />
          <span className="ab-eyebrow-text text-primary text-[10px] tracking-[0.5em] uppercase font-['Cormorant_Garamond'] opacity-0">
            a little about me...
          </span>
        </div>

        {/* Heading — masked clip reveal */}
        <div className="overflow-hidden mb-0.5">
          <span className="ab-hi block font-['Playfair_Display'] font-bold text-5xl text-foreground leading-[1.1]">
            Hi, I&apos;m
          </span>
        </div>
        <div className="overflow-hidden mb-7">
          <span className="ab-name block font-['Playfair_Display'] font-bold text-5xl italic text-primary leading-[1.1]">
            Noran Elgeneady.
          </span>
        </div>

        {/* Divider */}
        <div className="ab-divider h-px bg-gradient-to-r from-primary to-transparent mb-7" style={{ width: 0 }} />

        {/* Body */}
        <p className="ab-body font-['Cormorant_Garamond'] font-light text-lg leading-relaxed text-foreground/70 opacity-0 mb-4 max-w-[400px]">
          I don&apos;t create designs just for art or aesthetics. I craft visuals
          that bring brand identity to life, communicate marketing messages
          clearly, and transform ideas into impactful designs that truly support
          goals.
        </p>

        <p className="ab-tagline font-['Playfair_Display'] italic text-sm text-primary tracking-widest opacity-0 mb-12">
          Let the design tell your story.
        </p>

        {/* Badge */}
        <div className="ab-badge self-start border border-primary/20 bg-primary/[0.04] px-5 py-3 opacity-0 backdrop-blur-sm">
          <div className="font-['Playfair_Display'] italic text-xs text-primary tracking-widest">
            Visual Artist
          </div>
          <div className="text-[9px] text-foreground/35 tracking-[0.3em] uppercase mt-1">
            Brand &amp; Identity
          </div>
        </div>
      </motion.div>
    </section>
  );
}