"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { getAllCampaigns, getFeaturedCampaigns } from "@/lib/sanity-queries";

import type { Campaign, Service } from "@/lib/types";
import WorkSection from "@/components/WorkSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutStrip";
// import Navbar from "@/components/Navbar";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE REVEAL ( Theme)
// ═══════════════════════════════════════════════════════════════════════════════

function StatsStrip({
  totalCampaigns,
  totalServices,
}: {
  totalCampaigns: number;
  totalServices: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const stats = [
    { value: totalCampaigns, suffix: "+", label: "Campaigns" },
    { value: 2, suffix: "+", label: "Years Experience" },
    { value: 20, suffix: "+", label: "Happy Clients" },
    { value: totalServices, suffix: "", label: "Services" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      stats.forEach((s, i) => {
        const el = document.querySelector(`.stat-num-${i}`);
        if (!el) return;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: s.value,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
          onUpdate: () => {
            el.textContent = Math.ceil(obj.v) + s.suffix;
          },
        });
      });

      gsap.fromTo(
        ".stat-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [stats]);

  return (
    <section
      ref={ref}
      className="relative py-1 border-y bg-[#aec9b8] border-primary/10 overflow-hidden font-[virust]  "
    >
      {/* Background grain */}
      <div className="absolute inset-0 bg-[#1a0b12]/30" />
      <div className="relative max-w-[1600px] mx-auto px-8 md:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-primary-foreground">
          {stats.map((s, i) => (
            <div
              key={i}
              className="stat-item text-center md:text-left text-primary-foreground"
            >
              <div
                className={`stat-num-${i} text-5xl md:text-5xl  text-primary-foreground`}
              >
                0
              </div>
              <div className="text-foreground/40 text-xs tracking-[0.25em]  uppercase mt-1 font-[montserrat]  text-primary-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarqueeStrip() {
  const text = [
    "MASTER KV",
    "CREATIVE DIRECTION",
    "PRINTING",
    "CAMPAIGNS",
    "RETOUCH",
    "LUXURY",
  ];
  return (
    <div className="relative py-5 overflow-hidden border-y border-primary/15">
      <div className="absolute inset-0 bg-[#1a0b12]/20" />
      <motion.div
        className="flex gap-0 whitespace-nowrap relative"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="flex items-center text-[#515d55] text-xs tracking-[0.45em] uppercase font-['Cormorant_Garamond'] flex-shrink-0"
          >
            {text.map((word, idx) => (
              <span key={idx} className="mx-8">
                {word}
              </span> // mx-12 = big margin between words
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        ".contact-border-line",
        { scaleX: 0, scaleY: 0 },
        {
          scaleX: 1,
          scaleY: 1,
          duration: 1,
          ease: "power3.inOut",
          stagger: 0.08,
        },
      ).fromTo(
        ".contact-el",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
        },
        "-=0.6",
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("noranelgneady@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-32 md:py-40 px-6 md:px-12 overflow-hidden"
    >
      {/* Grid lines from Hero for consistency */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden md:block">
        <div className="absolute inset-0 grid grid-cols-[64px_1fr]">
          <div />
          <div className="grid grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="border-l border-[rgba(142,169,148,0.06)]"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="relative border border-primary/10 bg-primary/[0.02] backdrop-blur-sm p-10 md:p-20 lg:p-28 overflow-hidden">
          {/* Animated corner brackets */}
          {[
            { pos: "top-0 left-0", h: "origin-left", v: "origin-top" },
            { pos: "top-0 right-0", h: "origin-right", v: "origin-top" },
            { pos: "bottom-0 left-0", h: "origin-left", v: "origin-bottom" },
            { pos: "bottom-0 right-0", h: "origin-right", v: "origin-bottom" },
          ].map((item, i) => (
            <div
              key={i}
              className={`absolute ${item.pos} w-12 h-12 md:w-16 md:h-16`}
            >
              <div
                className={`contact-border-line absolute w-full h-px bg-primary/40 ${item.pos.includes("top") ? "top-0" : "bottom-0"} ${item.h}`}
              />
              <div
                className={`contact-border-line absolute h-full w-px bg-primary/40 ${item.pos.includes("left") ? "left-0" : "right-0"} ${item.v}`}
              />
            </div>
          ))}

          {/* Watermark text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="text-[16vw] md:text-[12vw] font-['Playfair_Display'] font-black text-white/[0.015] leading-none whitespace-nowrap">
              Contact
            </span>
          </div>

          <div className="relative z-10 text-center">
            {/* Label */}
            <div className="contact-el flex items-center justify-center gap-4 mb-8">
              <span className="w-8 md:w-12 h-px bg-primary/40" />
              <span className="text-primary/80 text-[10px] md:text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond']">
                Get In Touch
              </span>
              <span className="w-8 md:w-12 h-px bg-primary/40" />
            </div>

            {/* Heading */}
            <h2 className="contact-el text-4xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-bold text-white leading-[1.1] mb-6">
              Let's Create
              <br />
              <span
                className="italic font-['Cormorant_Garamond'] font-light"
                style={{
                  WebkitTextStroke: "1px rgba(142,169,148,0.5)",
                  color: "transparent",
                }}
              >
                Something Beautiful
              </span>
            </h2>

            {/* Description */}
            <p className="contact-el text-foreground/50 text-base md:text-lg font-['Cormorant_Garamond'] font-light mb-14 max-w-md mx-auto leading-relaxed">
              Ready to tell your story? Let's discuss how we can bring your
              vision to life through thoughtful design.
            </p>

            {/* Email + Actions */}
            <div className="contact-el flex flex-col items-center gap-8">
              {/* Copy Email Button */}
              <button
                onClick={copyEmail}
                className="group relative flex items-center gap-4 border border-primary/20 bg-primary/[0.03] hover:bg-primary/10 hover:border-primary/40 transition-all duration-500 px-8 py-4"
              >
                <span className="text-primary/90 text-sm md:text-base tracking-[0.1em] font-['Cormorant_Garamond']">
                  noranelgneady@gmail.com
                </span>
                <span className="text-primary/40 text-[10px] uppercase tracking-widest group-hover:text-primary/80 transition-colors">
                  {copied ? "Copied!" : "Copy"}
                </span>
                <div className="absolute inset-0 border border-primary/10 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none" />
              </button>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="mailto:noranelgneady@gmail.com"
                  className="group relative flex items-center gap-3 bg-primary text-background text-xs tracking-[0.3em] uppercase px-10 py-4 font-['Cormorant_Garamond'] font-semibold overflow-hidden"
                >
                  <span className="relative z-10">Send a Message</span>
                  <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </a>

                <a
                  href="https://wa.me/201000000000" // غير الرقم هنا لو عايز
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-primary/30 text-primary/90 text-xs tracking-[0.3em] uppercase px-10 py-4 font-['Cormorant_Garamond'] hover:border-primary/60 hover:bg-primary/5 transition-all duration-300"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="contact-el mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {["Behance", "Dribbble", "LinkedIn", "Instagram"].map(
                (social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-foreground/30 hover:text-primary/80 text-[10px] md:text-xs tracking-[0.3em] uppercase font-['Cormorant_Garamond'] transition-colors duration-300 relative group"
                  >
                    {social}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary/60 group-hover:w-full transition-all duration-300" />
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [featured, setFeatured] = useState<Campaign[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Unique service count state for stats strip
  const [serviceTotal, setServiceTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [all, feat] = await Promise.all([
          getAllCampaigns(),
          getFeaturedCampaigns(),
        ]);
        setCampaigns(all);
        setFeatured(feat.length ? feat : all.slice(0, 3));

        // Derive unique services from campaigns (sorted by first appearance)
        const seen = new Map<string, Service>();
        all.forEach((c) => {
          if (c.service && !seen.has(c.service._id))
            seen.set(c.service._id, c.service);
        });
        const servicesArr = Array.from(seen.values());
        setServices(servicesArr);
        setServiceTotal(servicesArr.length);
      } catch (e) {
        console.error("Failed to load data:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <>
      <Navbar />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <main className="relative z-[10]">
        <Hero />

        <StatsStrip
          totalCampaigns={campaigns.length}
          totalServices={serviceTotal}
        />

        <MarqueeStrip />

        <WorkSection campaigns={campaigns} />

        <MarqueeStrip />

        <AboutSection />

        <ContactSection />
      </main>
    </>
  );
}
