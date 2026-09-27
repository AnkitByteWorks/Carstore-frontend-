"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Wrench, ShieldCheck, Truck, Trophy, AlertCircle, Radio } from "lucide-react";
import type { OrderStatusType } from "@/lib/api/orders";

interface OrderTrackingStepperProps {
  status: OrderStatusType;
  isConnected?: boolean;
}

interface Step {
  id: OrderStatusType;
  label: string;
  subLabel: string;
  icon: React.ElementType;
}

const STEPS: Step[] = [
  {
    id: "PENDING",
    label: "Order Placed",
    subLabel: "Awaiting Confirmation",
    icon: Clock,
  },
  {
    id: "PROCESSING",
    label: "Vehicle Preparation",
    subLabel: "Detailing & Quality Inspection",
    icon: Wrench,
  },
  {
    id: "CONFIRMED",
    label: "Order Confirmed",
    subLabel: "Showroom Allocation Verified",
    icon: ShieldCheck,
  },
  {
    id: "SHIPPED",
    label: "In Transit",
    subLabel: "En Route in Covered Carrier",
    icon: Truck,
  },
  {
    id: "DELIVERED",
    label: "Delivered",
    subLabel: "Ceremonial Key Handover",
    icon: Trophy,
  },
];

const STATUS_ORDER: Record<OrderStatusType, number> = {
  PENDING: 0,
  PROCESSING: 1,
  CONFIRMED: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: -1,
};

export function OrderTrackingStepper({ status, isConnected = false }: OrderTrackingStepperProps) {
  const currentIndex = STATUS_ORDER[status] ?? 0;
  const isCancelled = status === "CANCELLED";

  if (isCancelled) {
    return (
      <div className="p-6 rounded-2xl bg-red-950/30 border border-red-800/60 text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="font-playfair text-xl font-bold text-red-300">
          Order Cancelled
        </h3>
        <p className="text-xs text-slate-400">
          This order has been cancelled. Any pre-authorization holds will be automatically released.
        </p>
      </div>
    );
  }

  // Calculate percentage for progress line
  const progressPercent = currentIndex === 0 ? 0 : (currentIndex / (STEPS.length - 1)) * 100;

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-8">
      {/* Live SSE Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-playfair text-lg sm:text-xl font-bold text-white">
              Live Order Journey
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/30">
              {status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time status updates streamed directly from our logistics dispatcher
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px]">
            <span className="relative flex h-2 w-2">
              {isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isConnected ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
            </span>
            <span className={isConnected ? "text-emerald-400 font-medium" : "text-amber-400"}>
              {isConnected ? "Live SSE Active" : "Connecting SSE..."}
            </span>
            <Radio className="h-3 w-3 text-slate-500 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Stepper Track */}
      <div className="relative">
        {/* Background line */}
        <div className="hidden sm:block absolute top-6 left-8 right-8 h-1 bg-slate-800 -translate-y-1/2 z-0" />

        {/* Animated Progress Fill Line */}
        <motion.div
          className="hidden sm:block absolute top-6 left-8 h-1 bg-gradient-to-r from-amber-500 via-gold to-emerald-400 -translate-y-1/2 z-0"
          initial={{ width: 0 }}
          animate={{ width: `calc(${progressPercent}% * (1 - 64px / 100%))` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
          {STEPS.map((step, idx) => {
            const isCompleted = currentIndex > idx;
            const isCurrent = currentIndex === idx;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-4 sm:gap-3"
              >
                {/* Node Icon */}
                <div className="relative flex-shrink-0">
                  {isCurrent && (
                    <motion.div
                      layoutId="stepper-glow"
                      className="absolute -inset-1 rounded-full bg-gold/30 blur-sm"
                      animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 relative border-2 ${
                      isCompleted
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/20"
                        : isCurrent
                        ? "bg-gold/20 border-gold text-gold shadow-lg shadow-gold/30 ring-4 ring-gold/10"
                        : "bg-slate-950 border-slate-800 text-slate-600"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                </div>

                {/* Text Info */}
                <div className="space-y-0.5">
                  <p
                    className={`text-xs sm:text-sm font-semibold transition-colors ${
                      isCurrent
                        ? "text-gold"
                        : isCompleted
                        ? "text-white"
                        : "text-slate-500"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[11px] text-slate-400 sm:line-clamp-2">
                    {step.subLabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
