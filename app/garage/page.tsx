"use client";

import { useGarageStore } from "@/lib/store/garage-store";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CarCard } from "@/components/cars/car-card";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GaragePage() {
  const { items, clearGarage } = useGarageStore();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              <Heart className="h-4 w-4 fill-gold" />
              <span>Personal Collection</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold text-white">
              My Virtual Garage
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-2">
              {items.length} {items.length === 1 ? "supercar" : "supercars"} curated in your private collection.
            </p>
          </div>

          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearGarage}
              className="border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 self-start md:self-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Collection
            </Button>
          )}
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80 p-8"
          >
            <div className="h-20 w-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 text-slate-600">
              <Heart className="h-10 w-10" />
            </div>
            <h2 className="font-playfair text-2xl font-bold text-white mb-2">
              Your Garage is Empty
            </h2>
            <p className="text-slate-400 max-w-md mb-8 text-sm">
              Explore our fleet of world-class supercars, and tap the heart icon on any vehicle to add it to your private garage.
            </p>
            <Link href="/cars">
              <Button className="gradient-gold text-slate-950 font-semibold px-6 h-11">
                Explore The Fleet
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CarCard car={car} />
                </motion.div>
              ))}
            </div>

            {/* Garage Perks */}
            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base">
                    VIP Concierge Priority Booking
                  </h3>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Cars saved in your garage can be reserved with expedited test drives and doorstep showcase delivery.
                  </p>
                </div>
              </div>
              <Link href="/cars">
                <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-slate-950 flex-shrink-0">
                  Add More Cars
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
