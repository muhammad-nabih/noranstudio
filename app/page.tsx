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
// THREE.JS BACKGROUND (Pink Theme)
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

    // ── Particles (pink palette) ──────────────────────────────────────────────
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#f379a7"), // primary
      new THREE.Color("#f8a9c9"), // secondary
      new THREE.Color("#ffbfcd"), // accent/light
      new THREE.Color("#030202"), // dark background
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

    // ── Wireframe Icosahedron (pink) ──────────────────────────────────────────
    const icoGeo = new THREE.IcosahedronGeometry(2.5, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: "#f379a7",
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(-5, 2, -4);
    scene.add(ico);

    // ── Ring (pink) ──────────────────────────────────────────────────────────
    const ringGeo = new THREE.TorusGeometry(3, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: "#f8a9c9",
      transparent: true,
      opacity: 0.05,
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
// PAGE REVEAL (Pink Theme)
// ═══════════════════════════════════════════════════════════════════════════════

function PageReveal() {
  return (
    <motion.div
      className="fixed inset-0 z-[200] origin-top"
      style={{
        background: "linear-gradient(180deg, #030202 0%, #1a0b12 100%)",
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
      className="relative py-16 border-y border-primary/10 overflow-hidden"
    >
      {/* Background grain */}
      <div className="absolute inset-0 bg-[#1a0b12]/30" />
      <div className="relative max-w-[1600px] mx-auto px-8 md:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="stat-item text-center md:text-left">
              <div
                className={`stat-num-${i} text-5xl md:text-6xl font-['Playfair_Display'] font-bold text-primary`}
              >
                0
              </div>
              <div className="text-foreground/40 text-xs tracking-[0.25em] uppercase mt-1 font-['Cormorant_Garamond']">
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
  const text =
    "MASTER KV — CREATIVE DIRECTION — PRINTING — CAMPAIGNS — RETOUCH — LUXURY —";
  return (
    <div className="relative py-5 overflow-hidden border-y border-primary/15">
      <div className="absolute inset-0 bg-[#1a0b12]/20" />
      <motion.div
        className="flex gap-0 whitespace-nowrap relative"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="text-primary/25 text-xs tracking-[0.45em] uppercase font-['Cormorant_Garamond'] flex-shrink-0 px-8"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
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
        <div className="relative border border-primary/15 p-12 md:p-24 overflow-hidden">
          {/* Corner decorations */}
          {[
            "top-0 left-0",
            "top-0 right-0",
            "bottom-0 left-0",
            "bottom-0 right-0",
          ].map((p, i) => (
            <div key={i} className={`absolute ${p} w-10 h-10`}>
              <div
                className={`absolute w-full h-px bg-primary ${i < 2 ? "top-0" : "bottom-0"}`}
              />
              <div
                className={`absolute h-full w-px bg-primary ${i % 2 === 0 ? "left-0" : "right-0"}`}
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
              <span className="w-12 h-px bg-primary" />
              <span className="text-primary text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond']">
                Get In Touch
              </span>
              <span className="w-12 h-px bg-primary" />
            </div>

            <h2 className="contact-el text-5xl md:text-7xl font-['Playfair_Display'] font-bold text-white leading-tight mb-4">
              Let's Create
              <br />
              <span
                style={{
                  WebkitTextStroke: "1px var(--primary)",
                  color: "transparent",
                }}
              >
                Together
              </span>
            </h2>

            <p className="contact-el text-foreground/50 text-base font-['Cormorant_Garamond'] font-light mb-12 max-w-sm mx-auto">
              Ready to tell your story? Let's discuss how we can bring your
              vision to life.
            </p>

            <div className="contact-el flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:hello@studio.com"
                className="group flex items-center gap-3 bg-primary text-background text-xs tracking-[0.3em] uppercase px-10 py-4 font-['Cormorant_Garamond'] hover:bg-secondary transition-colors duration-300"
              >
                Send a Message
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 border border-primary/40 text-primary text-xs tracking-[0.3em] uppercase px-10 py-4 font-['Cormorant_Garamond'] hover:border-primary transition-colors duration-300"
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