"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Gauge,
  ShieldCheck,
  Compass,
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format";

interface HeroMarque {
  id: number;
  name: string;
  brand: string;
  tagline: string;
  headline: string;
  hp: number;
  zeroToHundred: string;
  topSpeed: number;
  quarterMile: string;
  price: number;
  image: string;
  carId: number;
  accentColor: string;
}

const HERO_MARQUES: HeroMarque[] = [
  {
    id: 1,
    name: "Chiron Super Sport",
    brand: "Bugatti",
    tagline: "The 440 km/h Apex Predator",
    headline: "The Pinnacle of Pure Velocity",
    hp: 1578,
    zeroToHundred: "2.4s",
    topSpeed: 440,
    quarterMile: "9.1s",
    price: 400000000,
    image: "/cars/Bugatti Chiron Super Sport.jpg",
    carId: 5,
    accentColor: "from-blue-600/30 to-amber-500/20",
  },
  {
    id: 2,
    name: "Jesko Megacar",
    brand: "Koenigsegg",
    tagline: "300+ MPH Aerodynamic Titan",
    headline: "Defying the Boundaries of Physics",
    hp: 1600,
    zeroToHundred: "2.5s",
    topSpeed: 480,
    quarterMile: "8.9s",
    price: 320000000,
    image: "/cars/Koenigsegg Jesko.jpg",
    carId: 20,
    accentColor: "from-cyan-500/30 to-amber-400/20",
  },
  {
    id: 3,
    name: "SF90 Stradale",
    brand: "Ferrari",
    tagline: "Scuderia Hybrid Dominance",
    headline: "Sculpted for Pure Distinction",
    hp: 986,
    zeroToHundred: "2.5s",
    topSpeed: 340,
    quarterMile: "9.6s",
    price: 75000000,
    image: "/cars/Ferrari SF90 Stradale.jpg",
    carId: 2,
    accentColor: "from-red-600/30 to-amber-500/20",
  },
  {
    id: 4,
    name: "Aventador SVJ",
    brand: "Lamborghini",
    tagline: "Naturally Aspirated V12 Screamer",
    headline: "Unapologetic Raging Bull Ferocity",
    hp: 770,
    zeroToHundred: "2.8s",
    topSpeed: 352,
    quarterMile: "10.3s",
    price: 82500000,
    image: "/cars/Lamborghini Aventador SVJ.jpg",
    carId: 3,
    accentColor: "from-amber-600/30 to-orange-500/20",
  },
  {
    id: 5,
    name: "911 Turbo S",
    brand: "Porsche",
    tagline: "The Everyday Supercar Benchmark",
    headline: "Precision Engineered German Mastery",
    hp: 650,
    zeroToHundred: "2.7s",
    topSpeed: 330,
    quarterMile: "10.1s",
    price: 28500000,
    image: "/cars/Porsche 911 Turbo S.jpg",
    carId: 1,
    accentColor: "from-amber-500/30 to-yellow-600/20",
  },
  {
    id: 6,
    name: "720S Spider",
    brand: "McLaren",
    tagline: "Carbon Monocage Precision",
    headline: "Aerodynamics Redefined at Warp Speed",
    hp: 710,
    zeroToHundred: "2.9s",
    topSpeed: 341,
    quarterMile: "10.2s",
    price: 52000000,
    image: "/cars/McLaren 720S.jpg",
    carId: 4,
    accentColor: "from-orange-600/30 to-amber-400/20",
  },
  {
    id: 7,
    name: "Rolls-Royce Phantom",
    brand: "Rolls-Royce",
    tagline: "The Architecture of Pure Luxury",
    headline: "Serenity at Supreme Velocity",
    hp: 563,
    zeroToHundred: "5.3s",
    topSpeed: 250,
    quarterMile: "13.6s",
    price: 95000000,
    image: "/cars/Rolls-Royce Phantom.jpg",
    carId: 6,
    accentColor: "from-slate-500/30 to-amber-500/20",
  },
  {
    id: 8,
    name: "Continental GT",
    brand: "Bentley",
    tagline: "Twin-Turbo W12 Grand Touring",
    headline: "Effortless British Aristocratic Might",
    hp: 650,
    zeroToHundred: "3.6s",
    topSpeed: 335,
    quarterMile: "11.4s",
    price: 42000000,
    image: "/cars/Bentley Continental GT.jpg",
    carId: 7,
    accentColor: "from-emerald-600/30 to-amber-500/20",
  },
  {
    id: 9,
    name: "DBS Superleggera",
    brand: "Aston Martin",
    tagline: "Gentleman's 715 HP Brute Force",
    headline: "British Thoroughbred Royal Grandeur",
    hp: 715,
    zeroToHundred: "3.4s",
    topSpeed: 340,
    quarterMile: "11.0s",
    price: 48000000,
    image: "/cars/Aston Martin DBS Superleggera.jpg",
    carId: 8,
    accentColor: "from-red-700/30 to-amber-500/20",
  },
  {
    id: 10,
    name: "AMG GT Black Series",
    brand: "Mercedes-AMG",
    tagline: "Nürburgring Nordschleife Conqueror",
    headline: "Track-Bred Aerodynamic Masterpiece",
    hp: 720,
    zeroToHundred: "3.2s",
    topSpeed: 325,
    quarterMile: "10.6s",
    price: 38000000,
    image: "/cars/Mercedes-AMG GT Black Series.jpg",
    carId: 9,
    accentColor: "from-orange-500/30 to-amber-500/20",
  },
  {
    id: 11,
    name: "R8 V10 Performance",
    brand: "Audi",
    tagline: "Naturally Aspirated V10 Symphony",
    headline: "Ingolstadt's Mid-Engine Crown Jewel",
    hp: 611,
    zeroToHundred: "3.1s",
    topSpeed: 331,
    quarterMile: "10.7s",
    price: 26500000,
    image: "/cars/Audi R8 V10 Performance.jpg",
    carId: 10,
    accentColor: "from-rose-600/30 to-amber-500/20",
  },
  {
    id: 12,
    name: "M8 Competition",
    brand: "BMW",
    tagline: "617 HP Twin-Turbo Autobahn Crusher",
    headline: "Uncompromising Bavarian Power & Poise",
    hp: 617,
    zeroToHundred: "3.2s",
    topSpeed: 305,
    quarterMile: "10.9s",
    price: 24500000,
    image: "/cars/BMW M8 Competition.jpg",
    carId: 11,
    accentColor: "from-blue-500/30 to-cyan-400/20",
  },
  {
    id: 13,
    name: "Model S Plaid",
    brand: "Tesla",
    tagline: "1,020 HP Tri-Motor Electric Warp",
    headline: "Sub-2-Second Accelerative Wonder",
    hp: 1020,
    zeroToHundred: "2.1s",
    topSpeed: 322,
    quarterMile: "9.2s",
    price: 13500000,
    image: "/cars/Tesla Model S Plaid.jpg",
    carId: 12,
    accentColor: "from-slate-400/30 to-amber-400/20",
  },
  {
    id: 14,
    name: "GT-R Nismo",
    brand: "Nissan",
    tagline: "Godzilla Handcrafted Precision",
    headline: "ATTESA All-Wheel-Drive Dominance",
    hp: 600,
    zeroToHundred: "2.8s",
    topSpeed: 315,
    quarterMile: "10.8s",
    price: 22500000,
    image: "/cars/Nissan GT-R Nismo.jpg",
    carId: 13,
    accentColor: "from-red-600/30 to-slate-400/20",
  },
  {
    id: 15,
    name: "F-Type R",
    brand: "Jaguar",
    tagline: "Supercharged V8 British Roar",
    headline: "Sculptural Grace and Pure Ferocity",
    hp: 575,
    zeroToHundred: "3.7s",
    topSpeed: 300,
    quarterMile: "11.6s",
    price: 18500000,
    image: "/cars/Jaguar F-Type R.jpg",
    carId: 14,
    accentColor: "from-amber-600/30 to-red-500/20",
  },
  {
    id: 16,
    name: "MC20 Coupé",
    brand: "Maserati",
    tagline: "Nettuno Twin-Turbo F1 Pre-Chamber",
    headline: "Modena's Modern Supercar Renaissance",
    hp: 630,
    zeroToHundred: "2.9s",
    topSpeed: 325,
    quarterMile: "10.4s",
    price: 42000000,
    image: "/cars/Maserati MC20.jpg",
    carId: 15,
    accentColor: "from-blue-600/30 to-amber-400/20",
  },
  {
    id: 17,
    name: "LC 500",
    brand: "Lexus",
    tagline: "Naturally Aspirated 5.0L Acoustic Drama",
    headline: "Artistry in Motion & Japanese Craft",
    hp: 471,
    zeroToHundred: "4.4s",
    topSpeed: 270,
    quarterMile: "12.5s",
    price: 16500000,
    image: "/cars/Lexus LC 500.jpg",
    carId: 16,
    accentColor: "from-indigo-600/30 to-amber-500/20",
  },
  {
    id: 18,
    name: "Corvette Z06",
    brand: "Chevrolet",
    tagline: "Flat-Plane Crank 8,600 RPM Symphony",
    headline: "America's Mid-Engine Exotic Challenger",
    hp: 670,
    zeroToHundred: "2.6s",
    topSpeed: 314,
    quarterMile: "10.5s",
    price: 15500000,
    image: "/cars/Chevrolet Corvette Z06.jpg",
    carId: 17,
    accentColor: "from-red-600/30 to-orange-500/20",
  },
  {
    id: 19,
    name: "Shelby GT500",
    brand: "Ford",
    tagline: "760 HP Supercharged Predator V8",
    headline: "Venomous Track Weaponry Unleashed",
    hp: 760,
    zeroToHundred: "3.3s",
    topSpeed: 290,
    quarterMile: "10.7s",
    price: 12500000,
    image: "/cars/Ford Mustang Shelby GT500.jpg",
    carId: 18,
    accentColor: "from-sky-600/30 to-amber-400/20",
  },
  {
    id: 20,
    name: "Taycan Turbo S",
    brand: "Porsche",
    tagline: "Zero-Emissions Electric Benchmark",
    headline: "Instant Launch Torque & Dynamics",
    hp: 750,
    zeroToHundred: "2.8s",
    topSpeed: 260,
    quarterMile: "10.3s",
    price: 24500000,
    image: "/cars/Porsche Taycan Turbo S.jpg",
    carId: 19,
    accentColor: "from-teal-600/30 to-amber-400/20",
  },
];

