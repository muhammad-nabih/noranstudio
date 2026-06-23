// fonts.ts


import localFont from "next/font/local";
import { Montserrat } from "next/font/google";

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

// الخط الإيطاليك/الكاليجرافي المستخدم في كلمة MIND و HI...
export const astonScript = localFont({
  src: "../public/fonts/AstonScript.ttf",
  variable: "--font-aston",
  display: "swap",
});

// متسجل وجاهز للاستخدام في أي مكان تاني في الموقع (مش مستخدم في السكشن ده تحديدًا)
export const virust = localFont({
  src: "../public/fonts/VIRUST.ttf",
  variable: "--font-virust",
  display: "swap",
});