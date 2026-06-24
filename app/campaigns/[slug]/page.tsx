"use client";

import {
  useEffect,
  useRef,
  useState,
  use,
  useCallback,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Image from "next/image";
import Link from "next/link";
import { getCampaignBySlug } from "@/sanity/sanity-queries/sanity-queries";
import { getOptimizedImageUrl } from "@/lib/image-optimization";
import type { Campaign } from "@/sanity/lib/types";
import { cn } from "@/lib/utils";
import BackNav from "@/components/common/BackNav";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

const EASE_EXPO   = [0.76, 0, 0.24, 1]       as const;
const EASE_SMOOTH = [0.25, 0.46, 0.45, 0.94] as const;

// ─── Atmospheric Background ────────────────────────────────────────────────

function AtmosphericBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    const count     = 200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: "#f379a7", size: 0.02,
      transparent: true, opacity: 0.22, sizeAttenuation: true,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    let mx = 0, my = 0;
    const onMove   = (e: MouseEvent) => { mx = (e.clientX / window.innerWidth  - 0.5) * 0.2; my = (e.clientY / window.innerHeight - 0.5) * 0.2; };
    const onResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize",    onResize);

    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      particles.rotation.y += 0.0001;
      particles.rotation.x += 0.00005;
      camera.position.x += (mx - camera.position.x) * 0.02;
      camera.position.y += (-my - camera.position.y) * 0.02;
      renderer.render(scene, camera);
    };
    animate();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); window.removeEventListener("resize", onResize); renderer.dispose(); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.4 }} />;
}

// ─── Page Reveal ──────────────────────────────────────────────────────────

function PageReveal() {
  return (
    <motion.div
      className="fixed inset-0 bg-background z-[200] origin-top"
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 1.4, ease: EASE_EXPO, delay: 0.1 }}
    />
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────

