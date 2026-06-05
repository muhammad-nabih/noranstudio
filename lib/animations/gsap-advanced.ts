import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const setupParallaxScroll = (element: HTMLElement, offset: number = 50) => {
  gsap.to(element, {
    y: offset,
    scrollTrigger: {
      trigger: element,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      markers: false,
    },
  })
}

export const setupRevealAnimation = (elements: HTMLElement[], stagger: number = 0.1) => {
  gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 50,
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
    },
    {
      opacity: 1,
      y: 0,
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      stagger,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: elements[0],
        start: 'top 80%',
        end: 'top 20%',
        scrub: false,
      },
    }
  )
}

export const setupRotateOnScroll = (element: HTMLElement) => {
  gsap.to(element, {
    rotation: 360,
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 2,
    },
  })
}

export const setupScaleOnScroll = (element: HTMLElement, minScale: number = 0.8) => {
  gsap.to(element, {
    scale: minScale,
    opacity: 0.3,
    scrollTrigger: {
      trigger: element,
      start: 'top 50%',
      end: 'bottom 50%',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.getVelocity() / 300
        gsap.to(element, { skewY: progress, overwrite: 'auto' }, 0.8)
      },
    },
  })
}

export const setupTextSplit = (element: HTMLElement) => {
  const text = element.innerText
  element.innerHTML = text
    .split('')
    .map((char) => `<span class="inline-block">${char}</span>`)
    .join('')

  const spans = element.querySelectorAll('span')
  gsap.fromTo(
    spans,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.05,
      duration: 0.6,
      ease: 'back.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
      },
    }
  )
}

export const setupGlitchEffect = (element: HTMLElement) => {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      onEnter: () => {
        timeline.play()
      },
    },
  })

  timeline
    .to(element, { x: -2, duration: 0.1 }, 0)
    .to(element, { x: 2, duration: 0.1 }, 0.1)
    .to(element, { x: 0, duration: 0.1 }, 0.2)
    .to(element, { skewX: 10, duration: 0.1 }, 0.3)
    .to(element, { skewX: 0, duration: 0.1 }, 0.4)
}

export const setupMorphShape = (element: SVGElement) => {
  gsap.to(element, {
    attr: { r: 100 },
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
    },
  })
}

export const setupStaggeredList = (container: HTMLElement) => {
  const items = container.querySelectorAll('li, [data-list-item]')
  
  gsap.fromTo(
    items,
    {
      opacity: 0,
      x: -30,
    },
    {
      opacity: 1,
      x: 0,
      stagger: {
        amount: 0.6,
        from: 'start',
      },
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 75%',
      },
    }
  )
}

export const setupCounterAnimation = (element: HTMLElement, endValue: number, duration: number = 2) => {
  const obj = { value: 0 }
  
  gsap.to(obj, {
    value: endValue,
    duration,
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      once: true,
    },
    onUpdate: () => {
      element.innerText = Math.ceil(obj.value).toString()
    },
  })
}

export const setupPinSection = (element: HTMLElement, duration: number = 3) => {
  gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top top',
      end: 'bottom top',
      pin: true,
      scrub: 1,
    },
  })
}
