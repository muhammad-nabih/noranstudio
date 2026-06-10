// ─────────────────────────────────────────────────────────────────────────────
// sanity/queries/case-study.queries.ts
// All GROQ queries + TypeScript types for CaseStudy
// Import your configured `client` from "@/sanity/lib/client" wherever you use these
// ─────────────────────────────────────────────────────────────────────────────

import { groq } from "next-sanity";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SanityImageAsset {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt?: string;
  caption?: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  role: string;
}

export interface TypographyItem {
  fontName: string;
  role: "display" | "body" | "accent";
  weight: string;
  sample: string;
}

export interface RejectedOption {
  _key: string;
  title: string;
  image?: SanityImageAsset;
  reason: string;
}

export interface ProcessStep {
  _key: string;
  phase: string;
  description: string;
  images: SanityImageAsset[];
}

export interface Competitor {
  _key: string;
  name: string;
  strength: string;
  weakness: string;
  image?: SanityImageAsset;
}

export interface Metric {
  _key: string;
  label: string;
  value: string;
  description?: string;
}

// Full document — used on the [slug] page
export interface CaseStudy {
  _id: string;
  _type: "caseStudy";
  slug: { current: string };
  // Hero
  projectName: string;
  projectType: string;
  role: string;
  year: string;
  duration: string;
  summary: string;
  heroImage: SanityImageAsset;
  heroVideo?: string;
  tags?: string[];
  // Problem
  problemTitle: string;
  problemContext: string;
  clientQuote?: string;
  problemImages?: SanityImageAsset[];
  // Research
  moodBoardImages?: SanityImageAsset[];
  keywords: string[];
  competitors: Competitor[];
  researchInsights: string;
  // Process
  sketchImages?: SanityImageAsset[];
  processSteps: ProcessStep[];
  rejectedOptions: RejectedOption[];
  // Solution
  finalImages?: SanityImageAsset[];
  mockupImages?: SanityImageAsset[];
  colorPalette: ColorSwatch[];
  typography: TypographyItem[];
  designRationale: string;
  // Results
  metrics: Metric[];
  clientFeedback?: string;
  lessonsLearned: string;
  nextSteps?: string;
}

// Card shape — used on the listing page (lighter fetch)
export interface CaseStudyCard {
  _id: string;
  slug: { current: string };
  projectName: string;
  projectType: string;
  role: string;
  year: string;
  summary: string;
  heroImage: SanityImageAsset;
  tags?: string[];
}

// ─── GROQ Queries ────────────────────────────────────────────────────────────

// All case studies — lightweight, for the listing page
export const ALL_CASE_STUDIES_QUERY = groq`
  *[_type == "caseStudy"] | order(year desc) {
    _id,
    slug,
    projectName,
    projectType,
    role,
    year,
    summary,
    heroImage {
      asset,
      alt,
      caption
    },
    tags
  }
`;

// Single case study by slug — full document
export const CASE_STUDY_BY_SLUG_QUERY = groq`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    _id,
    _type,
    slug,
    projectName,
    projectType,
    role,
    year,
    duration,
    summary,
    heroImage {
      asset,
      alt,
      caption
    },
    heroVideo,
    tags,
    problemTitle,
    problemContext,
    clientQuote,
    problemImages[] {
      asset,
      alt,
      caption
    },
    moodBoardImages[] {
      asset,
      alt
    },
    keywords,
    competitors[] {
      _key,
      name,
      strength,
      weakness,
      image { asset }
    },
    researchInsights,
    sketchImages[] {
      asset,
      alt,
      caption
    },
    processSteps[] {
      _key,
      phase,
      description,
      images[] { asset }
    },
    rejectedOptions[] {
      _key,
      title,
      reason,
      image { asset, alt }
    },
    finalImages[] {
      asset,
      alt,
      caption
    },
    mockupImages[] {
      asset,
      alt,
      caption
    },
    colorPalette[] {
      name,
      hex,
      role
    },
    typography[] {
      fontName,
      role,
      weight,
      sample
    },
    designRationale,
    metrics[] {
      _key,
      label,
      value,
      description
    },
    clientFeedback,
    lessonsLearned,
    nextSteps
  }
`;

// All slugs — for generateStaticParams
export const ALL_SLUGS_QUERY = groq`
  *[_type == "caseStudy"] { "slug": slug.current }
`;