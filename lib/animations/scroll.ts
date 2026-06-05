import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const createScrollTrigger = (
  element: HTMLElement,
  animation: GSAPAnimation,
  options?: ScrollTrigger.Vars
) => {
  return ScrollTrigger.create({
    trigger: element,
    onEnter: () => animation.play(),
    onLeaveBack: () => animation.reverse(),
    ...options,
  })
}

export const createParallaxEffect = (element: HTMLElement, speed: number = 0.5) => {
  gsap.to(element, {
    y: () => window.innerHeight * speed,
    scrollTrigger: {
      trigger: element,
      start: 'top center',
      end: 'bottom center',
      scrub: true,
    },
  })
}

export const createFadeInUp = (element: HTMLElement, delay: number = 0) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
    },
  })

  tl.fromTo(
    element,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, delay },
    0
  )

  return tl
}

export const createStaggerChildren = (
  container: HTMLElement,
  selector: string,
  staggerDelay: number = 0.1
) => {
  const children = container.querySelectorAll(selector)

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 80%',
    },
  })

  tl.fromTo(
    children,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, stagger: staggerDelay },
    0
  )

  return tl
}
