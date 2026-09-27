"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CarCard } from "@/components/cars/car-card";
import { FiltersSidebar } from "@/components/cars/filters-sidebar";
import { SortDropdown } from "@/components/cars/sort-dropdown";
import { Pagination } from "@/components/cars/pagination";
import { EmptyState } from "@/components/cars/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { carsApi } from "@/lib/api/cars";
import { useCarFilters } from "@/lib/hooks/use-car-filters";
import { motion } from "framer-motion";
import { useState } from "react";

export default function CarsPage() {
  const { filters, updateFilter, resetFilters, hasActiveFilters } =
    useCarFilters();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["cars", filters],
    queryFn: () =>
      carsApi.getAll({
        page: filters.page,
        size: filters.size,
        sortBy: filters.sortBy,
        direction: filters.direction,
      }),
  });

  // Client-side filtering (since backend returns all cars for now)
  // In production, filters would be sent to backend
  const filteredCars = data?.content?.filter((car) => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (
        !car.name.toLowerCase().includes(search) &&
        !car.brand.toLowerCase().includes(search)
      )
        return false;
    }
    if (filters.brand && car.brand !== filters.brand) return false;
    if (filters.location && car.showroomLocation !== filters.location)
      return false;
    if (filters.minPrice !== null && car.price < filters.minPrice)
      return false;
    if (filters.maxPrice !== null && car.price > filters.maxPrice) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <p className="text-sm font-medium text-gold mb-2 tracking-widest uppercase">
              Full Collection
            </p>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white">
              Browse Luxury Cars
            </h1>
            <p className="text-slate-400 mt-3">
              {data?.totalElements || 0} cars available from the world&apos;s finest
              marques
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block lg:w-64 flex-shrink-0">
              <FiltersSidebar
                filters={filters}
                onUpdate={updateFilter}
                onReset={resetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 gap-4">
                {/* Mobile Filter Button */}
                <Sheet
                  open={mobileFiltersOpen}
                  onOpenChange={setMobileFiltersOpen}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="lg:hidden border-slate-800 text-slate-300"
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {hasActiveFilters && (
                        <span className="ml-2 w-2 h-2 rounded-full bg-gold" />
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="bg-slate-950 border-slate-800 text-white overflow-y-auto"
                  >
                    <SheetHeader>
                      <SheetTitle className="text-white">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersSidebar
                        filters={filters}
                        onUpdate={(key, value) => {
                          updateFilter(key, value);
                        }}
                        onReset={resetFilters}
                        hasActiveFilters={hasActiveFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="flex-1" />

                {/* Sort */}
                <SortDropdown
                  value={filters.sortBy}
                  direction={filters.direction}
                  onChange={(sortBy, direction) => {
                    updateFilter("sortBy", sortBy);
                    updateFilter("direction", direction);
                  }}
                />
              </div>

              {/* Loading */}
              {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-[420px] bg-slate-900 rounded-xl"
                    />
                  ))}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="text-center py-20">
                  <p className="text-red-400">
                    Failed to load cars. Is backend running?
                  </p>
                </div>
              )}

              {/* Empty */}
              {filteredCars && filteredCars.length === 0 && (
                <EmptyState onReset={resetFilters} />
              )}

              {/* Grid */}
              {filteredCars && filteredCars.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredCars.map((car, i) => (
                      <motion.div
                        key={car.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      >
                        <CarCard car={car} />
                      </motion.div>
                    ))}
                  </div>

                  <Pagination
                    currentPage={data?.page || 0}
                    totalPages={data?.totalPages || 1}
                    onPageChange={(page) => updateFilter("page", page)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
