"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key,
  Unlock,
  Lock,
  Flame,
  Radio,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Volume2,
  Check,
  Car as CarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  playKeyUnlockChirp,
  playKeyLockThud,
  playEngineIgnitionRoar,
  playBoxLidOpen,
  playChimeSound,
} from "@/lib/utils/audio-feedback";
import { toast } from "sonner";

interface BespokeKeyPresentationBoxProps {
  carName: string;
  carBrand?: string;
  clientName?: string;
  monogramText?: string;
  orderId?: string | number;
  carImage?: string;
}

type VelvetColor = "obsidian" | "cognac" | "crimson" | "emerald";
type MetalFinish = "titanium" | "gold" | "blackchrome" | "rosegold";

export function BespokeKeyPresentationBox({
  carName,
  carBrand = "Carstore Atelier",
  clientName = "VIP Patron",
  monogramText = "CS",
  orderId = "VIP-01",
  carImage = "/cars/Porsche 911 Turbo S.jpg",
}: BespokeKeyPresentationBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [velvet, setVelvet] = useState<VelvetColor>("obsidian");
  const [finish, setFinish] = useState<MetalFinish>("titanium");
  const [customMonogram, setCustomMonogram] = useState(monogramText || "CS");

  // Live Vehicle States driven by key fob
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const [lightsActive, setLightsActive] = useState<"off" | "flash" | "pulse">("off");

  // Handle Box Opening
  const toggleBox = () => {
    if (!isOpen) {
      playBoxLidOpen();
      toast.success("Bespoke Handover Presentation Box Unsealed", {
        description: "Handcrafted aerospace aluminum key fob revealed.",
      });
    }
    setIsOpen(!isOpen);
  };

  // Button actions
  const handleUnlock = () => {
    playKeyUnlockChirp();
    setIsUnlocked(true);
    setLightsActive("flash");
    setTimeout(() => setLightsActive("off"), 1200);
    toast.success("Vehicle Unlocked", {
      description: "Welcome protocol active • Mirrors unfolded • Interior ambient mood illuminated.",
    });
  };

  const handleLock = () => {
    playKeyLockThud();
    setIsUnlocked(false);
    setIsEngineRunning(false);
    setLightsActive("flash");
    setTimeout(() => setLightsActive("off"), 800);
    toast.info("Vehicle Armed & Locked", {
      description: "Ultrasonic sensors active • Active aero parked • Hydraulic suspension lowered.",
    });
  };

  const handleStartEngine = () => {
    playEngineIgnitionRoar();
    setIsEngineRunning(true);
    setIsUnlocked(true);
    setLightsActive("pulse");
    setTimeout(() => setLightsActive("off"), 2500);
    toast.success("Remote Engine Ignition Active", {
      description: "Twin-turbos primed • Pre-warming catalyst • Cabin climatized to 21.0°C.",
    });
  };

  const handleLocateBeacon = () => {
    playChimeSound();
    setLightsActive("pulse");
    setTimeout(() => setLightsActive("off"), 2000);
    toast.info("Concierge Valet Beacon Pulsing", {
      description: "Digital beacon broadcasted to diplomatic chauffeur team.",
    });
  };

  // Velvet styling
  const velvetBg = {
    obsidian: "from-zinc-950 via-neutral-900 to-black border-neutral-800",
    cognac: "from-amber-950 via-yellow-950 to-stone-950 border-amber-900/60",
    crimson: "from-rose-950 via-red-950 to-neutral-950 border-rose-900/60",
    emerald: "from-emerald-950 via-teal-950 to-zinc-950 border-emerald-900/60",
  }[velvet];

  // Metal Finish styling
  const finishStyles = {
    titanium: {
      body: "from-slate-200 via-slate-400 to-slate-300 text-slate-900",
      accent: "border-slate-300 shadow-slate-400/20",
      knurl: "bg-slate-400",
      label: "Aerospace Titanium / Billet Aluminum",
    },
    gold: {
      body: "from-amber-200 via-amber-400 to-yellow-500 text-amber-950",
      accent: "border-amber-300 shadow-amber-500/20",
      knurl: "bg-amber-500",
      label: "24K Polished Yellow Gold Inlay",
    },
    blackchrome: {
      body: "from-neutral-700 via-neutral-900 to-neutral-800 text-neutral-100",
      accent: "border-neutral-700 shadow-neutral-900/40",
      knurl: "bg-neutral-800",
      label: "Stealth Black Chrome PVD Coating",
    },
    rosegold: {
      body: "from-rose-200 via-rose-300 to-amber-300 text-rose-950",
      accent: "border-rose-300 shadow-rose-400/20",
      knurl: "bg-rose-400",
      label: "Bespoke Atelier Rose Gold",
    },
  }[finish];

  return (
    <div className="w-full rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-black border border-gold/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative ambient lighting */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Handover Experience</span>
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-white mt-2">
            Bespoke Presentation Box & Key Fob
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Handcrafted carbon-fiber casket with laser-engraved milled-aluminum vehicle key.
          </p>
        </div>

        <Button
          onClick={toggleBox}
          className={`font-semibold h-11 px-6 transition-all ${
            isOpen
              ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              : "gradient-gold text-slate-950 font-bold shadow-lg shadow-gold/10 hover:opacity-95"
          }`}
        >
          <Key className="w-4 h-4 mr-2" />
          {isOpen ? "Close Presentation Box" : "Unbox & Lift Carbon Lid"}
        </Button>
      </div>

      {/* Main Unboxing Canvas / Box Presentation */}
      <div className="mt-8 flex flex-col items-center">
        {/* The 3D Box Container */}
        <div
          onClick={() => !isOpen && toggleBox()}
          className={`w-full max-w-2xl rounded-2xl border transition-all duration-700 relative overflow-hidden ${
            isOpen
              ? `bg-gradient-to-b ${velvetBg} shadow-2xl shadow-black p-6 sm:p-8 min-h-[460px]`
              : "bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border-gold/40 shadow-xl cursor-pointer hover:border-gold hover:shadow-gold/10 p-8 min-h-[300px] flex flex-col items-center justify-center text-center"
          }`}
        >
          {/* Carbon Fiber Weave Texture (When closed or background) */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#d4af37 1px, transparent 1px), radial-gradient(#ffffff 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 10px 10px",
            }}
          />

          {!isOpen ? (
            /* CLOSED LID VIEW: Carbon Fiber Box with Gold Plaque */
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6 flex flex-col items-center z-10"
            >
              {/* Central Gold Inlay Emblem */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-200 via-gold to-yellow-600 p-0.5 shadow-2xl shadow-gold/20 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center p-2 text-center">
                  <Key className="w-6 h-6 text-gold mb-1 animate-pulse" />
                  <span className="font-playfair text-[9px] font-bold tracking-widest text-gold uppercase">
                    1 OF 1
                  </span>
                </div>
              </div>

              {/* Plaque Text */}
              <div>
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white tracking-wider">
                  CARSTORE BESPOKE ATELIER
                </h3>
                <p className="font-mono text-xs text-gold/80 mt-1 uppercase tracking-widest">
                  COMMISSION NO: CS-ORD-{orderId}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Prepared for <span className="text-white font-medium">{clientName}</span> • {carName}
                </p>
              </div>

              {/* Latch Hint */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-gold/40 text-gold text-xs font-semibold hover:bg-gold/10 transition-colors">
                <span>Click anywhere to release pneumatic latch</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
              </div>
            </motion.div>
          ) : (
            /* OPEN BOX VIEW: Velvet interior + Milled Key Fob + Brass Plaque */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center space-y-6 z-10"
            >
              {/* Brass Commission Plaque Inside Box */}
              <div className="w-full max-w-lg p-3.5 rounded-xl bg-gradient-to-r from-amber-900/30 via-yellow-950/40 to-amber-900/30 border border-amber-600/40 text-center flex flex-wrap items-center justify-between gap-3 shadow-inner">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-mono text-amber-300 font-bold tracking-widest block">
                    CHASSIS COMMISSION PLAQUE
                  </span>
                  <p className="text-xs text-slate-200 font-medium font-mono">
                    VIN: CS-2026-CHASSIS-{orderId}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">
                    PATRON MONOGRAM
                  </span>
                  <span className="text-xs font-serif font-bold text-gold tracking-widest">
                    {customMonogram}
                  </span>
                </div>
              </div>

              {/* The Milled Aluminum Key Fob in Velvet Recess */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-black/60 border border-white/10 shadow-2xl shadow-black flex flex-col items-center">
                {/* Velvet Recess Rim */}
                <div className="absolute inset-0 rounded-3xl border-2 border-black/80 shadow-[inset_0_4px_16px_rgba(0,0,0,0.8)] pointer-events-none" />

                {/* Key Fob Physical Body */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`w-64 sm:w-72 rounded-[32px] p-6 bg-gradient-to-b ${finishStyles.body} border-2 ${finishStyles.accent} shadow-2xl relative overflow-hidden`}
                >
                  {/* Metallic Shimmer Reflection */}
                  <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/20 to-transparent rotate-45 pointer-events-none" />

                  {/* Top Key Ring Eyelet (chamfered aluminum) */}
                  <div className="w-10 h-3 rounded-full bg-slate-800/40 border border-black/30 mx-auto mb-4 flex items-center justify-center">
                    <div className="w-4 h-1.5 rounded-full bg-black/50" />
                  </div>

                  {/* Laser-Etched Monogram Badge */}
                  <div className="text-center py-2 border-b border-black/20 mb-5 relative">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-black/60 font-bold block mb-1">
                      {carBrand}
                    </span>
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-950 border border-gold/40 text-gold shadow-lg shadow-black/40">
                      <span className="font-playfair text-xl font-extrabold tracking-widest text-gradient-gold">
                        {customMonogram}
                      </span>
                    </div>
                  </div>

                  {/* 4 Knurled Metal Remote Buttons */}
                  <div className="grid grid-cols-2 gap-3 z-10 relative">
                    {/* Unlock Button */}
                    <button
                      onClick={handleUnlock}
                      className="p-3.5 rounded-2xl bg-black/80 hover:bg-black text-slate-100 hover:text-gold border border-white/10 active:scale-95 transition-all flex flex-col items-center gap-1 shadow-md group"
                    >
                      <Unlock className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                        UNLOCK
                      </span>
                    </button>

                    {/* Lock Button */}
                    <button
                      onClick={handleLock}
                      className="p-3.5 rounded-2xl bg-black/80 hover:bg-black text-slate-100 hover:text-gold border border-white/10 active:scale-95 transition-all flex flex-col items-center gap-1 shadow-md group"
                    >
                      <Lock className="w-5 h-5 text-slate-300 group-hover:text-gold group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                        LOCK
                      </span>
                    </button>

                    {/* Remote Engine Ignition */}
                    <button
                      onClick={handleStartEngine}
                      className="p-3.5 rounded-2xl bg-gradient-to-br from-red-950/80 to-black hover:from-red-900 text-slate-100 border border-red-500/40 active:scale-95 transition-all flex flex-col items-center gap-1 shadow-md group col-span-1"
                    >
                      <Flame className="w-5 h-5 text-red-400 group-hover:scale-125 transition-transform animate-pulse" />
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-red-200">
                        START
                      </span>
                    </button>

                    {/* Locate / Valet Beacon */}
                    <button
                      onClick={handleLocateBeacon}
                      className="p-3.5 rounded-2xl bg-black/80 hover:bg-black text-slate-100 hover:text-cyan-400 border border-white/10 active:scale-95 transition-all flex flex-col items-center gap-1 shadow-md group col-span-1"
                    >
                      <Radio className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-cyan-200">
                        LOCATE
                      </span>
                    </button>
                  </div>

                  {/* Bottom Laser Engraving */}
                  <div className="mt-5 text-center">
                    <span className="text-[9px] font-mono tracking-widest uppercase text-black/50 font-bold">
                      MILLED IN STUTTGART • 7075-T6 ALLOY
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Live Vehicle Telemetry & Headlight Response */}
              <div className="w-full max-w-lg p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                    <img
                      src={carImage}
                      alt={carName}
                      className="w-full h-full object-cover"
                    />
                    {/* Headlights Flash Effect */}
                    {lightsActive !== "off" && (
                      <div className="absolute inset-0 bg-cyan-400/40 animate-ping pointer-events-none" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{carName}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Status:</span>
                      <span
                        className={`font-mono font-bold ${
                          isUnlocked ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {isUnlocked ? "UNLOCKED" : "LOCKED & SECURED"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Engine Status Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                      isEngineRunning
                        ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                        : "bg-slate-900 text-slate-400 border border-slate-800"
                    }`}
                  >
                    <Flame className="w-3 h-3" />
                    {isEngineRunning ? "IGNITION ACTIVE" : "ENGINE OFF"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Customization Atelier Controls (Only visible when box is open) */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mt-6 p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Bespoke Atelier Customizer
              </span>
              <span className="text-[11px] text-slate-400">
                Personalize your physical handover kit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Key Fob Finish */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Key Fob Metal Finish:</label>
                <div className="flex items-center gap-2">
                  {[
                    { key: "titanium", label: "Titanium", color: "bg-slate-300" },
                    { key: "gold", label: "24K Gold", color: "bg-amber-400" },
                    { key: "blackchrome", label: "Black Chrome", color: "bg-neutral-800" },
                    { key: "rosegold", label: "Rose Gold", color: "bg-rose-300" },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setFinish(f.key as MetalFinish)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-all ${
                        finish === f.key
                          ? "bg-slate-800 text-white border-gold shadow-sm"
                          : "bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${f.color}`} />
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Velvet Cushion Color */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Box Velvet Cushion:</label>
                <div className="flex items-center gap-2">
                  {[
                    { key: "obsidian", label: "Obsidian", color: "bg-neutral-900" },
                    { key: "cognac", label: "Cognac", color: "bg-amber-800" },
                    { key: "crimson", label: "Crimson", color: "bg-red-800" },
                    { key: "emerald", label: "Emerald", color: "bg-emerald-800" },
                  ].map((v) => (
                    <button
                      key={v.key}
                      onClick={() => setVelvet(v.key as VelvetColor)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-all ${
                        velvet === v.key
                          ? "bg-slate-800 text-white border-gold shadow-sm"
                          : "bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${v.color}`} />
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Monogram Input */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Laser-Engraved Monogram Initials (2–4 Characters):
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={customMonogram}
                  onChange={(e) => setCustomMonogram(e.target.value.toUpperCase())}
                  placeholder="A.S."
                  className="w-20 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-center font-playfair font-bold text-gold text-sm tracking-widest uppercase focus:border-gold outline-none"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success(`Monogram "${customMonogram}" etched onto key specification.`)}
                  className="h-8 text-xs border-slate-800 text-slate-300 hover:text-gold"
                >
                  Save Monogram
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
