"use client";

import { useEffect, useRef, useState, use } from "react";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
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

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── Three.js Background Canvas (Pink Theme) ──────────────────────────────────

function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    // Floating particles geometry
    const particleCount = 1200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Pink palette
    const palette = [
      new THREE.Color("#f379a7"), // primary pink
      new THREE.Color("#f8a9c9"), // secondary pink
      new THREE.Color("#ffbfcd"), // light pink
      new THREE.Color("#030202"), // dark background
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = Math.random() * 3 + 0.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // Floating torus knot (pink wireframe)
    const torusGeo = new THREE.TorusKnotGeometry(1.5, 0.3, 200, 32);
    const torusMat = new THREE.MeshBasicMaterial({
      color: "#f379a7",
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(4, -2, -3);
    scene.add(torus);

    let mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.5;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.5;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let frame = 0;
    const animate = () => {
      frame++;
      const id = requestAnimationFrame(animate);
      particles.rotation.y += 0.0003;
      particles.rotation.x += 0.0001;
      torus.rotation.x += 0.003;
      torus.rotation.y += 0.005;

      camera.position.x += (mouse.x - camera.position.x) * 0.05;
      camera.position.y += (-mouse.y - camera.position.y) * 0.05;

      renderer.render(scene, camera);
      return id;
    };
    const animId = animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}


// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection({ campaign }: { campaign: Campaign }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const title = titleRef.current;
      if (!title) return;

      const chars = title.querySelectorAll(".char");
      gsap.fromTo(
        chars,
        { y: 120, opacity: 0, rotateX: -80 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.04,
          ease: "power4.out",
          delay: 0.3,
        }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const titleText = campaign?.title || "Campaign";
  const words = titleText.split(" ");

  const heroImageUrl = campaign?.heroImage
    ? getOptimizedImageUrl(campaign.heroImage, { width: 1920, height: 1080 })
    : null;

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden">
      <motion.div
        ref={imageRef}
        style={{ y, scale }}
        className="absolute inset-0 z-[1]"
      >
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={campaign?.title || ""}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#030202] via-[#1a0b12] to-[#030202]" />
        )}
        {/* Overlays with pinkish tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030202] via-[#030202]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030202]/60 via-transparent to-[#030202]/20" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-[2] h-full flex flex-col justify-end pb-24 px-8 md:px-20 max-w-[1600px] mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="w-12 h-[1px] bg-primary" />
          <span className="text-primary text-xs tracking-[0.35em] uppercase font-light font-['Cormorant_Garamond']">
            {(campaign as any)?.service?.title || "Campaign"}
          </span>
        </motion.div>

        <div className="overflow-hidden" style={{ perspective: "800px" }}>
          <h1
            ref={titleRef}
            className="text-[clamp(3rem,9vw,9rem)] font-['poppins'] font-bold leading-[0.9] text-white mb-8 tracking-tight"
          >
            {words.map((word, wi) => (
              <span key={wi} className="inline-block mr-[0.2em]">
                {word.split("").map((char, ci) => (
                  <span
                    key={ci}
                    className="char inline-block"
                    style={{ transformOrigin: "bottom center" }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-wrap items-center gap-8 text-foreground/60 text-sm"
        >
          {(campaign as any)?.clientName && (
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-primary" />
              Client:{" "}
              <span className="text-primary ml-1">
                {(campaign as any).clientName}
              </span>
            </span>
          )}
          {(campaign as any)?.year && (
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-primary" />
              Year:{" "}
              <span className="text-primary ml-1">
                {(campaign as any).year}
              </span>
            </span>
          )}
          {(campaign as any)?.behanceUrl && (
            <a
              href={(campaign as any).behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors duration-300"
            >
              <span className="w-1 h-1 rounded-full bg-primary" />
              View on Behance ↗
            </a>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-8 z-[2] flex flex-col items-center gap-2"
      >
        <span className="text-primary/50 text-[10px] tracking-[0.3em] uppercase rotate-90 origin-center mb-4">
          Scroll
        </span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-primary/50 to-transparent relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-primary"
            animate={{ height: ["0%", "100%"], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}

// ─── Description Section ──────────────────────────────────────────────────────

function DescriptionSection({ campaign }: { campaign: Campaign }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".desc-line",
        { y: "100%", opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        ".desc-number",
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-40 px-8 md:px-20 max-w-[1600px] mx-auto"
    >
      <div className="desc-number absolute top-20 right-8 md:right-20 text-[20vw] font-['poppins'] font-bold text-white/[0.02] select-none leading-none pointer-events-none">
        01
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 md:gap-32 items-start relative z-10">
        <div>
          <div className="overflow-hidden mb-4">
            <div className="desc-line flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary" />
              <span className="text-primary text-xs tracking-[0.3em] uppercase font-light">
                About
              </span>
            </div>
          </div>
          <div className="overflow-hidden">
            <h2 className="desc-line text-4xl md:text-5xl font-['poppins'] text-white font-bold leading-tight">
              The
              <br />
              Story
            </h2>
          </div>
        </div>

        <div>
          <div className="overflow-hidden mb-8">
            <p
              ref={textRef}
              className="desc-line text-foreground/75 text-lg md:text-xl leading-[1.9] font-['Cormorant_Garamond'] font-light"
            >
              {campaign?.shortDescription ||
                "A compelling visual narrative that transcends conventional boundaries, crafted with meticulous attention to every detail."}
            </p>
          </div>

          <motion.div className="desc-line h-[1px] bg-gradient-to-r from-primary/60 via-primary/20 to-transparent mb-8" />

          <div className="desc-line grid grid-cols-3 gap-8">
            {[
              {
                label: "Images",
                value: (campaign as any)?.gallery?.length || "—",
              },
              { label: "Year", value: (campaign as any)?.year || "2024" },
              {
                label: "Type",
                value: (campaign as any)?.service?.title || "Creative",
              },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-['poppins'] text-primary font-bold">
                  {stat.value}
                </div>
                <div className="text-foreground/40 text-xs tracking-[0.2em] uppercase mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Gallery Section ──────────────────────────────────────────────────────────

function GalleryImage({
  src,
  alt,
  index,
}: {
  src: string;
  alt: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
        },
      }
    );
  }, []);

  return (
    <motion.div
      ref={ref}
      className="group relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div
        className="relative overflow-hidden bg-[#1a0b12]"
        style={{
          aspectRatio:
            index % 5 === 0 ? "16/9" : index % 3 === 0 ? "4/5" : "3/4",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            "object-cover transition-transform duration-700 group-hover:scale-105",
            loaded ? "opacity-100" : "opacity-0"
          )}
          sizes="(max-width: 768px) 100vw, 50vw"
          onLoad={() => setLoaded(true)}
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-500" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#030202]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-4 right-4 text-white/0 group-hover:text-white/60 text-xs font-['Cormorant_Garamond'] tracking-widest transition-all duration-500">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>
      <div className="h-[1px] w-0 group-hover:w-full bg-primary transition-all duration-500" />
    </motion.div>
  );
}

function GallerySection({ campaign }: { campaign: Campaign }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const images = (campaign as any)?.gallery || [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gallery-header",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  if (!images.length) return null;

  const getGridClass = (i: number) => {
    const patterns = [
      "col-span-2 row-span-2", // large
      "col-span-1 row-span-1", // small
      "col-span-1 row-span-2", // tall
      "col-span-1 row-span-1", // small
      "col-span-1 row-span-1", // small
    ];
    return patterns[i % patterns.length];
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 w-full md:px-20 mx-auto bg-background"
    >
      <div className="gallery-header mb-16 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-primary" />
            <span className="text-primary text-xs tracking-[0.3em] uppercase">
              Gallery
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-['poppins'] font-bold text-white leading-tight">
            Visual
            <br />
            Journey
          </h2>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-primary text-5xl font-['poppins']">
            {String(images.length).padStart(2, "0")}
          </div>
          <div className="text-foreground/40 text-xs tracking-[0.2em] uppercase">
            Frames
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">
        {images.map((img: any, i: number) => {
          const src = getOptimizedImageUrl(img, { width: 1200, height: 900 });
          const alt = img?.alt || `Gallery image ${i + 1}`;
          const gridClass = getGridClass(i);
          return (
            <div key={i} className={cn("overflow-hidden", gridClass)}>
              <GalleryImage src={src} alt={alt} index={i} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Marquee Strip (Pink) ─────────────────────────────────────────────────────

function MarqueeStrip({
  text = "CAMPAIGN — VISUAL EXCELLENCE — PHOTOGRAPHY — CREATIVE DIRECTION —",
}) {
  return (
    <div className="relative py-6 overflow-hidden border-y border-primary/20 my-20">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      >
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="text-primary/30 text-sm tracking-[0.4em] uppercase font-['Cormorant_Garamond'] font-light flex-shrink-0"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Behance CTA Section (Pink) ───────────────────────────────────────────────

function CTASection({ campaign }: { campaign: Campaign }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-content",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 75%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-32 px-8 md:px-20 max-w-[1600px] mx-auto">
      <div className="cta-content relative border border-primary/20 p-12 md:p-20 overflow-hidden">
        {/* Corner decorations */}
        {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map(
          (pos, i) => (
            <div key={i} className={`absolute ${pos} w-8 h-8`}>
              <div
                className={`absolute w-full h-[1px] bg-primary ${
                  i < 2 ? "top-0" : "bottom-0"
                }`}
              />
              <div
                className={`absolute h-full w-[1px] bg-primary ${
                  i % 2 === 0 ? "left-0" : "right-0"
                }`}
              />
            </div>
          )
        )}

        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-12 h-[1px] bg-primary" />
            <span className="text-primary text-xs tracking-[0.3em] uppercase">
              Explore More
            </span>
            <span className="w-12 h-[1px] bg-primary" />
          </div>
          <h2 className="text-4xl md:text-6xl font-['poppins'] font-bold text-white mb-6 leading-tight">
            See the Full
            <br />
            <span className="text-primary">Project</span>
          </h2>
          {(campaign as any)?.behanceUrl && (
            <motion.a
              href={(campaign as any).behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 mt-8 px-10 py-4 border border-primary text-primary text-sm tracking-[0.3em] uppercase font-['Cormorant_Garamond'] hover:bg-primary hover:text-background transition-all duration-400 group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View on Behance
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                ↗
              </span>
            </motion.a>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

// ─── Page Transition ──────────────────────────────────────────────────────────

function PageReveal() {
  return (
    <motion.div
      className="fixed inset-0 bg-background z-[150] origin-bottom"
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
    />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CampaignSlugPage({ params }: PageProps) {
  const { slug } = use(params);

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const data = await getCampaignBySlug(slug);
        setCampaign(data);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [slug]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  if (loading) return <Loader />;

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-['poppins'] text-white mb-4">
            404
          </h1>
          <p className="text-primary">Campaign not found</p>
          <Link
            href="/"
            className="mt-8 inline-block text-foreground/60 hover:text-primary transition-colors"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:wght@300;400;600&display=swap");

        html {
          background-color: #030202;
        }

        ::-webkit-scrollbar {
          width: 3px;
        }
        ::-webkit-scrollbar-track {
          background: #030202;
        }
        ::-webkit-scrollbar-thumb {
          background: #f379a7;
        }

        ::selection {
          background: #f379a7;
          color: #030202;
        }
      `}</style>

      <PageReveal />



      <ThreeBackground />

      <BackNav />

      <main className="relative z-[10] bg-transparent">
        <HeroSection campaign={campaign} />
        <DescriptionSection campaign={campaign} />
        <GallerySection campaign={campaign} />
        <CTASection campaign={campaign} />
      </main>
    </>
  );
}