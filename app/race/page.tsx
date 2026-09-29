"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gauge,
  Zap,
  Flag,
  RotateCcw,
  Trophy,
  Sparkles,
  ArrowRight,
  Flame,
  Volume2,
  Sliders,
  Shield,
  Clock,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils/format";
import {
  playLaunchSpool,
  playMechanicalClick,
  playChimeSound,
} from "@/lib/utils/audio-feedback";
import Link from "next/link";
import { toast } from "sonner";

interface RaceCar {
  id: number;
  name: string;
  brand: string;
  hp: number;
  torque: number; // Nm
  weightKg: number;
  zeroToHundred: number; // seconds
  quarterMileTime: number; // seconds
  quarterMileSpeed: number; // km/h
  topSpeed: number; // km/h
  drivetrain: string;
  price: number;
  image: string;
  color: string;
}

const RACE_CARS: RaceCar[] = [
  {
    id: 1,
    name: "Ferrari SF90 Stradale",
    brand: "Ferrari",
    hp: 986,
    torque: 800,
    weightKg: 1570,
    zeroToHundred: 2.5,
    quarterMileTime: 9.6,
    quarterMileSpeed: 238,
    topSpeed: 340,
    drivetrain: "AWD Tri-Motor Hybrid",
    price: 75000000,
    image: "/cars/Ferrari SF90 Stradale.jpg",
    color: "#E10600",
  },
  {
    id: 4,
    name: "Lamborghini Revuelto",
    brand: "Lamborghini",
    hp: 1001,
    torque: 1062,
    weightKg: 1772,
    zeroToHundred: 2.5,
    quarterMileTime: 9.7,
    quarterMileSpeed: 236,
    topSpeed: 350,
    drivetrain: "AWD V12 HPEV",
    price: 88900000,
    image: "/cars/Lamborghini Aventador SVJ.jpg",
    color: "#FFA500",
  },
  {
    id: 8,
    name: "Porsche 911 Turbo S",
    brand: "Porsche",
    hp: 640,
    torque: 800,
    weightKg: 1640,
    zeroToHundred: 2.7,
    quarterMileTime: 10.1,
    quarterMileSpeed: 224,
    topSpeed: 330,
    drivetrain: "AWD Twin-Turbo Flat-6",
    price: 33500000,
    image: "/cars/Porsche 911 Turbo S.jpg",
    color: "#D4AF37",
  },
  {
    id: 14,
    name: "Tesla Model S Plaid",
    brand: "Tesla",
    hp: 1020,
    torque: 1420,
    weightKg: 2162,
    zeroToHundred: 2.1,
    quarterMileTime: 9.23,
    quarterMileSpeed: 250,
    topSpeed: 322,
    drivetrain: "AWD Tri-Motor Electric",
    price: 15000000,
    image: "/cars/Tesla Model S Plaid.jpg",
    color: "#94A3B8",
  },
  {
    id: 13,
    name: "McLaren 720S",
    brand: "McLaren",
    hp: 710,
    torque: 770,
    weightKg: 1419,
    zeroToHundred: 2.9,
    quarterMileTime: 10.2,
    quarterMileSpeed: 228,
    topSpeed: 341,
    drivetrain: "RWD Twin-Turbo V8",
    price: 46500000,
    image: "/cars/McLaren 720S.jpg",
    color: "#FB923C",
  },
  {
    id: 11,
    name: "Koenigsegg Jesko",
    brand: "Koenigsegg",
    hp: 1600,
    torque: 1500,
    weightKg: 1420,
    zeroToHundred: 2.5,
    quarterMileTime: 8.9,
    quarterMileSpeed: 275,
    topSpeed: 480,
    drivetrain: "RWD Twin-Turbo V8",
    price: 250000000,
    image: "/cars/Koenigsegg Jesko.jpg",
    color: "#E2E8F0",
  },
];

