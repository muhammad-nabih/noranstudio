// app/work/[slug]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Next.js 15 / 16 — params is a Promise and MUST be awaited before use.
// The GROQ query uses $slug as a named parameter → must pass { slug } object,
// NOT a bare string, to client.fetch().
// ─────────────────────────────────────────────────────────────────────────────

import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import {
  CASE_STUDY_BY_SLUG_QUERY,
  ALL_SLUGS_QUERY,
  type CaseStudy,
} from "@/sanity/case-study.queries";
import CaseStudyPage from "@/components/CaseStudyPage";

export const revalidate = 60;

// ── Pre-generate all slugs at build time ─────────────────────────────────────
export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(ALL_SLUGS_QUERY);
  return slugs.map(({ slug }) => ({ slug }));
}

// ── SEO metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ✅ await first — THEN destructure (Next.js 15+ requirement)
  const { slug } = await params;

  // ✅ pass { slug } object — NOT the string directly
  // This is what feeds the $slug GROQ parameter
  const data: CaseStudy | null = await client.fetch(
    CASE_STUDY_BY_SLUG_QUERY,
    { slug }
  );

  if (!data) return {};

  return {
    title: `${data.projectName} — Case Study`,
    description: data.summary,
    openGraph: {
      title: `${data.projectName} — Case Study`,
      description: data.summary,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function CaseStudyRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ✅ await first — THEN destructure
  const { slug } = await params;

  // ✅ { slug } — the GROQ query expects: *[... && slug.current == $slug]
  //    client.fetch(query, params) maps $slug → params.slug
  const data: CaseStudy | null = await client.fetch(
    CASE_STUDY_BY_SLUG_QUERY,
    { slug }
  );

  if (!data) notFound();

  return <CaseStudyPage data={data} />;
}