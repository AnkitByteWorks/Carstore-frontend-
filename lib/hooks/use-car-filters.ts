"use client";

import { useState, useMemo } from "react";

export interface CarFilters {
  search: string;
  brand: string;
  minPrice: number | null;
  maxPrice: number | null;
  location: string;
  sortBy: string;
  direction: "asc" | "desc";
  page: number;
  size: number;
}

const DEFAULT_FILTERS: CarFilters = {
  search: "",
  brand: "",
  minPrice: null,
  maxPrice: null,
  location: "",
  sortBy: "id",
  direction: "asc",
  page: 0,
  size: 9,
};

export function useCarFilters() {
  const [filters, setFilters] = useState<CarFilters>(DEFAULT_FILTERS);

  const updateFilter = <K extends keyof CarFilters>(
    key: K,
    value: CarFilters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset page on filter change (except page itself)
      page: key === "page" ? (value as number) : 0,
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== "" ||
      filters.brand !== "" ||
      filters.minPrice !== null ||
      filters.maxPrice !== null ||
      filters.location !== "" ||
      filters.sortBy !== "id" ||
      filters.direction !== "asc"
    );
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
  };
}