// Continuous auto-rotation every 3.0 seconds (randomized)
const ROTATION_INTERVAL_MS = 3000;

export function Hero() {
  // Deterministic initial index for SSR to prevent hydration mismatch
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = HERO_MARQUES[currentIndex];

  // Randomize initial car safely upon client-side mount
  useEffect(() => {
    setCurrentIndex(Math.floor(Math.random() * HERO_MARQUES.length));
  }, []);

  // Completely automatic, uninterrupted random rotation through all 20 cars every 3.0 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      let nextIndex: number;
      do {
        nextIndex = Math.floor(Math.random() * HERO_MARQUES.length);
      } while (nextIndex === currentIndex && HERO_MARQUES.length > 1);

      setCurrentIndex(nextIndex);
    }, ROTATION_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Smoothly auto-scroll the active car pill inside the horizontal ribbon ONLY (never scrolls the window)
  useEffect(() => {
    const container = scrollContainerRef.current;
    const activePill = pillRefs.current[currentIndex];
    if (container && activePill) {
      const containerWidth = container.clientWidth;
      const pillLeft = activePill.offsetLeft;
      const pillWidth = activePill.clientWidth;

      // Center the active pill within the container's horizontal view
      const targetScrollLeft = pillLeft - containerWidth / 2 + pillWidth / 2;

      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#050505] pt-8 pb-8 border-b border-white/[0.08]">
      {/* Dynamic Ambient Spotlight Glow */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[400px] sm:h-[500px] bg-gradient-to-r ${current.accentColor} rounded-full blur-[140px] opacity-70 pointer-events-none transition-all duration-700`}
      />

      {/* Subtle Studio Floor Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(to right, #d4af37 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          backgroundPosition: "center top",
        }}
      />

      {/* Top Editorial Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.25em] text-slate-300 font-semibold">
              2026 BESPOKE FLEET ALLOCATIONS ACTIVE
            </span>
          </div>

          {/* Automatic Showcase Ticker */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a0a0d]/90 border border-white/[0.08] text-slate-300">
              <Shuffle className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">
                RANDOM SHUFFLE
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-white font-bold font-mono">
                MARQUE #{String(current.id).padStart(2, "0")} / {HERO_MARQUES.length}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-6 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Concierge Escrow
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" /> Enclosed Carrier
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Cinematic Stage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 py-4 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            <motion.div
              key={`badge-${current.id}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-widest uppercase"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {current.brand} • {current.tagline}
              </span>
            </motion.div>

            <motion.div
              key={`title-${current.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 min-h-[140px] flex flex-col justify-center"
            >
              <h1 className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                {current.headline.split(" ").slice(0, 2).join(" ")}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
                  {current.headline.split(" ").slice(2).join(" ")}
                </span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto lg:mx-0 pt-1 font-light leading-relaxed">
                Direct vault allocation for {current.brand} {current.name}. Fully inspected, bespoke
                engraved key handover, and climate-controlled hydraulic delivery anywhere in India.
              </p>
            </motion.div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
              <Link href={`/cars/${current.carId}`}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 text-slate-950 hover:opacity-95 font-bold h-12 px-7 text-sm sm:text-base shadow-xl shadow-amber-500/15 group cursor-pointer"
                >
                  <span>Acquire {current.name}</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/race">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-200 hover:text-amber-400 hover:border-amber-500/40 font-semibold h-12 px-5 text-sm backdrop-blur-md cursor-pointer"
                >
                  <Gauge className="mr-2 w-4 h-4 text-cyan-400" />
                  1/4-Mile Drag Simulator
                </Button>
              </Link>
            </div>

            {/* Price & Auto-cycle Progress Line */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-5">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">
                  Official Allocation
                </span>
                <span className="font-mono text-lg sm:text-2xl font-bold text-white tracking-tight">
                  {formatPrice(current.price)}
                </span>
              </div>

              {/* Dynamic Auto-Cycle Progress Line */}
              <div className="hidden sm:block pl-5 border-l border-slate-800 w-36">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                  <span>SHOWCASE ROTATION</span>
                  <span className="text-amber-400">3s</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    key={`progress-${current.id}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.0, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual + Performance Chips */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            {/* Main Showcase Visual with Smooth Image Crossfade */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl shadow-black group">
              <AnimatePresence>
                <motion.img
                  key={`car-img-${current.id}`}
                  src={current.image}
                  alt={current.name}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none z-10" />

              {/* Top Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
                <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-white font-mono text-xs font-bold">
                  {current.brand}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/15 backdrop-blur-md border border-amber-500/40 text-amber-400 font-mono text-xs font-bold flex items-center gap-1.5">
                  <Shuffle className="w-3 h-3 text-amber-400" />
                  RANDOM ALLOCATION #{String(current.id).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* 4 Floating Performance Chips */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-3.5">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md text-center">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                  HORSEPOWER
                </span>
                <span className="font-mono text-sm sm:text-base font-extrabold text-white">
                  {current.hp} <span className="text-[10px] font-normal text-slate-400">BHP</span>
                </span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md text-center">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                  0–100 KM/H
                </span>
                <span className="font-mono text-sm sm:text-base font-extrabold text-amber-400">
                  {current.zeroToHundred}
                </span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md text-center">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                  1/4 MILE
                </span>
                <span className="font-mono text-sm sm:text-base font-extrabold text-cyan-400">
                  {current.quarterMile}
                </span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md text-center">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                  TOP SPEED
                </span>
                <span className="font-mono text-sm sm:text-base font-extrabold text-emerald-400">
                  {current.topSpeed}{" "}
                  <span className="text-[10px] font-normal text-slate-400">KM/H</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 20-Car Horizontal Marquee Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-2">
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
          >
            {HERO_MARQUES.map((marque, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={marque.id}
                  ref={(el) => {
                    pillRefs.current[idx] = el;
                  }}
                  onClick={() => {
                    setCurrentIndex(idx);
                  }}
                  className={`px-3 py-2 rounded-xl border text-left transition-all shrink-0 flex items-center gap-2.5 cursor-pointer ${
                    isSelected
                      ? "bg-[#0d0d10] border-amber-500/70 shadow-lg shadow-amber-500/15 scale-102"
                      : "bg-[#060608]/80 border-white/[0.06] hover:border-white/[0.15] hover:bg-[#0a0a0d] opacity-60 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isSelected ? "bg-amber-400 shadow-[0_0_8px_#F59E0B]" : "bg-slate-700"
                    }`}
                  />
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 block leading-tight">
                      {String(idx + 1).padStart(2, "0")} • {marque.brand}
                    </span>
                    <span
                      className={`text-xs font-semibold truncate block mt-0.5 max-w-[130px] ${
                        isSelected ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {marque.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}