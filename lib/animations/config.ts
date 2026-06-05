import anime from 'animejs'

// GSAP Timeline configuration
export const GSAP_CONFIG = {
  ease: 'power3.inOut',
  duration: 0.8,
  stagger: 0.1,
}

// Framer Motion configuration
export const FRAMER_CONFIG = {
  transition: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  layoutTransition: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
}

// Anime.js keyframe animations
export const createKeyframeAnimation = (targets: any, keyframes: any[], options?: any) => {
  return anime({
    targets,
    keyframes,
    duration: 3000,
    easing: 'easeInOutQuad',
    loop: true,
    ...options,
  })
}

// Motion.dev scroll-linked animation helper
export const createScrollLinkedAnimation = (
  element: HTMLElement,
  startPosition: number,
  endPosition: number,
  animationFn: (progress: number) => void
) => {
  const handleScroll = () => {
    const scrollProgress = window.scrollY
    const totalDistance = endPosition - startPosition
    const progress = Math.max(0, Math.min(1, (scrollProgress - startPosition) / totalDistance))
    animationFn(progress)
  }

  window.addEventListener('scroll', handleScroll, { passive: true })

  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}