function HeroSection({ campaign }: { campaign: Campaign }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const fade   = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const heroImageUrl = (campaign as any)?.heroImage
    ? getOptimizedImageUrl((campaign as any).heroImage, { width: 1920, height: 1080 })
    : null;

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden">
      <motion.div style={{ y: imageY }} className="absolute inset-0 z-[1] scale-[1.12]">
        {heroImageUrl
          ? <Image src={heroImageUrl} alt={campaign?.title || ""} fill priority className="object-cover" sizes="100vw" />
          : <div className="w-full h-full bg-gradient-to-br from-card to-background" />}
      </motion.div>

      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-background via-background/30 to-background/10" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-background/50 via-transparent to-transparent" />

      <motion.div
        style={{ opacity: fade }}
        className="relative z-[10] h-full flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 max-w-[1600px] mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.9, ease: EASE_SMOOTH }}
          className="mb-6 flex items-center gap-4"
        >
          <span className="w-8 h-px bg-primary/60" />
          <span className="text-primary text-[10px] tracking-[0.5em] uppercase font-light font-[montserrat]">
            {(campaign as any)?.service?.title || "Campaign"}
          </span>
        </motion.div>

        <div className="overflow-hidden mb-8">
          <motion.h1
            initial={{ y: "105%" }}
            animate={{ y: "0%" }}
            transition={{ delay: 1.05, duration: 1.2, ease: EASE_EXPO }}
            className="font-[montserrat] font-bold leading-[0.87] text-foreground tracking-[-0.025em]"
            style={{ fontSize: "clamp(3.5rem,8.5vw,9rem)" }}
          >
            {campaign?.title || "Campaign"}
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45, duration: 0.8 }}
          className="flex flex-wrap items-end gap-x-10 gap-y-3"
        >
          {(campaign as any)?.clientName && <HeroMeta label="Client" value={(campaign as any).clientName} />}
          {(campaign as any)?.year       && <HeroMeta label="Year"   value={(campaign as any).year} />}
          {(campaign as any)?.behanceUrl && (
            <a
              href={(campaign as any).behanceUrl}
              target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors duration-400 text-[10px] tracking-[0.35em] uppercase"
            >
              Behance
              <span className="inline-block group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">↗</span>
            </a>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 right-8 z-[10] flex flex-col items-center gap-2"
      >
        <div className="w-px h-14 bg-border relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-primary"
            animate={{ height: ["0%", "100%"], opacity: [1, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <span className="text-foreground/60 text-[9px] tracking-[0.4em] uppercase rotate-90 origin-center mt-2">Scroll</span>
      </motion.div>
    </section>
  );
}

function HeroMeta({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-foreground/50 text-[9px] tracking-[0.4em] uppercase">{label}</span>
      <span className="text-foreground text-sm font-[montserrat] font-light leading-none">{value}</span>
    </div>
  );
}

// ─── Description ──────────────────────────────────────────────────────────

function DescriptionSection({ campaign }: { campaign: Campaign }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  const stats = [
    { label: "Frames", value: String((campaign as any)?.gallery?.length ?? "—").padStart(2, "0") },
    { label: "Year",   value: (campaign as any)?.year ?? "2024" },
    { label: "Type",   value: (campaign as any)?.service?.title ?? "Creative" },
  ];

  const ctr = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const itm = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE_SMOOTH } } };

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-8 md:px-16 lg:px-24 max-w-[1600px] mx-auto">
      <motion.div
        variants={ctr} initial="hidden" animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 lg:gap-28 items-start"
      >
        <motion.div variants={itm}>
          <div className="flex items-center gap-3 mb-7">
            <span className="w-6 h-px bg-primary/50" />
            <span className="text-primary text-[9px] tracking-[0.5em] uppercase font-[montserrat]">The Story</span>
          </div>
          <h2
            className="font-[montserrat] font-bold text-foreground leading-[0.9] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2.8rem,5vw,5rem)" }}
          >
            About<br />
            <em className="not-italic text-primary">this</em><br />
            Work
          </h2>
          <div className="mt-10 w-px h-16 bg-gradient-to-b from-primary/20 to-transparent ml-1" />
        </motion.div>

        <div className="pt-0 lg:pt-8 flex flex-col gap-10">
          <motion.p
            variants={itm}
            className="text-foreground/80 font-[montserrat] font-light leading-[1.85]"
            style={{ fontSize: "clamp(1.05rem,1.3vw,1.25rem)", maxWidth: "58ch" }}
          >
            {campaign?.shortDescription ||
              "A compelling visual narrative that transcends conventional boundaries, crafted with meticulous attention to every detail and driven by a singular, unwavering creative vision."}
          </motion.p>

          <motion.div variants={itm} className="w-full h-px bg-border/60" />

          <motion.div variants={itm} className="flex gap-12 md:gap-16">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="font-[montserrat] text-primary font-bold leading-none mb-2" style={{ fontSize: "clamp(1.8rem,3vw,2.8rem)" }}>
                  {s.value}
                </div>
                <div className="text-foreground/50 text-[9px] tracking-[0.4em] uppercase">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Lightbox ──────────────────────────────────────────────────────────────

interface LightboxProps {
  images: { src: string; alt: string }[];
  current: number;
  onClose: () => void;
  onPrev:  () => void;
  onNext:  () => void;
}

