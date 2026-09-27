import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/layout/hero";
import { BrandsBar } from "@/components/layout/brands-bar";
import { FeaturedCars } from "@/components/cars/featured-cars";
import { Features } from "@/components/layout/features";
import { CTA } from "@/components/layout/cta";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero />
      <BrandsBar />
      <FeaturedCars />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}