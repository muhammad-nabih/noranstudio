'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import * as THREE from 'three'

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const torusKnotRef = useRef<THREE.Mesh | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)

  // Setup Three.js background
  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0d0d0d) // Obsidian black
    scene.fog = new THREE.FogExp2(0x0d0d0d, 0.008)

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 2, 8)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Gold torus knot
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.3, 128, 16, 3, 4)
    const material = new THREE.MeshStandardMaterial({
      color: 0xc9a96e,
      emissive: 0x4a3a1a,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.85,
      flatShading: false,
    })
    const torusKnot = new THREE.Mesh(geometry, material)
    scene.add(torusKnot)
    torusKnotRef.current = torusKnot

    // Floating particles (stars)
    const particleCount = 1200
    const particlesGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 80
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 50
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 20
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xc9a96e,
      size: 0.08,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)
    particlesRef.current = particles

    // Subtle ambient + point light
    const ambientLight = new THREE.AmbientLight(0x221c0f)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0xc9a96e, 1.2, 20)
    pointLight.position.set(2, 3, 4)
    scene.add(pointLight)
    const backLight = new THREE.PointLight(0x8b7355, 0.6)
    backLight.position.set(-2, 1, -3)
    scene.add(backLight)

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      if (torusKnotRef.current) {
        torusKnotRef.current.rotation.x += 0.005
        torusKnotRef.current.rotation.y += 0.008
        torusKnotRef.current.rotation.z += 0.003
      }
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0005
        particlesRef.current.rotation.x += 0.0003
      }
      if (cameraRef.current) {
        // Gentle camera sway
        const time = Date.now() * 0.001
        cameraRef.current.position.x = Math.sin(time * 0.1) * 0.2
        cameraRef.current.lookAt(0, 0.5, 0)
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return
      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      rendererRef.current?.dispose()
    }
  }, [])

  return (
    <>
      {/* Three.js canvas container */}
      <div ref={containerRef} className="fixed inset-0 -z-10" />

      {/* Content overlay */}
      <div className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-[#0D0D0D]/80 via-[#0D0D0D]/60 to-[#0D0D0D]/80">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl w-full text-center space-y-8"
        >
          {/* Animated 404 with gold glow */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 150 }}
            className="relative"
          >
            <h1 className="text-8xl md:text-9xl font-boldfont-['Cormorant_Garamond']text-[#C9A96E] drop-shadow-[0_0_15px_rgba(201,169,110,0.5)]">
              404
            </h1>
            <div className="absolute -inset-4 bg-[#C9A96E]/5 blur-2xl rounded-full -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-['Cormorant_Garamond'] font-semibold text-[#E8DCC8]">
              Page Not Found
            </h2>
            <p className="text-[#E8DCC8]/70 font-['Cormorant_Garamond'] text-lg max-w-md mx-auto">
              The page you are looking for doesn't exist or has been moved.
              <br />
              Perhaps the story took another turn.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 border border-[#C9A96E]/30 bg-[#1A1008]/60 backdrop-blur-sm font-['Cormorant_Garamond'] rounded-full text-[#E8DCC8] font-['Cormorant_Garamond'] tracking-wide transition-all duration-300 hover:bg-[#C9A96E]/10 hover:border-[#C9A96E]/60 hover:shadow-lg hover:shadow-[#C9A96E]/20 group"
            >
              <span>Return to Home</span>
              <svg
                className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '80px' }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="h-px bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent mx-auto"
          />
        </motion.div>
      </div>
    </>
  )
}