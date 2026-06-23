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

export interface Metric {
  _key: string;
  label: string;
  value: string;
  description?: string;
}

export interface CaseStudy {
  _id: string;
  _type: "caseStudy";
  slug: { current: string };
  // Hero
  projectName: string;
  subtitle?: string;
  tags?: string[];
  year?: string;
  heroImage: SanityImageAsset;
  heroVideo?: string;
  heroDetailImages?: SanityImageAsset[];   // ✅ جديد: 4 صور تحت الهيرو
  // Challenge
  challengeTitle?: string;
  challengeDescription?: string;
  // Goal
  goalTitle?: string;
  goalDescription?: string;
  // Insight
  insightTitle?: string;
  insightDescription?: string;
  // Strategy
  strategyTitle?: string;
  strategyDescription?: string;
  // Creative Idea
  creativeIdeaTitle?: string;
  creativeIdeaDescription?: string;
  // Visual Direction
  visualDirectionTitle?: string;
  visualDirectionImages?: SanityImageAsset[];  // ✅ جديد: 6 صور المعرض
  visualDirectionDescription?: string;          // ✅ جديد: الوصف تحت المعرض
  colorPalette?: ColorSwatch[];
  // Results
  resultsTitle?: string;
  metrics?: Metric[];
  clientFeedback?: string;
}

export interface CaseStudyCard {
  _id: string;
  slug: { current: string };
  projectName: string;
  subtitle?: string;
  tags?: string[];
  year?: string;
  heroImage: SanityImageAsset;
}

// ─── GROQ Queries ────────────────────────────────────────────────────────────

export const ALL_CASE_STUDIES_QUERY = groq`
  *[_type == "caseStudy"] | order(year desc) {
    _id,
    slug,
    projectName,
    subtitle,
    tags,
    year,
    heroImage {
      asset,
      alt,
      caption
    }
  }
`;

export const CASE_STUDY_BY_SLUG_QUERY = groq`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    _id,
    _type,
    slug,
    projectName,
    subtitle,
    tags,
    year,
    heroImage {
      asset,
      alt,
      caption
    },
    heroVideo,
    heroDetailImages[] {
      asset,
      alt
    },
    challengeTitle,
    challengeDescription,
    goalTitle,
    goalDescription,
    insightTitle,
    insightDescription,
    strategyTitle,
    strategyDescription,
    creativeIdeaTitle,
    creativeIdeaDescription,
    visualDirectionTitle,
    visualDirectionImages[] {
      asset,
      alt
    },
    visualDirectionDescription,
    colorPalette[] {
      name,
      hex,
      role
    },
    resultsTitle,
    metrics[] {
      _key,
      label,
      value,
      description
    },
    clientFeedback
  }
`;

export const ALL_SLUGS_QUERY = groq`
  *[_type == "caseStudy"] { "slug": slug.current }
`;