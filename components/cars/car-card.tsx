"use client";

import Link from "next/link";
import { MapPin, Clock, Zap, Gauge, ArrowUpRight, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Car as CarType } from "@/lib/types/car";
import { formatPrice } from "@/lib/utils/format";
import { getCarFallbackImage } from "@/lib/utils/car-images";
import { getCarTelemetry } from "@/lib/data/car-specs";
import { GarageButton } from "./garage-button";
import { CompareButton } from "./compare-button";

interface CarCardProps {
  car: CarType;
}

export function CarCard({ car }: CarCardProps) {
  const imageUrl = getCarFallbackImage(car.id, car.brand, car.name);
  const telemetry = getCarTelemetry(car.id) || getCarTelemetry(car.name);

  return (
    <Link href={`/cars/${car.id}`} className="block h-full group">
      <div className="relative h-full flex flex-col rounded-2xl bg-gradient-to-b from-[#0e0e12]/95 via-[#09090b]/90 to-[#050505]/98 border border-white/[0.08] hover:border-amber-500/50 transition-all duration-500 hover:shadow-[0_16px_40px_rgba(212,175,55,0.14)] hover:-translate-y-1.5 overflow-hidden backdrop-blur-xl">
        {/* Ambient card top border glow on hover */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-400/80 transition-all duration-700 z-20" />

        {/* Hero Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#050505]">
          <img
            src={imageUrl}
            alt={car.name}
            className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

          {/* Top Floating Badges */}
          <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-semibold uppercase tracking-wider text-amber-300 border border-amber-500/30 shadow-sm">
              {car.brand}
            </span>
          </div>

          {/* Interactive Actions (Compare & Garage) */}
          <div
            className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <CompareButton car={car} />
            <GarageButton car={car} />
          </div>

          {/* In-Image Floating Telemetry Chips */}
          {telemetry && (
            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#050505]/90 backdrop-blur-md border border-white/[0.08] text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <Zap className="w-3 h-3 text-amber-400" />
                {telemetry.hp} HP
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3 h-3 text-slate-400" />
                {telemetry.zeroToHundred}s 0-100
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Gauge className="w-3 h-3 text-slate-400" />
                {telemetry.topSpeed} km/h
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors duration-300 line-clamp-1">
              {car.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 mt-2 leading-relaxed font-light">
              {car.description}
            </p>
          </div>

          {/* Showroom & Logistics Meta */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 truncate">
              <MapPin className="h-3.5 w-3.5 text-amber-400/80 shrink-0" />
              <span className="truncate">{car.showroomLocation}</span>
            </span>
            <span className="flex items-center gap-1.5 shrink-0 text-slate-400">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              {car.deliveryDays}d delivery
            </span>
          </div>

          {/* Pricing & Acquisition Action */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 block">
                Acquisition
              </span>
              <p className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
                {formatPrice(car.price)}
              </p>
            </div>

            <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}