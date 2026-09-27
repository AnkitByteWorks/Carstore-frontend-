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
      <body className="font-sans antialiased bg-slate-950 text-white">
        <Providers>
          {children}
          <CompareBar />
        </Providers>

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}