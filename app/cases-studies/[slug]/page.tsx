import { notFound } from "next/navigation";
import { getCaseStudyBySlug, getAllCaseStudySlugs } from "@/sanity/sanity-queries/sanity-queries";
import CaseStudyView from "@/components/CaseStudyView";
import Navbar from "@/components/Navbar";
import Loader from "@/app/Loader";
import { Suspense } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Static params (SSG) — اختياري بس بيحسّن السرعة
// ─────────────────────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudyPromise = getCaseStudyBySlug(slug);

  // Loader usage with suspense pattern (Next.js 13+)
  return (
    <>
      <Navbar />
      <div className="flex items-center my-4">
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <div className="flex-grow h-px bg-gradient-to-l from-transparent via-accent/40 to-transparent" />
      </div>
      <Suspense fallback={<Loader />}>
        {/* Await-ing the caseStudy */}
        <CaseStudyBoundary caseStudyPromise={caseStudyPromise} />
      </Suspense>
    </>
  );
}

// Helper boundary to handle async/await plus 404 for not found
async function CaseStudyBoundary({ caseStudyPromise }: { caseStudyPromise: Promise<any> }) {
  const caseStudy = await caseStudyPromise;
  if (!caseStudy) notFound();
  return <CaseStudyView caseStudy={caseStudy} />;
}