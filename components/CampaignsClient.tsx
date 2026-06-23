"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { getOptimizedImageUrl, getBlurDataUrl } from "@/lib/image-optimization";
import type { Campaign } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

// ─── Constants ────────────────────────────────────────────────────────────────
const CARDS_PER_PAGE = 8;

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

// ─── Floating Side Panel ──────────────────────────────────────────────────────
// Revealed on hover over a thin trigger strip on the right edge.
// Contains: back arrow → /campaigns, filter pills, prev/next arrows.
function SidePanel({
  services,
  active,
  onChange,
  currentPage,
  totalPages,
  onPageChange,
}: {
  services: string[];
  active: string;
  onChange: (s: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    setHovered(true);
  };

  const handleMouseLeave = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    hideTimeout.current = setTimeout(() => {
      setHovered(false);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    gsap.to(el, {
      x: hovered ? 0 : "100%",
      opacity: hovered ? 1 : 0,
      duration: 0.9,
      ease: hovered ? "power3.out" : "power3.in",
    });
  }, [hovered]);

  return (
    <div
      className="fixed right-0 top-0 h-full z-50 flex items-stretch"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger strip */}
      <div
        className="w-[18px] h-full flex flex-col items-center justify-center
                   gap-[5px] cursor-pointer"
      >
        {/* Three dots - using teal primary */}
        {[0.5, 1, 0.5].map((op, i) => (
          <div
            key={i}
            className="w-[3px] h-[3px] rounded-full transition-all duration-300"
            style={{
              background: `rgba(50, 90, 87,${hovered ? 0 : op * 0.4})`,
            }}
          />
        ))}

        {/* Vertical line hint - teal gradient */}
        <div
          className="absolute right-0 top-0 h-full w-[1px] transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(50,90,87,0.15) 30%, rgba(50,90,87,0.15) 70%, transparent)",
            opacity: hovered ? 0 : 1,
          }}
        />
      </div>

      {/* The actual panel */}
      <div
        ref={panelRef}
        className="relative flex flex-col 
                   py-8 px-5 w-[200px]
                   bg-background/90 backdrop-blur-xl"
        style={{
          borderLeft: "1px solid rgba(50, 90, 87, 0.12)",
          transform: "translateX(100%)",
          opacity: 0,
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* ── Top: Back arrow ── */}
        <div className='my-4'>
          <Link
            href="/"
            className="flex items-center gap-3 text-foreground/60 hover:text-primary transition-colors duration-300 text-sm tracking-[0.15em] uppercase group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300">
              ←
            </span>
            Back
          </Link>
        </div>

        <div>
          {/* Divider - teal gradient */}
          <div
            className="w-full h-px mb-7"
            style={{
              background:
                "linear-gradient(to right, rgba(50,90,87,0.2), transparent)",
            }}
          />

          {/* ── Filter label ── */}
          <p
            className="text-[7px] tracking-[0.55em] uppercase text-foreground/20 mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Filter
          </p>

          {/* ── Filter pills (vertical) ── */}
          <div className="flex flex-col gap-1.5">
            {services.map((svc) => {
              const isActive = active === svc;
              return (
                <button
                  key={svc}
                  onClick={() => onChange(svc)}
                  className="relative text-left px-3.5 py-2 text-[8px]
                             tracking-[0.35em] uppercase transition-all duration-300
                             overflow-hidden group/pill"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    border: isActive
                      ? "1px solid rgba(50, 90, 87, 0.6)"
                      : "1px solid rgba(50, 90, 87, 0.12)",
                    color: isActive
                      ? "var(--primary)"
                      : "rgba(142, 169, 148, 0.4)",
                    background: isActive
                      ? "rgba(50, 90, 87, 0.08)"
                      : "transparent",
                  }}
                >
                  <span
                    className="absolute inset-0 -translate-x-full
                               group-hover/pill:translate-x-0
                               transition-transform duration-400"
                    style={{
                      background: "rgba(50, 90, 87, 0.06)",
                      display: isActive ? "none" : "block",
                    }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    {isActive && (
                      <span
                        className="w-1 h-1 rounded-full flex-shrink-0"
                        style={{ background: "var(--primary)" }}
                      />
                    )}
                    {svc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Bottom: Pagination arrows ── */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-3">
            {/* Divider */}
            <div
              className="w-full h-px mb-1"
              style={{
                background:
                  "linear-gradient(to right, rgba(50,90,87,0.15), transparent)",
              }}
            />

            {/* Page indicator */}
            <div
              className="flex items-center gap-2 text-[8px] tracking-[0.3em]
                         text-foreground/20"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <span className="text-primary/50">
                {String(currentPage).padStart(2, "0")}
              </span>
              <span
                className="w-6 h-px"
                style={{ background: "rgba(50, 90, 87, 0.2)" }}
              />
              <span>{String(totalPages).padStart(2, "0")}</span>
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center
                           border transition-all duration-300
                           disabled:opacity-20 disabled:cursor-not-allowed
                           hover:text-primary hover:border-primary/40"
                style={{
                  border: "1px solid rgba(50, 90, 87, 0.15)",
                  color: "rgba(142, 169, 148, 0.4)",
                }}
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

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center
                           border transition-all duration-300
                           disabled:opacity-20 disabled:cursor-not-allowed
                           hover:text-primary hover:border-primary/40"
                style={{
                  border: "1px solid rgba(50, 90, 87, 0.15)",
                  color: "rgba(142, 169, 148, 0.4)",
                }}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Locked Placeholder Card ──────────────────────────────────────────────────
function LockedCard({ index }: { index: number }) {
  return (
    <div
      className="relative overflow-hidden flex flex-col items-center
                 justify-center gap-3"
      style={{
        background: `linear-gradient(135deg,
          hsl(150, 12%, ${5 + (index % 3)}%) 0%,
          hsl(150, 10%, ${7 + (index % 3)}%) 100%)`,
      }}
    >
      <div
        className="absolute inset-[1px] pointer-events-none"
        style={{ border: "1px dashed rgba(142,169,148,0.08)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg, rgba(142,169,148,1), rgba(142,169,148,1) 1px,
            transparent 1px, transparent 28px)`,
        }}
      />
      <div
        className="relative w-9 h-9 rounded-full flex items-center justify-center"
        style={{ border: "1px solid rgba(142,169,148,0.14)" }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{ color: "rgba(142,169,148,0.22)" }}
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
      <span
        className="text-[8px] tracking-[0.45em] uppercase"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "rgba(142,169,148,0.16)",
        }}
      >
        Coming Soon
      </span>
      <div className="flex items-center gap-1.5">
        {[1, 0.6, 0.3].map((op, i) => (
          <div
            key={i}
            className="w-[3px] h-[3px] rounded-full"
            style={{ background: `rgba(142,169,148,${op * 0.12})` }}
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
                     border border-primary/10 hover:border-primary/40 transition-colors duration-300"
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
                className="flex items-center gap-2 px-5 py-2.5 border border-primary/20
                           text-primary/60 hover:text-primary hover:border-primary/50
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
                className="flex items-center gap-3 px-6 py-2.5 bg-primary text-background
                           hover:bg-secondary transition-colors duration-300 group"
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
  animDelay,
}: {
  item: GridItem;
  displayIndex: number;
  onOpen: () => void;
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
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: `linear-gradient(to top, rgba(3,2,2,0.94) 0%, rgba(3,2,2,0.12) 48%, transparent 72%), linear-gradient(to right, rgba(3,2,2,0.35) 0%, transparent 42%)`,
            opacity: hov ? 1 : 0.55,
          }}
        />
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

      <span
        ref={numRef}
        className="absolute top-4 left-4 z-[2] font-bold leading-none select-none pointer-events-none"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(26px, 3vw, 42px)",
          color: "rgba(255,191,205,0.1)",
          lineHeight: 1,
        }}
      >
        {String(displayIndex).padStart(2, "0")}
      </span>

      <div
        className="absolute top-4 right-4 z-[2] px-3 py-1.5
                      border border-primary/20 bg-background/70 backdrop-blur-sm pointer-events-none"
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

      <div
        className="absolute top-3 left-3 w-4 h-4 border-t border-l border-primary/45
                      transition-opacity duration-300 pointer-events-none z-[2]"
        style={{ opacity: hov ? 1 : 0 }}
      />
      <div
        className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-primary/45
                      transition-opacity duration-300 pointer-events-none z-[2]"
        style={{ opacity: hov ? 1 : 0 }}
      />

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
          <div className="flex items-center gap-1.5 relative z-[4]">
            {slug && (
              <Link
                href={`/campaigns/${slug}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-background
                           hover:bg-secondary transition-colors duration-300 group/btn"
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
                className="flex items-center gap-1 px-3.5 py-1.5 border border-primary/25
                           text-primary/55 hover:text-primary hover:border-primary/50
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              className="w-7 h-7 flex items-center justify-center border border-primary/14
                         bg-background/60 backdrop-blur-sm text-foreground/28
                         hover:text-primary hover:border-primary/40 transition-all duration-300"
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
          className="font-semibold leading-tight tracking-tight text-foreground pointer-events-none"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(12px, 1vw, 15px)",
          }}
        >
          {item.campaign.title}
        </h3>
        <div
          ref={lineRef}
          className="mt-2 h-px bg-gradient-to-r from-primary via-secondary to-transparent
                     scale-x-0 pointer-events-none"
          style={{ transformOrigin: "left center" }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CampaignsClient({ campaigns }: Props) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const allGrid = useMemo(() => buildGrid(campaigns), [campaigns]);
  const services = useMemo(() => getServices(campaigns), [campaigns]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "All") return allGrid;
    return allGrid.filter(
      (item) => item.campaign.service?.title === activeFilter,
    );
  }, [activeFilter, allGrid]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / CARDS_PER_PAGE),
  );

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * CARDS_PER_PAGE;
    return filteredItems.slice(start, start + CARDS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const lockedCount = CARDS_PER_PAGE - pageItems.length;

  const openLightbox = useCallback((i: number) => setLightbox(i), []);
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
    },
    [totalPages],
  );

  return (
    /*
     * h-screen + overflow-hidden → page is exactly one viewport, zero scroll.
     * The grid fills all available space via flex-1 / h-full.
     */
    <div className="h-screen overflow-hidden bg-background">
      {/* ── Full-bleed grid ───────────────────────────────────────────────
       *  w-full h-full, no padding — cards are edge-to-edge.
       *  gridAutoRows: 50vh → two rows = 100vh exactly.
       *  gap-[3px] keeps the original tight-seam look.
       * ────────────────────────────────────────────────────────────────── */}
      <div className="w-full h-full">
        {allGrid.length > 0 ? (
          <div
            className="grid gap-[3px] w-full h-full"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "repeat(2, 1fr)", // 2 equal rows that together = 100%
            }}
          >
            {pageItems.map((item, i) => {
              const globalFilteredIdx = filteredItems.indexOf(item);
              const displayNumber = (currentPage - 1) * CARDS_PER_PAGE + i + 1;
              return (
                <Card
                  key={`${(item.campaign as any)._id}-${i}`}
                  item={item}
                  displayIndex={displayNumber}
                  animDelay={i * 0.06}
                  onOpen={() => openLightbox(globalFilteredIdx)}
                />
              );
            })}
            {Array.from({ length: lockedCount }, (_, i) => (
              <LockedCard key={`locked-${i}`} index={i} />
            ))}
          </div>
        ) : (
          /* Skeleton */
          <div
            className="grid gap-[3px] w-full h-full"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "repeat(2, 1fr)",
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
        )}
      </div>

      {/* ── Floating Side Panel (hover to reveal) ────────────────────── */}
      <SidePanel
        services={services}
        active={activeFilter}
        onChange={handleFilter}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* ── Lightbox ─────────────────────────────────────────────────── */}
      {lightbox !== null && (
        <Lightbox
          items={filteredItems}
          index={lightbox}
          onClose={closeLightbox}
          onChange={changeLightbox}
        />
      )}
    </div>
  );
}
