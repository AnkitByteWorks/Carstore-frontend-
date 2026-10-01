"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Gauge,
  ShieldCheck,
  Key,
  Truck,
  Lock,
  Sparkles,
  ArrowUpRight,
  Radio,
  Zap,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

export function Features() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#050505] border-y border-white/[0.06]">
      {/* Subtle ambient luxury light orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[250px] bg-blue-600/5 blur-[130px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-amber-400">
              The Carstore Sanctuary
            </span>
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            Engineered for the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
              Discerning Few
            </span>
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg font-light leading-relaxed">
            Beyond conventional retail. Every allocation represents an uncompromised standard of
            verified provenance, white-glove enclosed transport, and bespoke mechanical handover.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tile 1: 1/4-Mile Drag & Telemetry Lab (Wide Col Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 group relative rounded-2xl bg-gradient-to-b from-[#0d0d10]/95 to-[#050505]/95 p-7 sm:p-9 border border-white/[0.08] hover:border-amber-500/40 transition-all duration-500 overflow-hidden flex flex-col justify-between"
          >
            {/* Ambient hover glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-500/10 group-hover:bg-amber-500/15 blur-3xl transition-all duration-500 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform duration-300">
                  <Gauge className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  PHYSICS SIMULATOR
                </div>
              </div>

              <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-3">
                1/4-Mile Drag & Telemetry Lab
              </h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                Compare power-to-weight ratios, 0–100 km/h acceleration curves, and quarter-mile trap speeds
                across all 20 verified marques with our interactive digital drag strip before acquisition.
              </p>

              {/* Mini visual telemetry widget */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-white font-medium flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Bugatti Chiron SS vs Ferrari SF90
                  </span>
                  <span className="text-amber-400 font-semibold">9.1s vs 9.6s</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 w-16">Bugatti</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full w-[94%]" />
                    </div>
                    <span className="text-[11px] font-mono text-amber-300 font-semibold w-12 text-right">
                      1578 HP
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 w-16">Ferrari</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full w-[82%]" />
                    </div>
                    <span className="text-[11px] font-mono text-red-300 font-semibold w-12 text-right">
                      986 HP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/race"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group/link"
              >
                Launch Drag Simulator
                <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Tile 2: Secret Vault VIP Allocations (Col Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 group relative rounded-2xl bg-gradient-to-b from-[#0d0d10]/95 to-[#050505]/95 p-7 sm:p-9 border border-white/[0.08] hover:border-amber-500/40 transition-all duration-500 overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-amber-500/10 blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform duration-300">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400">
                  PRIVATE ESCROW
                </div>
              </div>

              <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-3">
                Off-Market Vault Allocations
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Access unlisted bespoke factory build allocations and ultra-rare collector consignments
                for Bugatti, Pagani, and Koenigsegg prior to public market disclosure.
              </p>

              {/* Private status badge list */}
              <div className="space-y-2.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Factory Certified Provenance
                  </span>
                  <span className="text-emerald-400 font-mono text-[11px]">100% Guaranteed</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Biometric Escrow Protection
                  </span>
                  <span className="text-amber-400 font-mono text-[11px]">Zero-Risk</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Off-Book NDA Acquisition
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">Strict Confidential</span>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/cars"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group/link"
              >
                Inquire For Private Inventory
                <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Tile 3: Bespoke Milled Key Presentation Box (Col Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 group relative rounded-2xl bg-gradient-to-b from-[#0d0d10]/95 to-[#050505]/95 p-7 sm:p-9 border border-white/[0.08] hover:border-amber-500/40 transition-all duration-500 overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform duration-300">
                  <Key className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-300">
                  BESPOKE ATELIER
                </div>
              </div>

              <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-3">
                Billet-Aluminum Key Handover
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Every acquisition arrives with a handcrafted presentation box containing an aircraft-grade
                aluminum key fob custom milled with your initials and NFC vehicle sync.
              </p>

              {/* Graphic snippet */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-6 flex items-center gap-4">
                <div className="w-12 h-14 rounded-lg bg-gradient-to-b from-slate-800 via-slate-900 to-black border border-amber-500/40 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B] mb-1" />
                  <span className="font-mono text-[9px] font-bold text-amber-300 tracking-widest">
                    CAR
                  </span>
                  <div className="w-6 h-[1px] bg-amber-500/30 my-1" />
                  <span className="text-[8px] font-serif text-slate-400 font-semibold">VIP</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Monogram Engraving Included</div>
                  <div className="text-[11px] text-slate-400">
                    Dual frequency transponder, brushed anodized chassis & carbon cradle.
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/test-drive/book"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group/link"
              >
                Book VIP Handover Experience
                <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Tile 4: Climate-Controlled Enclosed Transporter Fleet (Col Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-7 group relative rounded-2xl bg-gradient-to-b from-[#0d0d10]/95 to-[#050505]/95 p-7 sm:p-9 border border-white/[0.08] hover:border-amber-500/40 transition-all duration-500 overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-500/10 blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform duration-300">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-300">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  SATELLITE TELEMETRY ACTIVE
                </div>
              </div>

              <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-3">
                Climate-Controlled Transporter Fleet
              </h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                Dedicated hydraulic single-car transporters equipped with real-time GPS coordinates,
                air suspension shock dampening, and ₹100 Crore comprehensive in-transit insurance coverage.
              </p>

              {/* Transit Stats Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-6">
                <div className="text-center border-r border-slate-800/80 pr-2">
                  <div className="font-mono text-lg font-bold text-amber-400">48 hrs</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Pan-India Express</div>
                </div>
                <div className="text-center border-r border-slate-800/80 px-2">
                  <div className="font-mono text-lg font-bold text-white">21°C</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Climate Locked</div>
                </div>
                <div className="text-center pl-2">
                  <div className="font-mono text-lg font-bold text-emerald-400">Zero km</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Odometer Purity</div>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group/link"
              >
                Track Live Transporter Telemetry
                <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}