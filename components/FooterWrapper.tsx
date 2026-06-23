import { client } from "@/lib/sanity";
import type { FooterData } from "@/sanity/lib/types";
import Footer from "./Footer";

export default async function FooterWrapper() {
  let data: FooterData | null = null;

  try {
    data = await client.fetch<FooterData>(
      `*[_type == "footer"][0]{
        _id,
        _type,
        ctaTagline,
        ctaHeading,
        email,
        ctaButtonLabel,
        logoText,
        logoSubtext,
        navigationLinks,
        socialLinks,
        copyrightText
      }`
    );
  } catch (err) {
    console.error("[FooterWrapper] Failed to fetch footer data:", err);
  }

  return <Footer data={data} />;
}