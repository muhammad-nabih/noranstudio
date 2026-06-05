/**
 * Performance monitoring utilities
 */

export interface PerformanceMetrics {
  fcp?: number
  lcp?: number
  cls?: number
  inp?: number
  ttfb?: number
}

/**
 * Report Core Web Vitals to monitoring service
 */
export const reportWebVitals = (metrics: PerformanceMetrics) => {
  // Send to analytics service (e.g., Vercel Analytics, Google Analytics)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Log to monitoring service
    console.debug('[WebVitals]', metrics)
  }
}

/**
 * Measure performance of a function
 */
export const measurePerformance = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now()
  try {
    const result = await fn()
    const duration = performance.now() - start
    console.debug(`[Perf] ${name}: ${duration.toFixed(2)}ms`)
    return result
  } catch (error) {
    const duration = performance.now() - start
    console.error(`[Perf] ${name} failed after ${duration.toFixed(2)}ms`, error)
    throw error
  }
}

/**
 * Lazy load components with Intersection Observer
 */
export const lazyLoadElement = (
  element: Element,
  callback: () => void,
  options?: IntersectionObserverInit
) => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback()
        observer.unobserve(element)
      }
    }, options)

    observer.observe(element)
    return observer
  }

  // Fallback for browsers without IntersectionObserver
  callback()
  return null
}

/**
 * Debounce function to reduce function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function to limit function calls
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Preload resources for better performance
 */
export const preloadResource = (href: string, as: string) => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = as
    link.href = href
    document.head.appendChild(link)
  }
}

/**
 * Prefetch resources for faster navigation
 */
export const prefetchResource = (href: string) => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  }
}

/**
 * Monitor Long Tasks (tasks that take > 50ms)
 */
export const observeLongTasks = (callback: (duration: number) => void) => {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          callback(entry.duration)
        }
      })

      observer.observe({ entryTypes: ['longtask'] })
      return observer
    } catch (e) {
      console.warn('Long tasks observation not supported')
    }
  }
}

/**
 * Get performance score (0-100)
 */
export const calculatePerformanceScore = (metrics: PerformanceMetrics): number => {
  let score = 100

  // Penalize for high FCP
  if (metrics.fcp && metrics.fcp > 3000) score -= 20

  // Penalize for high LCP
  if (metrics.lcp && metrics.lcp > 4000) score -= 20
  else if (metrics.lcp && metrics.lcp > 2500) score -= 10

  // Penalize for high CLS
  if (metrics.cls && metrics.cls > 0.25) score -= 20
  else if (metrics.cls && metrics.cls > 0.1) score -= 10

  // Penalize for high INP
  if (metrics.inp && metrics.inp > 500) score -= 20
  else if (metrics.inp && metrics.inp > 200) score -= 10

  return Math.max(0, Math.min(100, score))
}
