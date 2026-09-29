"use client";

import { useState, useRef, useEffect } from "react";
import type { Car } from "@/lib/types/car";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCarFallbackImage } from "@/lib/utils/car-images";
import { carsApi } from "@/lib/api/cars";
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Gauge,
  Flame,
  Palette,
  Sparkles,
  MoveHorizontal,
  Box,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Car3DViewer } from "./car-3d-viewer";

interface CarVisualizer360Props {
  car: Car;
}

interface PaintOption {
  id: string;
  name: string;
  color: string;
  gradient: string;
  overlayFilter: string;
  accent: string;
}

const PAINT_OPTIONS: PaintOption[] = [
  {
    id: "nero",
    name: "Nero Daytona",
    color: "#090d16",
    gradient: "from-slate-900 to-black",
    overlayFilter: "brightness(0.9) contrast(1.15)",
    accent: "#94a3b8",
  },
  {
    id: "giallo",
    name: "Giallo Modena Gold",
    color: "#d97706",
    gradient: "from-amber-400 to-amber-700",
    overlayFilter: "sepia(0.2) hue-rotate(5deg) saturate(1.2)",
    accent: "#fbbf24",
  },
  {
    id: "rosso",
    name: "Rosso Corsa Red",
    color: "#b91c1c",
    gradient: "from-red-600 to-red-950",
    overlayFilter: "sepia(0.25) hue-rotate(330deg) saturate(1.4)",
    accent: "#ef4444",
  },
  {
    id: "grigio",
    name: "Grigio Silverstone",
    color: "#475569",
    gradient: "from-slate-400 to-slate-800",
    overlayFilter: "grayscale(0.3) contrast(1.1)",
    accent: "#cbd5e1",
  },
  {
    id: "verde",
    name: "Verde British Racing",
    color: "#065f46",
    gradient: "from-emerald-500 to-emerald-950",
    overlayFilter: "sepia(0.3) hue-rotate(90deg) saturate(1.3)",
    accent: "#10b981",
  },
];

