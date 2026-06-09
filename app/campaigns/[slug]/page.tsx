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
import { getCampaignBySlug } from "@/lib/sanity-queries";
import { getOptimizedImageUrl } from "@/lib/image-optimization";
import type { Campaign } from "@/lib/types";
import { cn } from "@/lib/utils";
import Loader from "@/components/common/Loader";
import BackNav from "@/components/common/BackNav";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── Easing constants ──────────────────────────────────────────────────────

const EASE_EXPO = [0.76, 0, 0.24, 1] as const;
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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    const count = 220;
    const positions = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const palette = [
      new THREE.Color("var(--primary)"),
      new THREE.Color("var(--secondary)"),
      new THREE.Color("var(--accent)"),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      alphas[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: "#f379a7",
      size: 0.022,
      transparent: true,
      opacity: 0.28,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    let mx = 0, my = 0;
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 0.25;
      my = (e.clientY / window.innerHeight - 0.5) * 0.25;
    };
    window.addEventListener("mousemove", onMove);
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      particles.rotation.y += 0.00012;
      particles.rotation.x += 0.00006;
      camera.position.x += (mx - camera.position.x) * 0.025;
      camera.position.y += (-my - camera.position.y) * 0.025;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.45 }}
    />
  );
}

// ─── Page Reveal ──────────────────────────────────────────────────────────

function PageReveal() {
  return (
    <motion.div
      className="fixed inset-0 bg-background z-[200] origin-top"
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 1.5, ease: EASE_EXPO, delay: 0.1 }}
    />
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────