function Lightbox({ images, current, onClose, onPrev, onNext }: LightboxProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="fixed inset-0 z-[400] flex items-center justify-center cursor-zoom-out"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/92 backdrop-blur-2xl" />

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="relative z-10 cursor-default"
          style={{ width: "min(90vw, 1100px)", height: "min(85vh, 800px)" }}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={   { opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.4, ease: EASE_SMOOTH }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 border border-border/30 z-[1] pointer-events-none" />
          <Image
            src={images[current].src}
            alt={images[current].alt}
            fill
            className="object-contain"
            sizes="90vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        <span className="w-6 h-px bg-border/50" />
        <span className="text-foreground/70 text-[10px] tracking-[0.45em] uppercase font-[montserrat]">
          {String(current + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
        <span className="w-6 h-px bg-border/50" />
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-5 md:left-10 z-20 top-1/2 -translate-y-1/2 w-11 h-11 border border-border/40 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/40 transition-all duration-300 bg-background/30 backdrop-blur-sm"
        aria-label="Previous"
      >←</button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-5 md:right-10 z-20 top-1/2 -translate-y-1/2 w-11 h-11 border border-border/40 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/40 transition-all duration-300 bg-background/30 backdrop-blur-sm"
        aria-label="Next"
      >→</button>

      <button
        onClick={onClose}
        className="absolute top-7 right-7 z-20 w-9 h-9 border border-border/30 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/40 transition-all duration-300 text-sm bg-background/30 backdrop-blur-sm"
        aria-label="Close"
      >✕</button>

      <p className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-foreground/50 text-[9px] tracking-[0.4em] uppercase">
        Click outside or press ESC to close
      </p>
    </motion.div>
  );
}

// ─── Gallery Tile ──────────────────────────────────────────────────────────

function GalleryTile({
  src, alt, index, onClick, className,
}: {
  src: string; alt: string; index: number;
  onClick: () => void; className?: string;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 92%", once: true } }
    );
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden cursor-pointer",
        "border border-border/20 hover:border-primary/25 transition-colors duration-500",
        "bg-card",
        className
      )}
    >
      <Image
        src={src} alt={alt} fill
        className={cn(
          "object-cover transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]",
          loaded ? "opacity-100" : "opacity-0"
        )}
        sizes="(max-width: 768px) 100vw, 50vw"
        onLoad={() => setLoaded(true)}
      />

      <div className="absolute inset-0 bg-background/0 group-hover:bg-background/15 transition-colors duration-500" />

      <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-background/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <span className="absolute bottom-3.5 right-4 text-foreground/0 group-hover:text-foreground/70 transition-all duration-400 font-[montserrat] text-[10px] tracking-[0.3em]">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-primary transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]" />
    </div>
  );
}

// ─── Gallery Section ───────────────────────────────────────────────────────

type BlockType = "A" | "B" | "C" | "D" | "E" | "F";
interface GImg { src: string; alt: string; }

const PATTERN: BlockType[]                   = ["A", "B", "C", "D", "E", "B", "F", "C", "D", "E"];
const CONSUMES: Record<BlockType, number>    = { A: 1, B: 2, C: 3, D: 2, E: 2, F: 1 };

function buildBlocks(images: GImg[]): { type: BlockType; imgs: GImg[]; startIdx: number }[] {
  const out: { type: BlockType; imgs: GImg[]; startIdx: number }[] = [];
  let cur = 0, pat = 0;

  while (cur < images.length) {
    const rem  = images.length - cur;
    const type = PATTERN[pat % PATTERN.length];
    const need = CONSUMES[type];

    if (rem < need) {
      if (rem >= 2) { out.push({ type: "B", imgs: images.slice(cur, cur + 2), startIdx: cur }); cur += 2; }
      else          { out.push({ type: "A", imgs: images.slice(cur, cur + 1), startIdx: cur }); cur += 1; }
      break;
    }
    out.push({ type, imgs: images.slice(cur, cur + need), startIdx: cur });
    cur += need;
    pat++;
  }
  return out;
}

const H_TALL   = "clamp(320px, 44vh, 580px)";
const H_MID    = "clamp(260px, 36vh, 480px)";
const H_STRIP  = "clamp(200px, 28vh, 360px)";
const H_SHORT  = "clamp(160px, 22vh, 280px)";
const GAP      = "6px";

