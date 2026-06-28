import { Analytics } from "@vercel/analytics/next";
import FooterWrapper from "@/components/FooterWrapper";
import type { Metadata } from "next";
import { montserrat, astonScript, virust } from "./fonts";
import "./globals.css";
import { BarbaProvider } from "@/components/providers/BarbaProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

import FullPageLoader from "@/components/FullPageLoader";




export const metadata: Metadata = {
  title: "NORAN GENEDY",
  description: `I don't create designs just for art or aesthetics. I craft visuals that bring brand identity to life, communicate marketing messages clearly, and transform ideas into impactful designs that truly support goals.`,
  generator: "mohamed nabih Dev",
  icons: {
    icon: [
      { url: "/logo.png", media: "(prefers-color-scheme: light)" },
      { url: "/logo.png", media: "(prefers-color-scheme: dark)" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${montserrat.variable} ${astonScript.variable} ${virust.variable} font-montserrat antialiased`}
    >
      <body >
        <FullPageLoader>
          <ThemeProvider>
            <BarbaProvider>
           
              <main>{children}</main>
              <FooterWrapper />
            </BarbaProvider>
          </ThemeProvider>
        </FullPageLoader>

        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}