function HeroSection({ campaign }: { campaign: Campaign }) {
  const heroRef    = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const imageY  = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade    = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const heroImageUrl = (campaign as any)?.heroImage
    ? getOptimizedImageUrl((campaign as any).heroImage, { width: 1920, height: 1080 })
    : null;

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden">
      {/* Parallax image */}
      <motion.div style={{ y: imageY }} className="absolute inset-0 z-[1] scale-[1.14]">
        {heroImageUrl ? (
          <Image src={heroImageUrl} alt={campaign?.title || ""} fill priority className="object-cover" sizes="100vw" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-card to-background" />
        )}
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-background via-background/35 to-background/15" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-background/55 via-transparent to-transparent" />

      {/* Content */}
      <motion.div
        style={{ opacity: fade }}
        className="relative z-[10] h-full flex flex-col justify-end pb-20 px-8 md:px-16 lg:px-24 max-w-[1600px] mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.9, ease: EASE_SMOOTH }}
          className="mb-7 flex items-center gap-4"
        >
          <span className="block w-10 h-px bg-primary/60" />
          <span className="text-primary/75 text-[10px] tracking-[0.5em] uppercase font-light font-['Cormorant_Garamond']">
            {(campaign as any)?.service?.title || "Campaign"}
          </span>
        </motion.div>

        <div className="overflow-hidden mb-9">
          <motion.h1
            initial={{ y: "105%" }}
            animate={{ y: "0%" }}
            transition={{ delay: 1.05, duration: 1.2, ease: EASE_EXPO }}
            className="font-['Cormorant_Garamond'] font-bold leading-[0.87] text-foreground tracking-[-0.025em]"
            style={{ fontSize: "clamp(3.5rem,8.5vw,9rem)" }}
          >
            {campaign?.title || "Campaign"}
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45, duration: 0.8 }}
          className="flex flex-wrap items-end gap-x-10 gap-y-4"
        >
          {(campaign as any)?.clientName && (
            <HeroMeta label="Client" value={(campaign as any).clientName} />
          )}
          {(campaign as any)?.year && (
            <HeroMeta label="Year" value={(campaign as any).year} />
          )}
          {(campaign as any)?.behanceUrl && (
            <a
              href={(campaign as any).behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-400 text-[10px] tracking-[0.35em] uppercase"
            >
              Behance
              <span className="inline-block group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">↗</span>
            </a>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-9 right-9 z-[10] flex flex-col items-center gap-3"
      >
        <div className="w-px h-16 bg-border relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-primary"
            animate={{ height: ["0%", "100%"], opacity: [1, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <span className="text-muted-foreground text-[9px] tracking-[0.4em] uppercase rotate-90 origin-center mt-2">Scroll</span>
      </motion.div>
    </section>
  );
}

function HeroMeta({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-muted-foreground/50 text-[9px] tracking-[0.4em] uppercase">{label}</span>
      <span className="text-muted-foreground text-sm font-['Cormorant_Garamond'] font-light leading-none">{value}</span>
    </div>
  );
}

// ─── Description Section ──────────────────────────────────────────────────

function DescriptionSection({ campaign }: { campaign: Campaign }) {
  const ref   = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  const stats = [
    { label: "Frames", value: String((campaign as any)?.gallery?.length ?? "—").padStart(2, "0") },
    { label: "Year",   value: (campaign as any)?.year ?? "2024" },
    { label: "Type",   value: (campaign as any)?.service?.title ?? "Creative" },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE_SMOOTH } },
  };

  return (
    <section ref={ref} className="relative py-36 md:py-48 px-8 md:px-16 lg:px-24 max-w-[1600px] mx-auto">
      {/* Large ghost numeral */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.5 }}
        className="absolute top-16 right-8 md:right-16 font-['Cormorant_Garamond'] font-bold text-foreground/[0.025] select-none pointer-events-none leading-none"
        style={{ fontSize: "clamp(8rem,20vw,22rem)" }}
        aria-hidden
      >
        01
      </motion.span>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-16 lg:gap-32 items-start relative z-10"
      >
        {/* Left */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-7 h-px bg-primary/50" />
            <span className="text-primary/60 text-[9px] tracking-[0.5em] uppercase font-['Cormorant_Garamond']">The Story</span>
          </div>
          <h2
            className="font-['Cormorant_Garamond'] font-bold text-foreground leading-[0.9] tracking-[-0.02em]"
            style={{ fontSize: "clamp(3.2rem,5.5vw,5.5rem)" }}
          >
            About<br />
            <em className="not-italic text-primary">this</em><br />
            Work
          </h2>
          <div className="mt-12 w-px h-20 bg-gradient-to-b from-primary/25 to-transparent ml-1" />
        </motion.div>

        {/* Right */}
        <div className="pt-0 lg:pt-10 flex flex-col gap-12">
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground font-['Cormorant_Garamond'] font-light leading-[1.9]"
            style={{ fontSize: "clamp(1.1rem,1.35vw,1.3rem)", maxWidth: "60ch" }}
          >
            {campaign?.shortDescription ||
              "A compelling visual narrative that transcends conventional boundaries, crafted with meticulous attention to every detail and driven by a singular, unwavering creative vision."}
          </motion.p>

          <motion.div variants={itemVariants} className="w-full h-px bg-border" />

          <motion.div variants={itemVariants} className="flex gap-14 md:gap-20">
            {stats.map((s, i) => (
              <div key={i}>
                <div
                  className="font-['Cormorant_Garamond'] text-primary font-bold leading-none mb-2.5"
                  style={{ fontSize: "clamp(2rem,3.2vw,3rem)" }}
                >
                  {s.value}
                </div>
                <div className="text-muted-foreground/50 text-[9px] tracking-[0.4em] uppercase">{s.label}</div>
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
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ images, current, onClose, onPrev, onNext }: LightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowLeft")   onPrev();
      if (e.key === "ArrowRight")  onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="fixed inset-0 z-[400] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/95 backdrop-blur-3xl" />

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="relative z-10 w-full h-full flex items-center justify-center p-12 md:p-20"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.45, ease: EASE_SMOOTH }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-full max-w-5xl" style={{ maxHeight: "78vh" }}>
            <Image
              src={images[current].src}
              alt={images[current].alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Counter */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <span className="text-muted-foreground text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond']">
          {String(current + 1).padStart(2, "0")} — {String(images.length).padStart(2, "0")}
        </span>
      </div>

      {/* Navigation arrows */}
      {(["left", "right"] as const).map((dir) => (
        <button
          key={dir}
          onClick={(e) => { e.stopPropagation(); dir === "left" ? onPrev() : onNext(); }}
          className={cn(
            "absolute z-20 top-1/2 -translate-y-1/2 w-12 h-12",
            "border border-border flex items-center justify-center",
            "text-muted-foreground hover:text-primary hover:border-primary/50",
            "transition-all duration-300 bg-card/30 backdrop-blur-sm",
            dir === "left" ? "left-6 md:left-10" : "right-6 md:right-10"
          )}
          aria-label={dir === "left" ? "Previous" : "Next"}
        >
          {dir === "left" ? "←" : "→"}
        </button>
      ))}

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 z-20 text-muted-foreground/50 hover:text-primary transition-colors duration-300 text-[10px] tracking-[0.4em] uppercase"
      >
        Close ✕
      </button>
    </motion.div>
  );
}

// ─── Gallery Tile ──────────────────────────────────────────────────────────

function GalleryTile({
  src, alt, index, onClick, className, style,
}: {
  src: string; alt: string; index: number;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref   = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 36 },
      {
        opacity: 1, y: 0, duration: 1.15, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      }
    );
  }, []);

  return (
    <div
      ref={ref}
      style={style}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden cursor-pointer bg-card",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
          "group-hover:scale-[1.045]",
          loaded ? "opacity-100" : "opacity-0"
        )}
        sizes="(max-width: 768px) 100vw, 50vw"
        onLoad={() => setLoaded(true)}
      />

      {/* Hover tint */}
      <div className="absolute inset-0 bg-background/0 group-hover:bg-background/18 transition-colors duration-500" />

      {/* Bottom gradient on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Frame number */}
      <div className="absolute bottom-4 right-5 text-foreground/0 group-hover:text-foreground/45 transition-all duration-500 font-['Cormorant_Garamond'] text-xs tracking-[0.3em]">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-primary transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]" />
    </div>
  );
}