function GallerySection({ campaign }: { campaign: Campaign }) {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const [lbIdx, setLbIdx] = useState<number | null>(null);

  const rawImages = (campaign as any)?.gallery ?? [];
  const images: GImg[] = rawImages.map((img: any, i: number) => ({
    src: getOptimizedImageUrl(img, { width: 1600, height: 1200 }),
    alt: img?.alt ?? `Frame ${i + 1}`,
  }));

  const open  = useCallback((i: number) => setLbIdx(i), []);
  const close = useCallback(() => setLbIdx(null), []);
  const prev  = useCallback(() => setLbIdx((i) => (i !== null ? (i - 1 + images.length) % images.length : null)), [images.length]);
  const next  = useCallback(() => setLbIdx((i) => (i !== null ? (i + 1) % images.length : null)),              [images.length]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".gh-label",
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".gh-title",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", delay: 0.1,
          scrollTrigger: { trigger: headerRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".gh-count",
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 0.2,
          scrollTrigger: { trigger: headerRef.current, start: "top 82%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  if (!images.length) return null;

  const blocks = buildBlocks(images);

  return (
    <section ref={sectionRef} className="py-16 md:py-24">

      <div
        ref={headerRef}
        className="px-8 md:px-16 lg:px-24 max-w-[1600px] mx-auto mb-12 md:mb-16 flex items-end justify-between"
      >
        <div>
          <div className="gh-label flex items-center gap-3 mb-5">
            <span className="w-6 h-px bg-primary/50" />
            <span className="text-primary text-[9px] tracking-[0.5em] uppercase font-[montserrat]">Gallery</span>
          </div>
          <h2
            className="gh-title font-[montserrat] font-bold text-foreground leading-[0.9] tracking-[-0.025em]"
            style={{ fontSize: "clamp(3rem,6vw,6rem)" }}
          >
            Visual<br />
            <em className="not-italic text-primary">Journey</em>
          </h2>
        </div>
        <div className="gh-count text-right hidden md:block">
          <div className="font-[montserrat] font-bold text-primary leading-none" style={{ fontSize: "clamp(2.5rem,4vw,4rem)" }}>
            {String(images.length).padStart(2, "0")}
          </div>
          <div className="text-foreground/50 text-[9px] tracking-[0.4em] uppercase mt-2">Frames</div>
        </div>
      </div>

      <div
        className="px-8 md:px-16 lg:px-24 max-w-[1600px] mx-auto flex flex-col"
        style={{ gap: GAP }}
      >
        {blocks.map(({ type, imgs, startIdx }, bi) => {

          if (type === "A") return (
            <div key={bi} className="relative w-full" style={{ height: H_TALL }}>
              <GalleryTile src={imgs[0].src} alt={imgs[0].alt} index={startIdx} onClick={() => open(startIdx)} className="absolute inset-0" />
            </div>
          );

          if (type === "B") return (
            <div key={bi} className="grid grid-cols-2" style={{ gap: GAP, height: H_MID }}>
              {imgs.map((img, ii) => (
                <div key={ii} className="relative overflow-hidden">
                  <GalleryTile src={img.src} alt={img.alt} index={startIdx + ii} onClick={() => open(startIdx + ii)} className="absolute inset-0" />
                </div>
              ))}
            </div>
          );

          if (type === "C") return (
            <div key={bi} className="grid grid-cols-3" style={{ gap: GAP, height: H_STRIP }}>
              {imgs.map((img, ii) => (
                <div key={ii} className="relative overflow-hidden">
                  <GalleryTile src={img.src} alt={img.alt} index={startIdx + ii} onClick={() => open(startIdx + ii)} className="absolute inset-0" />
                </div>
              ))}
            </div>
          );

          if (type === "D") return (
            <div key={bi} className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: GAP, height: H_MID }}>
              {imgs.map((img, ii) => (
                <div key={ii} className="relative overflow-hidden">
                  <GalleryTile src={img.src} alt={img.alt} index={startIdx + ii} onClick={() => open(startIdx + ii)} className="absolute inset-0" />
                </div>
              ))}
            </div>
          );

          if (type === "E") return (
            <div key={bi} className="grid" style={{ gridTemplateColumns: "1fr 2fr", gap: GAP, height: H_MID }}>
              {imgs.map((img, ii) => (
                <div key={ii} className="relative overflow-hidden">
                  <GalleryTile src={img.src} alt={img.alt} index={startIdx + ii} onClick={() => open(startIdx + ii)} className="absolute inset-0" />
                </div>
              ))}
            </div>
          );

          if (type === "F") return (
            <div key={bi} className="relative w-full" style={{ height: H_SHORT }}>
              <GalleryTile src={imgs[0].src} alt={imgs[0].alt} index={startIdx} onClick={() => open(startIdx)} className="absolute inset-0" />
            </div>
          );

          return null;
        })}
      </div>

      <AnimatePresence>
        {lbIdx !== null && (
          <Lightbox images={images} current={lbIdx} onClose={close} onPrev={prev} onNext={next} />
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Marquee ───────────────────────────────────────────────────────────────

function MarqueeStrip() {
  const text = "VISUAL EXCELLENCE — CREATIVE DIRECTION — PHOTOGRAPHY — CAMPAIGN — EDITORIAL —";
  return (
    <div className="relative py-7 overflow-hidden border-y border-border/30 my-20 md:my-28">
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="text-foreground/30 text-[10px] tracking-[0.6em] uppercase font-[montserrat] font-light flex-shrink-0">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── CTA ───────────────────────────────────────────────────────────────────

function CTASection({ campaign }: { campaign: Campaign }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section ref={ref} className="py-24 md:py-36 px-8 md:px-16 lg:px-24 max-w-[1600px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.1, ease: EASE_SMOOTH }}
      >
        <div className="flex items-center gap-5 mb-16">
          <span className="w-8 h-px bg-primary/30" />
          <span className="text-primary text-[9px] tracking-[0.55em] uppercase font-[montserrat]">Next Step</span>
          <div className="flex-1 h-px bg-border/30" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-end">
          <div>
            <h2
              className="font-[montserrat] font-bold text-foreground leading-[0.88] tracking-[-0.025em] mb-5"
              style={{ fontSize: "clamp(3rem,7vw,7.5rem)" }}
            >
              See the full<br />
              <em className="not-italic text-primary">project.</em>
            </h2>
            <p
              className="text-foreground/70 font-[montserrat] font-light leading-[1.8]"
              style={{ fontSize: "clamp(0.95rem,1.1vw,1.1rem)", maxWidth: "44ch" }}
            >
              The complete case study, process, and full asset library are available on Behance.
            </p>
          </div>

          {(campaign as any)?.behanceUrl && (
            <motion.a
              href={(campaign as any).behanceUrl}
              target="_blank" rel="noopener noreferrer"
              className={cn(
                "group inline-flex items-center gap-5 self-end",
                "border border-primary/25 px-9 py-4",
                "text-primary hover:text-foreground hover:border-primary/55 hover:bg-primary/[0.04]",
                "transition-all duration-500",
                "text-[10px] tracking-[0.45em] uppercase font-[montserrat]"
              )}
              whileHover={{ scale: 1.012 }}
              whileTap={{ scale: 0.988 }}
            >
              View on Behance
              <span className="inline-block group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">↗</span>
            </motion.a>
          )}
        </div>

        <div className="mt-16 h-px w-full bg-border/25" />
      </motion.div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function CampaignSlugPage({ params }: PageProps) {
  const { slug } = use(params);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);

  useEffect(() => {
    getCampaignBySlug(slug)
      .then(setCampaign)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = ""; };
  }, []);

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-[montserrat] text-foreground/20 font-bold mb-6" style={{ fontSize: "8rem" }}>404</p>
          <p className="text-primary text-[10px] tracking-[0.4em] uppercase mb-10">Campaign not found</p>
          <Link href="/" className="text-foreground/70 hover:text-primary transition-colors duration-300 text-[10px] tracking-[0.35em] uppercase">
            ← Return
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        ::-webkit-scrollbar       { width: 2px; }
        ::-webkit-scrollbar-track { background: var(--background); }
        ::-webkit-scrollbar-thumb { background: var(--primary); }
        ::selection               { background: var(--primary); color: var(--background); }
        *, *::before, *::after    { box-sizing: border-box; }
      `}</style>

      <PageReveal />
      <AtmosphericBackground />
      <BackNav />

      <main className="relative z-[10]">
        <HeroSection       campaign={campaign} />
        <DescriptionSection campaign={campaign} />
        <GallerySection    campaign={campaign} />
        <MarqueeStrip />
        <CTASection        campaign={campaign} />
      </main>
    </>
  );
}