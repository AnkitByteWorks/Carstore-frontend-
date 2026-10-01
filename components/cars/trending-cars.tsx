"use client";

import { useQuery } from "@tanstack/react-query";
import { carsApi } from "@/lib/api/cars";
import { CarCard } from "./car-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function TrendingCars() {
  const { data: cars, isLoading } = useQuery({
    queryKey: ["trending-cars"],
    queryFn: async () => {
      try {
        const trending = await carsApi.getTrending();
        if (trending && trending.length > 0) return trending;
      } catch (err) {
        // Fallback gracefully if backend endpoint is initializing
      }
      return carsApi.getFeatured();
    },
    staleTime: 60 * 1000, // 1 minute fresh cache
  });

  if (!isLoading && (!cars || cars.length === 0)) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-[#050505] via-[#09090c] to-[#050505] border-t border-white/[0.06]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
              <Flame className="h-4 w-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span>Real-Time Demand Analytics</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                REDIS POWERED
              </span>
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white">
              Trending Luxury Vehicles
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Most viewed and engaged supercars this week across our private client network
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[420px] bg-slate-900 rounded-xl" />
            ))}
          </div>
        )}

        {/* Cars Grid */}
        {cars && cars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.slice(0, 3).map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative"
              >
                {/* Hot Rank Badge */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/90 to-amber-500/90 text-slate-950 font-bold text-[10px] shadow-lg shadow-orange-500/20">
                  <Sparkles className="h-3 w-3" />
                  <span>TRENDING #{index + 1}</span>
                </div>
                <CarCard car={car} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
