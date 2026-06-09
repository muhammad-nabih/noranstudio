"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

interface LoaderProps {
  onComplete?: () => void;
  /** How long to hold the closed curtain before opening (ms). Default 600 */
  duration?: number;
}

export default function Loader({ onComplete, duration = 600 }: LoaderProps) {
  const [phase, setPhase] = useState<"hold" | "open" | "reveal" | "exit">(
    "hold",
  );
  const shimmerRef = useRef<HTMLDivElement>(null);

  // ── Timeline ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("open"), duration);
    const t2 = setTimeout(() => setPhase("reveal"), duration + 1100);
    const t3 = setTimeout(() => setPhase("exit"), duration + 2400);
    const t4 = setTimeout(() => onComplete?.(), duration + 3050);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [duration, onComplete]);

  // ── GSAP shimmer sweep ────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "reveal" || !shimmerRef.current) return;
    gsap.fromTo(
      shimmerRef.current,
      { x: "-110%", opacity: 1 },
      {
        x: "260%",
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut",
        delay: 0.35,
      },
    );
  }, [phase]);

  // ── Framer variants ───────────────────────────────────────────────────────
  const ease = [0.76, 0, 0.24, 1] as const;

  const curtainL = {
    hold: { x: "0%" },
    open: { x: "-101%", transition: { duration: 1.1, ease } },
    reveal: { x: "-101%" },
    exit: { x: "-101%" },
  };
  const curtainR = {
    hold: { x: "0%" },
    open: { x: "101%", transition: { duration: 1.1, ease } },
    reveal: { x: "101%" },
    exit: { x: "101%" },
  };

  const folds = [25, 50, 75];

  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        transition={{ duration: 0.65, ease: "easeInOut" }}
      >
        {/* ── Left curtain ── */}
        <motion.div
          className="absolute inset-y-0 left-0 w-1/2 bg-[#0d0d0d]"
          variants={curtainL}
          animate={phase}
        >
          {folds.map((p) => (
            <div
              key={p}
              className="absolute top-0 h-full w-px bg-white/[0.025]"
              style={{ left: `${p}%` }}
            />
          ))}
          {/* seam */}
          <div className="absolute inset-y-0 right-0 w-px bg-white/[0.05]" />
        </motion.div>

        {/* ── Right curtain ── */}
        <motion.div
          className="absolute inset-y-0 right-0 w-1/2 bg-[#0d0d0d]"
          variants={curtainR}
          animate={phase}
        >
          {folds.map((p) => (
            <div
              key={p}
              className="absolute top-0 h-full w-px bg-white/[0.025]"
              style={{ left: `${p}%` }}
            />
          ))}
          {/* seam */}
          <div className="absolute inset-y-0 left-0 w-px bg-white/[0.05]" />
        </motion.div>

        {/* ── Logo mark ── */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-3 select-none"
          animate={{ opacity: phase === "reveal" || phase === "exit" ? 1 : 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          {/* Circle + N */}
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full border border-white/10 overflow-hidden">
            <span
              className="text-white leading-none"
              style={{ fontFamily: "Georgia, serif", fontSize: "2.25rem" }}
            >
              N
            </span>

            {/* GSAP shimmer layer */}
            <div
              ref={shimmerRef}
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.07) 50%, transparent 75%)",
                transform: "translateX(-110%)",
              }}
            />
          </div>

          {/* Wordmark */}
          <p
            className="text-white/30 uppercase tracking-[0.22em]"
            style={{ fontSize: "9px" }}
          >
            Noran Elgeneady
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
