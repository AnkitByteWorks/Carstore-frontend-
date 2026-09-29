"use client";

import { useCompareStore } from "@/lib/store/compare-store";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getCarFallbackImage } from "@/lib/utils/car-images";
import { carsApi } from "@/lib/api/cars";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeftRight,
  Trash2,
  ShoppingCart,
  MapPin,
  Clock,
  ArrowRight,
  X,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ComparePage() {
  const { items, removeFromCompare, clearCompare } = useCompareStore();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              <ArrowLeftRight className="h-4 w-4" />
              <span>Side-by-Side Analysis</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold text-white">
              Marquee Fleet Comparison
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-2">
              Evaluating {items.length} {items.length === 1 ? "supercar" : "supercars"} across performance, pricing, and bespoke logistics.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <Link href="/cars">
                <Button variant="outline" size="sm" className="border-slate-800 text-slate-300 hover:text-white">
                  + Add Another Car
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCompare}
                className="border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80 p-8"
          >
            <div className="h-20 w-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 text-slate-600">
              <ArrowLeftRight className="h-10 w-10" />
            </div>
            <h2 className="font-playfair text-2xl font-bold text-white mb-2">
              No Supercars Selected For Comparison
            </h2>
            <p className="text-slate-400 max-w-md mb-8 text-sm">
              Browse our inventory and click the &quot;Compare&quot; button on any two or three vehicles to inspect their specifications side by side.
            </p>
            <Link href="/cars">
              <Button className="gradient-gold text-slate-950 font-semibold px-6 h-11">
                Explore The Fleet
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="overflow-x-auto pb-6">
            <div className="min-w-[700px] grid grid-cols-1 divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
              {/* Row 1: Vehicle Visual & Header */}
              <div
                className="grid gap-6 p-6"
                style={{
                  gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
                }}
              >
                {items.map((car) => (
                  <div key={car.id} className="relative space-y-4">
                    <button
                      onClick={() => removeFromCompare(car.id)}
                      className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-slate-950/80 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800"
                      aria-label="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>

                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-800 border border-slate-800 relative">
                      <img
                        src={
                          car.imageUrl && !car.imageUrl.includes("localhost") && !car.imageUrl.includes("placeholder")
                            ? car.imageUrl
                            : getCarFallbackImage(car.id, car.brand)
                        }
                        alt={car.name}
                        onError={(e) => {
                          const fallback = getCarFallbackImage(car.id, car.brand);
                          if (e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback;
                          }
                        }}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute bottom-2 left-2 bg-slate-950/90 text-gold border-gold/40 text-[11px]">
                        {car.brand}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-playfair text-xl font-bold text-white leading-snug">
                        {car.name}
                      </h3>
                      <p className="text-2xl font-extrabold text-gradient-gold mt-1.5">
                        {formatPrice(car.price)}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Link href={`/checkout/${car.id}`} className="block">
                        <Button className="w-full gradient-gold text-slate-950 font-bold h-10 text-xs">
                          <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                          Acquire Vehicle
                        </Button>
                      </Link>
                      <Link href={`/cars/${car.id}`} className="block">
                        <Button variant="outline" className="w-full border-slate-800 text-slate-300 hover:text-white h-9 text-xs">
                          Full Spec Sheet
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2: Location */}
              <div className="p-6 bg-slate-950/40">
                <span className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] block mb-3">
                  Showroom Location
                </span>
                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
                  }}
                >
                  {items.map((car) => (
                    <div key={car.id} className="flex items-center gap-2 text-sm text-slate-200">
                      <MapPin className="h-4 w-4 text-gold flex-shrink-0" />
                      <span>{car.showroomLocation} Flagship</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 3: Delivery Timeline */}
              <div className="p-6">
                <span className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] block mb-3">
                  Logistics & Delivery
                </span>
                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
                  }}
                >
                  {items.map((car) => (
                    <div key={car.id} className="flex items-center gap-2 text-sm text-slate-200">
                      <Clock className="h-4 w-4 text-gold flex-shrink-0" />
                      <span>{car.deliveryDays} Days Insured Transit</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 4: Color Palette */}
              <div className="p-6 bg-slate-950/40">
                <span className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] block mb-3">
                  Color Options
                </span>
                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
                  }}
                >
                  {items.map((car) => (
                    <div key={car.id} className="flex flex-wrap gap-1.5">
                      {(car.colorOptions ? car.colorOptions.split(",") : ["Bespoke"]).map((col, idx) => (
                        <Badge key={idx} variant="outline" className="border-slate-700 text-slate-300 text-[11px]">
                          {col.trim()}
                        </Badge>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 5: Payment Options */}
              <div className="p-6">
                <span className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] block mb-3">
                  Financing & Payment Methods
                </span>
                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
                  }}
                >
                  {items.map((car) => (
                    <div key={car.id} className="flex flex-wrap gap-1.5">
                      {(car.paymentOptions ? car.paymentOptions.split(",") : ["Wire Transfer"]).map((pm, idx) => (
                        <Badge key={idx} variant="outline" className="border-slate-800 bg-slate-900 text-slate-300 text-[11px]">
                          {pm.trim()}
                        </Badge>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 6: Description / Highlights */}
              <div className="p-6 bg-slate-950/40">
                <span className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] block mb-3">
                  Vehicle Persona
                </span>
                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
                  }}
                >
                  {items.map((car) => (
                    <p key={car.id} className="text-xs text-slate-400 leading-relaxed">
                      {car.description || "Uncompromised performance and luxury engineered without compromise."}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
