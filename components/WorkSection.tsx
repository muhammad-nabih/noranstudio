"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getOptimizedImageUrl, getBlurDataUrl } from "@/lib/image-optimization";
import type { Campaign, Service } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkSectionProps {
  campaigns: Campaign[];
}

// ─── Sub-component: single cinematic slide ────────────────────────────────────

interface SlideProps {
  campaign: Campaign;
  index: number;
  total: number;
  isActive: boolean;
}

function CinemaSlide({ campaign, index, total, isActive }: SlideProps) {
  const imgUrl = getOptimizedImageUrl(campaign.heroImage, {
    width: 1920,
    height: 1080,
  });
  const lqip = getBlurDataUrl(campaign.heroImage);
  const fallback = "#030202";
  const titleRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const leak1Ref = useRef<HTMLDivElement>(null);
  const leak2Ref = useRef<HTMLDivElement>(null);
  const leak3Ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  // entrance animation (pure CSS transitions)
  useEffect(() => {
    const els = {
      title: titleRef.current,
      desc: descRef.current,
      cta: ctaRef.current,
      meta: metaRef.current,
      l1: leak1Ref.current,
      l2: leak2Ref.current,
      l3: leak3Ref.current,
      img: imgRef.current,
    };

    const reset = () => {
      if (els.title) {
        els.title.style.transition = "none";
        els.title.style.transform = "translateY(105%)";
        els.title.style.opacity = "0";
      }
      if (els.desc) {
        els.desc.style.transition = "none";
        els.desc.style.transform = "translateY(22px)";
        els.desc.style.opacity = "0";
      }
      if (els.cta) {
        els.cta.style.transition = "none";
        els.cta.style.transform = "translateY(18px)";
        els.cta.style.opacity = "0";
      }
      if (els.meta) {
        els.meta.style.transition = "none";
        els.meta.style.transform = "translateX(14px)";
        els.meta.style.opacity = "0";
      }
      if (els.l1) {
        els.l1.style.transition = "none";
        els.l1.style.opacity = "0";
      }
      if (els.l2) {
        els.l2.style.transition = "none";
        els.l2.style.opacity = "0";
      }
      if (els.l3) {
        els.l3.style.transition = "none";
        els.l3.style.opacity = "0";
      }
      if (els.img) {
        els.img.style.transition = "none";
        els.img.style.transform = "scale(1.06)";
      }
    };

    reset();
    if (!isActive) return;

    void titleRef.current?.offsetHeight;

    const q = (delay: number, fn: () => void) => setTimeout(fn, delay);

    // light leaks
    q(0, () => {
      if (els.l1) {
        els.l1.style.transition = "opacity 1.6s ease";
        els.l1.style.opacity = "1";
      }
    });
    q(120, () => {
      if (els.l2) {
        els.l2.style.transition = "opacity 2.0s ease";
        els.l2.style.opacity = "1";
      }
    });
    q(220, () => {
      if (els.l3) {
        els.l3.style.transition = "opacity 1.4s ease";
        els.l3.style.opacity = "1";
      }
    });

    // image breathes in
    q(60, () => {
      if (els.img) {
        els.img.style.transition = "transform 1.8s cubic-bezier(0.16,1,0.3,1)";
        els.img.style.transform = "scale(1)";
      }
    });

    // title sweeps up
    q(180, () => {
      if (els.title) {
        els.title.style.transition =
          "transform 1.0s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease";
        els.title.style.transform = "translateY(0)";
        els.title.style.opacity = "1";
      }
    });

    // desc fades in
    q(440, () => {
      if (els.desc) {
        els.desc.style.transition =
          "opacity 0.85s ease, transform 0.85s cubic-bezier(0.16,1,0.3,1)";
        els.desc.style.opacity = "1";
        els.desc.style.transform = "translateY(0)";
      }
    });

    // cta
    q(620, () => {
      if (els.cta) {
        els.cta.style.transition =
          "opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)";
        els.cta.style.opacity = "1";
        els.cta.style.transform = "translateY(0)";
      }
    });

    // meta tags
    q(740, () => {
      if (els.meta) {
        els.meta.style.transition =
          "opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)";
        els.meta.style.opacity = "1";
        els.meta.style.transform = "translateX(0)";
      }
    });

    return () => {
      // timeouts will be cleaned
    };
  }, [isActive]);

  return (
    <article className="relative flex-shrink-0 w-screen h-full overflow-hidden">
      {/* Background image */}
      <div
        ref={imgRef}
        className="absolute inset-0 will-change-transform"
        style={{ transform: "scale(1.06)" }}
      >
        {lqip && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${lqip})`,
              filter: "blur(20px)",
              transform: "scale(1.05)",
            }}
          />
        )}
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={campaign.heroImage?.alt ?? campaign.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: fallback }} />
        )}
      </div>

      {/* Light leaks (pink tones) */}
      <div
        ref={leak1Ref}
        className="absolute pointer-events-none rounded-full opacity-0"
        style={{
          width: "55vw",
          height: "55vw",
          right: "-12vw",
          top: "-12vw",
          background:
            "radial-gradient(circle, rgba(243,121,167,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        ref={leak2Ref}
        className="absolute pointer-events-none rounded-full opacity-0"
        style={{
          width: "35vw",
          height: "35vw",
          left: "25%",
          bottom: "-8vw",
          background:
            "radial-gradient(circle, rgba(243,121,167,0.10) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        ref={leak3Ref}
        className="absolute pointer-events-none rounded-full opacity-0"
        style={{
          width: "18vw",
          height: "18vw",
          left: "5%",
          top: "20%",
          background:
            "radial-gradient(circle, rgba(243,121,167,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Cinematic overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "linear-gradient(100deg, rgba(3,2,2,0.92) 0%, rgba(3,2,2,0.55) 42%, rgba(3,2,2,0.08) 100%)",
            "linear-gradient(to bottom, rgba(3,2,2,0.55) 0%, transparent 22%, transparent 72%, rgba(3,2,2,0.75) 100%)",
          ].join(", "),
        }}
      />

      {/* horizontal letterbox bars */}
      <div
        className="absolute top-0 inset-x-0 h-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(3,2,2,0.70) 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-28 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(3,2,2,0.80) 0%, transparent 100%)",
        }}
      />

      {/* Slide number watermark */}
      <div
        className="absolute right-[8%] top-[15%] pointer-events-none select-none font-mono"
        style={{
          fontSize: "clamp(80px, 14vw, 200px)",
          fontWeight: 300,
          color: "rgba(255,255,255,0.04)",
          lineHeight: 1,
          letterSpacing: "-0.05em",
        }}
      >
        {pad(index + 1)}
      </div>

      {/* Main content */}
      <div className="absolute left-[7%] md:left-[9%] bottom-[13%] z-10 max-w-[620px]">
        {/* eyebrow row */}
        <div className="flex items-center gap-4 mb-5">
          <span
            className="inline-block h-px bg-white"
            style={{ width: 28, opacity: 0.45 }}
          />
          <span className="font-mono text-[9px] tracking-[0.55em] uppercase text-white/55">
            {pad(index + 1)}&nbsp;&nbsp;/&nbsp;&nbsp;{pad(total)}
          </span>
          {campaign.clientName && (
            <>
              <span className="inline-block w-px h-3 bg-white/20" />
              <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-white/38">
                {campaign.clientName}
              </span>
            </>
          )}
        </div>

        {/* service label */}
        <div
          className="font-mono text-[9px] tracking-[0.6em] uppercase text-white mb-4"
          style={{ opacity: 0.78 }}
        >
          {campaign.service?.title ?? "Design"}
        </div>

        {/* title */}
        <div className="overflow-hidden mb-7">
          <span
            ref={titleRef}
            className="block font-['Playfair_Display'] font-bold text-white leading-[0.92]"
            style={{
              fontSize: "clamp(46px, 6.5vw, 92px)",
              transform: "translateY(105%)",
              opacity: 0,
            }}
          >
            {campaign.title}
          </span>
        </div>

        {/* description */}
        <p
          ref={descRef}
          className="font-['Cormorant_Garamond'] font-light text-[16px] leading-[1.8] text-white/62 max-w-[440px]"
          style={{ opacity: 0, transform: "translateY(22px)" }}
        >
          {campaign.shortDescription}
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap items-center gap-8 my-4">
          <Link
            ref={ctaRef}
            href={`/campaigns/${campaign.slug.current}`}
            className={cn(
              "group relative inline-flex items-center gap-3",
              "font-mono text-xs font-medium tracking-[0.3em] uppercase",
              "text-white/90",
              "bg-background/30 backdrop-blur-sm",
              "border border-white/20 rounded-full",
              "px-6 py-3",
              "transition-all duration-500 ease-out",
              "hover:border-primary hover:bg-primary/20 hover:text-white hover:shadow-lg hover:shadow-primary/20",
              "hover:gap-5",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 mb-8"
            )}
            style={{ opacity: 0, transform: "translateY(18px)" }}
          >
            <span>View project</span>
            <span className="text-lg transition-transform duration-500 group-hover:translate-x-1.5 group-hover:scale-110">
              →
            </span>
          </Link>

          {campaign.behanceUrl && (
            <a
              href={campaign.behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2",
                "font-mono text-[11px] font-medium tracking-[0.3em] uppercase",
                "text-white/60 hover:text-white",
                "transition-all duration-300",
                "border-b border-white/20 hover:border-primary",
                "pb-1"
              )}
              style={{ opacity: 0, transform: "translateY(18px)" }}
            >
              Behance
              <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">↗</span>
            </a>
          )}
        </div>
      </div>

      {/* Right-side meta stack */}
      <div
        ref={metaRef}
        className="absolute right-[6%] top-1/2 -translate-y-1/2 z-10 flex flex-col items-end gap-2.5"
        style={{ opacity: 0, transform: "translateX(14px)" }}
      >
        {campaign.year && (
          <span
            className="font-mono text-[8px] tracking-[0.35em] uppercase"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            {campaign.year}
          </span>
        )}
        <span
          className="w-px h-10 block"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        <span
          className="font-['Cormorant_Garamond'] text-[11px] italic tracking-wide"
          style={{
            color: "rgba(255,255,255,0.18)",
            writingMode: "vertical-rl",
          }}
        >
          {campaign.service?.title}
        </span>
      </div>
    </article>
  );
}

// ─── Sub-component: left/right nav arrow ──────────────────────────────────────

interface NavArrowProps {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}

function NavArrow({ direction, onClick, disabled }: NavArrowProps) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      aria-label={isPrev ? "Previous project" : "Next project"}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-[60]",
        isPrev ? "left-4 md:left-7" : "right-4 md:right-7",
        "w-11 h-11 md:w-12 md:h-12 rounded-full",
        "flex items-center justify-center",
        "bg-background/40 backdrop-blur-md",
        "border border-primary/15",
        "text-primary/50",
        "transition-all duration-400 ease-out",
        "hover:border-primary/55 hover:text-primary hover:bg-primary/8",
        "hover:scale-105 active:scale-95",
        "disabled:opacity-0 disabled:pointer-events-none",
        "focus:outline-none focus:ring-1 focus:ring-primary/40"
      )}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        className="transition-transform duration-300"
        style={{ transform: isPrev ? "translateX(0)" : "translateX(0)" }}
      >
        <path
          d={isPrev ? "M10 2.5L4.5 8L10 13.5" : "M6 2.5L11.5 8L6 13.5"}
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function WorkSection({ campaigns }: WorkSectionProps) {
  const reelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const wheelCooldown = useRef(false);
  const touchStart = useRef(0);

  const [current, setCurrent] = useState(0);
  const [filterId, setFilterId] = useState<string | null>(null);

  // derived data
  const services = useMemo<Service[]>(() => {
    const map = new Map<string, Service>();
    campaigns.forEach((c) => {
      if (c.service) map.set(c.service._id, c.service);
    });
    return Array.from(map.values());
  }, [campaigns]);

  const filtered = useMemo(
    () =>
      filterId
        ? campaigns.filter((c) => c.service?._id === filterId)
        : campaigns,
    [campaigns, filterId],
  );
  const total = filtered.length;

  // translate reel
  const updateReel = useCallback(
    (idx: number, instant = false) => {
      if (!reelRef.current) return;
      reelRef.current.style.transition = instant
        ? "none"
        : "transform 1.15s cubic-bezier(0.77,0,0.18,1)";
      reelRef.current.style.transform = `translateX(${-idx * 100}vw)`;
      if (progressRef.current) {
        progressRef.current.style.width =
          total > 1 ? `${(idx / (total - 1)) * 100}%` : "0%";
      }
    },
    [total],
  );

  // navigate
  const goTo = useCallback(
    (n: number) => {
      if (isAnimating.current || n === current || n < 0 || n >= total) return;
      isAnimating.current = true;
      setCurrent(n);
      updateReel(n);
      setTimeout(() => {
        isAnimating.current = false;
      }, 1200);
    },
    [current, total, updateReel],
  );

  // keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(current + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goTo(current - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goTo, current]);

  // wheel
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (wheelCooldown.current) return;
      if (Math.abs(e.deltaY) < 40) return;
      wheelCooldown.current = true;
      goTo(e.deltaY > 0 ? current + 1 : current - 1);
      setTimeout(() => {
        wheelCooldown.current = false;
      }, 1300);
    };
    window.addEventListener("wheel", handler, { passive: true });
    return () => window.removeEventListener("wheel", handler);
  }, [goTo, current]);

  // touch
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const diff = touchStart.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 55) goTo(diff > 0 ? current + 1 : current - 1);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [goTo, current]);

  // filter change: reset to 0
  const applyFilter = useCallback((id: string | null) => {
    setFilterId(id);
    setCurrent(0);
  }, []);

  useEffect(() => {
    updateReel(0, true);
  }, [filterId, updateReel]);

  return (
    <section
      id="work"
      className="relative w-full overflow-hidden bg-background"
      style={{ height: "100svh" }}
      aria-label="Selected work"
    >
      {/* grain texture */}
      <div
        aria-hidden
        className="absolute inset-0 z-[90] pointer-events-none opacity-[0.038]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      <div className="flex justify-center items-center w-full my-8 px-4 relative z-[100]">
        {services.length > 0 && (
          <nav
            className="relative z-[200] flex flex-wrap justify-center gap-1 md:gap-2 rounded-full border border-primary/20 bg-background/40 backdrop-blur-xl p-1 shadow-lg shadow-primary/5"
            aria-label="Filter by service"
          >
            {(["All", ...services.map((s) => s.title)] as string[]).map(
              (label, i) => {
                const id = i === 0 ? null : services[i - 1]._id;
                const active = id === filterId;
                return (
                  <button
                    key={label}
                    onClick={() => applyFilter(id)}
                    className={cn(
                      "relative px-5 md:px-6 py-2.5 text-[10px] md:text-[11px] font-mono font-medium tracking-[0.2em] uppercase transition-all duration-300 rounded-full",
                      "hover:tracking-[0.25em]",
                      active
                        ? "text-background bg-accent shadow-md shadow-accent/30"
                        : "text-foreground/60 hover:text-accent hover:bg-accent/10"
                    )}
                  >
                    {label}
                    {active && (
                      <span className="absolute inset-0 rounded-full bg-accent -z-10 animate-pulse opacity-20" />
                    )}
                  </button>
                );
              }
            )}
          </nav>
        )}
      </div>

      {/* left/right nav arrows */}
      <NavArrow direction="prev" onClick={() => goTo(current - 1)} disabled={current === 0} />
      <NavArrow direction="next" onClick={() => goTo(current + 1)} disabled={current === total - 1} />

      {/* slide counter */}
      <div
        className="absolute left-9 bottom-[9%] z-[100] font-mono"
        style={{
          color: "rgba(243,121,167,0.32)",
          letterSpacing: "0.35em",
          fontSize: 10,
        }}
      >
        <span
          className="block font-light"
          style={{
            fontSize: "clamp(18px,2vw,24px)",
            color: "var(--primary)",
            lineHeight: 1,
          }}
        >
          {pad(current + 1)}
        </span>
        <span className="block mt-1">/ {pad(total)}</span>
      </div>

      {/* progress line */}
      <div
        ref={progressRef}
        className="absolute bottom-0 left-0 h-px z-[100] bg-primary"
        style={{
          width: "0%",
          transition: "width 1.15s cubic-bezier(0.77,0,0.18,1)",
        }}
      />

      {/* reel */}
      <div
        ref={reelRef}
        className="flex h-full will-change-transform"
        style={{
          width: `${total * 100}vw`,
          transform: "translateX(0)",
        }}
      >
        {filtered.map((campaign, i) => (
          <CinemaSlide
            key={campaign._id}
            campaign={campaign}
            index={i}
            total={total}
            isActive={i === current}
          />
        ))}
      </div>

      {/* hint badge */}
      <HintBadge />
    </section>
  );
}

// ─── Hint badge — fades out after first interaction ──────────────────────

function HintBadge() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = () => setVisible(false);
    const opts = { once: true, passive: true } as const;
    window.addEventListener("wheel", hide, opts);
    window.addEventListener("keydown", hide, opts);
    window.addEventListener("touchstart", hide, opts);
    const t = setTimeout(hide, 5000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="absolute bottom-9 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 pointer-events-none"
      style={{
        fontFamily: "DM Mono, monospace",
        fontSize: 8,
        letterSpacing: "0.4em",
        textTransform: "uppercase",
        color: "rgba(243,121,167,0.30)",
        animation: "fadeOut 1s 4s forwards",
      }}
    >
      <span>Scroll or use arrows</span>
      <span style={{ fontSize: 12 }}>↕</span>
      <style>{`@keyframes fadeOut { to { opacity: 0 } }`}</style>
    </div>
  );
}