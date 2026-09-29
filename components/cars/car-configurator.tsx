"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Car } from "@/lib/types/car";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils/format";
import {
  Wrench,
  Check,
  Disc,
  Armchair,
  Wind,
  Music,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface CarConfiguratorProps {
  car: Car;
}

interface ConfigCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  options: {
    id: string;
    label: string;
    description: string;
    price: number;
  }[];
}

const CONFIG_CATEGORIES: ConfigCategory[] = [
  {
    id: "wheels",
    name: "Wheels & Rims",
    icon: Disc,
    options: [
      {
        id: "wheels_std",
        label: "20\" Forged Diamond-Cut Alloys",
        description: "Lightweight multi-spoke factory aerodynamic design",
        price: 0,
      },
      {
        id: "wheels_carbon",
        label: "21\" Bespoke Monoblock Carbon Wheels",
        description: "Ultra-lightweight aerospace grade carbon composite (-14kg unsprung mass)",
        price: 1250000,
      },
    ],
  },
  {
    id: "brakes",
    name: "Braking System",
    icon: Disc,
    options: [
      {
        id: "brakes_std",
        label: "Brembo 6-Piston Performance Steel",
        description: "Dual-cast high friction compound rotors in Gloss Black",
        price: 0,
      },
      {
        id: "brakes_ceramic",
        label: "Carbon Ceramic Matrix with Giallo Gold Calipers",
        description: "Extreme track endurance with zero brake fade up to 1,000°C",
        price: 850000,
      },
    ],
  },
  {
    id: "interior",
    name: "Interior Upholstery",
    icon: Armchair,
    options: [
      {
        id: "int_nero",
        label: "Nero Alcantara with Gold Contrast Stitching",
        description: "Track-focused matte micro-suede with luxury diamond quilting",
        price: 0,
      },
      {
        id: "int_cuoio",
        label: "Cuoio Cognac Full-Grain Semi-Aniline Leather",
        description: "Hand-stitched Tuscan natural hide with ventilated luxury seats",
        price: 620000,
      },
    ],
  },
  {
    id: "aero",
    name: "Aero & Carbon Pack",
    icon: Wind,
    options: [
      {
        id: "aero_std",
        label: "Standard Body-Colored Aerodynamics",
        description: "Factory balanced drag and downforce package",
        price: 0,
      },
      {
        id: "aero_carbon",
        label: "Exposed Gloss Carbon Aero Package",
        description: "Carbon front splitter, active rear diffuser, and carbon mirror caps",
        price: 1400000,
      },
    ],
  },
  {
    id: "audio",
    name: "Acoustic Audio",
    icon: Music,
    options: [
      {
        id: "audio_std",
        label: "10-Speaker Studio Sound System",
        description: "450-watt balanced digital surround sound",
        price: 0,
      },
      {
        id: "audio_burmester",
        label: "Burmester® 3D High-End 16-Speaker Surround",
        description: "1,450-watt active noise cancellation with 3D roof exciter speakers",
        price: 480000,
      },
    ],
  },
];

export function CarConfigurator({ car }: CarConfiguratorProps) {
  const router = useRouter();

  // Selected option per category
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({
    wheels: "wheels_std",
    brakes: "brakes_std",
    interior: "int_nero",
    aero: "aero_std",
    audio: "audio_std",
  });

  const handleSelectOption = (categoryId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [categoryId]: optionId,
    }));
  };

  // Compute total options delta
  let totalOptionsPrice = 0;
  const chosenOptionsList: string[] = [];

  CONFIG_CATEGORIES.forEach((cat) => {
    const chosenOptionId = selectedOptions[cat.id];
    const opt = cat.options.find((o) => o.id === chosenOptionId);
    if (opt) {
      totalOptionsPrice += opt.price;
      if (opt.price > 0) {
        chosenOptionsList.push(`${cat.name}: ${opt.label}`);
      }
    }
  });

  const finalTotalPrice = car.price + totalOptionsPrice;

  const handleProceedToCheckout = () => {
    const optionsQuery = encodeURIComponent(chosenOptionsList.join(" | "));
    router.push(`/checkout/${car.id}?customPrice=${finalTotalPrice}&options=${optionsQuery}`);
  };

  return (
    <Card className="bg-slate-900 border-slate-800 p-6 sm:p-8 space-y-8 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-widest">
            <Wrench className="h-3.5 w-3.5" />
            <span>Atelier Bespoke Configurator</span>
          </div>
          <h3 className="font-playfair text-2xl font-bold text-white mt-1">
            Customize Specification
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Select high-performance packages, bespoke leather, and acoustic trims
          </p>
        </div>

        <Badge variant="outline" className="border-gold/40 text-gold text-xs self-start sm:self-center px-3 py-1">
          {chosenOptionsList.length} Custom Options Selected
        </Badge>
      </div>

      {/* Options Categories Accordion / Grid */}
      <div className="space-y-6">
        {CONFIG_CATEGORIES.map((cat) => {
          const CatIcon = cat.icon;
          return (
            <div key={cat.id} className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <CatIcon className="h-4 w-4 text-gold" />
                <span>{cat.name}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cat.options.map((opt) => {
                  const isSelected = selectedOptions[cat.id] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(cat.id, opt.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "bg-gold/10 border-gold shadow-md shadow-gold/10 ring-1 ring-gold/40"
                          : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-white leading-snug">
                            {opt.label}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {opt.description}
                          </p>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected
                              ? "bg-gold text-slate-950 font-bold"
                              : "border border-slate-700"
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </div>
                      </div>

                      <div className="mt-4 pt-2 border-t border-slate-800/60 flex justify-between items-center text-xs">
                        <span className="text-slate-500">Option Price</span>
                        <span
                          className={`font-semibold ${
                            opt.price === 0 ? "text-emerald-400" : "text-gold font-mono"
                          }`}
                        >
                          {opt.price === 0 ? "Included as Standard" : `+ ${formatPrice(opt.price)}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Separator className="bg-slate-800" />

      {/* Pricing Summary & Checkout Action */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Base Model ({car.brand} {car.name})</span>
            <span className="text-white font-medium">{formatPrice(car.price)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Custom Factory Options</span>
            <span className="text-gold font-medium">
              {totalOptionsPrice > 0 ? `+ ${formatPrice(totalOptionsPrice)}` : "None"}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>VIP Transit & Commissioning</span>
            <span className="text-emerald-400 font-medium">Complimentary</span>
          </div>

          <Separator className="bg-slate-800 my-2" />

          <div className="flex justify-between items-center pt-1">
            <div>
              <p className="text-xs text-slate-400">Total Configured Price</p>
              <p className="text-2xl font-bold text-gradient-gold font-playfair">
                {formatPrice(finalTotalPrice)}
              </p>
            </div>
            <Button
              onClick={handleProceedToCheckout}
              size="lg"
              className="gradient-gold text-slate-950 font-bold px-6 shadow-xl shadow-gold/10 hover:opacity-90"
            >
              Order This Build
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
