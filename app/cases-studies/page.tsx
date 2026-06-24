// app/work/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Server Component — fetches all case studies from Sanity
// and passes them to the client-side CaseStudiesGrid.
// ─────────────────────────────────────────────────────────────────────────────

import { client } from "@/sanity/lib/client";
import {
  ALL_CASE_STUDIES_QUERY,
  type CaseStudyCard,
} from "@/sanity/sanity-queries/case-study.queries";
import CaseStudiesGrid from "@/components/CaseStudiesGrid";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Work — Case Studies",
  description:
    "A curated collection of projects — each one a problem worth documenting.",
};

export default async function WorkPage() {
  const data: CaseStudyCard[] = await client.fetch(ALL_CASE_STUDIES_QUERY);

  return (
    <>
      <Navbar />
      <div className="flex items-center my-4">
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <div className="flex-grow h-px bg-gradient-to-l from-transparent via-accent/40 to-transparent" />
      </div>
      <CaseStudiesGrid data={data} />;
    </>
  );
}
