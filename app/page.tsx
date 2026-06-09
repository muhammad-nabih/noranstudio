"use client";

import { useEffect, useRef, useState, use } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Image from "next/image";
import Link from "next/link";
import { getAllCampaigns, getFeaturedCampaigns } from "@/lib/sanity-queries";
import { getOptimizedImageUrl } from "@/lib/image-optimization";
import type { Campaign, Service } from "@/lib/types";
import { cn } from "@/lib/utils";
import AboutStrip from "@/components/AboutStrip";
import Loader from "@/components/common/Loader";
import ServiceCard from "@/components/ServiceCard";
import WorkSection from "@/components/WorkSection";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ═══════════════════════════════════════════════════════════════════════════════
// THREE.JS BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════════

function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 6;

    // ── Particles ──────────────────────────────────────────────────────────────
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#C9A96E"),
      new THREE.Color("#8B7355"),
      new THREE.Color("#E8DCC8"),
      new THREE.Color("#1A1A2E"),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Wireframe Icosahedron ──────────────────────────────────────────────────
    const icoGeo = new THREE.IcosahedronGeometry(2.5, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: "#C9A96E",
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(-5, 2, -4);
    scene.add(ico);

    // ── Ring ──────────────────────────────────────────────────────────────────
    const ringGeo = new THREE.TorusGeometry(3, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: "#C9A96E",
      transparent: true,
      opacity: 0.06,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(6, -3, -5);
    ring.rotation.x = Math.PI / 4;
    scene.add(ring);

    let mx = 0,
      my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 0.6;
      my = (e.clientY / window.innerHeight - 0.5) * 0.6;
    };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      particles.rotation.y += 0.0002;
      particles.rotation.x += 0.00008;
      ico.rotation.y += 0.004;
      ico.rotation.x += 0.002;
      ring.rotation.z += 0.003;
      camera.position.x += (mx - camera.position.x) * 0.04;
      camera.position.y += (-my - camera.position.y) * 0.04;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.65 }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE REVEAL
// ═══════════════════════════════════════════════════════════════════════════════

function PageReveal() {
  return (
    <motion.div
      className="fixed inset-0 z-[200] origin-top"
      style={{
        background: "linear-gradient(180deg, #0D0D0D 0%, #1A1008 100%)",
      }}
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
    />
  );
}

