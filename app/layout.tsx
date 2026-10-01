import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

import { CompareBar } from "@/components/cars/compare-bar";
import { AiConciergeChat } from "@/components/ai/ai-concierge-chat";
import { LuxurySpotlight } from "@/components/ui/luxury-spotlight";

export const metadata: Metadata = {
  title: "Carstore — Luxury Cars",
  description: "Buy the world's finest luxury cars. Delivered to your door.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
    >
      <body className="font-sans antialiased bg-[#050505] text-white">
        <LuxurySpotlight />
        <Providers>
          {children}
          <CompareBar />
          <AiConciergeChat />
        </Providers>

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}