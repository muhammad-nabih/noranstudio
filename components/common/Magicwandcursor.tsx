'use client';

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║              MAGIC WAND CURSOR — Noran Studio                  ║
 * ║                                                                  ║
 * ║  Integration:                                                    ║
 * ║    1. Import and render <MagicWandCursor /> once at the root    ║
 * ║       of your layout (e.g. layout.tsx or _app.tsx).             ║
 * ║    2. Add  cursor-none  class to <body> or the section that     ║
 * ║       should use the custom cursor.                             ║
 * ║    3. All Three.js, GSAP, and Framer Motion are self-contained. ║
 * ║                                                                  ║
 * ║  Palette:                                                        ║
 * ║    #0D0D0D  Obsidian black  — wand body                        ║
 * ║    #C9A96E  Warm gold       — sparkle stars                    ║
 * ║    #E8DCC8  Aged cream      — glow / secondary sparkles        ║
 * ║    #1A1008  Dark amber      — shadow / depth                   ║
 * ║    #8B7355  Bronze          — accent star tips                 ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import * as THREE from 'three';

// ─── Palette ──────────────────────────────────────────────────────────────────
const PALETTE = {
  obsidian : 0x0D0D0D,
  gold     : 0xC9A96E,
  cream    : 0xE8DCC8,
  amber    : 0x1A1008,
  bronze   : 0x8B7355,
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  type: 'star' | 'dot' | 'sparkle';
  color: string;
  rotation: number;
  rotationSpeed: number;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MagicWandCursor() {
  // refs
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const threeCanvasRef = useRef<HTMLCanvasElement>(null);
  const wandRef        = useRef<HTMLDivElement>(null);
  const particlesRef   = useRef<TrailParticle[]>([]);
  const mouseRef       = useRef({ x: -200, y: -200 });
  const prevMouseRef   = useRef({ x: -200, y: -200 });
  const rafRef         = useRef<number>(0);
  const threeRafRef    = useRef<number>(0);
  const isMovingRef    = useRef(false);
  const idleTimerRef   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Framer Motion smooth follower for the wand element
  const rawX  = useMotionValue(-200);
  const rawY  = useMotionValue(-200);
  const wandX = useSpring(rawX, { stiffness: 240, damping: 28, mass: 0.6 });
  const wandY = useSpring(rawY, { stiffness: 240, damping: 28, mass: 0.6 });

  // ── Star shape path helper ─────────────────────────────────────────────────
  const starPath = (
    ctx: CanvasRenderingContext2D,
    cx: number, cy: number,
    outerR: number, innerR: number,
    points: number, rotation: number
  ) => {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points + rotation;
      const r = i % 2 === 0 ? outerR : innerR;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
  };

  // ── Spawn sparkle particle ─────────────────────────────────────────────────
  const spawnParticle = useCallback((x: number, y: number, speed: number) => {
    const colors = ['#C9A96E', '#E8DCC8', '#8B7355', '#C9A96E', '#E8DCC8'];
    const types: TrailParticle['type'][] = ['star', 'star', 'dot', 'sparkle', 'star'];
    const idx    = Math.floor(Math.random() * colors.length);
    const angle  = Math.random() * Math.PI * 2;
    const spread = 0.6 + Math.random() * 1.4;
    const vel    = (speed * 0.08 + 0.4) * spread;

    particlesRef.current.push({
      x,
      y,
      vx           : Math.cos(angle) * vel,
      vy           : Math.sin(angle) * vel - 0.6,
      life         : 1,
      maxLife      : 0.65 + Math.random() * 0.5,
      size         : 2 + Math.random() * 5,
      type         : types[idx],
      color        : colors[idx],
      rotation     : Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.12,
    });
  }, []);

  // ── 2D Canvas particle system ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let lastTime = 0;

    const render = (time: number) => {
      rafRef.current = requestAnimationFrame(render);
      const dt = Math.min((time - lastTime) / 16.67, 3);
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update + draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life -= 0.022 * dt;
        if (p.life <= 0) return false;

        p.x  += p.vx * dt;
        p.y  += p.vy * dt;
        p.vy += 0.04 * dt; // gravity
        p.vx *= 0.98;
        p.rotation += p.rotationSpeed * dt;

        const alpha  = Math.min(p.life / p.maxLife, 1) * p.life;
        const scale  = p.size * (0.3 + p.life * 0.7);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'star') {
          ctx.fillStyle = p.color;
          // glow
          ctx.shadowBlur  = 8;
          ctx.shadowColor = p.color;
          starPath(ctx, 0, 0, scale, scale * 0.42, 5, 0);
          ctx.fill();
          ctx.shadowBlur = 0;

        } else if (p.type === 'sparkle') {
          // 4-point sparkle cross
          ctx.fillStyle = p.color;
          ctx.shadowBlur  = 10;
          ctx.shadowColor = '#C9A96E';
          const s = scale * 0.8;
          ctx.beginPath();
          ctx.moveTo(0, -s); ctx.lineTo(s * 0.18, -s * 0.18);
          ctx.lineTo(s, 0);  ctx.lineTo(s * 0.18, s * 0.18);
          ctx.lineTo(0, s);  ctx.lineTo(-s * 0.18, s * 0.18);
          ctx.lineTo(-s, 0); ctx.lineTo(-s * 0.18, -s * 0.18);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;

        } else {
          // dot
          ctx.fillStyle = p.color;
          ctx.shadowBlur  = 6;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, scale * 0.35, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        ctx.restore();
        return true;
      });
    };

    rafRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // ── Three.js ambient aura ──────────────────────────────────────────────────
  // Subtle WebGL layer: a few glowing embers follow cursor tip with delay
  useEffect(() => {
    const canvas = threeCanvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -window.innerWidth  / 2,
       window.innerWidth  / 2,
       window.innerHeight / 2,
      -window.innerHeight / 2,
      0.1, 10
    );
    camera.position.z = 1;

    // Embers: small glowing points that drift from tip
    const EMBERS = 18;
    const emberPositions = new Float32Array(EMBERS * 3);
    const emberSizes     = new Float32Array(EMBERS);

    // Start off-screen
    for (let i = 0; i < EMBERS; i++) {
      emberPositions[i * 3]     = -9999;
      emberPositions[i * 3 + 1] = -9999;
      emberPositions[i * 3 + 2] = 0;
      emberSizes[i] = 6 + Math.random() * 12;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(emberSizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:  { value: 0 },
        uColor: { value: new THREE.Color(PALETTE.gold) },
      },
      vertexShader: /* glsl */`
        attribute float size;
        uniform float uTime;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          pos.x += sin(uTime * 2.2 + position.y * 0.05) * 2.0;
          pos.y += cos(uTime * 1.8 + position.x * 0.05) * 1.5;
          vAlpha = 0.25 + 0.35 * abs(sin(uTime * 1.4 + position.x * 0.1));
          gl_Position  = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size;
        }
      `,
      fragmentShader: /* glsl */`
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float a = smoothstep(1.0, 0.1, d) * vAlpha;
          gl_FragColor = vec4(uColor, a);
        }
      `,
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Ember trails: each point slowly wanders toward cursor tip
    const emberTargets = Array.from({ length: EMBERS }, () => ({
      x: -9999, y: -9999,
      delay: Math.random() * 0.6,
      speed: 0.04 + Math.random() * 0.08,
    }));

    const posAttr = geo.attributes.position as THREE.BufferAttribute;

    let time = 0;
    const animate = () => {
      threeRafRef.current = requestAnimationFrame(animate);
      time += 0.016;
      mat.uniforms.uTime.value = time;

      const mx = mouseRef.current.x - window.innerWidth  / 2;
      const my = -(mouseRef.current.y - window.innerHeight / 2);

      for (let i = 0; i < EMBERS; i++) {
        const t = emberTargets[i];
        // Chase with lag
        t.x += (mx - t.x) * (t.speed * (1 - t.delay));
        t.y += (my - t.y) * (t.speed * (1 - t.delay));

        posAttr.setXYZ(i, t.x, t.y, 0);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };
    threeRafRef.current = requestAnimationFrame(animate);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.left   = -window.innerWidth  / 2;
      camera.right  =  window.innerWidth  / 2;
      camera.top    =  window.innerHeight / 2;
      camera.bottom = -window.innerHeight / 2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(threeRafRef.current);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  // ── Mouse tracking + GSAP wand entrance ───────────────────────────────────
  useEffect(() => {
    const wand = wandRef.current;
    if (!wand) return;

    // Wand entrance from off-screen
    gsap.fromTo(wand, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(2)', delay: 0.3 });

    let lastSpawnTime = 0;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Speed calculation
      const dx = x - prevMouseRef.current.x;
      const dy = y - prevMouseRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      mouseRef.current = { x, y };

      // Update Framer Motion spring
      rawX.set(x);
      rawY.set(y);

      // Spawn particles at wand tip — tip is now aligned to mouse position exactly
      const now = performance.now();
      const spawnRate = Math.max(16, 60 - speed * 1.5);
      if (now - lastSpawnTime > spawnRate) {
        const count = speed > 10 ? 3 : 1;
        for (let i = 0; i < count; i++) {
          spawnParticle(
            x + (Math.random() - 0.5) * 4,
            y + (Math.random() - 0.5) * 4,
            speed
          );
        }
        lastSpawnTime = now;
      }

      // Wand tilt: rotate slightly based on movement direction
      const angle = speed > 2 ? Math.atan2(dy, dx) * (180 / Math.PI) : 0;
      gsap.to(wand, {
        rotate   : -45 + angle * 0.08, // base rotation is -45 (diagonal), tilt slightly
        duration : 0.3,
        ease     : 'power2.out',
        overwrite: 'auto',
      });

      // Moving flag
      isMovingRef.current = true;
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        isMovingRef.current = false;
      }, 120);

      prevMouseRef.current = { x, y };
    };

    // Click burst — tip aligned to mouse, no offset needed
    const onClick = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      for (let i = 0; i < 14; i++) {
        spawnParticle(x, y, 12 + Math.random() * 8);
      }
      // GSAP wand pulse on click
      gsap.timeline()
        .to(wand, { scale: 1.35, duration: 0.12, ease: 'power2.out' })
        .to(wand, { scale: 1,    duration: 0.5,  ease: 'elastic.out(1.2, 0.5)' });
    };

    // Press down — squeeze toward tip (scale down + slight nudge toward tip direction)
    const onMouseDown = () => {
      gsap.to(wand, {
        scale    : 0.82,
        rotate   : '-=3',        // tip dips slightly on press
        duration : 0.1,
        ease     : 'power3.out',
        overwrite: 'auto',
      });
    };

    // Release — spring back
    const onMouseUp = () => {
      gsap.to(wand, {
        scale    : 1,
        duration : 0.55,
        ease     : 'elastic.out(1.3, 0.5)',
        overwrite: 'auto',
      });
    };

    document.addEventListener('mousemove',  onMove);
    document.addEventListener('click',      onClick);
    document.addEventListener('mousedown',  onMouseDown);
    document.addEventListener('mouseup',    onMouseUp);

    return () => {
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('click',      onClick);
      document.removeEventListener('mousedown',  onMouseDown);
      document.removeEventListener('mouseup',    onMouseUp);
      clearTimeout(idleTimerRef.current);
    };
  }, [rawX, rawY, spawnParticle]);

  // ── Idle sparkle loop (when cursor is still) ───────────────────────────────
  useEffect(() => {
    const idleLoop = () => {
      if (!isMovingRef.current && mouseRef.current.x > -100) {
        const x = mouseRef.current.x + (Math.random() - 0.5) * 6;
        const y = mouseRef.current.y + (Math.random() - 0.5) * 6;
        if (Math.random() < 0.4) spawnParticle(x, y, 1);
      }
    };
    const id = setInterval(idleLoop, 180);
    return () => clearInterval(id);
  }, [spawnParticle]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/*
        ┌─────────────────────────────────────────────────────────────┐
        │  Layer 1 — Three.js WebGL ember aura (lowest, z-[9990])     │
        │  Layer 2 — 2D Canvas particle trail (z-[9995])              │
        │  Layer 3 — Framer Motion wand SVG element (z-[9999])        │
        └─────────────────────────────────────────────────────────────┘
      */}

      {/* Three.js glow embers */}
      <canvas
        ref={threeCanvasRef}
        className="fixed inset-0 pointer-events-none z-[9990]"
        style={{ mixBlendMode: 'screen' }}
        aria-hidden="true"
      />

      {/* 2D particle trail canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9995]"
        aria-hidden="true"
      />

      {/* Wand cursor element */}
      <motion.div
        ref={wandRef}
        style={{
          x       : wandX,
          y       : wandY,
          opacity : 0,
          position: 'fixed',
          top     : 0,
          left    : 0,
          zIndex  : 9999,
          // Hotspot: the gold tip is at SVG coordinate (37.5, 5.5).
          // We shift the div so that exact pixel lands on the real mouse position.
          // translateX: -(37.5/44)*100% ≈ -85.2%  →  tip aligns on X
          // translateY: -(5.5/44)*100%  ≈ -12.5%  →  tip aligns on Y
          translateX: '-85.2%',
          translateY: '-12.5%',
          pointerEvents: 'none',
          willChange   : 'transform',
        }}
        aria-hidden="true"
      >
        {/* SVG wand — inlined for crisp rendering at any DPR */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 44 44"
          width="44"
          height="44"
          style={{ display: 'block', filter: 'drop-shadow(0 2px 8px rgba(201,169,110,0.5))' }}
        >
          {/* Shadow / depth layer */}
          <line
            x1="38" y1="6" x2="10" y2="38"
            stroke="#1A1008"
            strokeWidth="6.5"
            strokeLinecap="round"
            opacity="0.45"
          />
          {/* Wand body — obsidian */}
          <line
            x1="37" y1="5" x2="9" y2="37"
            stroke="#0D0D0D"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Mid-body highlight */}
          <line
            x1="36" y1="6.5" x2="22" y2="21"
            stroke="#8B7355"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Gold tip band */}
          <circle cx="37.5" cy="5.5" r="3.8" fill="#C9A96E" opacity="0.95" />
          {/* Inner cream highlight */}
          <circle cx="37.5" cy="5.5" r="1.8" fill="#E8DCC8" opacity="0.85" />
          {/* Tiny gold ring at mid-wand (collar) */}
          <circle cx="23"   cy="21"  r="1.4" fill="none" stroke="#8B7355" strokeWidth="1" opacity="0.5" />
        </svg>
      </motion.div>
    </>
  );
}