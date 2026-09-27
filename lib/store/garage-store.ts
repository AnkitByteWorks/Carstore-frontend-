"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Car } from "@/lib/types/car";

interface GarageState {
  items: Car[];
  addToGarage: (car: Car) => void;
  removeFromGarage: (id: number) => void;
  toggleGarage: (car: Car) => boolean;
  isInGarage: (id: number) => boolean;
  clearGarage: () => void;
}

export const useGarageStore = create<GarageState>()(
  persist(
    (set, get) => ({
      items: [],

      addToGarage: (car) => {
        const exists = get().items.some((item) => item.id === car.id);
        if (!exists) {
          set({ items: [...get().items, car] });
        }
      },

      removeFromGarage: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      toggleGarage: (car) => {
        const inGarage = get().isInGarage(car.id);
        if (inGarage) {
          get().removeFromGarage(car.id);
          return false;
        } else {
          get().addToGarage(car);
          return true;
        }
      },

      isInGarage: (id) => {
        return get().items.some((item) => item.id === id);
      },

      clearGarage: () => {
        set({ items: [] });
      },
    }),
    {
      name: "carstore-garage",
    }
  )
);
