import { urlFor } from './sanity'

interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpg' | 'png'
}

/**
 * Generate optimized image URL with caching headers
 */
export const getOptimizedImageUrl = (
  source: any,
  options: ImageOptimizationOptions = {}
) => {
  const { width = 1200, height, quality = 75, format = 'webp' } = options

  let url = urlFor(source)
    .width(width)
    .quality(quality)
    .format(format)
    .url()

  if (height) {
    url = urlFor(source)
      .width(width)
      .height(height)
      .fit('crop')
      .quality(quality)
      .format(format)
      .url()
  }

  return url
}

/**
 * Generate responsive image sources for srcSet
 */
export const getResponsiveImageSources = (
  source: any,
  widths: number[] = [640, 1024, 1536, 2048]
) => {
  return widths
    .map((width) => {
      const url = urlFor(source)
        .width(width)
        .quality(75)
        .format('webp')
        .url()
      return `${url} ${width}w`
    })
    .join(', ')
}

/**
 * Generate placeholder blur data URL for LQIP (Low Quality Image Placeholder)
 */
export const getBlurDataUrl = (source: any): string => {
  return urlFor(source)
    .width(10)
    .height(10)
    .blur(10)
    .url()
}

/**
 * Get optimized image with all best practices
 */
export const getOptimizedImageProps = (
  source: any,
  alt: string,
  options: ImageOptimizationOptions = {}
) => {
  const { width = 1200, height } = options

  return {
    src: getOptimizedImageUrl(source, { width, height, ...options }),
    srcSet: getResponsiveImageSources(source, [640, 1024, 1536]),
    alt,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw',
    loading: 'lazy' as const,
    decoding: 'async' as const,
  }
}

/**
 * Preload critical images for performance
 */
export const preloadImage = (source: any, width: number = 1200) => {
  const url = getOptimizedImageUrl(source, { width })
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = url
  link.type = 'image/webp'
  document.head.appendChild(link)
}

/**
 * Generate srcset attribute for different pixel densities
 */
export const getPixelDensitySrcSet = (source: any, width: number = 1200) => {
  return [
    { density: 1, url: getOptimizedImageUrl(source, { width }) },
    { density: 2, url: getOptimizedImageUrl(source, { width: width * 2 }) },
  ]
    .map(({ density, url }) => `${url} ${density}x`)
    .join(', ')
}
