import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/layout/hero";
import { BrandsBar } from "@/components/layout/brands-bar";
import { FeaturedCars } from "@/components/cars/featured-cars";
import { TrendingCars } from "@/components/cars/trending-cars";
import { Features } from "@/components/layout/features";
import { CTA } from "@/components/layout/cta";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      <Hero />
      <BrandsBar />
      <FeaturedCars />
      <TrendingCars />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}