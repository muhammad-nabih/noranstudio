'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const cursorRef   = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const imageRef    = useRef<HTMLDivElement>(null);
  const rafRef      = useRef<number>(0);
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const yText    = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const yImage   = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const opacity  = useTransform(scrollYProgress, [0, 0.7], [1, 0]);


  /* ── Three.js ambient field ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
    camera.position.z = 6;

    /* Floating dust particles */
    const COUNT = 280;
    const positions = new Float32Array(COUNT * 3);
    const sizes     = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:  { value: 0 },
        uColor: { value: new THREE.Color(0xC9A96E) },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: /* glsl */`
        attribute float size;
        uniform float uTime;
        uniform vec2  uMouse;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          pos.y += sin(uTime * 0.35 + position.x * 0.7) * 0.18;
          pos.x += cos(uTime * 0.25 + position.y * 0.5) * 0.12;
          float dist  = length(pos.xy - uMouse * 5.0);
          float repel = smoothstep(2.2, 0.0, dist) * 0.5;
          pos.z      += repel;
          vAlpha = 0.1 + 0.3 * abs(sin(uTime * 0.4 + position.z));
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position  = projectionMatrix * mv;
          gl_PointSize = size * (280.0 / -mv.z);
        }
      `,
      fragmentShader: /* glsl */`
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float a = smoothstep(1.0, 0.2, d) * vAlpha;
          gl_FragColor = vec4(uColor, a);
        }
      `,
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    /* Thin orbital rings — positioned center-right behind image */
    const mkRing = (r: number, op: number, px: number, py: number) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.004, 16, 120),
        new THREE.MeshBasicMaterial({ color: 0xC9A96E, transparent: true, opacity: op })
      );
      m.position.set(px, py, 0);
      scene.add(m);
      return m;
    };
    const ring1 = mkRing(2.0, 0.10, 2.8,  0.2);
    const ring2 = mkRing(2.6, 0.05, 2.8,  0.2);
    const ring3 = mkRing(3.2, 0.03, 2.8,  0.2);

    let mouseNorm = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouseNorm.x = (e.clientX / window.innerWidth)  * 2 - 1;
      mouseNorm.y = -(e.clientY / window.innerHeight) * 2 + 1;
      mat.uniforms.uMouse.value.set(mouseNorm.x, mouseNorm.y);
    };
    document.addEventListener('mousemove', onMouse);

    const animate = (t: number) => {
      rafRef.current = requestAnimationFrame(animate);
      mat.uniforms.uTime.value = t * 0.001;
      points.rotation.y = mouseNorm.x * 0.03;
      points.rotation.x = mouseNorm.y * 0.03;
      ring1.rotation.z += 0.0008;
      ring2.rotation.z -= 0.0005;
      ring3.rotation.z += 0.0003;
      renderer.render(scene, camera);
    };
    rafRef.current = requestAnimationFrame(animate);

    const onResize = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  /* ── GSAP entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Initial states */
      gsap.set([
        '.hero-eyebrow', '.hero-name-1', '.hero-name-2',
        '.hero-sub', '.hero-cta', '.hero-scroll', '.hero-image',
        '.hero-badge-1', '.hero-badge-2', '.hero-line',
        '.hero-stat', '.hero-marquee',
      ], { autoAlpha: 0 });

      gsap.set('.hero-name-1', { yPercent: 110 });
      gsap.set('.hero-name-2', { yPercent: 110 });
      gsap.set('.hero-eyebrow', { y: 20 });
      gsap.set('.hero-sub',     { y: 24 });
      gsap.set('.hero-cta',     { y: 20 });
      gsap.set('.hero-scroll',  { y: 16 });
      gsap.set('.hero-badge-1', { x: -20 });
      gsap.set('.hero-badge-2', { x:  20 });
      gsap.set('.hero-stat',    { y: 16 });
      gsap.set('.hero-marquee', { y: 10 });

      const tl = gsap.timeline({ delay: 0.4 });

      tl
        .to('.hero-eyebrow',  { autoAlpha: 1, y: 0,        duration: 0.8, ease: 'power3.out' })
        .to('.hero-name-1',   { autoAlpha: 1, yPercent: 0, duration: 1.0, ease: 'power4.out' }, '-=0.3')
        .to('.hero-name-2',   { autoAlpha: 1, yPercent: 0, duration: 1.0, ease: 'power4.out' }, '-=0.7')
        .to('.hero-line',     { autoAlpha: 1, scaleX: 1,   duration: 1.2, ease: 'power3.inOut', transformOrigin: 'left center' }, '-=0.4')
        .to('.hero-sub',      { autoAlpha: 1, y: 0,        duration: 0.9, ease: 'power3.out' }, '-=0.8')
        .to('.hero-cta',      { autoAlpha: 1, y: 0,        duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .to('.hero-image',    { autoAlpha: 1,              duration: 1.4, ease: 'power2.out' }, '-=0.9')
        .to('.hero-badge-1',  { autoAlpha: 1, x: 0,        duration: 0.7, ease: 'back.out(1.4)' }, '-=0.6')
        .to('.hero-badge-2',  { autoAlpha: 1, x: 0,        duration: 0.7, ease: 'back.out(1.4)' }, '-=0.5')
        .to('.hero-stat',     { autoAlpha: 1, y: 0,        duration: 0.8, ease: 'power3.out', stagger: 0.08 }, '-=0.5')
        .to('.hero-scroll',   { autoAlpha: 1, y: 0,        duration: 0.7, ease: 'power3.out' }, '-=0.3')
        .to('.hero-marquee',  { autoAlpha: 1, y: 0,        duration: 0.6, ease: 'power3.out' }, '-=0.5');



      /* Floating image bob */
      gsap.to(imageRef.current, {
        y: -14,
        duration: 3.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2,
      });

      /* Shimmer sweep */
      const shimmer = () => {
        gsap.fromTo('.hero-shimmer',
          { top: '-2px', opacity: 0 },
          { top: '102%', opacity: 0.5, duration: 2.4, ease: 'none',
            onComplete: () => gsap.delayedCall(4, shimmer) });
      };
      gsap.delayedCall(3, shimmer);

    }, sectionRef);

    return () => ctx.revert();
  }, []);



  const marqueeWords = [
    'Retouch', '✦', 'Campaign', '✦', 'Printing', '✦', 'Master KV', '✦',
    'Retouch', '✦', 'Campaign', '✦', 'Printing', '✦', 'Master KV', '✦',
  ];

  return (
    <>


      <section
        ref={sectionRef}
        id="hero"
        className="relative min-h-screen w-full overflow-hidden bg-[#080604] cursor-none flex flex-col"
      >
        {/* ── Canvas background ── */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* ── Background texture layers ── */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Radial glow behind image */}
          <div className="absolute top-0 right-0 w-[65%] h-full bg-[radial-gradient(ellipse_70%_80%_at_80%_50%,rgba(201,169,110,0.055)_0%,transparent_65%)]" />
          {/* Subtle grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
          />
          {/* Fine horizontal lines */}
          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(201,169,110,1) 60px,rgba(201,169,110,1) 61px)' }}
          />
          {/* Left vignette */}
          <div className="absolute left-0 top-0 h-full w-[30%] bg-gradient-to-r from-[#080604]/80 to-transparent" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080604] to-transparent" />
        </div>

        {/* ── MAIN CONTENT ── */}
        <motion.div
          style={{ y: yText, opacity }}
          className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center px-8 md:px-20 pt-36 pb-20 gap-12"
        >
          {/* LEFT: Typography */}
          <div className="flex flex-col max-w-[600px]">
            {/* Eyebrow */}
            <div className="hero-eyebrow flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2">
                <span className="w-8 h-px bg-[#C9A96E]/70" />
                <div className="w-1 h-1 bg-[#C9A96E] rounded-full" />
              </div>
              <span
                className="text-[#C9A96E]/80 text-[10px] tracking-[0.5em] uppercase"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Visual Designer & Brand Strategist
              </span>
            </div>

            {/* Main heading */}
            <div className="overflow-hidden mb-1">
              <span
                className="hero-name-1 block text-[clamp(54px,8vw,96px)] font-bold text-[#F5EDD6] leading-[0.95]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Crafting
              </span>
            </div>
            <div className="overflow-hidden mb-2">
              <span
                className="hero-name-2 block text-[clamp(54px,8vw,96px)] font-bold italic text-[#C9A96E] leading-[0.95]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Brands
              </span>
            </div>
            <div className="overflow-hidden mb-10">
              <span
                className="hero-name-1 block text-[clamp(54px,8vw,96px)] font-bold text-[#F5EDD6] leading-[0.95] opacity-30"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                that speak.
              </span>
            </div>

            {/* Divider line */}
            <div
              className="hero-line w-full max-w-[340px] h-px mb-10"
              style={{
                background: 'linear-gradient(90deg, #C9A96E 0%, rgba(201,169,110,0.3) 60%, transparent 100%)',
                transform: 'scaleX(0)',
              }}
            />

            {/* Sub copy */}
            <p
              className="hero-sub text-[#E8DCC8]/60 text-[17px] leading-relaxed max-w-[420px] mb-12"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
            >
              I design visuals that don't just look good — they convert,
              communicate, and position your brand where it deserves to be.
            </p>

            {/* CTAs */}
            <div className="hero-cta flex items-center gap-5 mb-16">
              <a
                href="#work"
                className="hero-cta-btn group relative flex items-center gap-3 px-7 py-4 bg-[#C9A96E] text-[#0D0A05] text-[11px] tracking-[0.3em] uppercase overflow-hidden transition-all duration-500"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <span className="relative z-10 font-semibold">View Work</span>
                <svg className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="absolute inset-0 bg-[#F5EDD6] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
              </a>

              <a
                href="#contact"
                className="hero-cta-btn group flex items-center gap-3 px-7 py-4 border border-[#C9A96E]/30 text-[#C9A96E] text-[11px] tracking-[0.3em] uppercase hover:border-[#C9A96E]/70 transition-all duration-400"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <span>Let's Talk</span>
              </a>
            </div>

          </div>

          {/* RIGHT: Portrait */}
          <motion.div
            style={{ y: yImage }}
            className="hidden md:flex items-center justify-center relative"
          >
            {/* Outer decorative frame container */}
            <div className="relative w-[340px] h-[480px] md:w-[380px] md:h-[520px]">

              {/* Orbiting corner accents */}
              <div className="absolute -top-4 -left-4 w-16 h-16 border-t border-l border-[#C9A96E]/50" />
              <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b border-r border-[#C9A96E]/50" />
              <div className="absolute -top-4 -right-4 w-6 h-6 border-t border-r border-[#C9A96E]/20" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 border-b border-l border-[#C9A96E]/20" />

              {/* Glow halo behind image */}
              <div
                className="absolute inset-0 rounded-[2px]"
                style={{ boxShadow: '0 0 80px rgba(201,169,110,0.10), 0 0 160px rgba(201,169,110,0.05)' }}
              />

              {/* Image */}
              <div ref={imageRef} className="hero-image relative w-full h-full">
                <Image
                  src="/landing.png"
                  alt="Noran Elgeneady — Visual Designer"
                  fill
                  className="object-cover object-left"
                  priority
                  onLoad={() => setLoaded(true)}
                />

                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080604]/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#080604]/20 via-transparent to-transparent pointer-events-none" />

                {/* Shimmer sweep */}
                <div
                  className="hero-shimmer absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent z-10"
                  style={{ top: '-2px' }}
                />
              </div>

              {/* Badge: role */}
              <div className="hero-badge-1 absolute -left-14 top-[22%] bg-[rgba(8,6,4,0.92)] border border-[#C9A96E]/20 backdrop-blur-sm py-3 px-4 z-10">
                <div
                  className="text-[10px] text-[#C9A96E] tracking-[0.35em] uppercase mb-0.5"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Visual Designer
                </div>
                <div
                  className="text-[9px] text-[#E8DCC8]/35 tracking-[0.25em] uppercase"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Brand & Identity
                </div>
              </div>

              {/* Badge: availability */}
              <div className="hero-badge-2 absolute -right-12 bottom-[22%] bg-[rgba(8,6,4,0.92)] border border-[#C9A96E]/20 backdrop-blur-sm py-3 px-4 z-10">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span
                    className="text-[10px] text-[#E8DCC8]/70 tracking-[0.3em] uppercase"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Available
                  </span>
                </div>
                <div
                  className="text-[9px] text-[#E8DCC8]/30 tracking-[0.2em] uppercase"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Open to projects
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Scroll indicator ── */}
        <motion.div
          style={{ opacity }}
          className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        >
          <span
            className="text-[#E8DCC8]/25 text-[9px] tracking-[0.45em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-[#C9A96E]/50 to-transparent relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#C9A96E] to-transparent"
              style={{ animation: 'scrollLine 1.8s ease-in-out infinite' }}
            />
          </div>
          <style>{`
            @keyframes scrollLine {
              0%   { transform: translateY(-100%); opacity: 0; }
              30%  { opacity: 1; }
              100% { transform: translateY(100%); opacity: 0; }
            }
          `}</style>
        </motion.div>

        {/* ── Marquee strip ── */}
        <div className="hero-marquee relative z-10 border-t border-[#C9A96E]/8 py-4 overflow-hidden bg-[#080604]/60 backdrop-blur-sm">
          <div
            className="flex items-center gap-8 whitespace-nowrap"
            style={{ animation: 'marquee 22s linear infinite' }}
          >
            {[...marqueeWords, ...marqueeWords].map((w, i) => (
              <span
                key={i}
                className={`text-[11px] tracking-[0.35em] uppercase ${w === '✦' ? 'text-[#C9A96E]/60 text-[8px]' : 'text-[#E8DCC8]/20'}`}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {w}
              </span>
            ))}
          </div>
          <style>{`
            @keyframes marquee {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      </section>
    </>
  );
}