import { Suspense } from 'react';
import { getAllCampaigns } from '@/lib/sanity-queries';
import CampaignsClient from '@/components/CampaignsClient';
import Navbar from '@/components/Navbar';
import BackNav from '@/components/common/BackNav';

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
    <div className="bg-[#0D0D0D] min-h-screen">
      
      {/* Header skeleton */}
      <div className="px-8 md:px-20 pt-36 pb-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-8 h-px bg-[#C9A96E]/20" />
          <div className="w-24 h-2 bg-[#C9A96E]/10 rounded-full" />
        </div>
        <div className="h-[clamp(60px,10vw,120px)] w-3/5 bg-[#C9A96E]/[0.05] animate-pulse" />
        <div className="mt-8 mb-8 h-px w-full max-w-xl"
          style={{ background: 'linear-gradient(90deg, rgba(201,169,110,0.15) 0%, transparent 100%)' }} />
        <div className="h-4 w-72 bg-[#E8DCC8]/[0.04] animate-pulse" />
      </div>
      {/* Marquee placeholder */}
      <div className="border-t border-[#C9A96E]/[0.07] py-4 bg-[#0D0D0D]/60 mb-1" />
      {/* Grid skeleton */}
      <div className="px-[3px] pb-[3px]">
        <div
          className="grid gap-[3px]"
          style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '230px', gridAutoFlow: 'row dense' }}
        >
          {pattern.map((p, i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{
                gridColumn: `span ${p.col}`,
                gridRow:    `span ${p.row}`,
                background: `hsl(35, 10%, ${5 + (i % 3) * 2}%)`,
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
    <main className="min-h-screen bg-[#0D0D0D]">
        <BackNav/>
      <Suspense fallback={<CampaignsSkeleton />}>
   
        <CampaignsClient campaigns={campaigns} />
      </Suspense>
    </main>
  );
}