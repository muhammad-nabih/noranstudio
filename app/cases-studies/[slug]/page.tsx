import { notFound } from "next/navigation";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { getCaseStudyBySlug, getAllCaseStudySlugs } from "@/lib/sanity-queries";
import CaseStudyView from "@/components/CaseStudyView";
import Navbar from "@/components/Navbar";

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
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) notFound();

  return (
    <>
   
      
      <Navbar />
      <div className="flex items-center my-4">
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
    
        <div className="flex-grow h-px bg-gradient-to-l from-transparent via-accent/40 to-transparent" />
      </div>
 
  
      <CaseStudyView caseStudy={caseStudy} />;
    </>
  );
}
