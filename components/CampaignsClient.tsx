"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOptimizedImageUrl, getBlurDataUrl } from "@/lib/image-optimization";
import type { Campaign } from "@/lib/types";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  campaigns: Campaign[];
}

type AspectKind = "tall" | "wide" | "square";

interface GridItem {
  campaign: Campaign;
  imgSrc: string;
  blur: string;
  aspect: AspectKind;
  colSpan: number;
  rowSpan: number;
  serviceSlug: string;
}

const PATTERN: Array<{ aspect: AspectKind; col: number; row: number }> = [
  { aspect: "tall", col: 1, row: 2 },
  { aspect: "wide", col: 2, row: 1 },
  { aspect: "square", col: 1, row: 1 },
  { aspect: "square", col: 1, row: 1 },
  { aspect: "wide", col: 2, row: 1 },
  { aspect: "tall", col: 1, row: 2 },
  { aspect: "square", col: 1, row: 1 },
  { aspect: "wide", col: 2, row: 1 },
];

function buildGrid(campaigns: Campaign[]): GridItem[] {
  const items: GridItem[] = [];
  let pi = 0;
  for (const c of campaigns) {
    const srcs: Array<{ src: string; blur: string }> = [];
    if (c.heroImage?.asset) {
      srcs.push({
        src: getOptimizedImageUrl(c.heroImage, { width: 1200, quality: 85 }),
        blur: getBlurDataUrl(c.heroImage),
      });
    }
    for (const img of (c.gallery ?? []).slice(0, 2)) {
      if (img?.asset) {
        srcs.push({
          src: getOptimizedImageUrl(img, { width: 900, quality: 80 }),
          blur: getBlurDataUrl(img),
        });
      }
    }
    for (const { src, blur } of srcs) {
      const p = PATTERN[pi % PATTERN.length];
      pi++;
      items.push({
        campaign: c,
        imgSrc: src,
        blur,
        aspect: p.aspect,
        colSpan: p.col,
        rowSpan: p.row,
        serviceSlug: (c.service?.title ?? "all")
          .toLowerCase()
          .replace(/\s+/g, "-"),
      });
    }
  }
  return items;
}

