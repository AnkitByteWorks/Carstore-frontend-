"use client";

import { useCompareStore } from "@/lib/store/compare-store";
import { getCarFallbackImage } from "@/lib/utils/car-images";
import { carsApi } from "@/lib/api/cars";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function CompareBar() {
  const { items, removeFromCompare, clearCompare } = useCompareStore();

  if (items.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl"
      >
        <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl shadow-gold/10 flex items-center justify-between gap-4">
          {/* Selected items pills */}
          <div className="flex items-center gap-3 overflow-x-auto">
            {items.map((car) => (
              <div
                key={car.id}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 pr-2.5 flex-shrink-0"
              >
                <div className="h-9 w-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                  <img
                    src={
                      car.hasImage
                        ? carsApi.getImageUrl(car.id)
                        : getCarFallbackImage(car.id, car.brand)
                    }
                    alt={car.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white truncate max-w-[100px]">
                    {car.name}
                  </p>
                  <p className="text-[10px] text-gold font-medium">
                    {formatPrice(car.price)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCompare(car.id)}
                  aria-label="Remove"
                  className="text-slate-500 hover:text-white p-0.5 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* Empty slot placeholder if < 3 */}
            {items.length < 3 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-slate-800 text-[11px] text-slate-500 flex-shrink-0">
                <ArrowLeftRight className="h-3 w-3" />
                <span>Add {3 - items.length} more</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={clearCompare}
              className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1 transition-colors hidden sm:block"
            >
              Clear
            </button>
            <Link href="/compare">
              <Button size="sm" className="gradient-gold text-slate-950 font-bold px-4 h-9 text-xs">
                Compare ({items.length})
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