// ─── Gallery Section (Editorial Layout) ───────────────────────────────────

/*
  Layout system — fully symmetric, curated editorial blocks:

  Block A  →  1 full-width panorama           (16:6 ratio)
  Block B  →  2 equal columns                 (each 4:5 ratio)
  Block C  →  3 equal columns                 (each 1:1 ratio)
  Block D  →  1 wide (2/3) + 1 tall (1/3)    (left: 3:4, right: 3:5)
  Block E  →  1 tall (1/3) + 1 wide (2/3)    (mirror of D)
  Block F  →  full-width editorial            (21:9 cinematic)

  Pattern repeats: A → B → C → D → E → C → F → B → repeat
  Gaps: 3px on mobile, 5px on desktop — feels like printed magazine gutter
*/

const GALLERY_PATTERN = ["A", "B", "C", "D", "E", "C", "F", "B"] as const;
type BlockType = (typeof GALLERY_PATTERN)[number];

interface GalleryImage { src: string; alt: string; }

function buildBlocks(images: GalleryImage[]): { type: BlockType; imgs: GalleryImage[] }[] {
  const BLOCK_CONSUMPTION: Record<BlockType, number> = { A: 1, B: 2, C: 3, D: 2, E: 2, F: 1 };
  const blocks: { type: BlockType; imgs: GalleryImage[] }[] = [];
  let cursor = 0;
  let patternCursor = 0;

  while (cursor < images.length) {
    const remaining = images.length - cursor;
    const type = GALLERY_PATTERN[patternCursor % GALLERY_PATTERN.length];
    const needed = BLOCK_CONSUMPTION[type];

    // If not enough images for next block, fall back to simpler ones
    if (remaining < needed) {
      if (remaining >= 2) {
        blocks.push({ type: "B", imgs: images.slice(cursor, cursor + 2) });
        cursor += 2;
      } else {
        blocks.push({ type: "A", imgs: images.slice(cursor, cursor + 1) });
        cursor += 1;
      }
      break;
    }

    blocks.push({ type, imgs: images.slice(cursor, cursor + needed) });
    cursor += needed;
    patternCursor++;
  }

  return blocks;
}

