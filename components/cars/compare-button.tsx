"use client";

import { useCompareStore } from "@/lib/store/compare-store";
import type { Car } from "@/lib/types/car";
import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompareButtonProps {
  car: Car;
  className?: string;
  showText?: boolean;
}

export function CompareButton({ car, className, showText = false }: CompareButtonProps) {
  const { toggleCompare, isInCompare } = useCompareStore();
  const compared = isInCompare(car.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(car);
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={compared ? "Remove from comparison" : "Compare this car"}
      className={cn(
        "group relative flex items-center justify-center rounded-full transition-all duration-300",
        compared
          ? "bg-amber-500/20 text-gold border border-amber-500/50 hover:bg-amber-500/30"
          : "bg-slate-950/70 backdrop-blur-md text-slate-400 border border-slate-700/60 hover:text-white hover:border-gold/50 hover:bg-slate-900/90",
        showText ? "px-3.5 py-2.5 gap-2 text-xs font-medium" : "h-9 w-9",
        className
      )}
    >
      <ArrowLeftRight
        className={cn(
          "transition-transform duration-300 group-hover:rotate-180",
          showText ? "h-3.5 w-3.5" : "h-3.5 w-3.5",
          compared ? "text-gold" : ""
        )}
      />
      {showText && <span>{compared ? "Added to Compare" : "Compare"}</span>}
    </button>
  );
}
