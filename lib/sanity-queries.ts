import { client } from './sanity'
import type { Campaign } from './types'

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