"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/format";
import { Calculator, ShieldCheck, ChevronDown } from "lucide-react";

interface EmiCalculatorProps {
  price: number;
}

export function EmiCalculator({ price }: EmiCalculatorProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const {
    downPaymentAmount,
    principalLoan,
    monthlyEmi,
    totalInterest,
    totalPayment,
  } = useMemo(() => {
    const down = Math.round((price * downPaymentPercent) / 100);
    const p = Math.max(0, price - down);
    const n = tenureYears * 12;
    const r = interestRate / 12 / 100;

    let emi = 0;
    if (p > 0 && r > 0 && n > 0) {
      emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    }

    const totalInt = Math.max(0, Math.round(emi * n - p));
    const totalPay = Math.round(p + totalInt + down);

    return {
      downPaymentAmount: down,
      principalLoan: p,
      monthlyEmi: emi,
      totalInterest: totalInt,
      totalPayment: totalPay,
    };
  }, [price, downPaymentPercent, tenureYears, interestRate]);

  return (
    <Card className="bg-slate-900 border-slate-800 overflow-hidden rounded-2xl">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-850/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-playfair text-lg font-bold text-white">
              Bespoke Financing & EMI Calculator
            </h3>
            <p className="text-xs text-slate-400">
              Personalized luxury loan estimation • Competitive marquee rates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Est. Monthly</p>
            <p className="text-sm font-bold text-gold">{formatPrice(monthlyEmi)}/mo</p>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="p-6 pt-2 border-t border-slate-800/80 space-y-6">
          {/* Main EMI Highlight Banner */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-medium">
                Estimated Monthly Outlay
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl md:text-4xl font-extrabold text-gradient-gold">
                  {formatPrice(monthlyEmi)}
                </span>
                <span className="text-slate-400 text-sm">/ month</span>
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="h-4 w-4" />
                <span>Zero Prepayment Penalty</span>
              </div>
              <p>Instant approval with tier-1 private banking partners</p>
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="space-y-5">
            {/* 1. Down Payment */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 font-medium">Down Payment ({downPaymentPercent}%)</span>
                <span className="text-gold font-semibold">{formatPrice(downPaymentAmount)}</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>10% (Min)</span>
                <span>50%</span>
                <span>80% (Max)</span>
              </div>
            </div>

            {/* 2. Tenure */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 font-medium">Loan Duration</span>
                <span className="text-gold font-semibold">
                  {tenureYears} {tenureYears === 1 ? "Year" : "Years"} ({tenureYears * 12} Mos)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>1 Year</span>
                <span>3 Years</span>
                <span>5 Years</span>
                <span>7 Years</span>
              </div>
            </div>

            {/* 3. Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 font-medium">Interest Rate (p.a.)</span>
                <span className="text-gold font-semibold">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="7.0"
                max="14.0"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>7.0%</span>
                <span>8.5% (Prime)</span>
                <span>14.0%</span>
              </div>
            </div>
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Loan Principal</p>
              <p className="text-sm font-semibold text-white mt-1">{formatPrice(principalLoan)}</p>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Total Interest</p>
              <p className="text-sm font-semibold text-white mt-1">{formatPrice(totalInterest)}</p>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Total Outlay</p>
              <p className="text-sm font-semibold text-gold mt-1">{formatPrice(totalPayment)}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