function getServices(campaigns: Campaign[]): string[] {
  const seen = new Set<string>();
  for (const c of campaigns) {
    if (c.service?.title) seen.add(c.service.title);
  }
  return ["All", ...Array.from(seen)];
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────
function FilterBar({
  services,
  active,
  onChange,
  total,
  filtered,
}: {
  services: string[];
  active: string;
  onChange: (s: string) => void;
  total: number;
  filtered: number;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".filter-item",
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.06,
          delay: 1.2,
        },
      );
    }, barRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={barRef}
      className="relative z-10 px-8 md:px-20 pb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
    >
      <div className="flex items-center gap-2 flex-wrap">
        {services.map((svc) => {
          const isActive = active === svc;
          return (
            <button
              key={svc}
              onClick={() => onChange(svc)}
              className="filter-item relative px-5 py-2 text-[9px] tracking-[0.4em] uppercase transition-all duration-400 overflow-hidden group"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                border: isActive
                  ? "1px solid rgba(243,121,167,0.6)"
                  : "1px solid rgba(243,121,167,0.12)",
                color: isActive ? "var(--primary)" : "rgba(255,191,205,0.35)",
                background: isActive ? "rgba(243,121,167,0.08)" : "transparent",
              }}
            >
              <span
                className="absolute inset-0 bg-primary/6 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                style={{ display: isActive ? "none" : "block" }}
              />
              <span className="relative z-10">{svc}</span>
            </button>
          );
        })}
      </div>
      <div
        className="filter-item flex items-center gap-2 text-[9px] tracking-[0.4em] uppercase text-foreground/20"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        <span className="text-primary/60">{filtered}</span>
        <span>/</span>
        <span>{total} visuals</span>
      </div>
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  items,
  index,
  onClose,
  onChange,
}: {
  items: GridItem[];
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const item = items[index];
  const total = items.length;
  const ref = useRef<HTMLDivElement>(null);
  const slug = (item.campaign as any)?.slug?.current;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const el = ref.current;
    if (el) {
      gsap.set(el, { autoAlpha: 0, backdropFilter: "blur(0px)" });
      gsap.to(el, { autoAlpha: 1, duration: 0.45, ease: "power2.out" });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") onChange((index + 1) % total);
      if (e.key === "ArrowLeft") onChange((index - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, total]);

  const close = () => {
    const el = ref.current;
    if (el)
      gsap.to(el, {
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: onClose,
      });
    else onClose();
  };

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[500] flex items-center justify-center"
      onClick={close}
      style={{ isolation: "isolate" }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />

      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 z-20 px-8 py-6 flex items-center justify-between"
        style={{
          background:
            "linear-gradient(to bottom, rgba(3,2,0,0.8), transparent)",
        }}
      >
        {/* Counter */}
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] tracking-[0.4em] uppercase text-primary"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="w-px h-3 bg-primary/30" />
          <span
            className="text-[10px] tracking-[0.4em] uppercase text-foreground/20"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* Close */}
        <button
          onClick={close}
          className="group w-10 h-10 flex items-center justify-center border border-primary/10 hover:border-primary/40 transition-colors duration-300"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="text-foreground/30 group-hover:text-primary transition-colors duration-300"
          >
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Image */}
      <div className="relative z-10 px-20" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <Image
            src={item.imgSrc}
            alt={item.campaign.title}
            width={1400}
            height={900}
            className="object-contain max-h-[72vh] w-auto shadow-2xl"
            priority
          />
          <div className="absolute inset-0 border border-primary/10 pointer-events-none" />
        </div>

        {/* Info panel below image */}
        <div className="mt-8 flex items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-px bg-primary/60" />
              <p
                className="text-[9px] tracking-[0.45em] uppercase text-primary"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {(item.campaign as any).service?.title ?? "Campaign"}
              </p>
            </div>
            <h3
              className="text-foreground font-semibold leading-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
              }}
            >
              {item.campaign.title}
            </h3>
            <div className="flex items-center gap-4 mt-2">
              {(item.campaign as any).clientName && (
                <span
                  className="text-foreground/35 text-[10px] tracking-[0.3em] uppercase"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {(item.campaign as any).clientName}
                </span>
              )}
              {(item.campaign as any).year && (
                <span
                  className="text-primary/50 text-[10px] tracking-[0.3em] uppercase"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {(item.campaign as any).year}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {(item.campaign as any).behanceUrl && (
              <a
                href={(item.campaign as any).behanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-5 py-2.5 border border-primary/20 text-primary/60 hover:text-primary hover:border-primary/50 transition-all duration-300"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <span className="text-[9px] tracking-[0.35em] uppercase">
                  Behance
                </span>
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path
                    d="M1 8L8 1M8 1H3M8 1V6"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}

            {slug && (
              <Link
                href={`/campaigns/${slug}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-3 px-6 py-2.5 bg-primary text-background hover:bg-secondary transition-colors duration-300 group"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <span className="text-[9px] tracking-[0.35em] uppercase font-semibold">
                  View Project
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="group-hover:translate-x-0.5 transition-transform duration-300"
                >
                  <path
                    d="M2 6h8M6 2l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Nav arrows */}
      {(
        [
          { d: -1, pos: "left-4", path: "M10 3L4 9L10 15" },
          { d: 1, pos: "right-4", path: "M4 3L10 9L4 15" },
        ] as const
      ).map(({ d, pos, path }) => (
        <button
          key={d}
          onClick={(e) => {
            e.stopPropagation();
            onChange((index + d + total) % total);
          }}
          className={`absolute ${pos} top-1/2 -translate-y-1/2 z-20
                      w-10 h-10 flex items-center justify-center
                      border border-primary/10 bg-background/80 backdrop-blur-sm
                      text-foreground/25 hover:text-primary hover:border-primary/40
                      transition-all duration-300`}
        >
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
            <path
              d={path}
              stroke="currentColor"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({
  item,
  index,
  onOpen,
  isVisible,
}: {
  item: GridItem;
  index: number;
  onOpen: () => void;
  isVisible: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const shimRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const [hov, setHov] = useState(false);

  const slug = (item.campaign as any)?.slug?.current;
  const behanceUrl = (item.campaign as any)?.behanceUrl;
  const clientName = (item.campaign as any)?.clientName;
  const year = (item.campaign as any)?.year;

  /* Scroll reveal */
  useEffect(() => {
    if (!wrapRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapRef.current,
        { autoAlpha: 0, y: 50, clipPath: "inset(0 0 100% 0)" },
        {
          autoAlpha: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: 1.2,
          ease: "power4.out",
          delay: (index % 4) * 0.1,
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        },
      );
    });
    return () => ctx.revert();
  }, [index]);

  /* Filter visibility */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    gsap.to(el, {
      autoAlpha: isVisible ? 1 : 0,
      scale: isVisible ? 1 : 0.94,
      duration: 0.55,
      ease: "power3.out",
      pointerEvents: isVisible ? "all" : "none",
    });
  }, [isVisible]);

  /* Hover GSAP */
  const onEnter = useCallback(() => {
    setHov(true);
    gsap.to(imgRef.current, { scale: 1.07, duration: 0.9, ease: "power3.out" });
    gsap.to(lineRef.current, {
      scaleX: 1,
      duration: 0.5,
      ease: "power3.out",
      transformOrigin: "left",
    });
    gsap.to(infoRef.current, {
      y: 0,
      autoAlpha: 1,
      duration: 0.45,
      ease: "power3.out",
    });
    gsap.to(numRef.current, { color: "var(--primary)", duration: 0.3 });
    gsap.fromTo(
      shimRef.current,
      { top: "-2px", autoAlpha: 0 },
      { top: "102%", autoAlpha: 0.7, duration: 1.9, ease: "none" },
    );
  }, []);

  const onLeave = useCallback(() => {
    setHov(false);
    gsap.to(imgRef.current, { scale: 1, duration: 0.8, ease: "power3.out" });
    gsap.to(lineRef.current, {
      scaleX: 0,
      duration: 0.4,
      ease: "power3.in",
      transformOrigin: "right",
    });
    gsap.to(infoRef.current, {
      y: 10,
      autoAlpha: 0,
      duration: 0.35,
      ease: "power2.in",
    });
    gsap.to(numRef.current, { color: "rgba(255,191,205,0.12)", duration: 0.3 });
  }, []);

  return (
    <div
      ref={wrapRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative overflow-hidden"
      style={{
        gridColumn: `span ${item.colSpan}`,
        gridRow: `span ${item.rowSpan}`,
      }}
    >
      {/* Clickable image area */}
      <div className="absolute inset-0 z-[1] cursor-pointer" onClick={onOpen}>
        <div ref={imgRef} className="absolute inset-0 will-change-transform">
          <Image
            src={item.imgSrc}
            alt={item.campaign.title}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={item.blur}
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          />
        </div>

        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient vignette */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: `
              linear-gradient(to top, rgba(3,2,2,0.95) 0%, rgba(3,2,2,0.15) 45%, transparent 70%),
              linear-gradient(to right, rgba(3,2,2,0.4) 0%, transparent 40%)
            `,
            opacity: hov ? 1 : 0.55,
          }}
        />

        {/* Shimmer */}
        <div
          ref={shimRef}
          className="absolute left-0 w-full h-[1px] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--primary), transparent)",
            top: "-2px",
          }}
        />
      </div>

      {/* Index number */}
      <span
        ref={numRef}
        className="absolute top-5 left-5 z-[2] font-bold leading-none select-none pointer-events-none"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(28px, 3.5vw, 48px)",
          color: "rgba(255,191,205,0.12)",
          lineHeight: 1,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Service tag */}
      <div
        className="absolute top-5 right-5 z-[2] px-3 py-1.5 border border-primary/20 bg-background/70 backdrop-blur-sm transition-all duration-400 pointer-events-none"
        style={{
          opacity: hov ? 1 : 0,
          transform: hov ? "translateX(0)" : "translateX(10px)",
        }}
      >
        <span
          className="text-[8px] tracking-[0.4em] uppercase text-primary"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {(item.campaign as any).service?.title ?? "Campaign"}
        </span>
      </div>

      {/* Corner accents */}
      <div
        className="absolute top-3 left-3 w-5 h-5 border-t border-l border-primary/40 transition-opacity duration-300 pointer-events-none z-[2]"
        style={{ opacity: hov ? 1 : 0 }}
      />
      <div
        className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-primary/40 transition-opacity duration-300 pointer-events-none z-[2]"
        style={{ opacity: hov ? 1 : 0 }}
      />

      {/* Bottom info panel */}
      <div className="absolute bottom-0 left-0 right-0 z-[3] p-5">
        <div
          ref={infoRef}
          style={{ opacity: 0, transform: "translateY(10px)" }}
          className="mb-2"
        >
          {(clientName || year) && (
            <div className="flex items-center gap-3 mb-3">
              {clientName && (
                <span
                  className="text-[8px] tracking-[0.45em] uppercase text-primary"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {clientName}
                </span>
              )}
              {clientName && year && (
                <span className="w-px h-3 bg-primary/25" />
              )}
              {year && (
                <span
                  className="text-[8px] tracking-[0.3em] uppercase text-primary/50"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {year}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 relative z-[4]">
            {slug && (
              <Link
                href={`/campaigns/${slug}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-background hover:bg-secondary transition-colors duration-300 group/btn"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <span className="text-[8px] tracking-[0.3em] uppercase font-semibold">
                  View Project
                </span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  className="group-hover/btn:translate-x-0.5 transition-transform duration-300"
                >
                  <path
                    d="M1.5 5h7M5.5 2l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}

            {behanceUrl && (
              <a
                href={behanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-4 py-2 border border-primary/25 text-primary/60 hover:text-primary hover:border-primary/50 transition-all duration-300 backdrop-blur-sm"
                style={{
                  background: "rgba(3,2,2,0.6)",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                <span className="text-[8px] tracking-[0.3em] uppercase">
                  Behance
                </span>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path
                    d="M1 7L7 1M7 1H3M7 1V5"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              className="w-8 h-8 flex items-center justify-center border border-primary/15 bg-background/60 backdrop-blur-sm text-foreground/30 hover:text-primary hover:border-primary/40 transition-all duration-300"
              title="Quick view"
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path
                  d="M1 4V1h3M7 1h3v3M10 7v3H7M4 10H1V7"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <h3
          className="font-semibold leading-tight tracking-tight text-foreground pointer-events-none"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(13px, 1.1vw, 17px)",
          }}
        >
          {item.campaign.title}
        </h3>

        <div
          ref={lineRef}
          className="mt-2.5 h-px bg-gradient-to-r from-primary via-secondary to-transparent scale-x-0 pointer-events-none"
          style={{ transformOrigin: "left center" }}
        />
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function PlaceholderGrid() {
  return (
    <div
      className="grid gap-[3px]"
      style={{
        gridTemplateColumns: "repeat(4,1fr)",
        gridAutoRows: "230px",
        gridAutoFlow: "row dense",
      }}
    >
      {PATTERN.slice(0, 8).map((p, i) => (
        <div
          key={i}
          className="relative overflow-hidden"
          style={{
            gridColumn: `span ${p.col}`,
            gridRow: `span ${p.row}`,
            background: `hsl(340, 40%, ${6 + (i % 3) * 2}%)`,
            animation: `pulsePink 2.4s ease-in-out ${i * 0.18}s infinite`,
          }}
        >
          <div className="absolute bottom-4 left-4">
            <div className="w-14 h-1 rounded-full bg-primary/7 mb-2" />
            <div className="w-9 h-0.5 rounded-full bg-primary/5" />
          </div>
        </div>
      ))}
      <style>{`@keyframes pulsePink{0%,100%{opacity:.55}50%{opacity:1}}`}</style>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CampaignsClient({ campaigns }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const yHdr = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const opHdr = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const allGrid = useMemo(() => buildGrid(campaigns), [campaigns]);
  const services = useMemo(() => getServices(campaigns), [campaigns]);

  const visibleSet = useMemo(() => {
    if (activeFilter === "All") return new Set(allGrid.map((_, i) => i));
    return new Set(
      allGrid.reduce<number[]>((acc, item, i) => {
        if (item.campaign.service?.title === activeFilter) acc.push(i);
        return acc;
      }, []),
    );
  }, [activeFilter, allGrid]);

  const filteredCount = visibleSet.size;
  const visibleItems = useMemo(
    () => allGrid.filter((_, i) => visibleSet.has(i)),
    [allGrid, visibleSet],
  );

  /* Three.js particle field (pink theme) */
  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;
  //   const renderer = new THREE.WebGLRenderer({
  //     canvas,
  //     alpha: true,
  //     antialias: true,
  //   });
  //   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //   renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  //   const scene = new THREE.Scene();
  //   const camera = new THREE.PerspectiveCamera(
  //     55,
  //     canvas.offsetWidth / canvas.offsetHeight,
  //     0.1,
  //     100,
  //   );
  //   camera.position.z = 6;

  //   const COUNT = 220;
  //   const pos = new Float32Array(COUNT * 3);
  //   const sz = new Float32Array(COUNT);
  //   for (let i = 0; i < COUNT; i++) {
  //     pos[i * 3] = (Math.random() - 0.5) * 14;
  //     pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
  //     pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
  //     sz[i] = Math.random() * 2.5 + 0.5;
  //   }
  //   const geo = new THREE.BufferGeometry();
  //   geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  //   geo.setAttribute("size", new THREE.BufferAttribute(sz, 1));

  //   const mat = new THREE.ShaderMaterial({
  //     uniforms: {
  //       uTime: { value: 0 },
  //       uColor: { value: new THREE.Color(0xf379a7) }, // primary pink
  //       uMouse: { value: new THREE.Vector2(0, 0) },
  //     },
  //     vertexShader: /* glsl */ `
  //       attribute float size; uniform float uTime; uniform vec2 uMouse; varying float vAlpha;
  //       void main() {
  //         vec3 p = position;
  //         p.y += sin(uTime * 0.35 + position.x * 0.7) * 0.18;
  //         p.x += cos(uTime * 0.25 + position.y * 0.5) * 0.12;
  //         float dist = length(p.xy - uMouse * 5.0);
  //         p.z += smoothstep(2.2, 0.0, dist) * 0.5;
  //         vAlpha = 0.1 + 0.3 * abs(sin(uTime * 0.4 + position.z));
  //         vec4 mv = modelViewMatrix * vec4(p, 1.0);
  //         gl_PointSize = size * (280.0 / -mv.z);
  //         gl_Position = projectionMatrix * mv;
  //       }
  //     `,
  //     fragmentShader: /* glsl */ `
  //       uniform vec3 uColor; varying float vAlpha;
  //       void main() {
  //         float d = length(gl_PointCoord - 0.5) * 2.0;
  //         gl_FragColor = vec4(uColor, smoothstep(1.0, 0.2, d) * vAlpha);
  //       }
  //     `,
  //     transparent: true,
  //     depthWrite: false,
  //     blending: THREE.AdditiveBlending,
  //   });

  //   const points = new THREE.Points(geo, mat);
  //   scene.add(points);

  //   const mkRing = (r: number, op: number, px: number, py: number) => {
  //     const m = new THREE.Mesh(
  //       new THREE.TorusGeometry(r, 0.004, 16, 120),
  //       new THREE.MeshBasicMaterial({
  //         color: 0xf379a7,
  //         transparent: true,
  //         opacity: op,
  //       }),
  //     );
  //     m.position.set(px, py, 0);
  //     scene.add(m);
  //     return m;
  //   };
  //   const ring1 = mkRing(2.2, 0.07, -3, 0);
  //   const ring2 = mkRing(3.0, 0.04, -3, 0);

  //   let mouse = { x: 0, y: 0 };
  //   const onMouse = (e: MouseEvent) => {
  //     mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  //     mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  //     mat.uniforms.uMouse.value.set(mouse.x, mouse.y);
  //   };
  //   document.addEventListener("mousemove", onMouse);

  //   const animate = (t: number) => {
  //     rafRef.current = requestAnimationFrame(animate);
  //     mat.uniforms.uTime.value = t * 0.001;
  //     points.rotation.y = mouse.x * 0.03;
  //     points.rotation.x = mouse.y * 0.03;
  //     ring1.rotation.z += 0.0008;
  //     ring2.rotation.z -= 0.0005;
  //     renderer.render(scene, camera);
  //   };
  //   rafRef.current = requestAnimationFrame(animate);

  //   const onResize = () => {
  //     const w = canvas.offsetWidth,
  //       h = canvas.offsetHeight;
  //     renderer.setSize(w, h);
  //     camera.aspect = w / h;
  //     camera.updateProjectionMatrix();
  //   };
  //   window.addEventListener("resize", onResize);

  //   return () => {
  //     cancelAnimationFrame(rafRef.current);
  //     document.removeEventListener("mousemove", onMouse);
  //     window.removeEventListener("resize", onResize);
  //     renderer.dispose();
  //   };
  // }, []);

  /* GSAP entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [
          ".camp-eyebrow",
          ".camp-title",
          ".camp-divider",
          ".camp-sub",
          ".camp-count",
          ".camp-marquee",
        ],
        { autoAlpha: 0 },
      );
      gsap.set(".camp-title", { yPercent: 110 });
      gsap.set(".camp-eyebrow", { y: 20 });
      gsap.set(".camp-sub", { y: 22 });
      gsap.set(".camp-count", { y: 14 });
      gsap.set(".camp-divider", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".camp-marquee", { y: 10 });

      gsap
        .timeline({ delay: 0.3 })
        .to(".camp-eyebrow", {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        })
        .to(
          ".camp-title",
          { autoAlpha: 1, yPercent: 0, duration: 1.1, ease: "power4.out" },
          "-=0.4",
        )
        .to(
          ".camp-divider",
          { autoAlpha: 1, scaleX: 1, duration: 1.3, ease: "power3.inOut" },
          "-=0.5",
        )
        .to(
          ".camp-sub",
          { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" },
          "-=0.7",
        )
        .to(
          ".camp-count",
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.4",
        )
        .to(
          ".camp-marquee",
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3",
        );

      const shimmer = () => {
        gsap.fromTo(
          ".camp-div-shimmer",
          { left: "0%", autoAlpha: 0 },
          {
            left: "100%",
            autoAlpha: 0.8,
            duration: 2.0,
            ease: "none",
            onComplete: () => gsap.delayedCall(3.5, shimmer),
          },
        );
      };
      gsap.delayedCall(2, shimmer);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const marqueeWords = [
    "Campaign",
    "✦",
    "Key Visual",
    "✦",
    "Retouching",
    "✦",
    "Post Production",
    "✦",
    "Campaign",
    "✦",
    "Key Visual",
    "✦",
    "Retouching",
    "✦",
    "Post Production",
    "✦",
  ];

  const openLightbox = useCallback((i: number) => setLightbox(i), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const changeLightbox = useCallback((i: number) => setLightbox(i), []);
  const handleFilter = useCallback((s: string) => {
    setLightbox(null);
    setActiveFilter(s);
  }, []);

  return (
    <>
      {/* Hero header */}
      <section
        ref={sectionRef}
        id="campaigns"
        className="relative min-h-[65vh] w-full overflow-hidden bg-background flex flex-col"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-0 w-[55%] h-full
                          bg-[radial-gradient(ellipse_60%_70%_at_20%_40%,rgba(243,121,167,0.06)_0%,transparent_65%)]"
          />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(243,121,167,1) 60px,rgba(243,121,167,1) 61px)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        <motion.div
          style={{ y: yHdr, opacity: opHdr }}
          className="relative z-10 px-8 md:px-20 pt-36 pb-10"
        >
          <div className="camp-eyebrow flex items-center gap-4 mb-10">
            <span className="w-8 h-px bg-primary/70" />
            <div className="w-1 h-1 rounded-full bg-primary" />
            <span
              className="text-primary/80 text-[10px] tracking-[0.5em] uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Selected Work
            </span>
          </div>

          <div className="overflow-hidden mb-1">
            <h1
              className="camp-title block font-bold leading-[0.9] tracking-[-0.02em] text-foreground"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(60px,10vw,120px)",
              }}
            >
              STUDIO
            </h1>
          </div>

          <div
            className="camp-divider relative w-full max-w-xl h-px mt-8 mb-8 overflow-hidden"
            style={{
              background:
                "linear-gradient(90deg,var(--primary) 0%,rgba(243,121,167,0.3) 60%,transparent 100%)",
            }}
          >
            <div
              className="camp-div-shimmer absolute top-0 w-8 h-full pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg,transparent,var(--primary),transparent)",
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <p
              className="camp-sub text-foreground/55 text-lg leading-relaxed max-w-[400px]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
              }}
            >
              A curated archive of advertising campaigns,
              <br />
              key visuals &amp; creative productions.
            </p>
            {allGrid.length > 0 && (
              <span
                className="camp-count text-[9px] tracking-[0.45em] uppercase text-foreground/20"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {allGrid.length} visuals · {campaigns.length} projects
              </span>
            )}
          </div>
        </motion.div>

        {/* Marquee */}
        <div className="camp-marquee relative z-10 border-t border-primary/7 py-4 overflow-hidden bg-background/60 backdrop-blur-sm mb-1">
          <div
            className="flex items-center gap-8 whitespace-nowrap"
            style={{ animation: "marquee 24s linear infinite" }}
          >
            {[...marqueeWords, ...marqueeWords].map((w, i) => (
              <span
                key={i}
                className={
                  w === "✦"
                    ? "text-primary/50 text-[8px]"
                    : "text-foreground/18 text-[11px] tracking-[0.35em] uppercase"
                }
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {w}
              </span>
            ))}
          </div>
          <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
        </div>
      </section>

      {/* Gallery */}
      <section className="relative bg-background">
        {services.length > 1 && (
          <FilterBar
            services={services}
            active={activeFilter}
            onChange={handleFilter}
            total={allGrid.length}
            filtered={filteredCount}
          />
        )}

        <div className="px-[3px] pb-[3px]">
          {allGrid.length > 0 ? (
            <div
              className="grid gap-[3px]"
              style={{
                gridTemplateColumns: "repeat(4,1fr)",
                gridAutoRows: "230px",
                gridAutoFlow: "row dense",
              }}
            >
              {allGrid.map((item, i) => (
                <Card
                  key={`${(item.campaign as any)._id}-${i}`}
                  item={item}
                  index={i}
                  isVisible={visibleSet.has(i)}
                  onOpen={() => {
                    const visIdx = visibleItems.findIndex((v) => v === item);
                    if (visIdx !== -1) openLightbox(visIdx);
                  }}
                />
              ))}
            </div>
          ) : (
            <PlaceholderGrid />
          )}
        </div>

        {/* Footer CTA */}
        <div className="relative px-8 md:px-20 py-28 border-t border-primary/7 mt-1">
          <div
            className="absolute inset-0 pointer-events-none
                          bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(243,121,167,0.04)_0%,transparent_70%)]"
          />
          <div className="relative max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-primary/60" />
                <span
                  className="text-[9px] tracking-[0.5em] uppercase text-primary/70"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Ready to collaborate?
                </span>
              </div>
              <h2
                className="font-bold leading-[1] tracking-tight text-foreground"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(36px,5vw,72px)",
                }}
              >
                Let's build something
                <br />
                <span className="italic text-primary">remarkable.</span>
              </h2>
            </div>
            <Link
              href="/#contact"
              className="group relative flex items-center gap-4 px-8 py-4 border border-primary/25 text-primary hover:border-primary/60 transition-all duration-500 overflow-hidden"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <div className="absolute inset-0 bg-primary/6 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 text-[10px] tracking-[0.35em] uppercase">
                Start a project
              </span>
              <svg
                className="relative z-10 w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <Lightbox
          items={visibleItems}
          index={lightbox}
          onClose={closeLightbox}
          onChange={changeLightbox}
        />
      )}
    </>
  );
}
