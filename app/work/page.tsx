// app/work/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Server Component — fetches all case studies from Sanity
// and passes them to the client-side CaseStudiesGrid.
// ─────────────────────────────────────────────────────────────────────────────

import { client } from "@/sanity/lib/client";
import {
  ALL_CASE_STUDIES_QUERY,
  type CaseStudyCard,
} from "@/sanity/case-study.queries";
import CaseStudiesGrid from "@/components/CaseStudiesGrid";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Work — Case Studies",
  description: "A curated collection of projects — each one a problem worth documenting.",
};

export default async function WorkPage() {
  const data: CaseStudyCard[] = await client.fetch(ALL_CASE_STUDIES_QUERY);

  return <CaseStudiesGrid data={data} />;
}