"use client";

import { useQuery } from "@tanstack/react-query";
import { carsApi } from "@/lib/api/cars";
import { CarCard } from "./car-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function FeaturedCars() {
  const { data: cars, isLoading, error } = useQuery({
    queryKey: ["featured-cars"],
    queryFn: carsApi.getFeatured,
  });

  return (
    <section className="py-20 bg-slate-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sm font-medium text-gold mb-2 tracking-widest uppercase">
              Curated Collection
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white">
              Featured Cars
            </h2>
          </div>
          <Link href="/cars" className="hidden md:block">
            <Button
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-slate-950"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Grid Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Skeleton className="h-[420px] bg-slate-800/50 rounded-xl" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-400">
              Failed to load cars. Is the backend running?
            </p>
          </div>
        )}

        {/* Grid with Framer Motion Staggered Fade-in */}
        {cars && cars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/cars">
            <Button
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-slate-950"
            >
              View All Cars
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}