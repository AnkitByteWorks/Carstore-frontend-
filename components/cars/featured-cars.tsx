"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { carsApi } from "@/lib/api/cars";
import { CarCard } from "./car-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Gauge, Trophy, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Car } from "@/lib/types/car";
import { getCarTelemetry } from "@/lib/data/car-specs";

interface CategoryOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryOption[] = [
  { id: "all", label: "All Flagships", icon: Sparkles },
  { id: "hypercars", label: "Hypercars (800+ HP)", icon: Zap },
  { id: "track", label: "Track Weapons", icon: Gauge },
  { id: "v12", label: "V12 & Grand Tourers", icon: Trophy },
  { id: "electric", label: "Hybrid & Electric", icon: Flame },
];

function matchesCategory(car: Car, categoryId: string): boolean {
  if (categoryId === "all") return true;
  const telemetry = getCarTelemetry(car.id) || getCarTelemetry(car.name);
  if (!telemetry) return true;

  switch (categoryId) {
    case "hypercars":
      return telemetry.hp >= 800;
    case "track":
      return (
        telemetry.drivetrain.includes("RWD") ||
        car.name.includes("GT") ||
        car.name.includes("SVJ") ||
        car.name.includes("Nismo") ||
        car.name.includes("Performance") ||
        car.name.includes("Black Series")
      );
    case "v12":
      return (
        telemetry.drivetrain.includes("V12") ||
        telemetry.drivetrain.includes("W16") ||
        telemetry.drivetrain.includes("W12") ||
        car.brand === "Rolls-Royce" ||
        car.brand === "Bentley" ||
        car.brand === "Aston Martin"
      );
    case "electric":
      return (
        telemetry.drivetrain.toLowerCase().includes("electric") ||
        telemetry.drivetrain.toLowerCase().includes("hybrid")
      );
    default:
      return true;
  }
}

export function FeaturedCars() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["all-inventory-cars"],
    queryFn: () => carsApi.getAll({ size: 20 }),
  });

  const allCars = data?.content || [];

  const filteredCars = useMemo(() => {
    return allCars.filter((car) => matchesCategory(car, activeCategory));
  }, [allCars, activeCategory]);

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[300px] bg-amber-500/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono uppercase tracking-widest text-amber-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Inventory
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Curated{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
                Masterpieces
              </span>
            </h2>
          </div>

          <Link href="/cars" className="hidden md:inline-flex">
            <Button
              variant="outline"
              className="border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 font-semibold text-xs tracking-wider uppercase px-5 py-5 rounded-xl"
            >
              Browse Full Inventory ({allCars.length || 20})
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 shrink-0 cursor-pointer ${
                  isActive
                    ? "text-slate-950 font-semibold"
                    : "text-slate-400 hover:text-white bg-[#0a0a0d] border border-white/[0.08] hover:border-white/[0.2]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterTab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[460px] bg-slate-900/60 border border-slate-800/60 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20 p-8 rounded-2xl bg-slate-900/40 border border-red-500/20">
            <p className="text-red-400 font-medium">
              Unable to reach the Carstore vault. Please check backend connection.
            </p>
          </div>
        )}

        {/* Filtered Grid with Animated Transitions */}
        {!isLoading && filteredCars.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                >
                  <CarCard car={car} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* No Results Fallback */}
        {!isLoading && filteredCars.length === 0 && (
          <div className="text-center py-16 p-8 rounded-2xl bg-slate-900/30 border border-slate-800">
            <p className="text-slate-400 text-sm">
              No vehicles currently match this criteria in our active showroom.
            </p>
            <Button
              onClick={() => setActiveCategory("all")}
              variant="outline"
              className="mt-4 border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-slate-950"
            >
              Reset to All Flagships
            </Button>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-10 text-center md:hidden">
          <Link href="/cars">
            <Button
              variant="outline"
              className="w-full border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-slate-950 font-semibold"
            >
              Browse Full Inventory ({allCars.length || 20})
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}