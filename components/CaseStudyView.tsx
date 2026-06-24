import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { CaseStudy } from "@/sanity/lib/types";


// ─────────────────────────────────────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────────────────────────────────────
function SectionLabel({ number }: { number: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="h-px w-8 bg-primary/60" />
      <span className="text-xs tracking-[0.2em] text-muted-foreground font-medium">
        {number}
      </span>
    </div>
  );
}

function InfoBlock({
  number,
  title,
  description,
}: {
  number: string;
  title?: string;
  description?: string;
}) {
  if (!title && !description) return null;
  return (
    <div className="border-l border-border pl-6 py-1">
      <SectionLabel number={number} />
      {title && (
        <h3 className="text-foreground text-lg md:text-xl font-semibold uppercase tracking-wide mb-3">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

function isLight(hex: string) {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function CaseStudyView({ caseStudy }: { caseStudy: CaseStudy }) {
  const {
    projectName,
    subtitle,
    tags,
    year,
    heroImage,
    heroDetailImages,
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
    visualDirectionImages,
    visualDirectionDescription,
    colorPalette,
    resultsTitle,
    metrics,
    clientFeedback,
  } = caseStudy;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24">
        {/* ── Top label: PROJECT NAME | EG ───────────────────────────── */}
        <div className="text-center mb-10">
          <h1 className="text-sm md:text-base tracking-[0.25em] font-medium text-foreground/90 uppercase">
            {projectName}
            <span className="text-muted-foreground"> &nbsp;|&nbsp; EG</span>
          </h1>
        </div>

        {/* ── Hero Image ──────────────────────────────────────────────── */}
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border mb-4">
          {heroImage?.asset && (
            <Image
              src={urlFor(heroImage).width(1600).height(900).url()}
              alt={heroImage.alt || projectName}
              fill
              priority
              className="object-cover"
            />
          )}
          {subtitle && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-black/10 via-transparent to-black/30">
              {/* <span className="text-3xl md:text-5xl font-serif italic text-accent/95 drop-shadow-lg">
                {projectName}
              </span>
              <span className="mt-2 text-xs md:text-sm tracking-[0.15em] text-foreground/90 uppercase">
                {subtitle}
              </span> */}
            </div>
          )}
        </div>

        {/* ── 4 Detail Images under Hero ─────────────────────────────── */}
        {heroDetailImages && heroDetailImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {heroDetailImages.slice(0, 4).map((img, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border"
              >
                <Image
                  src={urlFor(img).width(400).height(300).url()}
                  alt={img.alt || `${projectName} detail ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* ── Tags + Year ─────────────────────────────────────────────── */}
        {(tags?.length || year) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-16 border border-border">
            {tags?.slice(0, 3).map((tag, i) => (
              <div key={i} className="bg-card px-4 py-5 text-center">
                <span className="text-xs md:text-sm tracking-[0.1em] font-medium text-foreground/90 uppercase">
                  {tag}
                </span>
              </div>
            ))}
            {year && (
              <div className="bg-card px-4 py-5 text-center">
                <span className="text-xs md:text-sm tracking-[0.1em] font-medium text-foreground/90 uppercase">
                  {year}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Challenge / Goal / Insight / Strategy grid ──────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12 mb-20">
          <InfoBlock number="01" title={challengeTitle} description={challengeDescription} />
          <InfoBlock number="02" title={goalTitle} description={goalDescription} />
          <InfoBlock number="03" title={insightTitle} description={insightDescription} />
          <InfoBlock number="04" title={strategyTitle} description={strategyDescription} />
        </div>

        {/* ── Creative Idea ───────────────────────────────────────────── */}
        {(creativeIdeaTitle || creativeIdeaDescription) && (
          <div className="text-center mb-20 max-w-3xl mx-auto">
            {creativeIdeaTitle && (
              <h2 className="text-accent text-sm md:text-base tracking-[0.2em] font-semibold uppercase mb-4">
                {creativeIdeaTitle}
              </h2>
            )}
            {creativeIdeaDescription && (
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {creativeIdeaDescription}
              </p>
            )}
          </div>
        )}

        {/* ── Visual Direction ────────────────────────────────────────── */}
        {(visualDirectionTitle || (visualDirectionImages && visualDirectionImages.length > 0)) && (
          <div className="rounded-2xl border border-border bg-card/40 p-6 md:p-10 mb-20">
            {visualDirectionTitle && (
              <h2 className="text-center text-foreground/90 text-sm md:text-base tracking-[0.2em] font-semibold uppercase mb-8">
                {visualDirectionTitle}
              </h2>
            )}

            {visualDirectionImages && visualDirectionImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {visualDirectionImages.slice(0, 6).map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border"
                  >
                    <Image
                      src={urlFor(img).width(500).height(375).url()}
                      alt={img.alt || `${projectName} visual ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {visualDirectionDescription && (
              <p className="text-muted-foreground text-sm leading-relaxed text-center max-w-3xl mx-auto mb-8">
                {visualDirectionDescription}
              </p>
            )}

            {colorPalette && colorPalette.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {colorPalette.slice(0, 4).map((swatch, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className="w-full h-12 rounded-md border border-border flex items-center justify-center text-xs font-mono"
                      style={{
                        backgroundColor: swatch.hex,
                        color: isLight(swatch.hex) ? "#060a0a" : "#f5f5f5",
                      }}
                    >
                      {swatch.hex}
                    </div>
                    <span className="text-[11px] text-muted-foreground tracking-wide">
                      {swatch.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Results & Impact ────────────────────────────────────────── */}
        {(resultsTitle || (metrics && metrics.length > 0) || clientFeedback) && (
          <div>
            <SectionLabel number="05" />
            {resultsTitle && (
              <h2 className="text-foreground text-xl md:text-2xl font-semibold uppercase tracking-wide mb-8">
                {resultsTitle}
              </h2>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {metrics?.slice(0, 1).map((metric) => (
                <div key={metric._key} className="rounded-xl border border-border p-6 md:p-8">
                  <div className="text-5xl md:text-6xl font-bold text-accent mb-3">
                    {metric.value}
                  </div>
                  {metric.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {metric.description}
                    </p>
                  )}
                </div>
              ))}

              {clientFeedback && (
                <div className="rounded-xl border border-border p-6 md:p-8">
                  <h3 className="text-foreground text-sm font-semibold uppercase tracking-wide mb-3">
                    Client Feedback
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {clientFeedback}
                  </p>
                </div>
              )}
            </div>

            {metrics && metrics.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                {metrics.slice(1).map((metric) => (
                  <div key={metric._key} className="rounded-xl border border-border p-6">
                    <div className="text-3xl font-bold text-accent mb-2">
                      {metric.value}
                    </div>
                    <div className="text-xs text-foreground/80 uppercase tracking-wide mb-1">
                      {metric.label}
                    </div>
                    {metric.description && (
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {metric.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}