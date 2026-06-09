import { Suspense } from 'react';
import { getAllCampaigns } from '@/lib/sanity-queries';
import CampaignsClient from '@/components/CampaignsClient';
import Navbar from '@/components/Navbar';
import BackNav from '@/components/common/BackNav';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Campaigns',
  description: 'A curated archive of advertising campaigns, key visuals & creative productions.',
};

export const revalidate = 60;

function CampaignsSkeleton() {
  const pattern = [
    { col: 1, row: 2 }, { col: 2, row: 1 }, { col: 1, row: 1 },
    { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 1, row: 2 },
  ];
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="px-8 md:px-20 pt-36 pb-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-8 h-px bg-primary/20" />
          <div className="w-24 h-2 bg-primary/10 rounded-full animate-pulse" />
        </div>
        <div className="h-[clamp(60px,10vw,120px)] w-3/5 bg-primary/5 animate-pulse" />
        <div className="mt-8 mb-8 h-px w-full max-w-xl"
          style={{ background: 'linear-gradient(90deg, rgba(243,121,167,0.15) 0%, transparent 100%)' }} />
        <div className="h-4 w-72 bg-foreground/5 animate-pulse" />
      </div>
      {/* Marquee placeholder */}
      <div className="border-t border-primary/10 py-4 bg-background/60 mb-1" />
      {/* Grid skeleton */}
      <div className="px-[3px] pb-[3px]">
        <div
          className="grid gap-[3px]"
          style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '230px', gridAutoFlow: 'row dense' }}
        >
          {pattern.map((p, i) => (
            <div
              key={i}
              className={cn(
                "animate-pulse",
                i % 2 === 0 ? "bg-primary/5" : "bg-secondary/5"
              )}
              style={{
                gridColumn: `span ${p.col}`,
                gridRow:    `span ${p.row}`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function CampaignsPage() {
  const campaigns = await getAllCampaigns();
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<CampaignsSkeleton />}>
        <CampaignsClient campaigns={campaigns} />
      </Suspense>
    </main>
  );
}