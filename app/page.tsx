"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  getAbout,
  getAllCampaigns,
  getFeaturedCampaigns,
  getFooterData,       
  getSiteSettings,      
} from "@/sanity/sanity-queries/sanity-queries";

import WorkSection from "@/components/WorkSection";
import Footer from "@/components/Footer";         
import type { SocialLink } from "@/components/SocialLinks"; 
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutStrip";
import { AboutData, Campaign, FooterData, Service } from "@/sanity/lib/types";

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

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-8 md:px-20">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-8 text-primary-foreground">
          {stats.map((s, i) => (
            <div
              key={i}
              className="stat-item text-center text-primary-foreground"
            >
              <div
                className={`stat-num-${i} text-2xl sm:text-4xl md:text-5xl text-primary-foreground`}
              >
                0
              </div>
              <div className="text-foreground/40 text-[9px] sm:text-[10px] md:text-xs tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] uppercase mt-1 font-[montserrat] text-primary-foreground">
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
        ".contact-el",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
        },
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
      className="relative py-24 md:py-32 px-6 md:px-12"
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Label */}
        <div className="contact-el flex items-center justify-center gap-3 mb-6">
          <span className="w-8 h-px bg-primary/30" />
          <span className="text-primary/70 text-xs tracking-[0.3em] uppercase">
            Get In Touch
          </span>
          <span className="w-8 h-px bg-primary/30" />
        </div>

        {/* Heading */}
        <h2 className="contact-el text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 font-[astroScript]">
          Let's Create
          <br />
          <span className="text-primary/90 italic font-light">
            Something Beautiful
          </span>
        </h2>

        {/* Description */}
        <p className="contact-el text-foreground/50 text-base md:text-lg mb-12 max-w-md mx-auto leading-relaxed">
          Ready to tell your story? Let's discuss how we can bring your vision
          to life through thoughtful design.
        </p>

        {/* Email */}
        <div className="contact-el flex flex-col items-center gap-6">
          <button
            onClick={copyEmail}
            className="group flex items-center gap-3 border border-primary/20 bg-primary/[0.03] hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 px-6 py-3 rounded-sm"
          >
            <span className="text-primary/90 text-sm tracking-wide">
              noranelgneady@gmail.com
            </span>
            <span className="text-primary/40 text-xs uppercase tracking-wider group-hover:text-primary/80 transition-colors">
              {copied ? "Copied!" : "Copy"}
            </span>
          </button>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="mailto:noranelgneady@gmail.com"
              className="flex items-center gap-2 bg-primary text-background text-xs tracking-[0.2em] uppercase px-8 py-3.5 font-semibold hover:bg-primary/90 transition-colors duration-300"
            >
              <span>Send a Message</span>
              <span>→</span>
            </a>

            <a
              href="https://wa.me/201090636030"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-primary/30 text-primary/90 text-xs tracking-[0.2em] uppercase px-8 py-3.5 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300"
            >
              WhatsApp
            </a>
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
  const [about, setAbout] = useState<AboutData | null>(null);
  const [serviceTotal, setServiceTotal] = useState(0);
  
  // ← أضف الـ state الجديدة
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [all, feat, aboutData, footer, site] = await Promise.all([
          getAllCampaigns(),
          getFeaturedCampaigns(),
          getAbout(),
          getFooterData(),      // ← أضف
          getSiteSettings(),    // ← أضف
        ]);

        setCampaigns(all);
        setAbout(aboutData);
        setFeatured(feat.length ? feat : all.slice(0, 3));
        setFooterData(footer);                    // ← أضف
        setSocialLinks(site?.socialLinks ?? []);  // ← أضف

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

      <main className="relative z-[10]">
        <Hero socialLinks={socialLinks} />
        
        <StatsStrip
          totalCampaigns={campaigns.length}
          totalServices={serviceTotal}
        />
        
        <MarqueeStrip />
        <WorkSection campaigns={campaigns} />
        <MarqueeStrip />
        
        {about && <AboutSection data={about} />}
        
        <ContactSection />
      </main>



    </>
  );
}
