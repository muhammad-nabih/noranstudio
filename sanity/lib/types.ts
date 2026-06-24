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
  caption?: string
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













// ════════════════════════════════════════════════════════════════════════════
// ───                     FOOTER DATA                             ───────────
// ════════════════════════════════════════════════════════════════════════════

export interface NavigationLink {
  label: string
  href: string
}

export interface SocialLink {
  platform: string
  label: string
  url: string
}

export interface FooterData {
  _id?: string
  _type?: 'footer'
  ctaTagline?: string
  ctaHeading?: string
  email?: string
  ctaButtonLabel?: string
  logoText?: string
  logoSubtext?: string
  navigationLinks?: NavigationLink[]
  // socialLinks removed → now comes from siteSettings
  copyrightText?: string
}







// ════════════════════════════════════════════════════════════════════════════
// ─── Case Study (matches "caseStudy" document in Sanity) ─────────────────────
// ════════════════════════════════════════════════════════════════════════════

export interface ColorSwatch {
  name: string
  hex: string
  role: string
}

export interface Metric {
  _key: string
  label: string
  value: string
  description?: string
}

export interface CaseStudy {
  _id: string
  _type: 'caseStudy'
  slug: { current: string }

  // Hero
  projectName: string
  subtitle?: string
  tags?: string[]                          // SOCIAL MEDIA, VISUAL ARTIST, TOURISM...
  year?: string
  heroImage: SanityImageAsset
  heroVideo?: string
  heroDetailImages?: SanityImageAsset[]    // الـ 4 صور تحت الهيرو

  // Challenge
  challengeTitle?: string
  challengeDescription?: string

  // Goal
  goalTitle?: string
  goalDescription?: string

  // Insight
  insightTitle?: string
  insightDescription?: string

  // Strategy
  strategyTitle?: string
  strategyDescription?: string

  // Creative Idea
  creativeIdeaTitle?: string
  creativeIdeaDescription?: string

  // Visual Direction
  visualDirectionTitle?: string
  visualDirectionImages?: SanityImageAsset[]   // الـ 6 صور
  visualDirectionDescription?: string
  colorPalette?: ColorSwatch[]

  // Results
  resultsTitle?: string
  metrics?: Metric[]
  clientFeedback?: string
}

export interface CaseStudyCard {
  _id: string
  slug: { current: string }
  projectName: string
  subtitle?: string
  tags?: string[]
  year?: string
  heroImage: SanityImageAsset
}


// sanity/lib/types.ts — أضفها جنب Campaign و Service
export type AboutData = {
  name: string;
  greeting: string;
  role: string;
  location: string;
  heroHeadingLine1: string;
  heroHeadingLine2: string;
  shortBio: string;
  fullBio: string;
  yearsExperience: string;
  brandsCrafted: string;
  photoUrl: string;
};