export function CarVisualizer360({ car }: CarVisualizer360Props) {
  const [activeMode, setActiveMode] = useState<"3d" | "photo">("3d");
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startAngle, setStartAngle] = useState(0);
  const [selectedPaint, setSelectedPaint] = useState<PaintOption>(PAINT_OPTIONS[0]);

  // Audio Engine Synthesizer State
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [rpm, setRpm] = useState(900);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const engineOscRef = useRef<OscillatorNode | null>(null);
  const engineGainRef = useRef<GainNode | null>(null);
  const revIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Drag interaction for 360 rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartAngle(rotationAngle);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    // 360 degrees rotation mapping
    const newAngle = ((startAngle + deltaX * 0.8) % 360 + 360) % 360;
    setRotationAngle(Math.round(newAngle));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setStartAngle(rotationAngle);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    const newAngle = ((startAngle + deltaX * 0.8) % 360 + 360) % 360;
    setRotationAngle(Math.round(newAngle));
  };

  // Web Audio API V8/V12 Exhaust Simulator
  const startEngineSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(65, ctx.currentTime); // Deep V8 idle

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      engineOscRef.current = osc;
      engineGainRef.current = gain;
      setIsPlayingSound(true);
      setRpm(950);
      toast.success("V8 Twin-Turbo Engine Started", {
        description: "Hold 'Throttle Rev' to accelerate to 8,500 RPM",
      });
    } catch (e) {
      toast.error("Audio playback not supported in this browser mode.");
    }
  };

  const stopEngineSound = () => {
    if (audioCtxRef.current) {
      if (engineGainRef.current) {
        engineGainRef.current.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.3);
      }
      setTimeout(() => {
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
        engineOscRef.current = null;
        engineGainRef.current = null;
        setIsPlayingSound(false);
        setRpm(0);
      }, 300);
    }
  };

  const throttleRev = (accelerate: boolean) => {
    if (!isPlayingSound || !audioCtxRef.current || !engineOscRef.current) return;

    if (accelerate) {
      engineOscRef.current.frequency.cancelScheduledValues(audioCtxRef.current.currentTime);
      engineOscRef.current.frequency.exponentialRampToValueAtTime(260, audioCtxRef.current.currentTime + 0.5); // High RPM
      if (engineGainRef.current) {
        engineGainRef.current.gain.linearRampToValueAtTime(0.25, audioCtxRef.current.currentTime + 0.2);
      }
      setRpm(7800);
    } else {
      engineOscRef.current.frequency.cancelScheduledValues(audioCtxRef.current.currentTime);
      engineOscRef.current.frequency.exponentialRampToValueAtTime(65, audioCtxRef.current.currentTime + 0.8); // Return to idle
      if (engineGainRef.current) {
        engineGainRef.current.gain.linearRampToValueAtTime(0.12, audioCtxRef.current.currentTime + 0.4);
      }
      setRpm(950);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const imageSrc = car.hasImage
    ? carsApi.getImageUrl(car.id)
    : getCarFallbackImage(car.id, car.brand);

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-2xl overflow-hidden">
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive 3D Studio & Acoustics</span>
          </div>
          <h3 className="font-playfair text-xl font-bold text-white mt-0.5">
            Bespoke Engineering & CAD Studio
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switch Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <Button
              size="sm"
              variant={activeMode === "3d" ? "default" : "ghost"}
              onClick={() => setActiveMode("3d")}
              className={`text-xs h-7 px-3 font-semibold ${
                activeMode === "3d"
                  ? "bg-gold text-slate-950 font-bold hover:bg-gold/90 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Box className="h-3.5 w-3.5 mr-1.5" />
              3D CAD Studio
            </Button>

            <Button
              size="sm"
              variant={activeMode === "photo" ? "default" : "ghost"}
              onClick={() => setActiveMode("photo")}
              className={`text-xs h-7 px-3 font-semibold ${
                activeMode === "photo"
                  ? "bg-gold text-slate-950 font-bold hover:bg-gold/90 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              360° Photo Reel
            </Button>
          </div>

          {activeMode === "photo" && (
            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="outline" className="border-gold/30 text-gold text-xs font-mono">
                {rotationAngle}°
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setRotationAngle(0)}
                className="text-slate-400 hover:text-white text-xs h-7 px-2"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Active Studio View */}
      {activeMode === "3d" ? (
        <Car3DViewer car={car} />
      ) : (
        <>
          {/* 360 Interactive Canvas Container */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className={`relative aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 cursor-grab select-none flex items-center justify-center transition-all ${
              isDragging ? "cursor-grabbing shadow-inner ring-1 ring-gold/40" : ""
            }`}
          >
            {/* Subtle grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Ambient Color Glow reflection */}
            <div
              className="absolute inset-x-12 bottom-0 h-24 rounded-full blur-3xl opacity-40 transition-colors duration-700 pointer-events-none"
              style={{ backgroundColor: selectedPaint.accent }}
            />

            {/* Rotated Car Image with Perspective Transform */}
            <motion.div
              animate={{
                rotateY: (rotationAngle % 360) * 0.25,
                scale: 1 + Math.sin((rotationAngle * Math.PI) / 180) * 0.05,
              }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full h-full p-4 flex items-center justify-center relative z-10"
            >
              <img
                src={imageSrc}
                alt={car.name}
                style={{ filter: selectedPaint.overlayFilter }}
                className="max-h-full max-w-full object-contain pointer-events-none transition-[filter] duration-500 drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)]"
              />
            </motion.div>

            {/* Drag Helper Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 pointer-events-none">
              <MoveHorizontal className="h-3.5 w-3.5 text-gold animate-pulse" />
              <span>Click & Drag Horizontally to Rotate 360°</span>
            </div>
          </div>

          {/* Studio Controls Grid: Paint Selector + Exhaust Sound */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Paint Swatches */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-gold" />
                  Bespoke Paint Studio
                </span>
                <span className="text-xs font-medium text-gold">
                  {selectedPaint.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {PAINT_OPTIONS.map((paint) => {
                  const isSelected = selectedPaint.id === paint.id;
                  return (
                    <button
                      key={paint.id}
                      onClick={() => setSelectedPaint(paint)}
                      title={paint.name}
                      className={`group relative h-10 w-10 rounded-full transition-all duration-200 flex items-center justify-center p-0.5 ${
                        isSelected
                          ? "ring-2 ring-gold ring-offset-2 ring-offset-slate-950 scale-110 shadow-lg"
                          : "opacity-70 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <span
                        className="h-full w-full rounded-full border border-white/20 shadow-inner"
                        style={{ backgroundColor: paint.color }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exhaust Acoustics Synthesizer */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Gauge className="h-3.5 w-3.5 text-gold" />
                  Twin-Turbo Exhaust Sound
                </span>
                {isPlayingSound && (
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {rpm} RPM
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {!isPlayingSound ? (
                  <Button
                    onClick={startEngineSound}
                    className="flex-1 gradient-gold text-slate-950 font-bold h-10 text-xs shadow-md shadow-gold/10"
                  >
                    <Volume2 className="h-4 w-4 mr-1.5" />
                    Start V8 Engine
                  </Button>
                ) : (
                  <>
                    <Button
                      onMouseDown={() => throttleRev(true)}
                      onMouseUp={() => throttleRev(false)}
                      onTouchStart={() => throttleRev(true)}
                      onTouchEnd={() => throttleRev(false)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold h-10 text-xs shadow-lg shadow-red-600/20 active:scale-95 transition-all"
                    >
                      <Flame className="h-4 w-4 mr-1.5 text-amber-300 animate-bounce" />
                      Hold to Rev Throttle (8,500 RPM)
                    </Button>

                    <Button
                      variant="outline"
                      onClick={stopEngineSound}
                      className="border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white h-10 px-3"
                      title="Cut Engine"
                    >
                      <VolumeX className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
