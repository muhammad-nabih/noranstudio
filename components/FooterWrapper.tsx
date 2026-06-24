import { getFooterData, getSiteSettings } from "@/sanity/sanity-queries/sanity-queries";
import type { FooterData } from "@/sanity/lib/types";
import type { SocialLink } from "@/components/SocialLinks";
import Footer from "@/components/Footer";

export default async function FooterWrapper() {
  const [footerData, siteSettings] = await Promise.all([
    getFooterData(),
    getSiteSettings(),
  ]);

  return (
    <Footer 
      data={footerData} 
      socialLinks={siteSettings?.socialLinks ?? []} 
    />
  );
}