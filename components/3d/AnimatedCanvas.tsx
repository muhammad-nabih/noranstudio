'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

export function AnimatedCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const objectsRef = useRef<THREE.Object3D[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    camera.position.z = 8

    // Create multiple particle systems
    const createParticleSystem = (count: number, color: number, z: number) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const velocities = new Float32Array(count * 3)

      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20
        positions[i + 1] = (Math.random() - 0.5) * 20
        positions[i + 2] = (Math.random() - 0.5) * 5
        
        velocities[i] = (Math.random() - 0.5) * 0.02
        velocities[i + 1] = (Math.random() - 0.5) * 0.02
        velocities[i + 2] = (Math.random() - 0.5) * 0.01
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.userData.velocities = velocities

      const material = new THREE.PointsMaterial({
        color,
        size: 0.08,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.5,
      })

      const particles = new THREE.Points(geometry, material)
      particles.position.z = z
      scene.add(particles)
      return particles
    }

    // Create torus geometry
    const torusGeometry = new THREE.TorusGeometry(3, 0.8, 64, 64)
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: 0xff00ff,
      emissive: 0xff00ff,
      emissiveIntensity: 0.3,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    })

    const torus = new THREE.Mesh(torusGeometry, torusMaterial)
    scene.add(torus)

    // Create icosahedron
    const icosahedronGeometry = new THREE.IcosahedronGeometry(1.5, 4)
    const icosahedronMaterial = new THREE.MeshStandardMaterial({
      color: 0xff00ff,
      emissive: 0xff00ff,
      emissiveIntensity: 0.2,
      metalness: 0.5,
      roughness: 0.5,
      wireframe: false,
      transparent: true,
      opacity: 0.6,
    })
    const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial)
    scene.add(icosahedron)

    // Add lighting
    const light1 = new THREE.PointLight(0xff00ff, 1, 100)
    light1.position.set(10, 10, 10)
    scene.add(light1)

    const light2 = new THREE.PointLight(0x00ffff, 0.5, 100)
    light2.position.set(-10, -10, 10)
    scene.add(light2)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    // Create particle systems
    const particles1 = createParticleSystem(200, 0xff00ff, -2)
    const particles2 = createParticleSystem(150, 0x00ffff, -3)

    objectsRef.current = [torus, icosahedron, particles1, particles2]

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Update particle velocities
      ;[particles1, particles2].forEach(p => {
        const posAttr = p.geometry.getAttribute('position') as THREE.BufferAttribute
        const positions = posAttr.array as Float32Array
        const velocities = p.geometry.userData.velocities as Float32Array

        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i]
          positions[i + 1] += velocities[i + 1]
          positions[i + 2] += velocities[i + 2]

          // Wrap around
          if (Math.abs(positions[i]) > 10) velocities[i] *= -1
          if (Math.abs(positions[i + 1]) > 10) velocities[i + 1] *= -1
        }
        posAttr.needsUpdate = true
      })

      // Rotate shapes
      torus.rotation.x += 0.0005
      torus.rotation.y += 0.0008
      icosahedron.rotation.x += 0.001
      icosahedron.rotation.y += 0.001
      icosahedron.rotation.z += 0.0005

      particles1.rotation.y += 0.0001
      particles2.rotation.y -= 0.0002

      renderer.render(scene, camera)
    }
    animate()

    // GSAP animations
    gsap.to(icosahedron.position, {
      y: 1,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    gsap.to(torus.position, {
      x: 2,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full absolute inset-0" />
}
