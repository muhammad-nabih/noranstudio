"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function AboutStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const rafRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const xLeft = useTransform(scrollYProgress, [0, 1], ["-6%", "0%"]);
  const xRight = useTransform(scrollYProgress, [0, 1], ["6%", "0%"]);

  /* ── Three.js particle field ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      canvas.offsetWidth / canvas.offsetHeight,
      0.1,
      100,
    );
    camera.position.z = 5;

    /* particles */
    const COUNT = 220;
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      sizes[i] = Math.random() * 3 + 1;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xc9a96e) },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: /* glsl */ `
        attribute float size;
        uniform float uTime;
        uniform vec2  uMouse;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          pos.y += sin(uTime * 0.4 + position.x * 0.8) * 0.15;
          pos.x += cos(uTime * 0.3 + position.y * 0.6) * 0.10;
          float dist   = length(pos.xy - uMouse * 4.0);
          float repel  = smoothstep(2.0, 0.0, dist) * 0.6;
          pos.z       += repel;
          vAlpha = 0.15 + 0.35 * abs(sin(uTime * 0.5 + position.x));
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mv.z);
          gl_Position  = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float a = smoothstep(1.0, 0.0, d) * vAlpha;
          gl_FragColor = vec4(uColor, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    /* subtle rings */
    const mkRing = (radius: number, opacity: number, x: number) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.003, 16, 100),
        new THREE.MeshBasicMaterial({
          color: 0xc9a96e,
          transparent: true,
          opacity,
        }),
      );
      m.position.x = x;
      scene.add(m);
      return m;
    };
    const ring1 = mkRing(2.2, 0.12, 2);
    const ring2 = mkRing(2.6, 0.06, 2);

    let mouseNorm = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouseNorm.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNorm.y = -(e.clientY / window.innerHeight) * 2 + 1;
      mat.uniforms.uMouse.value.set(mouseNorm.x, mouseNorm.y);
    };
    document.addEventListener("mousemove", onMouse);

    const animate = (t: number) => {
      rafRef.current = requestAnimationFrame(animate);
      mat.uniforms.uTime.value = t * 0.001;
      points.rotation.y = mouseNorm.x * 0.04;
      points.rotation.x = mouseNorm.y * 0.04;
      ring1.rotation.z += 0.001;
      ring2.rotation.z -= 0.0007;
      renderer.render(scene, camera);
    };
    rafRef.current = requestAnimationFrame(animate);

    const onResize = () => {
      const w = canvas.offsetWidth,
        h = canvas.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  /* ── Portrait 3D parallax ── */
  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const inner = imgRef.current;
    if (!section || !frame || !inner) return;

    const onMove = (e: MouseEvent) => {
      const rx = (e.clientY / window.innerHeight - 0.5) * -14;
      const ry = (e.clientX / window.innerWidth - 0.5) * 18;
      gsap.to(frame, {
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 900,
        transformOrigin: "center center",
        ease: "power1.out",
        duration: 0.6,
      });
      gsap.to(inner, {
        x: (e.clientX / window.innerWidth - 0.5) * -10,
        y: (e.clientY / window.innerHeight - 0.5) * -8,
        duration: 0.8,
        ease: "power1.out",
      });
    };

    const onLeave = () => {
      gsap.to(frame, {
        rotateX: 0,
        rotateY: 0,
        duration: 1.2,
        ease: "elastic.out(1,0.5)",
      });
      gsap.to(inner, { x: 0, y: 0, duration: 1, ease: "power2.out" });
    };

    document.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ── GSAP entrance timeline ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      tlRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      tlRef.current
        .to(".about-eyebrow", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        })
        .to(
          ".about-h1",
          { opacity: 1, y: "0%", duration: 0.9, ease: "power4.out" },
          "-=0.4",
        )
        .to(
          ".about-h2",
          { opacity: 1, y: "0%", duration: 0.9, ease: "power4.out" },
          "-=0.6",
        )
        .to(
          ".about-divider",
          { width: 280, duration: 1.2, ease: "power3.inOut" },
          "-=0.3",
        )
        .to(
          ".about-body",
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          "-=0.6",
        )
        .to(
          ".about-tagline",
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.4",
        )
        .to(
          ".about-stats",
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.3",
        )
        .to(
          ".about-ring",
          { opacity: 1, duration: 1.5, ease: "power2.out" },
          "-=0.8",
        )
        .to(
          ".about-corner-tl",
          { opacity: 1, x: 0, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.8",
        )
        .to(
          ".about-corner-br",
          { opacity: 1, x: 0, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.6",
        )
        .to(
          ".about-portrait",
          { opacity: 1, duration: 1.2, ease: "power2.out" },
          "-=0.5",
        )
        .to(
          ".about-glow",
          { opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.8",
        )
        .to(
          ".about-badge",
          { opacity: 1, x: 0, duration: 0.8, ease: "back.out(1.4)" },
          "-=0.6",
        );

      /* shimmer loop */
      const shimmerLoop = () => {
        gsap.fromTo(
          ".about-shimmer",
          { top: "-2px", opacity: 0 },
          {
            top: "102%",
            opacity: 0.6,
            duration: 2.2,
            ease: "none",
            onComplete: () => gsap.delayedCall(3, shimmerLoop),
          },
        );
      };
      gsap.delayedCall(2.5, shimmerLoop);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-[#0a0805]"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_70%_50%,rgba(201,169,110,0.07)_0%,transparent_70%)] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 80px,rgba(201,169,110,0.02) 80px,rgba(201,169,110,0.02) 81px)",
        }}
      />

      {/* ── LEFT: Text ── */}
      <motion.div
        style={{ x: xLeft }}
        className="flex flex-col justify-center px-16 md:px-20 py-24 relative z-10"
      >
        {/* Eyebrow */}
        <div className="about-eyebrow flex items-center gap-3 mb-8 opacity-0 translate-y-6">
          <span className="w-10 h-px bg-[#C9A96E]" />
          <span className="text-[#C9A96E] text-[10px] tracking-[0.5em] uppercase font-['Cormorant_Garamond']">
            a little about me...
          </span>
        </div>

        {/* Heading */}
        <div className="overflow-hidden mb-1">
          <span className="about-h1 block font-['Playfair_Display'] font-bold text-5xl text-[#F5EDD6] leading-[1.1] opacity-0 translate-y-full">
            Hi, I'm
          </span>
        </div>
        <div className="overflow-hidden mb-8">
          <span className="about-h2 block font-['Playfair_Display'] font-bold text-5xl italic text-[#C9A96E] leading-[1.1] opacity-0 translate-y-full">
            Noran Elgeneady.
          </span>
        </div>

        {/* Divider */}
        <div className="about-divider w-0 h-px bg-gradient-to-r from-[#C9A96E] to-transparent mb-8" />

        {/* Body */}
        <p className="about-body font-['Cormorant_Garamond'] font-light text-lg leading-relaxed text-[#E8DCC8]/75 opacity-0 translate-y-5 mb-5 max-w-[440px]">
          I don't create designs just for art or aesthetics. I craft visuals
          that bring brand identity to life, communicate marketing messages
          clearly, and transform ideas into impactful designs that truly support
          goals.
        </p>

        <p className="about-tagline font-['Playfair_Display'] italic text-sm text-[#C9A96E] tracking-widest opacity-0 translate-y-4 mb-12">
          Let the design tell your story.
        </p>

        {/* Stats */}
        <div className="about-stats flex gap-10 opacity-0 translate-y-5">
          {[
            { num: "∞", label: "Possibilities" },
            { num: "01", label: "Vision" },
            { num: "↑", label: "Excellence" },
            { num: "◈", label: "Craft" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col gap-1 group">
              <span className="font-['Playfair_Display'] text-3xl text-[#C9A96E] group-hover:scale-110 transition-transform duration-300">
                {s.num}
              </span>
              <span className="text-[10px] tracking-[0.35em] uppercase text-[#E8DCC8]/40">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── RIGHT: Portrait + Three.js ── */}
      <motion.div
        style={{ x: xRight }}
        className="relative flex items-center justify-center z-10 overflow-hidden min-h-[600px]"
      >
        {/* Three.js particle canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Decorative rings */}
        <div className="about-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[520px] border border-[#C9A96E]/[0.08] opacity-0" />
        <div className="about-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[560px] border border-[#C9A96E]/[0.04] opacity-0" />

        {/* Portrait frame */}
        <div
          ref={frameRef}
          className="relative z-[5] w-[380px] h-[480px]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Glow */}
          <div
            className="about-glow absolute inset-[-2px] opacity-0"
            style={{
              boxShadow:
                "0 0 60px rgba(201,169,110,0.15), inset 0 0 40px rgba(201,169,110,0.05)",
            }}
          />

          {/* Image */}
          <div ref={imgRef} className="w-full h-full">
            <Image
              src="/NORAN.png" // ← put your image here
              alt="Noran Elgeneady"
              fill
              className="about-portrait object-cover object-top opacity-0"
              priority
            />
          </div>

          {/* Corner borders */}
          <div className="about-corner-tl absolute -top-3 -left-3 w-14 h-14 border-t border-l border-[#C9A96E] z-[6] opacity-0 -translate-x-2 -translate-y-2" />
          <div className="about-corner-br absolute -bottom-3 -right-3 w-14 h-14 border-b border-r border-[#C9A96E] z-[6] opacity-0 translate-x-2 translate-y-2" />

          {/* Shimmer sweep */}
          <div
            className="about-shimmer absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent z-[9]"
            style={{ top: "-2px" }}
          />
        </div>

        {/* Floating badge */}
        <div className="about-badge absolute right-8 bottom-24 bg-[rgba(12,9,5,0.9)] border border-[#C9A96E]/20 p-4 z-[8] opacity-0 translate-x-5 backdrop-blur-sm">
          <div className="font-['Playfair_Display'] italic text-xs text-[#C9A96E] tracking-widest">
            Visual Designer
          </div>
          <div className="text-[9px] text-[#E8DCC8]/40 tracking-[0.3em] uppercase mt-1">
            Brand & Identity
          </div>
        </div>
      </motion.div>
    </section>
  );
}
