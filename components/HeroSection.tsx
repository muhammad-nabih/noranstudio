"use client";




import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
const astonScript = localFont({
  src: "../public/fonts/AstonScript.ttf",
  display: "swap",
});

// ─── Tools — 6 icons, evenly spaced in a clean arc ───────────────────────────
const TOOLS = [
  {
    key: "ps",
    label: "Ps",
    bg: "#001E36",
    color: "#31A8FF",
    text: "Ps",
    angle: -155,
    r: 230,
    delay: "0.05s",
    phase: "0s",
    isFigma: false,
  },
  {
    key: "ai",
    label: "Ai",
    bg: "#260C00",
    color: "#FF9A00",
    text: "Ai",
    angle: -115,
    r: 245,
    delay: "0.1s",
    phase: "0.6s",
    isFigma: false,
  },
  {
    key: "figma",
    label: "Fg",
    bg: "",
    color: "",
    text: "",
    angle: -70,
    r: 235,
    delay: "0.15s",
    phase: "1.2s",
    isFigma: true,
  },
  {
    key: "ae",
    label: "Ae",
    bg: "#00005B",
    color: "#9999FF",
    text: "Ae",
    angle: 70,
    r: 235,
    delay: "0.2s",
    phase: "0.4s",
    isFigma: false,
  },
  {
    key: "canva",
    label: "Cv",
    bg: "#7D2AE8",
    color: "#fff",
    text: "C",
    angle: 115,
    r: 245,
    delay: "0.25s",
    phase: "1s",
    isFigma: false,
  },
  {
    key: "id",
    label: "Id",
    bg: "#49021F",
    color: "#FF3366",
    text: "Id",
    angle: 155,
    r: 230,
    delay: "0.3s",
    phase: "0.2s",
    isFigma: false,
  },
];

function FigmaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
      <circle cx="14.5" cy="12" r="3.5" fill="#1ABCFE" />
      <path d="M7 3h5a3.5 3.5 0 0 1 0 7H7V3z" fill="#FF7262" />
      <path d="M7 10h5a3.5 3.5 0 0 1 0 7H7V10z" fill="#A259FF" />
      <path d="M7 17h3.5A3.5 3.5 0 0 1 7 20.5V17z" fill="#0ACF83" />
    </svg>
  );
}