export default function RaceSimulatorPage() {
  const [carA, setCarA] = useState<RaceCar>(RACE_CARS[0]); // SF90
  const [carB, setCarB] = useState<RaceCar>(RACE_CARS[1]); // Revuelto

  // Race phases: 'idle' | 'arming' | 'countdown' | 'racing' | 'finished'
  const [racePhase, setRacePhase] = useState<
    "idle" | "arming" | "countdown" | "racing" | "finished"
  >("idle");
  const [countdownStep, setCountdownStep] = useState<number>(0); // 0: off, 1: yellow1, 2: yellow2, 3: green
  const [progressA, setProgressA] = useState(0);
  const [progressB, setProgressB] = useState(0);
  const [speedA, setSpeedA] = useState(0);
  const [speedB, setSpeedB] = useState(0);
  const [rpmA, setRpmA] = useState(800);
  const [rpmB, setRpmB] = useState(800);
  const [winner, setWinner] = useState<RaceCar | null>(null);

  const stopAudioRef = useRef<(() => void) | null>(null);

  // Arm Launch Control
  const startArming = () => {
    playMechanicalClick();
    setRacePhase("arming");
    setRpmA(4200);
    setRpmB(4200);
    stopAudioRef.current = playLaunchSpool(3.0);
    toast.info("Launch Control Armed!", {
      description: "Turbos spooling. Boost primed at 1.8 bar.",
    });

    // Start Christmas tree countdown after 1.5s
    setTimeout(() => {
      setRacePhase("countdown");
      setCountdownStep(1); // yellow 1

      setTimeout(() => {
        setCountdownStep(2); // yellow 2

        setTimeout(() => {
          setCountdownStep(3); // GREEN!
          runRace();
        }, 800);
      }, 800);
    }, 1500);
  };

  const runRace = () => {
    if (stopAudioRef.current) {
      stopAudioRef.current();
    }
    setRacePhase("racing");

    const totalDurationMs = Math.max(carA.quarterMileTime, carB.quarterMileTime) * 800; // time scaled for exciting visual
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(1, elapsed / totalDurationMs);

      // Physics acceleration curves
      const aProgress = Math.min(
        100,
        Math.pow(elapsed / (carA.quarterMileTime * 800), 1.6) * 100
      );
      const bProgress = Math.min(
        100,
        Math.pow(elapsed / (carB.quarterMileTime * 800), 1.6) * 100
      );

      setProgressA(aProgress);
      setProgressB(bProgress);

      setSpeedA(Math.round((aProgress / 100) * carA.quarterMileSpeed));
      setSpeedB(Math.round((bProgress / 100) * carB.quarterMileSpeed));

      // Shifting gear RPM simulation
      const gearCycleA = (elapsed % 800) / 800;
      setRpmA(Math.round(4000 + gearCycleA * 4500));
      const gearCycleB = (elapsed % 800) / 800;
      setRpmB(Math.round(4000 + gearCycleB * 4500));

      if (aProgress >= 100 && bProgress >= 100) {
        clearInterval(interval);
        setRacePhase("finished");
        const victorious =
          carA.quarterMileTime <= carB.quarterMileTime ? carA : carB;
        setWinner(victorious);
        playChimeSound();
        toast.success(`VICTORY: ${victorious.name}!`, {
          description: `1/4-Mile completed in ${victorious.quarterMileTime}s @ ${victorious.quarterMileSpeed} km/h`,
        });
      }
    }, 30);
  };

  const resetRace = () => {
    playMechanicalClick();
    if (stopAudioRef.current) stopAudioRef.current();
    setRacePhase("idle");
    setCountdownStep(0);
    setProgressA(0);
    setProgressB(0);
    setSpeedA(0);
    setSpeedB(0);
    setRpmA(800);
    setRpmB(800);
    setWinner(null);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Header */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
            <Gauge className="h-3.5 w-3.5 animate-pulse" />
            1/4-Mile Drag Strip • Dynamic Telemetry
          </div>

          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Head-to-Head <span className="text-gradient-gold">Race Simulator</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base">
            Arm launch control, spool up high-boost twin turbos and hybrid electric motors, and analyze real-time quarter-mile telemetry.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Car Selection Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Lane 1: Gold Fighter */}
          <Card className="bg-slate-900/80 border-gold/30 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-gold/15 text-gold text-xs font-mono font-bold">
                  LANE 1 • GOLD FIGHTER
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  0-100: {carA.zeroToHundred}s
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-medium">Select Vehicle</label>
                <Select
                  value={String(carA.id)}
                  disabled={racePhase !== "idle"}
                  onValueChange={(val) => {
                    const found = RACE_CARS.find((c) => c.id === Number(val));
                    if (found) setCarA(found);
                  }}
                >
                  <SelectTrigger className="bg-slate-950 border-slate-800 text-white font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    {RACE_CARS.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name} ({c.hp} HP)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Car Visual Preview */}
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                <img
                  src={carA.image}
                  alt={carA.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div>
                    <p className="font-playfair font-bold text-white text-base">
                      {carA.name}
                    </p>
                    <p className="text-xs text-slate-300">{carA.drivetrain}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-gold">
                    {formatPrice(carA.price)}
                  </span>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">POWER</span>
                  <span className="font-bold text-white">{carA.hp} HP</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">TORQUE</span>
                  <span className="font-bold text-white">{carA.torque} Nm</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">WEIGHT</span>
                  <span className="font-bold text-white">{carA.weightKg} kg</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">1/4 MILE</span>
                  <span className="font-bold text-gold">{carA.quarterMileTime}s</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Lane 2: Silver Challenger */}
          <Card className="bg-slate-900/80 border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono font-bold">
                  LANE 2 • CHALLENGER
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  0-100: {carB.zeroToHundred}s
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-medium">Select Vehicle</label>
                <Select
                  value={String(carB.id)}
                  disabled={racePhase !== "idle"}
                  onValueChange={(val) => {
                    const found = RACE_CARS.find((c) => c.id === Number(val));
                    if (found) setCarB(found);
                  }}
                >
                  <SelectTrigger className="bg-slate-950 border-slate-800 text-white font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    {RACE_CARS.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name} ({c.hp} HP)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Car Visual Preview */}
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                <img
                  src={carB.image}
                  alt={carB.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div>
                    <p className="font-playfair font-bold text-white text-base">
                      {carB.name}
                    </p>
                    <p className="text-xs text-slate-300">{carB.drivetrain}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-slate-200">
                    {formatPrice(carB.price)}
                  </span>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">POWER</span>
                  <span className="font-bold text-white">{carB.hp} HP</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">TORQUE</span>
                  <span className="font-bold text-white">{carB.torque} Nm</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">WEIGHT</span>
                  <span className="font-bold text-white">{carB.weightKg} kg</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">1/4 MILE</span>
                  <span className="font-bold text-slate-300">{carB.quarterMileTime}s</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* The 1/4-Mile Drag Strip Arena */}
        <section className="space-y-6">
          <Card className="bg-slate-950 border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-2xl">
            {/* Top Control Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                  <Flag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-lg text-white">
                    402m Drag Strip Telemetry
                  </h3>
                  <p className="text-xs text-slate-400">
                    Surface: VHT TrackBite Heated Asphalt • Altitude: Sea Level
                  </p>
                </div>
              </div>

              {/* Christmas Tree Starting Lights */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">TREE:</span>
                <span
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    countdownStep >= 1
                      ? "bg-amber-400 border-amber-300 shadow-[0_0_12px_#fbbf24]"
                      : "bg-slate-800 border-slate-700"
                  }`}
                />
                <span
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    countdownStep >= 2
                      ? "bg-amber-400 border-amber-300 shadow-[0_0_12px_#fbbf24]"
                      : "bg-slate-800 border-slate-700"
                  }`}
                />
                <span
                  className={`w-4 h-4 rounded-full border transition-all ${
                    countdownStep === 3
                      ? "bg-emerald-400 border-emerald-300 shadow-[0_0_18px_#34d399] animate-pulse"
                      : "bg-slate-800 border-slate-700"
                  }`}
                />
              </div>
            </div>

            {/* Live Dual Lanes Track */}
            <div className="py-6 space-y-6">
              {/* Lane 1 Track */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gold font-bold">{carA.name}</span>
                  <span className="text-slate-400">
                    {speedA} km/h • {rpmA.toLocaleString()} RPM
                  </span>
                </div>
                <div className="relative h-14 bg-gradient-to-r from-slate-900 via-slate-900 to-zinc-900 rounded-xl border border-slate-800 overflow-hidden flex items-center px-4">
                  {/* Distance markers */}
                  <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-20">
                    <div className="border-r border-slate-400 h-full text-[9px] pt-1">0m</div>
                    <div className="border-r border-slate-400 h-full text-[9px] pt-1">100m</div>
                    <div className="border-r border-slate-400 h-full text-[9px] pt-1">200m</div>
                    <div className="border-r border-slate-400 h-full text-[9px] pt-1">300m</div>
                    <div className="border-r border-gold h-full text-[9px] pt-1 text-gold font-bold">FINISH</div>
                  </div>

                  {/* Animated Car Icon / Marker */}
                  <motion.div
                    className="absolute z-10 flex items-center gap-1"
                    style={{ left: `calc(${progressA}% * 0.88)` }}
                  >
                    <div className="px-2.5 py-1 rounded-md bg-gold text-slate-950 text-xs font-bold font-mono shadow-lg flex items-center gap-1">
                      <span>🏎️</span>
                      <span className="text-[10px] hidden sm:inline">{carA.brand}</span>
                    </div>
                    {racePhase === "racing" && (
                      <span className="text-xs animate-ping">🔥</span>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Lane 2 Track */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-200 font-bold">{carB.name}</span>
                  <span className="text-slate-400">
                    {speedB} km/h • {rpmB.toLocaleString()} RPM
                  </span>
                </div>
                <div className="relative h-14 bg-gradient-to-r from-slate-900 via-slate-900 to-zinc-900 rounded-xl border border-slate-800 overflow-hidden flex items-center px-4">
                  {/* Distance markers */}
                  <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-20">
                    <div className="border-r border-slate-400 h-full text-[9px] pt-1">0m</div>
                    <div className="border-r border-slate-400 h-full text-[9px] pt-1">100m</div>
                    <div className="border-r border-slate-400 h-full text-[9px] pt-1">200m</div>
                    <div className="border-r border-slate-400 h-full text-[9px] pt-1">300m</div>
                    <div className="border-r border-gold h-full text-[9px] pt-1 text-gold font-bold">FINISH</div>
                  </div>

                  {/* Animated Car Icon / Marker */}
                  <motion.div
                    className="absolute z-10 flex items-center gap-1"
                    style={{ left: `calc(${progressB}% * 0.88)` }}
                  >
                    <div className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-950 text-xs font-bold font-mono shadow-lg flex items-center gap-1">
                      <span>🏎️</span>
                      <span className="text-[10px] hidden sm:inline">{carB.brand}</span>
                    </div>
                    {racePhase === "racing" && (
                      <span className="text-xs animate-ping">🔥</span>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Launch Action Bar */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="h-4 w-4 text-gold" />
                <span>
                  {racePhase === "idle" && "Ready on starting grid. Click Arm Launch Control."}
                  {racePhase === "arming" && "Spooling turbos & holding brake..."}
                  {racePhase === "countdown" && "Watch the tree lights..."}
                  {racePhase === "racing" && "FULL THROTTLE! Dual cars at wide-open throttle!"}
                  {racePhase === "finished" && `Race Finished! Winner: ${winner?.name}`}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {racePhase === "finished" ? (
                  <Button
                    onClick={resetRace}
                    className="w-full sm:w-auto border-slate-800 bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset Strip
                  </Button>
                ) : (
                  <Button
                    onClick={startArming}
                    disabled={racePhase !== "idle"}
                    size="lg"
                    className="w-full sm:w-auto gradient-gold text-slate-950 hover:opacity-90 font-bold px-8 h-12 shadow-lg shadow-gold/20"
                  >
                    <Zap className="mr-2 h-5 w-5 fill-current" />
                    {racePhase === "idle" ? "Arm Launch Control" : "Launching..."}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* Finish Line Podium & Telemetry Comparison */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-2xl bg-gradient-to-r from-gold/15 via-slate-900 to-gold/15 border-2 border-gold/40 text-center space-y-6 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center text-gold mx-auto shadow-xl">
              <Trophy className="h-8 w-8 animate-bounce" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-gold font-semibold">
                Quarter-Mile Champion
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mt-1">
                {winner.name} Wins!
              </h2>
              <p className="text-sm text-slate-300 mt-1 font-mono">
                Trap Time: {winner.quarterMileTime}s @ {winner.quarterMileSpeed} km/h • 0-100 km/h: {winner.zeroToHundred}s
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href={`/cars/${winner.id}`}>
                <Button className="gradient-gold text-slate-950 font-bold px-6 h-11">
                  Inspect & Configure Champion
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={resetRace}
                className="border-slate-800 text-slate-300 hover:text-white h-11"
              >
                Rerace on Track
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </main>
  );
}
