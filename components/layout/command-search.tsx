"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { carsApi } from "@/lib/api/cars";
import { formatPrice } from "@/lib/utils/format";
import { getCarFallbackImage } from "@/lib/utils/car-images";
import type { Car } from "@/lib/types/car";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Clock,
  ArrowRight,
  Car as CarIcon,
  X,
  Sparkles,
} from "lucide-react";

const QUICK_BRANDS = [
  "Ferrari",
  "Porsche",
  "Lamborghini",
  "Bugatti",
  "Rolls-Royce",
  "McLaren",
];

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Fetch all cars for instant search
  const { data } = useQuery({
    queryKey: ["command-search-cars"],
    queryFn: () => carsApi.getAll({ page: 0, size: 50 }),
  });

  const cars = data?.content;

  // Keyboard shortcut listener (Cmd + K or Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtered cars
  const results = useMemo(() => {
    const list = cars || [];
    if (!query.trim()) {
      return list.slice(0, 6); // show first 6 as suggestions
    }

    const q = query.toLowerCase().trim();
    return list.filter(
      (car: Car) =>
        car.name.toLowerCase().includes(q) ||
        car.brand.toLowerCase().includes(q) ||
        car.showroomLocation.toLowerCase().includes(q) ||
        (car.description && car.description.toLowerCase().includes(q))
    );
  }, [cars, query]);

  const handleSelectCar = (id: number) => {
    setOpen(false);
    setQuery("");
    router.push(`/cars/${id}`);
  };

  return (
    <>
      {/* Trigger Button for Navbar */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors text-xs font-medium"
        aria-label="Search supercars"
      >
        <Search className="h-3.5 w-3.5 text-gold" />
        <span className="hidden sm:inline">Search marquee fleet...</span>
        <span className="sm:hidden">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
          <span>Ctrl</span>K
        </kbd>
      </button>

      {/* Modal Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-2xl p-0 overflow-hidden shadow-2xl shadow-gold/5">
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-900/60">
            <Search className="h-5 w-5 text-gold flex-shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by model, brand, location (e.g. Porsche 911, Mumbai)..."
              className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-slate-500 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Badges */}
          <div className="px-4 py-2.5 border-b border-slate-800/80 bg-slate-950/80 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider flex-shrink-0">
              Popular:
            </span>
            {QUICK_BRANDS.map((brand) => (
              <button
                key={brand}
                onClick={() => setQuery(brand)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors flex-shrink-0 ${
                  query.toLowerCase() === brand.toLowerCase()
                    ? "bg-gold text-slate-950 border-gold font-semibold"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-850 p-2">
            {results.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                <CarIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p>No supercars found matching &quot;{query}&quot;</p>
                <p className="text-xs text-slate-600 mt-1">
                  Try searching for Ferrari, Bugatti, or Mumbai
                </p>
              </div>
            ) : (
              results.map((car: Car) => (
                <div
                  key={car.id}
                  onClick={() => handleSelectCar(car.id)}
                  className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-900 cursor-pointer transition-colors group"
                >
                  {/* Thumbnail */}
                  <div className="h-14 w-20 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 relative">
                    <img
                      src={
                        car.hasImage
                          ? carsApi.getImageUrl(car.id)
                          : getCarFallbackImage(car.id, car.brand)
                      }
                      alt={car.name}
                      onError={(e) => {
                        const fallback = getCarFallbackImage(car.id, car.brand);
                        if (e.currentTarget.src !== fallback) {
                          e.currentTarget.src = fallback;
                        }
                      }}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-playfair text-white font-semibold text-sm truncate group-hover:text-gold transition-colors">
                        {car.name}
                      </span>
                      <Badge className="bg-slate-800 text-gold border-slate-700 text-[10px] px-1.5 py-0">
                        {car.brand}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {car.showroomLocation}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {car.deliveryDays}d delivery
                      </span>
                    </div>
                  </div>

                  {/* Price + Arrow */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gradient-gold">
                      {formatPrice(car.price)}
                    </p>
                    <span className="text-[11px] text-slate-500 flex items-center justify-end gap-1 group-hover:text-gold transition-colors">
                      View <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Guide */}
          <div className="p-3 bg-slate-900/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-gold" />
              <span>Showing {results.length} results</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Press <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-400 font-mono">ESC</kbd> to close</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
