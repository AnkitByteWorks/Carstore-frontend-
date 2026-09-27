"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Car } from "@/lib/types/car";
import { toast } from "sonner";

interface CompareState {
  items: Car[];
  addToCompare: (car: Car) => boolean;
  removeFromCompare: (id: number) => void;
  toggleCompare: (car: Car) => boolean;
  isInCompare: (id: number) => boolean;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCompare: (car) => {
        const { items } = get();
        if (items.some((c) => c.id === car.id)) {
          return true;
        }
        if (items.length >= 3) {
          toast.error("You can compare up to 3 supercars simultaneously.");
          return false;
        }
        set({ items: [...items, car] });
        toast.success(`${car.name} added to comparison`);
        return true;
      },

      removeFromCompare: (id) => {
        set({ items: get().items.filter((c) => c.id !== id) });
      },

      toggleCompare: (car) => {
        const inCompare = get().isInCompare(car.id);
        if (inCompare) {
          get().removeFromCompare(car.id);
          toast.info(`${car.name} removed from comparison`);
          return false;
        } else {
          return get().addToCompare(car);
        }
      },

      isInCompare: (id) => {
        return get().items.some((c) => c.id === id);
      },

      clearCompare: () => {
        set({ items: [] });
      },
    }),
    {
      name: "carstore-compare",
    }
  )
);
