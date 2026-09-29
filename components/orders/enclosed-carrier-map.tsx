"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Truck,
  Shield,
  Thermometer,
  Gauge,
  Radio,
  CheckCircle2,
  Navigation,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface EnclosedCarrierMapProps {
  orderId: number;
  deliveryCity: string;
  status: string;
}

export function EnclosedCarrierMap({
  orderId,
  deliveryCity,
  status,
}: EnclosedCarrierMapProps) {
  const [carrierSpeed, setCarrierSpeed] = useState(82);
  const [internalTemp, setInternalTemp] = useState(20.4);
  const [progressPercent, setProgressPercent] = useState(65);

  useEffect(() => {
    // Dynamic telemetry drift
    const interval = setInterval(() => {
      setCarrierSpeed(Math.floor(76 + Math.random() * 12));
      setInternalTemp(Number((20.2 + Math.random() * 0.5).toFixed(1)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const isTransit = status === "SHIPPED" || status === "PROCESSING" || status === "CONFIRMED";

  return (
    <Card className="bg-slate-900 border-slate-800 p-6 rounded-2xl overflow-hidden relative shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center flex-shrink-0">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-playfair font-bold text-white text-lg">
                White-Glove Hydraulic Carrier GPS
              </h3>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE GPS
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Carrier Transporter #VIP-CARRIER-09 • Monitored Route to {deliveryCity || "Destination"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Radio className="h-4 w-4 text-gold animate-pulse" />
          <span>IRNSS Satellite Uplink Active</span>
        </div>
      </div>

      {/* Styled Route Map Canvas */}
      <div className="relative h-44 sm:h-52 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-5">
        {/* Radar grid background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #D4AF37 1px, transparent 1px), linear-gradient(to bottom, #D4AF37 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Origin & Destination Labels */}
        <div className="relative z-10 flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gold border-2 border-slate-950 shadow-[0_0_8px_#D4AF37]" />
            <span className="font-mono text-white font-medium">Carstore Central Hub (Bandra, Mumbai)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-mono text-gold font-medium">
              {deliveryCity || "Client Residence"}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_8px_#34d399]" />
          </div>
        </div>

        {/* Animated Highway Transit Line */}
        <div className="relative z-10 my-auto">
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden relative border border-slate-800">
            {/* Glowing route trail */}
            <motion.div
              className="h-full bg-gradient-to-r from-gold/50 via-gold to-emerald-400 rounded-full"
              style={{ width: `${progressPercent}%` }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Carrier Icon Marker */}
          <div
            className="absolute -top-3.5 -translate-x-1/2 flex flex-col items-center pointer-events-none"
            style={{ left: `${progressPercent}%` }}
          >
            <div className="px-2 py-0.5 rounded-md bg-gold text-slate-950 font-bold text-[10px] font-mono shadow-xl flex items-center gap-1">
              <Truck className="h-3 w-3" />
              <span>CARRIER</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping mt-0.5" />
          </div>
        </div>

        {/* Live Highway Checkpoint Status */}
        <div className="relative z-10 flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-900">
          <span>Current Waypoint: NH-48 Express Highway Corridor</span>
          <span className="text-emerald-400 font-mono font-medium">
            Next Pitstop: Regional Security Escort Depot
          </span>
        </div>
      </div>

      {/* Telemetry Sensor Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase">
            <Gauge className="h-3.5 w-3.5 text-gold" />
            <span>Transit Speed</span>
          </div>
          <p className="font-mono text-sm font-bold text-white">
            {carrierSpeed} km/h
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase">
            <Thermometer className="h-3.5 w-3.5 text-cyan-400" />
            <span>Trailer Climate</span>
          </div>
          <p className="font-mono text-sm font-bold text-white">
            {internalTemp}°C (AC Sealed)
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span>Suspension</span>
          </div>
          <p className="font-mono text-sm font-bold text-emerald-400">
            Active Air Leveling
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase">
            <Lock className="h-3.5 w-3.5 text-gold" />
            <span>Cargo Seal</span>
          </div>
          <p className="font-mono text-sm font-bold text-white">
            Dual Biometric
          </p>
        </div>
      </div>
    </Card>
  );
}