function GallerySection({ campaign }: { campaign: Campaign }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const rawImages = (campaign as any)?.gallery ?? [];
  const images: GalleryImage[] = rawImages.map((img: any, i: number) => ({
    src: getOptimizedImageUrl(img, { width: 1600, height: 1200 }),
    alt: img?.alt ?? `Frame ${i + 1}`,
  }));

  const openLightbox  = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null)),
    [images.length]
  );
  const nextImage = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null)),
    [images.length]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".gh-label",
        { opacity: 0, x: -14 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 80%", once: true } }
      );
      gsap.fromTo(".gh-title",
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", delay: 0.1,
          scrollTrigger: { trigger: headerRef.current, start: "top 80%", once: true } }
      );
      gsap.fromTo(".gh-count",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2,
          scrollTrigger: { trigger: headerRef.current, start: "top 80%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  if (!images.length) return null;

  const blocks = buildBlocks(images);

  // Map from image's position in flat array to absolute index for lightbox
  let flatIndex = 0;
  const indexedBlocks = blocks.map((b) => {
    const start = flatIndex;
    flatIndex += b.imgs.length;
    return { ...b, startIndex: start };
  });

  const GAP = "gap-[3px] md:gap-[5px]";
  const PH  = "clamp(280px,38vh,520px)";  // primary height for most blocks
  const TH  = "clamp(200px,28vh,380px)";  // tertiary height for C blocks

  return (
    <section ref={sectionRef} className="py-20 md:py-32">

      {/* ── Section Header ── */}
      <div
        ref={headerRef}
        className="px-8 md:px-16 lg:px-24 max-w-[1600px] mx-auto mb-16 md:mb-24 flex items-end justify-between"
      >
        <div>
          <div className="gh-label flex items-center gap-3 mb-5">
            <span className="w-7 h-px bg-primary/50" />
            <span className="text-primary/60 text-[9px] tracking-[0.5em] uppercase font-['Cormorant_Garamond']">
              Gallery
            </span>
          </div>
          <h2
            className="gh-title font-['Cormorant_Garamond'] font-bold text-foreground leading-[0.9] tracking-[-0.025em]"
            style={{ fontSize: "clamp(3.2rem,6.5vw,6.5rem)" }}
          >
            Visual<br />
            <em className="not-italic text-primary">Journey</em>
          </h2>
        </div>
        <div className="gh-count text-right hidden md:block">
          <div
            className="font-['Cormorant_Garamond'] font-bold text-primary leading-none"
            style={{ fontSize: "clamp(2.8rem,4.5vw,4.5rem)" }}
          >
            {String(images.length).padStart(2, "0")}
          </div>
          <div className="text-muted-foreground/40 text-[9px] tracking-[0.4em] uppercase mt-2">Frames</div>
        </div>
      </div>

      {/* ── Editorial Blocks ── */}
      <div className={cn("flex flex-col", GAP)}>
        {indexedBlocks.map((block, bi) => {
          const { type, imgs, startIndex } = block;

          /* ── Block A: Full-width panorama ── */
          if (type === "A") return (
            <div key={bi} className="relative w-full" style={{ height: "clamp(340px,52vh,680px)" }}>
              <GalleryTile
                src={imgs[0].src} alt={imgs[0].alt}
                index={startIndex}
                onClick={() => openLightbox(startIndex)}
                className="absolute inset-0"
              />
            </div>
          );

          /* ── Block B: Two equal columns ── */
          if (type === "B") return (
            <div key={bi} className={cn("grid grid-cols-2", GAP)} style={{ height: `${PH}` }}>
              {imgs.map((img, ii) => (
                <div key={ii} className="relative overflow-hidden">
                  <GalleryTile
                    src={img.src} alt={img.alt}
                    index={startIndex + ii}
                    onClick={() => openLightbox(startIndex + ii)}
                    className="absolute inset-0"
                  />
                </div>
              ))}
            </div>
          );

          /* ── Block C: Three equal columns ── */
          if (type === "C") return (
            <div key={bi} className={cn("grid grid-cols-3", GAP)} style={{ height: `${TH}` }}>
              {imgs.map((img, ii) => (
                <div key={ii} className="relative overflow-hidden">
                  <GalleryTile
                    src={img.src} alt={img.alt}
                    index={startIndex + ii}
                    onClick={() => openLightbox(startIndex + ii)}
                    className="absolute inset-0"
                  />
                </div>
              ))}
            </div>
          );

          /* ── Block D: Wide left (2/3) + Tall right (1/3) ── */
          if (type === "D") return (
            <div key={bi} className={cn("grid", GAP)} style={{ gridTemplateColumns: "2fr 1fr", height: `${PH}` }}>
              <div className="relative overflow-hidden">
                <GalleryTile
                  src={imgs[0].src} alt={imgs[0].alt}
                  index={startIndex}
                  onClick={() => openLightbox(startIndex)}
                  className="absolute inset-0"
                />
              </div>
              <div className="relative overflow-hidden">
                <GalleryTile
                  src={imgs[1].src} alt={imgs[1].alt}
                  index={startIndex + 1}
                  onClick={() => openLightbox(startIndex + 1)}
                  className="absolute inset-0"
                />
              </div>
            </div>
          );

          /* ── Block E: Tall left (1/3) + Wide right (2/3) — mirror of D ── */
          if (type === "E") return (
            <div key={bi} className={cn("grid", GAP)} style={{ gridTemplateColumns: "1fr 2fr", height: `${PH}` }}>
              <div className="relative overflow-hidden">
                <GalleryTile
                  src={imgs[0].src} alt={imgs[0].alt}
                  index={startIndex}
                  onClick={() => openLightbox(startIndex)}
                  className="absolute inset-0"
                />
              </div>
              <div className="relative overflow-hidden">
                <GalleryTile
                  src={imgs[1].src} alt={imgs[1].alt}
                  index={startIndex + 1}
                  onClick={() => openLightbox(startIndex + 1)}
                  className="absolute inset-0"
                />
              </div>
            </div>
          );

          /* ── Block F: Cinematic full-width (shorter, wider feel) ── */
          if (type === "F") return (
            <div key={bi} className="relative w-full" style={{ height: "clamp(220px,30vh,420px)" }}>
              <GalleryTile
                src={imgs[0].src} alt={imgs[0].alt}
                index={startIndex}
                onClick={() => openLightbox(startIndex)}
                className="absolute inset-0"
              />
            </div>
          );

          return null;
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            current={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Marquee Strip ────────────────────────────────────────────────────────

function MarqueeStrip() {
  const text = "VISUAL EXCELLENCE — CREATIVE DIRECTION — PHOTOGRAPHY — CAMPAIGN — EDITORIAL —";
  return (
    <div className="relative py-8 overflow-hidden border-y border-border/40 my-28 md:my-40">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, ease: "linear", repeat: Infinity }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="text-foreground/10 text-[10px] tracking-[0.6em] uppercase font-['Cormorant_Garamond'] font-light flex-shrink-0"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────

function CTASection({ campaign }: { campaign: Campaign }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      ref={ref}
      className="py-28 md:py-44 px-8 md:px-16 lg:px-24 max-w-[1600px] mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: EASE_SMOOTH }}
      >
        {/* Top rule */}
        <div className="flex items-center gap-6 mb-20">
          <span className="w-10 h-px bg-primary/35" />
          <span className="text-primary/45 text-[9px] tracking-[0.55em] uppercase font-['Cormorant_Garamond']">
            Next Step
          </span>
          <div className="flex-1 h-px bg-border/40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-20 items-end">
          <div>
            <h2
              className="font-['Cormorant_Garamond'] font-bold text-foreground leading-[0.88] tracking-[-0.025em] mb-6"
              style={{ fontSize: "clamp(3.2rem,7.5vw,8rem)" }}
            >
              See the full<br />
              <em className="not-italic text-primary">project.</em>
            </h2>
            <p
              className="text-muted-foreground font-['Cormorant_Garamond'] font-light leading-[1.8]"
              style={{ fontSize: "clamp(1rem,1.15vw,1.15rem)", maxWidth: "44ch" }}
            >
              The complete case study, process, and full asset library are available on Behance.
            </p>
          </div>

          {(campaign as any)?.behanceUrl && (
            <motion.a
              href={(campaign as any).behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group inline-flex items-center gap-5 self-end",
                "border border-primary/30 px-10 py-5",
                "text-primary/70 hover:text-primary",
                "hover:border-primary/65 hover:bg-primary/[0.04]",
                "transition-all duration-500",
                "text-[10px] tracking-[0.45em] uppercase font-['Cormorant_Garamond']"
              )}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
            >
              View on Behance
              <span className="inline-block group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                ↗
              </span>
            </motion.a>
          )}
        </div>

        {/* Bottom rule */}
        <div className="mt-20 h-px w-full bg-border/30" />
      </motion.div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────

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

  if (loading) return <Loader />;

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p
            className="font-['Cormorant_Garamond'] text-foreground/10 font-bold mb-7"
            style={{ fontSize: "8rem" }}
          >
            404
          </p>
          <p className="text-primary/50 text-[10px] tracking-[0.4em] uppercase mb-10">
            Campaign not found
          </p>
          <Link
            href="/"
            className="text-muted-foreground/40 hover:text-primary transition-colors duration-300 text-[10px] tracking-[0.35em] uppercase"
          >
            ← Return
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&display=swap");

        ::-webkit-scrollbar          { width: 2px; }
        ::-webkit-scrollbar-track    { background: var(--background); }
        ::-webkit-scrollbar-thumb    { background: var(--primary); }
        ::selection                  { background: var(--primary); color: var(--background); }
        *, *::before, *::after       { box-sizing: border-box; }
      `}</style>

      <PageReveal />
      <AtmosphericBackground />
      <BackNav />

      <main className="relative z-[10]">
        <HeroSection campaign={campaign} />
        <DescriptionSection campaign={campaign} />
        <GallerySection campaign={campaign} />
        <MarqueeStrip />
        <CTASection campaign={campaign} />
      </main>
    </>
  );
}