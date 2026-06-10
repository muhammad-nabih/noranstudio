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
        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8"
        >
          <span className="text-xs tracking-widest uppercase px-3 py-1 border border-accent/40 text-accent bg-accent/5 rounded-full">
            {data.projectType}
          </span>
          {[data.role, data.year, data.duration].filter(Boolean).map((m, i) => (
            <span key={i} className="text-muted-foreground text-sm">{m}</span>
          ))}
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

        {/* Summary */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          className="mt-8 max-w-2xl text-muted-foreground text-lg leading-relaxed"
        >
          {data.summary}
        </motion.p>

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {data.tags.map((t) => (
              <span
                key={t}
                className="text-xs text-muted-foreground border border-border/50 px-3 py-1 rounded-full"
              >
                {t}
              </span>
            ))}
          </motion.div>
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

// ─── ② Problem Context ────────────────────────────────────────────────────────

function ProblemContext({ data }: { data: CaseStudy }) {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef   = useRef(null);
  const inView     = useInView(sectionRef, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!data.clientQuote) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(quoteRef.current,
        { x: -36, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: quoteRef.current, start: "top 82%", toggleActions: "play none none none" },
        }
      );
    });
    return () => ctx.revert();
  }, [data.clientQuote]);

  return (
    <section ref={sectionRef} className="py-28 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="01" label="Problem Context" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6"
            >
              {data.problemTitle}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-muted-foreground leading-relaxed"
            >
              {data.problemContext}
            </motion.p>
          </div>

          {data.clientQuote && (
            <blockquote
              ref={quoteRef}
              className="relative border-l-2 border-accent pl-8 py-2"
            >
              <span
                className="absolute -top-5 left-5 text-6xl text-accent/15 font-serif select-none leading-none"
                aria-hidden
              >
                &ldquo;
              </span>
              <p className="text-foreground text-xl font-medium italic leading-relaxed relative z-10">
                {data.clientQuote}
              </p>
              <footer className="mt-4 text-muted-foreground text-sm">
                — Client, Pre-Brief Interview
              </footer>
            </blockquote>
          )}
        </div>

        {/* Optional problem images */}
        {data.problemImages && data.problemImages.length > 0 && (
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.problemImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <SanityImage
                  image={img}
                  ratio="aspect-video"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── ③ Research & Strategy ────────────────────────────────────────────────────

function ResearchStrategy({ data }: { data: CaseStudy }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-28 px-6 md:px-16 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="02" label="Research & Strategy" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Keywords + Insights */}
          <div className="space-y-12">
            {data.keywords?.length > 0 && (
              <div>
                <p className="text-muted-foreground text-xs tracking-widest uppercase mb-4">
                  Design Direction
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.keywords.map((kw, i) => (
                    <motion.span
                      key={kw}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="text-xs px-3 py-1.5 border border-border text-foreground rounded-full hover:border-accent hover:text-accent transition-colors cursor-default"
                    >
                      {kw}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {data.researchInsights && (
              <div>
                <p className="text-muted-foreground text-xs tracking-widest uppercase mb-4">
                  Key Insights
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {data.researchInsights}
                </p>
              </div>
            )}
          </div>

          {/* Competitor table */}
          {data.competitors?.length > 0 && (
            <div className="lg:col-span-2">
              <p className="text-muted-foreground text-xs tracking-widest uppercase mb-6">
                Competitive Landscape
              </p>
              <div className="grid grid-cols-3 gap-4 mb-3 px-2">
                {["Competitor", "What Works", "The Gap"].map((h) => (
                  <span key={h} className="text-muted-foreground text-xs">{h}</span>
                ))}
              </div>
              <div className="h-px bg-border mb-2" />
              {data.competitors.map((c, i) => (
                <motion.div
                  key={c._key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className="grid grid-cols-3 gap-4 px-2 py-4 border-b border-border/30 hover:bg-card/60 transition-colors rounded"
                >
                  <span className="text-foreground font-medium text-sm">{c.name}</span>
                  <span className="text-muted-foreground text-sm leading-snug">{c.strength}</span>
                  <span className="text-accent/70 text-sm leading-snug">{c.weakness}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Mood board */}
        {data.moodBoardImages && data.moodBoardImages.length > 0 && (
          <div className="mt-16">
            <p className="text-muted-foreground text-xs tracking-widest uppercase mb-6">Mood Board</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {data.moodBoardImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                >
                  <SanityImage
                    image={img}
                    ratio="aspect-square"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── ④ Implementation Journey ─────────────────────────────────────────────────

function ImplementationJourney({ data }: { data: CaseStudy }) {
  const stepsRef = useRef<HTMLDivElement>(null);
  const ref      = useRef(null);
  const inView   = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const steps = stepsRef.current?.querySelectorAll(".step-item");
      steps?.forEach((step, i) => {
        gsap.fromTo(step,
          { x: i % 2 === 0 ? -28 : 28, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.75, ease: "power3.out",
            scrollTrigger: { trigger: step, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      });
    }, stepsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-28 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="03" label="Implementation Journey" />

        {/* Sketches */}
        {data.sketchImages && data.sketchImages.length > 0 && (
          <div className="mb-16">
            <p className="text-muted-foreground text-xs tracking-widest uppercase mb-6">Initial Sketches</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.sketchImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <SanityImage
                    image={img}
                    ratio="aspect-[4/3]"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Process steps */}
        {data.processSteps?.length > 0 && (
          <div ref={stepsRef} className="mb-24">
            <p className="text-muted-foreground text-xs tracking-widest uppercase mb-10">
              How It Evolved
            </p>
            <div className="relative">
              <div className="absolute left-5 top-5 bottom-5 w-px bg-border/30 hidden md:block" />
              <div className="space-y-8">
                {data.processSteps.map((step, i) => (
                  <div key={step._key} className="step-item relative flex gap-8 items-start">
                    <div className="flex-shrink-0 relative z-10 w-10 h-10 rounded-full border border-accent/30 bg-background flex items-center justify-center">
                      <span className="text-accent font-mono text-xs">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="pt-2 flex-1">
                      <h4 className="text-foreground font-semibold mb-1">{step.phase}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                      {step.images?.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          {step.images.map((img, j) => (
                            <SanityImage
                              key={j}
                              image={img}
                              ratio="aspect-video"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rejected options */}
        {data.rejectedOptions?.length > 0 && (
          <div>
            <p className="text-muted-foreground text-xs tracking-widest uppercase mb-2">
              What Was Left Behind
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              Directions explored and consciously rejected.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {data.rejectedOptions.map((opt, i) => (
                <motion.div
                  key={opt._key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  className="border border-border/40 rounded-lg p-3 hover:border-border transition-colors relative"
                >
                  {/* <span className="absolute top-4 right-4 text-destructive/25 text-xl select-none">✕</span> */}
                  <SanityImage
                    image={opt.image ? opt.image : undefined}
                    alt={opt.image?.alt ?? ""}
                    ratio="aspect-[4/3]"
                    className="mb-4"
               
                  />
                  <h4 className="text-foreground text-sm font-medium mb-2 line-through decoration-destructive/30">
                    {opt.title}
                  </h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">{opt.reason}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── ⑤ Final Solution ────────────────────────────────────────────────────────

function FinalSolution({ data }: { data: CaseStudy }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-28 px-6 md:px-16 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="04" label="Final Solution" />

        {/* Hero final image */}
        {data.finalImages && data.finalImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <SanityImage
              image={data.finalImages[0]}
              ratio="aspect-[21/9]"
            />
          </motion.div>
        )}

        {/* Mockup grid */}
        {data.mockupImages && data.mockupImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
            {data.mockupImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              >
                <SanityImage
                  image={img}
                  ratio="aspect-square"
                />
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Color palette */}
          {data.colorPalette?.length > 0 && (
            <div>
              <p className="text-muted-foreground text-xs tracking-widest uppercase mb-6">Color Palette</p>
              <div className="space-y-3">
                {data.colorPalette.map((c, i) => (
                  <motion.div
                    key={c.hex}
                    initial={{ opacity: 0, x: -16 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="flex items-center gap-4"
                  >
                    <div
                      className="w-10 h-10 rounded-md flex-shrink-0 border border-border/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-foreground text-sm font-medium">{c.name}</span>
                        <span className="text-muted-foreground text-xs font-mono">{c.hex}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">{c.role}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Typography + Rationale */}
          <div className="space-y-10">
            {data.typography?.length > 0 && (
              <div>
                <p className="text-muted-foreground text-xs tracking-widest uppercase mb-6">Typography</p>
                <div className="space-y-6">
                  {data.typography.map((t, i) => (
                    <motion.div
                      key={t.fontName}
                      initial={{ opacity: 0, y: 12 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                      className="border-b border-border/30 pb-5"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-foreground font-semibold text-sm">{t.fontName}</span>
                        <span className="text-accent text-xs font-mono uppercase">{t.role}</span>
                      </div>
                      <span className="text-muted-foreground text-xs mb-3 block">
                        Weight: {t.weight}
                      </span>
                      <p
                        className="text-foreground leading-snug"
                        style={{
                          fontSize:   t.role === "display" ? "clamp(1.4rem, 3vw, 2rem)" : "1rem",
                          fontWeight: t.role === "display" ? 700 : 400,
                        }}
                      >
                        {t.sample}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {data.designRationale && (
              <div>
                <p className="text-muted-foreground text-xs tracking-widest uppercase mb-4">
                  Design Rationale
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">{data.designRationale}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ⑥ Results & Impact ───────────────────────────────────────────────────────

function ResultsImpact({ data }: { data: CaseStudy }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-28 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="05" label="Results & Impact" />

        {/* Metrics */}
        {data.metrics?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {data.clientFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="border-l-2 border-accent/50 pl-8"
            >
              <p className="text-muted-foreground text-xs tracking-widest uppercase mb-4">
                Client Feedback
              </p>
              <blockquote className="text-foreground text-lg italic leading-relaxed">
                &ldquo;{data.clientFeedback}&rdquo;
              </blockquote>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {data.lessonsLearned && (
              <>
                <p className="text-muted-foreground text-xs tracking-widest uppercase mb-4">
                  Lessons Learned
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm">{data.lessonsLearned}</p>
              </>
            )}
            {data.nextSteps && (
              <div className="mt-8">
                <p className="text-muted-foreground text-xs tracking-widest uppercase mb-3">
                  Next Steps
                </p>
                <p className="text-muted-foreground text-sm">{data.nextSteps}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Sticky Nav ───────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: "problem", label: "Problem", num: "01" },
  { id: "research", label: "Research", num: "02" },
  { id: "process", label: "Process", num: "03" },
  { id: "solution", label: "Solution", num: "04" },
  { id: "results", label: "Results", num: "05" },
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
      {/* Glassmorphism container */}
      <div className="relative px-3 py-4 shadow-xl shadow-black/5">
        {/* Moving active indicator (dot) */}
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
            {/* Number */}
            <motion.span
              animate={{
                opacity: active === id ? 1 : 0.4,
                color: active === id ? "var(--accent)" : "var(--muted-foreground)",
              }}
              className="text-xs font-mono tracking-widest min-w-[1.5rem]"
            >
              {num}
            </motion.span>

            {/* Label */}
            <span
              className={`text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                active === id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground/40 group-hover:text-muted-foreground/70"
              }`}
            >
              {label}
            </span>

            {/* Active dot – visible only on active */}
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
  return (
    <main className="bg-background text-foreground min-h-screen">
      <BackNav/>
      <StickyNav />

      <Hero data={data} />
      <Divider />

      <div id="problem">
        <ProblemContext data={data} />
      </div>
      <Divider />

      <div id="research">
        <ResearchStrategy data={data} />
      </div>
      <Divider />

      <div id="process">
        <ImplementationJourney data={data} />
      </div>
      <Divider />

      <div id="solution">
        <FinalSolution data={data} />
      </div>
      <Divider />

      <div id="results">
        <ResultsImpact data={data} />
      </div>

      <div className="border-t border-border/30 py-12 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-muted-foreground text-xs">
            {data.projectName} · {data.projectType} · {data.year}
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