"use client";

// ─────────────────────────────────────────────────────────────────────────────
// components/CaseStudyPage.tsx
// Single Case Study page — receives real Sanity data as props
// No mock data. No fallbacks. If data is missing, the page is not rendered.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CaseStudy, SanityImageAsset } from "@/sanity/case-study.queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import BackNav from "./common/BackNav";

gsap.registerPlugin(ScrollTrigger);

// ─── Internal primitives ──────────────────────────────────────────────────────

function SectionLabel({ index, label }: { index: string; label: string }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="flex items-center gap-4 mb-14">
      <motion.span
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="font-mono text-xs text-accent"
      >
        {index}
      </motion.span>
      <motion.div
        initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{ transformOrigin: "left" }}
        className="w-8 h-px bg-border"
      />
      <motion.span
        initial={{ opacity: 0, y: 4 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted-foreground text-xs tracking-widest uppercase"
      >
        {label}
      </motion.span>
    </div>
  );
}

function Divider() {
  return <div className="w-full h-px bg-border/30" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// SanityImage — renders a Sanity image asset using next/image + urlFor.
// ─────────────────────────────────────────────────────────────────────────────
function SanityImage({
  image,
  alt = "",
  caption,
  className = "",
  ratio = "aspect-video",
  width = 1200,
}: {
  image?: SanityImageAsset;
  alt?: string;
  caption?: string;
  className?: string;
  ratio?: string;
  width?: number;
}) {
  const hasAsset = !!image?.asset?._ref;
  const src = hasAsset ? urlFor(image!).width(width).auto("format").url() : null;

  return (
    <figure className={className}>
      <div className={`${ratio} w-full bg-muted/10 border border-border/20 rounded-lg overflow-hidden relative`}>
        {src ? (
          <Image
            src={src}
            alt={image?.alt ?? alt}
            fill
            className="object-cover"
            sizes={`(max-width: 768px) 100vw, ${width}px`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-muted-foreground/20 text-xs font-mono">no image</span>
          </div>
        )}
      </div>
      {(caption ?? image?.caption) && (
        <figcaption className="mt-2 text-muted-foreground text-xs text-center">
          {caption ?? image?.caption}
        </figcaption>
      )}
    </figure>
  );
}

// ─── ① Hero ───────────────────────────────────────────────────────────────────

function Hero({ data }: { data: CaseStudy }) {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1.1, ease: "power3.out", delay: 0.4 }
      );
      const words = titleRef.current?.querySelectorAll(".w");
      if (words?.length) {
        gsap.fromTo(words,
          { y: 70, opacity: 0, rotationX: -18 },
          { y: 0, opacity: 1, rotationX: 0, duration: 0.85, stagger: 0.07, ease: "power3.out", delay: 0.55 }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] flex flex-col justify-end pb-20 pt-36 px-6 md:px-16 overflow-hidden"
    >
      {/* Subtle grid lines */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[18%] top-0 bottom-0 w-px bg-border/10" />
        <div className="absolute right-[18%] top-0 bottom-0 w-px bg-border/10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Meta: tags + year */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8"
        >
          {data.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs tracking-widest uppercase px-3 py-1 border border-accent/40 text-accent bg-accent/5 rounded-full"
            >
              {tag}
            </span>
          ))}
          {data.year && (
            <span className="text-muted-foreground text-sm">{data.year}</span>
          )}
        </motion.div>

        {/* Accent line */}
        <div ref={lineRef} className="w-14 h-px bg-accent mb-8" />

        {/* Title */}
        <h1 ref={titleRef} className="overflow-hidden" style={{ perspective: "900px" }}>
          {data.projectName.split(" ").map((word, i) => (
            <span
              key={i}
              className="w inline-block mr-[0.25em] text-[clamp(3rem,8vw,7rem)] font-bold tracking-tight text-foreground leading-[0.95]"
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        {data.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="mt-6 max-w-2xl text-muted-foreground text-lg leading-relaxed"
          >
            {data.subtitle}
          </motion.p>
        )}

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="mt-16 flex items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-muted-foreground/30"
          />
          <span className="text-muted-foreground text-xs tracking-widest uppercase">Scroll</span>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Generic Section Components ──────────────────────────────────────────────

// Each section: title + description (optional)
function SectionWithTitle({
  id,
  index,
  label,
  title,
  description,
}: {
  id: string;
  index: string;
  label: string;
  title?: string;
  description?: string;
}) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (!title && !description) return null;

  return (
    <section ref={ref} id={id} className="py-28 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <SectionLabel index={index} label={label} />
        <div className="max-w-3xl">
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6"
            >
              {title}
            </motion.h2>
          )}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-muted-foreground leading-relaxed"
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── ⑦ Visual Direction ──────────────────────────────────────────────────────

function VisualDirection({ data }: { data: CaseStudy }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (!data.visualDirectionTitle && !data.colorPalette?.length) return null;

  return (
    <section ref={ref} id="visual" className="py-28 px-6 md:px-16 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="06" label="Visual Direction" />
        <div className="max-w-3xl">
          {data.visualDirectionTitle && (
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-8"
            >
              {data.visualDirectionTitle}
            </motion.h2>
          )}
        </div>

        {data.colorPalette && data.colorPalette.length > 0 && (
          <div className="mt-10">
            <p className="text-muted-foreground text-xs tracking-widest uppercase mb-6">Color Palette</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.colorPalette.map((c, i) => (
                <motion.div
                  key={c.hex}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex items-center gap-4 p-4 border border-border/30 rounded-lg"
                >
                  <div
                    className="w-12 h-12 rounded-full flex-shrink-0 border border-border/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div>
                    <div className="text-foreground text-sm font-medium">{c.name}</div>
                    <div className="text-muted-foreground text-xs font-mono">{c.hex}</div>
                    <div className="text-muted-foreground text-xs">{c.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── ⑧ Results & Impact ───────────────────────────────────────────────────────

function ResultsImpact({ data }: { data: CaseStudy }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (!data.resultsTitle && !data.metrics?.length && !data.clientFeedback) return null;

  return (
    <section ref={ref} id="results" className="py-28 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="07" label="Results & Impact" />
        {data.resultsTitle && (
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-10"
          >
            {data.resultsTitle}
          </motion.h2>
        )}

        {data.metrics && data.metrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
            {data.metrics.map((m, i) => (
              <motion.div
                key={m._key}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border border-border/40 rounded-lg p-8 hover:border-accent/30 transition-colors group"
              >
                <div className="text-[clamp(2.5rem,5vw,3.5rem)] font-bold text-foreground leading-none mb-3 group-hover:text-accent transition-colors">
                  {m.value}
                </div>
                <div className="text-foreground text-sm font-medium mb-1">{m.label}</div>
                {m.description && (
                  <div className="text-muted-foreground text-xs">{m.description}</div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {data.clientFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="border-l-2 border-accent/50 pl-8 max-w-3xl"
          >
            <p className="text-muted-foreground text-xs tracking-widest uppercase mb-4">
              Client Feedback
            </p>
            <blockquote className="text-foreground text-lg italic leading-relaxed">
              &ldquo;{data.clientFeedback}&rdquo;
            </blockquote>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ─── Sticky Nav ───────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: "challenge", label: "Challenge", num: "01" },
  { id: "goal",      label: "Goal",      num: "02" },
  { id: "insight",   label: "Insight",   num: "03" },
  { id: "strategy",  label: "Strategy",  num: "04" },
  { id: "idea",      label: "Idea",      num: "05" },
  { id: "visual",    label: "Visual",    num: "06" },
  { id: "results",   label: "Results",   num: "07" },
];

function StickyNav() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observers = NAV_SECTIONS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -50% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <nav className="fixed top-1/2 -translate-y-1/2 right-2 z-50 hidden lg:flex flex-col items-end gap-0">
      <div className="relative px-3 py-4 shadow-xl shadow-black/5">
        <div className="absolute right-0 top-4 bottom-4 w-[2px] flex flex-col items-center justify-start">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="w-[2px] rounded-full bg-accent"
            style={{
              height: `${100 / NAV_SECTIONS.length}%`,
              y:
                NAV_SECTIONS.findIndex((s) => s.id === active) *
                (100 / NAV_SECTIONS.length) +
                "%",
            }}
          />
        </div>

        {NAV_SECTIONS.map(({ id, label, num }) => (
          <button
            key={id}
            onClick={() =>
              document.getElementById(id)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className="group relative flex items-center gap-2 px-2 py-2 w-full text-left transition-all duration-300"
          >
            <motion.span
              animate={{
                opacity: active === id ? 1 : 0.4,
                color: active === id ? "var(--accent)" : "var(--muted-foreground)",
              }}
              className="text-xs font-mono tracking-widest min-w-[1.5rem]"
            >
              {num}
            </motion.span>
            <span
              className={`text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                active === id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground/40 group-hover:text-muted-foreground/70"
              }`}
            >
              {label}
            </span>
            <span
              className={`ml-auto w-2 h-2 rounded-full transition-all duration-300 ${
                active === id
                  ? "bg-accent scale-100 opacity-100"
                  : "bg-accent/0 scale-0 opacity-0"
              }`}
            />
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function CaseStudyPage({ data }: { data: CaseStudy }) {
  // Helper: render section if title or description exists
  const renderSection = (id: string, index: string, label: string, title?: string, description?: string) => {
    if (!title && !description) return null;
    return (
      <>
        <div id={id}>
          <SectionWithTitle
            id={id}
            index={index}
            label={label}
            title={title}
            description={description}
          />
        </div>
        <Divider />
      </>
    );
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      <BackNav />
      <StickyNav />

      <Hero data={data} />
      <Divider />

      {/* Challenge */}
      {renderSection(
        "challenge",
        "01",
        "Challenge",
        data.challengeTitle,
        data.challengeDescription
      )}

      {/* Goal */}
      {renderSection(
        "goal",
        "02",
        "Goal",
        data.goalTitle,
        data.goalDescription
      )}

      {/* Insight */}
      {renderSection(
        "insight",
        "03",
        "Insight",
        data.insightTitle,
        data.insightDescription
      )}

      {/* Strategy */}
      {renderSection(
        "strategy",
        "04",
        "Strategy",
        data.strategyTitle,
        data.strategyDescription
      )}

      {/* Creative Idea */}
      {renderSection(
        "idea",
        "05",
        "Creative Idea",
        data.creativeIdeaTitle,
        data.creativeIdeaDescription
      )}

      {/* Visual Direction */}
      {(data.visualDirectionTitle || data.colorPalette?.length) && (
        <>
          <div id="visual">
            <VisualDirection data={data} />
          </div>
          <Divider />
        </>
      )}

      {/* Results */}
      {(data.resultsTitle || data.metrics?.length || data.clientFeedback) && (
        <>
          <div id="results">
            <ResultsImpact data={data} />
          </div>
        </>
      )}

      {/* Footer */}
      <div className="border-t border-border/30 py-12 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-muted-foreground text-xs">
            {data.projectName} · {data.tags?.join(", ")} · {data.year}
          </span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ↑ Back to top
          </button>
        </div>
      </div>
    </main>
  );
}