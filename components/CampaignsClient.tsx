"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { getOptimizedImageUrl, getBlurDataUrl } from "@/lib/image-optimization";
import type { Campaign } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

// ─── Constants ────────────────────────────────────────────────────────────────
const CARDS_PER_PAGE = 8; // 4 cols × 2 rows — perfect symmetry

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props {
  campaigns: Campaign[];
}

interface GridItem {
  campaign: Campaign;
  imgSrc: string;
  blur: string;
  serviceSlug: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildGrid(campaigns: Campaign[]): GridItem[] {
  const items: GridItem[] = [];
  for (const c of campaigns) {
    const srcs: Array<{ src: string; blur: string }> = [];
    if (c.heroImage?.asset) {
      srcs.push({
        src: getOptimizedImageUrl(c.heroImage, { width: 900, quality: 85 }),
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
      items.push({
        campaign: c,
        imgSrc: src,
        blur,
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
      className="relative z-10 px-8 md:px-20 pb-8 flex flex-col sm:flex-row
                 items-start sm:items-center justify-between gap-6"
    >
      <div className="flex items-center gap-2 flex-wrap">
        {services.map((svc) => {
          const isActive = active === svc;
          return (
            <button
              key={svc}
              onClick={() => onChange(svc)}
              className="filter-item relative px-5 py-2 text-[9px] tracking-[0.4em]
                         uppercase transition-all duration-400 overflow-hidden group"
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
                className="absolute inset-0 bg-primary/6 -translate-x-full
                           group-hover:translate-x-0 transition-transform duration-500"
                style={{ display: isActive ? "none" : "block" }}
              />
              <span className="relative z-10">{svc}</span>
            </button>
          );
        })}
      </div>

      <div
        className="filter-item flex items-center gap-2 text-[9px]
                   tracking-[0.4em] uppercase text-foreground/20"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        <span className="text-primary/60">{filtered}</span>
        <span>/</span>
        <span>{total} visuals</span>
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div
      className="relative flex items-center justify-center gap-2 py-10 px-8
                 border-t border-primary/7"
    >
      {/* Prev */}
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center
                   border border-primary/12 text-foreground/25
                   hover:border-primary/40 hover:text-primary
                   disabled:opacity-30 disabled:cursor-not-allowed
                   transition-all duration-300"
        aria-label="Previous page"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path
            d="M8 3L4 6.5L8 10"
            stroke="currentColor"
            strokeWidth=".85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Page numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onChange(page)}
          className="w-9 h-9 flex items-center justify-center
                     border transition-all duration-300 text-[10px]
                     tracking-[0.2em]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            border:
              page === currentPage
                ? "1px solid rgba(243,121,167,0.6)"
                : "1px solid rgba(243,121,167,0.12)",
            color:
              page === currentPage ? "var(--primary)" : "rgba(255,191,205,0.25)",
            background:
              page === currentPage ? "rgba(243,121,167,0.08)" : "transparent",
          }}
        >
          {String(page).padStart(2, "0")}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center
                   border border-primary/12 text-foreground/25
                   hover:border-primary/40 hover:text-primary
                   disabled:opacity-30 disabled:cursor-not-allowed
                   transition-all duration-300"
        aria-label="Next page"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path
            d="M5 3L9 6.5L5 10"
            stroke="currentColor"
            strokeWidth=".85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Page info */}
      <div
        className="absolute right-8 text-[9px] tracking-[0.4em]
                   uppercase text-foreground/18"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        <span className="text-primary/60">{currentPage}</span>
        {" / "}
        {totalPages}
      </div>
    </div>
  );
}

// ─── Locked Placeholder Card ───────────────────────────────────────────────────
function LockedCard({ index }: { index: number }) {
  return (
    <div
      className="relative overflow-hidden flex flex-col items-center
                 justify-center gap-3"
      style={{
        background: `linear-gradient(135deg,
          hsl(340, 40%, ${5 + (index % 3)}%) 0%,
          hsl(340, 35%, ${7 + (index % 3)}%) 100%)`,
      }}
    >
      {/* Dashed border inset */}
      <div
        className="absolute inset-[1px] pointer-events-none"
        style={{ border: "1px dashed rgba(243,121,167,0.08)" }}
      />

      {/* Diagonal hatching */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            rgba(243,121,167,1),
            rgba(243,121,167,1) 1px,
            transparent 1px,
            transparent 28px
          )`,
        }}
      />

      {/* Lock icon */}
      <div
        className="relative w-9 h-9 rounded-full flex items-center
                   justify-center"
        style={{ border: "1px solid rgba(243,121,167,0.14)" }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{ color: "rgba(243,121,167,0.22)" }}
        >
          <rect
            x="2.5"
            y="6.5"
            width="9"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth=".75"
          />
          <path
            d="M4.5 6.5V5A2.5 2.5 0 0 1 9.5 5V6.5"
            stroke="currentColor"
            strokeWidth=".75"
          />
        </svg>
      </div>

      {/* Label */}
      <span
        className="text-[8px] tracking-[0.45em] uppercase"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "rgba(243,121,167,0.16)",
        }}
      >
        Coming Soon
      </span>

      {/* Dots */}
      <div className="flex items-center gap-1.5">
        {[1, 0.6, 0.3].map((op, i) => (
          <div
            key={i}
            className="w-[3px] h-[3px] rounded-full"
            style={{ background: `rgba(243,121,167,${op * 0.12})` }}
          />
        ))}
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
      gsap.set(el, { autoAlpha: 0 });
      gsap.to(el, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
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
        duration: 0.28,
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
      <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />

      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 z-20 px-8 py-6
                   flex items-center justify-between"
        style={{
          background:
            "linear-gradient(to bottom, rgba(3,2,0,0.8), transparent)",
        }}
      >
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
        <button
          onClick={close}
          className="group w-10 h-10 flex items-center justify-center
                     border border-primary/10 hover:border-primary/40
                     transition-colors duration-300"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="text-foreground/30 group-hover:text-primary
                       transition-colors duration-300"
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
      <div
        className="relative z-10 px-20"
        onClick={(e) => e.stopPropagation()}
      >
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

        {/* Info panel */}
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
          <div className="flex items-center gap-3 flex-shrink-0">
            {(item.campaign as any).behanceUrl && (
              <a
                href={(item.campaign as any).behanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-5 py-2.5
                           border border-primary/20 text-primary/60
                           hover:text-primary hover:border-primary/50
                           transition-all duration-300"
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
                className="flex items-center gap-3 px-6 py-2.5 bg-primary
                           text-background hover:bg-secondary
                           transition-colors duration-300 group"
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
  displayIndex,
  onOpen,
  isVisible,
  animDelay,
}: {
  item: GridItem;
  displayIndex: number;
  onOpen: () => void;
  isVisible: boolean;
  animDelay: number;
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
        { autoAlpha: 0, y: 40, clipPath: "inset(0 0 100% 0)" },
        {
          autoAlpha: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: 1.1,
          ease: "power4.out",
          delay: animDelay,
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 94%",
            toggleActions: "play none none none",
          },
        },
      );
    });
    return () => ctx.revert();
  }, [animDelay]);

  /* Filter/page visibility */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    gsap.to(el, {
      autoAlpha: isVisible ? 1 : 0,
      scale: isVisible ? 1 : 0.95,
      duration: 0.5,
      ease: "power3.out",
      pointerEvents: isVisible ? "all" : "none",
    });
  }, [isVisible]);

  /* Hover */
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
      duration: 0.42,
      ease: "power3.out",
    });
    gsap.to(numRef.current, { color: "rgba(243,121,167,0.22)", duration: 0.3 });
    gsap.fromTo(
      shimRef.current,
      { top: "-2px", autoAlpha: 0 },
      { top: "102%", autoAlpha: 0.7, duration: 1.8, ease: "none" },
    );
  }, []);

  const onLeave = useCallback(() => {
    setHov(false);
    gsap.to(imgRef.current, { scale: 1, duration: 0.8, ease: "power3.out" });
    gsap.to(lineRef.current, {
      scaleX: 0,
      duration: 0.38,
      ease: "power3.in",
      transformOrigin: "right",
    });
    gsap.to(infoRef.current, {
      y: 10,
      autoAlpha: 0,
      duration: 0.32,
      ease: "power2.in",
    });
    gsap.to(numRef.current, { color: "rgba(255,191,205,0.1)", duration: 0.3 });
  }, []);

  return (
    <div
      ref={wrapRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative overflow-hidden"
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
            sizes="(max-width:768px) 50vw, 25vw"
          />
        </div>

        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: `
              linear-gradient(to top, rgba(3,2,2,0.94) 0%, rgba(3,2,2,0.12) 48%, transparent 72%),
              linear-gradient(to right, rgba(3,2,2,0.35) 0%, transparent 42%)
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
        className="absolute top-4 left-4 z-[2] font-bold leading-none
                   select-none pointer-events-none"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(26px, 3vw, 42px)",
          color: "rgba(255,191,205,0.1)",
          lineHeight: 1,
        }}
      >
        {String(displayIndex).padStart(2, "0")}
      </span>

      {/* Service tag */}
      <div
        className="absolute top-4 right-4 z-[2] px-3 py-1.5
                   border border-primary/20 bg-background/70 backdrop-blur-sm
                   pointer-events-none"
        style={{
          opacity: hov ? 1 : 0,
          transform: hov ? "translateX(0)" : "translateX(10px)",
          transition: "all 0.35s ease",
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
        className="absolute top-3 left-3 w-4 h-4 border-t border-l
                   border-primary/45 transition-opacity duration-300
                   pointer-events-none z-[2]"
        style={{ opacity: hov ? 1 : 0 }}
      />
      <div
        className="absolute bottom-3 right-3 w-4 h-4 border-b border-r
                   border-primary/45 transition-opacity duration-300
                   pointer-events-none z-[2]"
        style={{ opacity: hov ? 1 : 0 }}
      />

      {/* Bottom info panel */}
      <div className="absolute bottom-0 left-0 right-0 z-[3] p-4">
        <div
          ref={infoRef}
          style={{ opacity: 0, transform: "translateY(10px)" }}
          className="mb-2"
        >
          {(clientName || year) && (
            <div className="flex items-center gap-3 mb-2.5">
              {clientName && (
                <span
                  className="text-[8px] tracking-[0.4em] uppercase text-primary"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {clientName}
                </span>
              )}
              {clientName && year && (
                <span className="w-px h-2.5 bg-primary/25" />
              )}
              {year && (
                <span
                  className="text-[8px] tracking-[0.3em] uppercase text-primary/45"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {year}
                </span>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 relative z-[4]">
            {slug && (
              <Link
                href={`/campaigns/${slug}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary
                           text-background hover:bg-secondary transition-colors
                           duration-300 group/btn"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <span className="text-[8px] tracking-[0.3em] uppercase font-semibold">
                  View Project
                </span>
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 9 9"
                  fill="none"
                  className="group-hover/btn:translate-x-0.5 transition-transform duration-300"
                >
                  <path
                    d="M1.5 4.5h6M4.5 1.5l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="0.85"
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
                className="flex items-center gap-1 px-3.5 py-1.5
                           border border-primary/25 text-primary/55
                           hover:text-primary hover:border-primary/50
                           transition-all duration-300 backdrop-blur-sm"
                style={{
                  background: "rgba(3,2,2,0.6)",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                <span className="text-[8px] tracking-[0.3em] uppercase">
                  Behance
                </span>
                <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                  <path
                    d="M1 6L6 1M6 1H3M6 1V4"
                    stroke="currentColor"
                    strokeWidth="0.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}

            {/* Quick-view expand */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              className="w-7 h-7 flex items-center justify-center
                         border border-primary/14 bg-background/60 backdrop-blur-sm
                         text-foreground/28 hover:text-primary hover:border-primary/40
                         transition-all duration-300"
              title="Quick view"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1 3.5V1h2.5M6.5 1H9v2.5M9 6.5V9H6.5M3.5 9H1V6.5"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <h3
          className="font-semibold leading-tight tracking-tight
                     text-foreground pointer-events-none"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(12px, 1vw, 15px)",
          }}
        >
          {item.campaign.title}
        </h3>

        <div
          ref={lineRef}
          className="mt-2 h-px bg-gradient-to-r from-primary
                     via-secondary to-transparent scale-x-0 pointer-events-none"
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
        gridTemplateColumns: "repeat(4, 1fr)",
        gridAutoRows: "260px",
      }}
    >
      {Array.from({ length: CARDS_PER_PAGE }, (_, i) => (
        <div
          key={i}
          className="relative overflow-hidden"
          style={{
            background: `hsl(340, 40%, ${5 + (i % 3) * 2}%)`,
            animation: `pulsePink 2.4s ease-in-out ${i * 0.18}s infinite`,
          }}
        >
          <div className="absolute bottom-4 left-4">
            <div className="w-14 h-1 rounded-full bg-primary/7 mb-2" />
            <div className="w-9 h-0.5 rounded-full bg-primary/5" />
          </div>
        </div>
      ))}
      <style>{`@keyframes pulsePink{0%,100%{opacity:.5}50%{opacity:.9}}`}</style>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CampaignsClient({ campaigns }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const yHdr = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const opHdr = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const allGrid = useMemo(() => buildGrid(campaigns), [campaigns]);
  const services = useMemo(() => getServices(campaigns), [campaigns]);

  /* Filtered items (for the active service filter) */
  const filteredItems = useMemo(() => {
    if (activeFilter === "All") return allGrid;
    return allGrid.filter(
      (item) => item.campaign.service?.title === activeFilter,
    );
  }, [activeFilter, allGrid]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / CARDS_PER_PAGE));

  /* Current page slice */
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * CARDS_PER_PAGE;
    return filteredItems.slice(start, start + CARDS_PER_PAGE);
  }, [filteredItems, currentPage]);

  /* How many locked placeholders to fill the grid */
  const lockedCount = CARDS_PER_PAGE - pageItems.length;

  /* Lightbox navigation works over filteredItems */
  const openLightbox = useCallback(
    (filteredIdx: number) => setLightbox(filteredIdx),
    [],
  );
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const changeLightbox = useCallback((i: number) => setLightbox(i), []);

  const handleFilter = useCallback((s: string) => {
    setLightbox(null);
    setCurrentPage(1);
    setActiveFilter(s);
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      setLightbox(null);
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
      // Scroll gallery into view
      document
        .getElementById("campaigns-gallery")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [totalPages],
  );

  /* GSAP hero entrance */
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
    "Campaign", "✦", "Key Visual", "✦", "Retouching",
    "✦", "Post Production", "✦", "Campaign", "✦",
    "Key Visual", "✦", "Retouching", "✦", "Post Production", "✦",
  ];

  return (
    <>
      {/* ── Hero header ── */}
      <section
        ref={sectionRef}
        id="campaigns"
        className="relative min-h-[65vh] w-full overflow-hidden bg-background flex flex-col"
      >
        {/* Bg effects */}
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
              className="camp-title block font-bold leading-[0.9]
                         tracking-[-0.02em] text-foreground"
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
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
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

      {/* ── Gallery ── */}
      <section id="campaigns-gallery" className="relative bg-background">
        {services.length > 1 && (
          <FilterBar
            services={services}
            active={activeFilter}
            onChange={handleFilter}
            total={allGrid.length}
            filtered={filteredItems.length}
          />
        )}

        <div className="px-[3px] pb-[3px]">
          {allGrid.length > 0 ? (
            <div
              className="grid gap-[3px]"
              style={{
                /*
                 * Symmetric 4-column grid.
                 * All cards are exactly 1×1 — no tall/wide breaking symmetry.
                 * gridAutoRows is fixed so every row is the same height.
                 */
                gridTemplateColumns: "repeat(4, 1fr)",
                gridAutoRows: "260px",
              }}
            >
              {/* Real cards for this page */}
              {pageItems.map((item, i) => {
                const globalFilteredIdx = filteredItems.indexOf(item);
                const displayNumber =
                  (currentPage - 1) * CARDS_PER_PAGE + i + 1;

                return (
                  <Card
                    key={`${(item.campaign as any)._id}-${i}`}
                    item={item}
                    displayIndex={displayNumber}
                    isVisible={true}
                    animDelay={i * 0.06}
                    onOpen={() => openLightbox(globalFilteredIdx)}
                  />
                );
              })}

              {/* Locked placeholder cards to maintain 4×2 symmetry */}
              {Array.from({ length: lockedCount }, (_, i) => (
                <LockedCard key={`locked-${i}`} index={i} />
              ))}
            </div>
          ) : (
            <PlaceholderGrid />
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={handlePageChange}
        />

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
              className="group relative flex items-center gap-4 px-8 py-4
                         border border-primary/25 text-primary
                         hover:border-primary/60 transition-all duration-500 overflow-hidden"
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

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <Lightbox
          items={filteredItems}
          index={lightbox}
          onClose={closeLightbox}
          onChange={changeLightbox}
        />
      )}
    </>
  );
}