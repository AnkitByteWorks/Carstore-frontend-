"use client";

import { useGarageStore } from "@/lib/store/garage-store";
import type { Car } from "@/lib/types/car";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GarageButtonProps {
  car: Car;
  className?: string;
  showText?: boolean;
}

export function GarageButton({ car, className, showText = false }: GarageButtonProps) {
  const { toggleGarage, isInGarage } = useGarageStore();
  const saved = isInGarage(car.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleGarage(car);
    if (added) {
      toast.success(`${car.name} added to My Garage! ❤️`);
    } else {
      toast.info(`${car.name} removed from My Garage`);
    }
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={saved ? "Remove from Garage" : "Add to Garage"}
      className={cn(
        "group relative flex items-center justify-center rounded-full transition-all duration-300",
        saved
          ? "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30"
          : "bg-slate-950/70 backdrop-blur-md text-slate-400 border border-slate-700/60 hover:text-white hover:border-gold/50 hover:bg-slate-900/90",
        showText ? "px-4 py-2.5 gap-2 text-sm font-medium" : "h-9 w-9",
        className
      )}
    >
      <Heart
        className={cn(
          "transition-transform duration-300 group-hover:scale-110",
          showText ? "h-4 w-4" : "h-4 w-4",
          saved ? "fill-red-500 text-red-500" : ""
        )}
      />
      {showText && <span>{saved ? "Saved in Garage" : "Save to Garage"}</span>}
    </button>
  );
}