function ToolBadge({ tool }: { tool: (typeof TOOLS)[number] }) {
  const rad = (tool.angle * Math.PI) / 180;
  const x = Math.cos(rad) * tool.r;
  const y = Math.sin(rad) * tool.r;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-default"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        animation: `toolIn 0.6s ${tool.delay} cubic-bezier(0.34,1.4,0.64,1) both,
                    drift 6s ${tool.phase} ease-in-out infinite`,
      }}
    >
      <div
        className="w-[46px] h-[46px] rounded-2xl flex items-center justify-center
                   border border-[rgba(243,121,167,0.18)] backdrop-blur-sm
                   transition-all duration-300
                   group-hover:border-[rgba(243,121,167,0.6)]
                   group-hover:scale-110
                   group-hover:shadow-[0_0_18px_rgba(243,121,167,0.2)]"
        style={{ background: "rgba(10,4,7,0.82)" }}
      >
        {tool.isFigma ? (
          <FigmaIcon />
        ) : (
          <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="3" fill={tool.bg} />
            <text
              x="12"
              y="16"
              textAnchor="middle"
              fontFamily="'Poppins',sans-serif"
              fontSize="8.5"
              fontWeight="700"
              fill={tool.color}
            >
              {tool.text}
            </text>
          </svg>
        )}
      </div>
    </div>
  );
}

// ─── Calligraphic N ───────────────────────────────────────────────────────────
function CalligraphicN({ size = 68 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 88 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: size * 0.92,
        height: size,
        filter: "drop-shadow(0 0 10px rgba(243,121,167,0.55))",
      }}
      aria-hidden="true"
    >
      <path
        d="M8 88 C8 88, 12 16, 16 8 C18 4, 22 4, 24 8 C30 24, 48 60, 58 80 C60 84, 62 86, 63 88"
        stroke="#f379a7"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M16 10 C28 28, 50 60, 62 84"
        stroke="#f379a7"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
      <path
        d="M62 10 C64 10, 68 10, 70 12 C75 18, 78 40, 80 88"
        stroke="#f379a7"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M6 6 C10 2, 16 2, 18 6"
        stroke="#f8a9c9"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {}, []);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        @keyframes toolIn {
          from { opacity: 0; transform: translate(-50%,-50%) scale(0.4); }
          to   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
        }
        @keyframes drift {
          0%,100% { transform: translate(-50%,-50%) translateY(0);    }
          50%      { transform: translate(-50%,-50%) translateY(-9px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes imageReveal {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes cardGlow {
          0%,100% { box-shadow: 0 0 60px rgba(243,121,167,0.10), 0 40px 80px rgba(0,0,0,0.6); }
          50%      { box-shadow: 0 0 90px rgba(243,121,167,0.18), 0 40px 80px rgba(0,0,0,0.6); }
        }
        @keyframes orbitSpin {
          to { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes badgePulse {
          0%,100% { opacity:1; box-shadow: 0 0 7px #f379a7; }
          50%      { opacity:.4; box-shadow: 0 0 2px #f379a7; }
        }
        @keyframes scrollAnim {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        .badge-dot  { animation: badgePulse 2s infinite; }
        .scroll-bar { animation: scrollAnim 2.2s ease-in-out infinite; }
        .hero-em    { color: #f8a9c9; font-style: normal; font-weight: 500; }
      `}</style>

      <section
        ref={sectionRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#030202]"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* ── Background glow ─────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: `
              radial-gradient(ellipse 50% 60% at 50% 52%, rgba(243,121,167,0.09) 0%, transparent 65%),
              radial-gradient(ellipse 25% 35% at 15% 85%, rgba(243,121,167,0.04) 0%, transparent 55%)
            `,
          }}
        />
        {/* subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `
              linear-gradient(rgba(243,121,167,0.022) 1px, transparent 1px),
              linear-gradient(90deg, rgba(243,121,167,0.022) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />

        {/* ── LAYOUT ──────────────────────────────────────────── */}
        <div
          className="relative z-10 w-full max-w-[1180px] mx-auto px-8
                        grid grid-cols-[1fr_auto_1fr] items-center gap-0"
          style={{ minHeight: "100vh" }}
        >
          {/* ── LEFT: Name + tagline ──────────────────────── */}
          <div
            className="flex flex-col gap-5 pr-8"
            style={{ animation: "fadeUp 0.65s 0.2s ease both" }}
          >
            {/* badge */}
            <div
              className="inline-flex items-center gap-2 text-[10.5px] font-medium
                            tracking-[0.2em] uppercase text-[#f379a7]
                            border border-[rgba(243,121,167,0.22)] rounded-full
                            px-4 py-1.5 w-fit"
            >
              <span
                className="badge-dot w-1.5 h-1.5 rounded-full bg-[#f379a7]"
                style={{ boxShadow: "0 0 7px #f379a7" }}
              />
              Visual Artist &amp; Designer
            </div>

            {/* name */}
            <div className="flex items-end gap-1.5 leading-none select-none  my-12">
              {/* The "N" with Aston Script Bold */}
              <span
                className={`${astonScript.className} text-[90px] leading-none text-[#f379a7]`}
                style={{
                  textShadow: "0 0 20px rgba(243,121,167,0.45)",
                }}
              >
                N
              </span>
              <div>
                <span className="block text-[64px] font-bold tracking-[-2.5px] text-white leading-[0.88]">
                  oran
                </span>
                <span className="block text-[26px] font-light tracking-[0.16em] text-[#f8a9c9] uppercase mt-2">
                  ELgeneady
                </span>
              </div>
            </div>

            {/* divider + role */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-px bg-[#f379a7] opacity-50" />
              <span className="text-[11px] tracking-[0.22em] uppercase text-[#f379a7] opacity-70">
                Graphic Designer
              </span>
            </div>

            {/* stats */}
            <div
              className="flex items-center gap-0 mt-4 pt-5
                            border-t border-[rgba(243,121,167,0.14)]"
            >
              {[
                { num: "50+", label: "Projects" },
                { num: "3+", label: "Years" },
                { num: "30+", label: "Clients" },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center">
                  <div className="px-6 first:pl-0">
                    <span className="block text-[30px] font-bold text-[#f379a7] leading-none">
                      {s.num}
                    </span>
                    <span className="block text-[9.5px] tracking-[0.15em] text-[rgba(255,191,205,0.4)] uppercase mt-1">
                      {s.label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div className="w-px h-8 bg-[rgba(243,121,167,0.18)]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── CENTER: Card + image overflow + orbit icons ── */}
          <div
            className="relative flex items-end justify-center"
            style={{ width: 360, height: "88vh" }}
          >
            {/* orbit ring — single clean dashed circle */}
            <div
              className="absolute"
              style={{
                width: 500,
                height: 500,
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",
                animation: "orbitSpin 40s linear infinite",
                pointerEvents: "none",
              }}
              aria-hidden="true"
            >
              <svg width="500" height="500" viewBox="0 0 500 500">
                <circle
                  cx="250"
                  cy="250"
                  r="240"
                  fill="none"
                  stroke="rgba(243,121,167,0.10)"
                  strokeWidth="1"
                  strokeDasharray="4 20"
                />
              </svg>
            </div>

            {/* static faint inner ring */}
            <div
              className="absolute pointer-events-none"
              aria-hidden="true"
              style={{
                width: 320,
                height: 320,
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",
                border: "1px solid rgba(243,121,167,0.06)",
                borderRadius: "50%",
              }}
            />

            {/* glow behind card */}
            <div
              className="absolute pointer-events-none"
              aria-hidden="true"
              style={{
                width: 320,
                height: 420,
                left: "50%",
                bottom: "5%",
                transform: "translateX(-50%)",
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 80%, rgba(243,121,167,0.18) 0%, transparent 70%)",
              }}
            />

            {/* ── CARD ── */}
            <div
              className="relative z-20 overflow-visible"
              style={{
                width: 300,
                height: 420,
                borderRadius: 32,
                animation:
                  "imageReveal 0.9s 0.1s cubic-bezier(0.34,1.1,0.64,1) both, cardGlow 5s 1s ease-in-out infinite",
              }}
            >
              {/* card body */}
              <div
                className="absolute inset-0 rounded-[32px]"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(30,12,20,0.95) 0%, rgba(10,4,7,0.98) 100%)",
                  border: "1px solid rgba(243,121,167,0.16)",
                }}
              />

              {/* top shimmer on card edge */}
              <div
                className="absolute inset-x-0 top-0 h-px rounded-t-[32px] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(243,121,167,0.35), transparent)",
                }}
              />

              {/* ── IMAGE — overflows top of card ── */}
              <div
                className="absolute left-0 right-0 overflow-visible"
                style={{
                  bottom: 0,
                  height: 520 /* taller than card → image pokes above */,
                  zIndex: 10,
                }}
              >
                <Image
                  src="/noran-genedy.png"
                  alt="Noran ELgeneady"
                  fill
                  priority
                  className="object-cover object-top"
                  style={{
                    maskImage:
                      "linear-gradient(to top, transparent 0%, black 12%, black 82%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to top, transparent 0%, black 12%, black 82%, transparent 100%)",
                    borderRadius: "0 0 32px 32px",
                  }}
                />
              </div>

              {/* card bottom info strip */}
              <div
                className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-5 pt-14 rounded-b-[32px]"
                style={{
                  background:
                    "linear-gradient(to top, rgba(8,3,6,0.95) 60%, transparent)",
                }}
              >
                <p className="text-[11px] font-light leading-[1.75] text-[rgba(255,191,205,0.6)]">
                  Visuals that bring{" "}
                  <span className="hero-em">brands to life</span> and turn ideas
                  into <span className="hero-em">impact</span>.
                </p>
              </div>
            </div>

            {/* ── FLOATING TOOL BADGES around the center ── */}
            {TOOLS.map((tool) => (
              <ToolBadge key={tool.key} tool={tool} />
            ))}
          </div>

          {/* ── RIGHT: desc + CTAs ─────────────────────────── */}
          <div
            className="flex flex-col gap-6 pl-8"
            style={{ animation: "fadeUp 0.65s 0.35s ease both" }}
          >
            {/* tagline */}
            <p className="text-[13px] font-light leading-[2] text-[rgba(255,191,205,0.6)] max-w-[240px]">
              I don&apos;t just design — I craft{" "}
              <span className="hero-em">experiences</span> that make brands
              unforgettable.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <Link
                href="#work"
                className="inline-flex items-center gap-2 bg-[#f379a7] text-[#030202]
                           text-[12px] font-semibold tracking-wide
                           px-7 py-3.5 rounded-full w-fit
                           transition-all duration-300
                           hover:bg-[#f8a9c9] hover:-translate-y-0.5
                           hover:shadow-[0_8px_28px_rgba(243,121,167,0.35)]"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                View My Work
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 text-[#ffbfcd]
                           text-[12px] font-normal tracking-wide
                           px-7 py-3.5 rounded-full w-fit
                           border border-[rgba(243,121,167,0.22)]
                           transition-all duration-300
                           hover:border-[#f379a7] hover:text-[#f379a7]"
              >
                Let&apos;s Talk
              </Link>
            </div>

            {/* social */}
            <div className="flex items-center gap-3 mt-2">
              {[
                {
                  label: "Behance",
                  href: "#",
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.7zm-7.441-3h4.917c-.048-1.741-1.249-2.93-2.425-2.93-1.326 0-2.315.89-2.492 2.93zm-5.408-6.4c2.443-.188 3.912.49 4.516 2.029.228.585.307 1.282.307 2.152 0 .839-.075 1.517-.218 2.032C14.807 15.46 13.208 16 11.38 16H4V7.6h6.877zm-4.08 5.9h3.4c1.504 0 2.332-.668 2.332-2.07 0-1.385-.885-2.03-2.305-2.03h-3.427v4.1z" />
                    </svg>
                  ),
                },
                {
                  label: "Instagram",
                  href: "#",
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3.5 h-3.5"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle
                        cx="17.5"
                        cy="6.5"
                        r="0.5"
                        fill="currentColor"
                        stroke="none"
                      />
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  href: "#",
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full border border-[rgba(243,121,167,0.2)]
                             flex items-center justify-center
                             text-[rgba(243,121,167,0.45)]
                             transition-all duration-300
                             hover:border-[#f379a7] hover:text-[#f379a7] hover:scale-110"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>


      </section>
    </>
  );
}
