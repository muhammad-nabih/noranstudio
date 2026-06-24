"use client";

// ─────────────────────────────────────────────────────────────────────────────
// components/CaseStudiesGrid.tsx
// Listing page — all case studies from Sanity in a filterable grid
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import type { CaseStudyCard } from "@/sanity/sanity-queries/case-study.queries";
import { urlFor } from "@/sanity/lib/image";

// ─── Card component ───────────────────────────────────────────────────────────

function Card({ data, index }: { data: CaseStudyCard; index: number }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      layout
    >
      <Link
        href={`/cases-studies/${data.slug.current}`}
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative overflow-hidden rounded-lg aspect-[4/3] bg-muted/10 border border-border/20 mb-5">
            {data.heroImage?.asset?._ref ? (
            <Image
              src={urlFor(data.heroImage).width(800).auto("format").url()}
              alt={data.heroImage.alt ?? data.projectName}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-muted-foreground/15 text-xs font-mono">no image</span>
            </div>
          )}

          {/* Hover overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              animate={hovered ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-foreground text-sm font-medium border border-foreground/30 px-5 py-2 rounded-full"
            >
              View Case Study →
            </motion.span>
          </motion.div>

          {/* Year badge */}
          <span className="absolute top-3 right-3 text-muted-foreground/60 text-xs font-mono bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
            {data.year}
          </span>
        </div>

        {/* Meta */}
        <div className="space-y-2">
          <h2 className="text-foreground font-bold text-xl leading-tight group-hover:text-accent transition-colors duration-300">
            {data.projectName}
          </h2>

          {data.subtitle && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {data.subtitle}
            </p>
          )}

          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs text-muted-foreground/60 border border-border/30 px-2 py-0.5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function CaseStudiesGrid({ data = [] }: { data: CaseStudyCard[] }) {
  // Collect all unique tags across case studies for filtering
  const types = ["All", ...Array.from(new Set(data.flatMap((d) => d.tags ?? [])))];
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? data : data.filter((d) => d.tags?.includes(active));

  return (
    <main className="bg-background text-foreground min-h-screen">

      {/* Page header */}
      <section className="px-6 md:px-16 pt-36 pb-20 max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-accent text-xs tracking-widest uppercase font-mono mb-4"
        >
          Selected Work
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(2.5rem,6vw,5rem)] font-bold text-foreground leading-[0.95] tracking-tight mb-6"
        >
          Case Studies
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-muted-foreground text-lg max-w-xl leading-relaxed"
        >
          A curated collection of projects — each one a problem worth documenting.
        </motion.p>
      </section>

      <div className="w-full h-px bg-border/30" />

 

      {/* Grid */}
      <section className="px-6  my-8 md:px-16 pb-32 max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground text-sm py-20 text-center"
          >
            No case studies found.
          </motion.p>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <Card key={item._id} data={item} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-muted-foreground/40 text-xs font-mono"
        >
          {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          {active !== "All" && ` in ${active}`}
        </motion.p>
      </section>
    </main>
  );
}