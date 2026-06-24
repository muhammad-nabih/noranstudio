import { client } from '../../lib/sanity'
import type { Campaign, CaseStudy, CaseStudyCard, FooterData } from '@/sanity/lib/types'

// ─── Full Campaign (for slug page) ───────────────────────────────────────────

export const getCampaignBySlug = async (slug: string): Promise<Campaign | null> => {
  const query = `
    *[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      shortDescription,
      service-> {
        _id,
        title,
        description
      },
      heroImage {
        ...,
        asset->
      },
      order,
      behanceUrl,
      gallery[] {
        ...,
        asset->
      },
      clientName,
      year,
      featured
    }
  `
  return client.fetch(query, { slug })
}

// ─── All Campaigns (listing page) ────────────────────────────────────────────

export const getAllCampaigns = async (): Promise<Campaign[]> => {
  const query = `
    *[_type == "project"] | order(order asc) {
      _id,
      title,
      slug,
      shortDescription,
      service-> {
        _id,
        title
      },
      heroImage {
        ...,
        asset->
      },
      order,
      behanceUrl,
      clientName,
      year,
      featured
    }
  `
  return client.fetch(query)
}

// ─── Featured Campaigns (homepage) ────────────────────────────────────────────

export const getFeaturedCampaigns = async (): Promise<Campaign[]> => {
  const query = `
    *[_type == "project" && featured == true] | order(order asc) {
      _id,
      title,
      slug,
      shortDescription,
      service-> {
        _id,
        title
      },
      heroImage {
        ...,
        asset->
      },
      order,
      featured,
      clientName,
      year
    }
  `
  return client.fetch(query)
}

// ════════════════════════════════════════════════════════════════════════════
// ─── Footer query ───────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════

export const getFooterData = async (): Promise<FooterData | null> => {
  const query = `
    *[_type == "footer"][0]{
      _id,
      _type,
      ctaTagline,
      ctaHeading,
      email,
      ctaButtonLabel,
      logoText,
      logoSubtext,
      navigationLinks,
      socialLinks,
      copyrightText
    }
  `
  return client.fetch(query)
}

// ════════════════════════════════════════════════════════════════════════════
// ─── Case Study queries ───────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════

// ─── Full Case Study (for app/work/[slug]/page.tsx) ──────────────────────────

export const getCaseStudyBySlug = async (slug: string): Promise<CaseStudy | null> => {
  const query = `
    *[_type == "caseStudy" && slug.current == $slug][0] {
      _id,
      _type,
      slug,
      projectName,
      subtitle,
      tags,
      year,
      heroImage {
        ...,
        asset->
      },
      heroVideo,
      heroDetailImages[] {
        ...,
        asset->
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
        ...,
        asset->
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
  `
  return client.fetch(query, { slug })
}

// ─── All Case Studies (listing page, e.g. /work) ─────────────────────────────

export const getAllCaseStudies = async (): Promise<CaseStudyCard[]> => {
  const query = `
    *[_type == "caseStudy"] | order(year desc) {
      _id,
      slug,
      projectName,
      subtitle,
      tags,
      year,
      heroImage {
        ...,
        asset->
      }
    }
  `
  return client.fetch(query)
}

// ─── All Case Study Slugs (for generateStaticParams) ─────────────────────────

export const getAllCaseStudySlugs = async (): Promise<{ slug: string }[]> => {
  const query = `
    *[_type == "caseStudy"] { "slug": slug.current }
  `
  return client.fetch(query)
}

// في sanity/sanity-queries/sanity-queries.ts — أضف ده

export const ABOUT_QUERY = `*[_type == "about"][0]{
  name,
  greeting,
  role,
  location,
  heroHeadingLine1,
  heroHeadingLine2,
  shortBio,
  fullBio,
  yearsExperience,
  brandsCrafted,
  "photoUrl": photo.asset->url
}`

export const getAbout = () => client.fetch(ABOUT_QUERY);

// ─── Site Settings (Social Links) ───────────────────────────────────────────

export const getSiteSettings = async () => {
  const query = `
    *[_type == "siteSettings"][0]{
      socialLinks[]{
        platform,
        url
      }
    }
  `
  return client.fetch(query)
}