function StatsStrip({ totalCampaigns }: { totalCampaigns: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const stats = [
    { value: totalCampaigns, suffix: "+", label: "Campaigns" },
    { value: 2, suffix: "+", label: "Years Experience" },
    { value: 20, suffix: "+", label: "Happy Clients" },
    { value: 4, suffix: "", label: "Services" },
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
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-16 border-y border-[#C9A96E]/10 overflow-hidden"
    >
      {/* Background grain */}
      <div className="absolute inset-0 bg-[#1A1008]/30" />
      <div className="relative max-w-[1600px] mx-auto px-8 md:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="stat-item text-center md:text-left">
              <div
                className={`stat-num-${i} text-5xl md:text-6xl font-['Playfair_Display'] font-bold text-[#C9A96E]`}
              >
                0
              </div>
              <div className="text-[#E8DCC8]/40 text-xs tracking-[0.25em] uppercase mt-1 font-['Cormorant_Garamond']">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES SECTION  ← الجزء الأهم — كل service بشخصيتها
// ═══════════════════════════════════════════════════════════════════════════════

const SERVICE_ACCENTS = [
  { color: "#C9A96E", dim: "#8B7355", number: "01" },
  { color: "#E8DCC8", dim: "#A89880", number: "02" },
  { color: "#8B7355", dim: "#6B5840", number: "03" },
  { color: "#C9A96E", dim: "#8B7355", number: "04" },
  { color: "#E8DCC8", dim: "#A89880", number: "05" },
];

function MarqueeStrip() {
  const text =
    "MASTER KV — CREATIVE DIRECTION — PRINTING — CAMPAIGNS — RETOUCH — LUXURY —";
  return (
    <div className="relative py-5 overflow-hidden border-y border-[#C9A96E]/15">
      <div className="absolute inset-0 bg-[#1A1008]/20" />
      <motion.div
        className="flex gap-0 whitespace-nowrap relative"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="text-[#C9A96E]/25 text-xs tracking-[0.45em] uppercase font-['Cormorant_Garamond'] flex-shrink-0 px-8"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WORK / CAMPAIGNS GRID
// ═══════════════════════════════════════════════════════════════════════════════

function CampaignCard({
  campaign,
  index,
}: {
  campaign: Campaign;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const slug =
    typeof campaign.slug === "string" ? campaign.slug : campaign.slug?.current;

  // Alternating sizes for visual rhythm
  const isLarge = index % 5 === 0;
  const isMedium = index % 5 === 2;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 50, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 88%" },
          delay: (index % 3) * 0.1,
        },
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <motion.div
      ref={ref}
      className={cn(
        "group relative overflow-hidden cursor-pointer",
        isLarge ? "md:col-span-2 md:row-span-2" : "",
        isMedium ? "md:col-span-1 md:row-span-2" : "",
      )}
    >
      <Link href={`/campaigns/${slug}`}>
        <div
          className="relative overflow-hidden bg-[#1A1008]"
          style={{ aspectRatio: isLarge ? "16/9" : isMedium ? "3/4" : "4/5" }}
        >
          {/* Image */}
          {campaign.heroImage && (
            <Image
              src={getOptimizedImageUrl(campaign.heroImage, {
                width: isLarge ? 1200 : 700,
                height: isLarge ? 675 : 900,
              })}
              alt={campaign.title}
              fill
              className={cn(
                "object-cover transition-all duration-700 group-hover:scale-106",
                loaded ? "opacity-100" : "opacity-0",
              )}
              sizes={
                isLarge
                  ? "(max-width:768px) 100vw, 66vw"
                  : "(max-width:768px) 100vw, 33vw"
              }
              onLoad={() => setLoaded(true)}
            />
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/90 via-[#0D0D0D]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Service badge */}
          {campaign.service?.title && (
            <div className="absolute top-4 left-4 bg-[#0D0D0D]/70 backdrop-blur-sm border border-[#C9A96E]/20 px-3 py-1">
              <span className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase font-['Cormorant_Garamond']">
                {campaign.service.title}
              </span>
            </div>
          )}

          {/* Featured star */}
          {campaign.featured && (
            <div className="absolute top-4 right-4 w-7 h-7 bg-[#C9A96E] flex items-center justify-center">
              <span className="text-[#0D0D0D] text-xs">★</span>
            </div>
          )}

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-white font-['Playfair_Display'] font-bold text-lg leading-tight mb-1">
                  {campaign.title}
                </h3>
                <p className="text-[#E8DCC8]/50 text-xs font-['Cormorant_Garamond'] line-clamp-1">
                  {campaign.shortDescription}
                </p>
              </div>
              <div className="flex-shrink-0 w-9 h-9 border border-[#C9A96E]/50 flex items-center justify-center text-[#C9A96E] opacity-0 group-hover:opacity-100 transition-all duration-400 group-hover:bg-[#C9A96E] group-hover:text-[#0D0D0D]">
                →
              </div>
            </div>
          </div>

          {/* Gold scan line on hover */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-[#C9A96E]/40 pointer-events-none"
            initial={{ top: "0%" }}
            whileHover={{ top: "100%" }}
            transition={{ duration: 0.8, ease: "linear" }}
          />
        </div>

        {/* Bottom meta */}
        <div className="flex items-center justify-between pt-3 px-1">
          <span className="text-[#E8DCC8]/30 text-[10px] tracking-[0.2em] uppercase font-['Cormorant_Garamond']">
            {campaign.clientName || "Client"}
            {campaign.year && ` · ${campaign.year}`}
          </span>
          <span className="text-[#C9A96E]/40 text-[10px] font-['Cormorant_Garamond']">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-el",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 75%" },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={ref} className="py-40 px-8 md:px-20">
      <div className="max-w-[1600px] mx-auto">
        <div className="relative border border-[#C9A96E]/15 p-12 md:p-24 overflow-hidden">
          {/* Corner decorations */}
          {[
            "top-0 left-0",
            "top-0 right-0",
            "bottom-0 left-0",
            "bottom-0 right-0",
          ].map((p, i) => (
            <div key={i} className={`absolute ${p} w-10 h-10`}>
              <div
                className={`absolute w-full h-px bg-[#C9A96E] ${i < 2 ? "top-0" : "bottom-0"}`}
              />
              <div
                className={`absolute h-full w-px bg-[#C9A96E] ${i % 2 === 0 ? "left-0" : "right-0"}`}
              />
            </div>
          ))}

          {/* BG text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[20vw] font-['Playfair_Display'] font-black text-white/[0.02]">
              Hello
            </span>
          </div>

          <div className="relative z-10 text-center">
            <div className="contact-el flex items-center justify-center gap-3 mb-6">
              <span className="w-12 h-px bg-[#C9A96E]" />
              <span className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond']">
                Get In Touch
              </span>
              <span className="w-12 h-px bg-[#C9A96E]" />
            </div>

            <h2 className="contact-el text-5xl md:text-7xl font-['Playfair_Display'] font-bold text-white leading-tight mb-4">
              Let's Create
              <br />
              <span
                style={{
                  WebkitTextStroke: "1px #C9A96E",
                  color: "transparent",
                }}
              >
                Together
              </span>
            </h2>

            <p className="contact-el text-[#E8DCC8]/50 text-base font-['Cormorant_Garamond'] font-light mb-12 max-w-sm mx-auto">
              Ready to tell your story? Let's discuss how we can bring your
              vision to life.
            </p>

            <div className="contact-el flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:hello@studio.com"
                className="group flex items-center gap-3 bg-[#C9A96E] text-[#0D0D0D] text-xs tracking-[0.3em] uppercase px-10 py-4 font-['Cormorant_Garamond'] hover:bg-[#E8DCC8] transition-colors duration-300"
              >
                Send a Message
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 border border-[#C9A96E]/40 text-[#C9A96E] text-xs tracking-[0.3em] uppercase px-10 py-4 font-['Cormorant_Garamond'] hover:border-[#C9A96E] transition-colors duration-300"
              >
                Call Us
              </a>
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
        setServices(Array.from(seen.values()));
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

  if (loading) return <Loader />;

  return (
    <>
      {/* ── Global styles ──────────────────────────────────────────────────── */}

      {/* ── Page reveal ───────────────────────────────────────────────────── */}
      <PageReveal />

      {/* ── Three.js background ───────────────────────────────────────────── */}
      <ThreeBackground />

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <main className="relative z-[10]">
        <HeroSection />
        <StatsStrip totalCampaigns={campaigns.length} />

        <MarqueeStrip />

        <WorkSection campaigns={campaigns} />
        <MarqueeStrip />

        <ServicesSection services={services} campaigns={campaigns} />

        <AboutStrip />

        <ContactSection />

        <Footer services={services} />
      </main>
    </>
  );
}
