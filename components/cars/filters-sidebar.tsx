"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import type { CarFilters } from "@/lib/hooks/use-car-filters";

interface FiltersSidebarProps {
  filters: CarFilters;
  onUpdate: <K extends keyof CarFilters>(
    key: K,
    value: CarFilters[K]
  ) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const BRANDS = [
  "Ferrari",
  "Lamborghini",
  "Porsche",
  "Bugatti",
  "Rolls-Royce",
  "McLaren",
  "Bentley",
  "Koenigsegg",
  "Aston Martin",
  "Mercedes-AMG",
  "Audi",
  "BMW",
  "Tesla",
  "Nissan",
  "Jaguar",
  "Maserati",
  "Lexus",
  "Chevrolet",
  "Ford",
];

const LOCATIONS = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
];

const PRICE_RANGES = [
  { label: "Under ₹2 Cr", min: 0, max: 20000000 },
  { label: "₹2 Cr - ₹5 Cr", min: 20000000, max: 50000000 },
  { label: "₹5 Cr - ₹10 Cr", min: 50000000, max: 100000000 },
  { label: "₹10 Cr - ₹50 Cr", min: 100000000, max: 500000000 },
  { label: "Above ₹50 Cr", min: 500000000, max: null },
];

export function FiltersSidebar({
  filters,
  onUpdate,
  onReset,
  hasActiveFilters,
}: FiltersSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-2xl font-bold text-white">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-gold hover:text-gold hover:bg-gold/10"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <Separator className="bg-slate-800" />

      {/* Search */}
      <div className="space-y-3">
        <Label className="text-slate-300 text-sm font-medium">Search</Label>
        <Input
          placeholder="Porsche, Ferrari..."
          value={filters.search}
          onChange={(e) => onUpdate("search", e.target.value)}
          className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:border-gold"
        />
      </div>

      <Separator className="bg-slate-800" />

      {/* Brand */}
      <div className="space-y-3">
        <Label className="text-slate-300 text-sm font-medium">Brand</Label>
        <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-2">
          <button
            onClick={() => onUpdate("brand", "")}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
              filters.brand === ""
                ? "bg-gold/20 text-gold"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            All Brands
          </button>
          {BRANDS.map((brand) => (
            <button
              key={brand}
              onClick={() => onUpdate("brand", brand)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                filters.brand === brand
                  ? "bg-gold/20 text-gold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-slate-800" />

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-slate-300 text-sm font-medium">Price Range</Label>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range, i) => {
            const isActive =
              filters.minPrice === range.min && filters.maxPrice === range.max;
            return (
              <button
                key={i}
                onClick={() => {
                  onUpdate("minPrice", range.min);
                  onUpdate("maxPrice", range.max);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                  isActive
                    ? "bg-gold/20 text-gold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {range.label}
              </button>
            );
          })}
          {filters.minPrice !== null && (
            <button
              onClick={() => {
                onUpdate("minPrice", null);
                onUpdate("maxPrice", null);
              }}
              className="text-xs text-gold hover:underline mt-2"
            >
              Clear price
            </button>
          )}
        </div>
      </div>

      <Separator className="bg-slate-800" />

      {/* Location */}
      <div className="space-y-3">
        <Label className="text-slate-300 text-sm font-medium">
          Showroom Location
        </Label>
        <div className="space-y-1.5">
          <button
            onClick={() => onUpdate("location", "")}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
              filters.location === ""
                ? "bg-gold/20 text-gold"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            All Locations
          </button>
          {LOCATIONS.map((loc) => (
            <button
              key={loc}
              onClick={() => onUpdate("location", loc)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                filters.location === loc
                  ? "bg-gold/20 text-gold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
