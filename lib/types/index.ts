// ─── Sanity image asset ───────────────────────────────────────────────────────

export interface SanityImageAsset {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
    url?: string
    metadata?: {
      lqip?: string
      dimensions?: { width: number; height: number }
    }
  }
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt?: string
}

// ─── Service ──────────────────────────────────────────────────────────────────

export interface Service {
  _id: string
  _type: 'service'
  title: string
  description?: string
  order?: number
}

// ─── Campaign (matches "project" document in Sanity) ─────────────────────────

export interface Campaign {
  _id: string
  _type: 'project'

  // Required fields
  title: string
  slug: { current: string }
  shortDescription: string
  service: Service
  heroImage: SanityImageAsset
  order: number

  // Optional fields
  behanceUrl?: string
  gallery?: SanityImageAsset[]
  clientName?: string
  year?: number
  featured?: boolean
}

// ─── Legacy alias (keep backwards compat if anything imports ImageAsset) ─────

export type ImageAsset = SanityImageAsset

// ─── Gallery type (for future use if gallery schema is re-enabled) ────────────

export interface Gallery {
  _id: string
  _type: 'gallery'
  title: string
  description?: string
  images: SanityImageAsset[]
  order: number
}