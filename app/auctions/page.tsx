"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gavel,
  Clock,
  ShieldCheck,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Flame,
  CheckCircle2,
  AlertCircle,
  Truck,
  Lock,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils/format";
import { toast } from "sonner";

interface Bid {
  id: string;
  bidder: string;
  location: string;
  amount: number;
  time: string;
  isUser?: boolean;
}

// Synthesize luxury auction hammer sound using Web Audio API
function playHammerChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // Gavel knock
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.7, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);

    // Golden resonance ring
    setTimeout(() => {
      const ringOsc = ctx.createOscillator();
      const ringGain = ctx.createGain();
      ringOsc.type = "triangle";
      ringOsc.frequency.setValueAtTime(880, ctx.currentTime); // A5 chime
      ringGain.gain.setValueAtTime(0.4, ctx.currentTime);
      ringGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      ringOsc.connect(ringGain);
      ringGain.connect(ctx.destination);
      ringOsc.start();
      ringOsc.stop(ctx.currentTime + 0.85);
    }, 100);
  } catch (e) {
    // Audio synthesis not permitted or unsupported
  }
}

export default function AuctionsPage() {
  // Current active lot state
  const [currentBid, setCurrentBid] = useState(285000000); // ₹28.50 Cr
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 38,
    seconds: 42,
  });
  const [bids, setBids] = useState<Bid[]>([
    {
      id: "b1",
      bidder: "Collector #4092",
      location: "Mumbai, IN",
      amount: 285000000,
      time: "2 mins ago",
    },
    {
      id: "b2",
      bidder: "Apex Syndicate",
      location: "Dubai, UAE",
      amount: 280000000,
      time: "11 mins ago",
    },
    {
      id: "b3",
      bidder: "VIP Patron #014",
      location: "Monaco, MC",
      amount: 275000000,
      time: "26 mins ago",
    },
    {
      id: "b4",
      bidder: "K. Singhania",
      location: "Delhi, IN",
      amount: 270000000,
      time: "48 mins ago",
    },
  ]);

  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [customBidAmount, setCustomBidAmount] = useState<string>("");
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  // Live countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulated occasional competitor bid
  useEffect(() => {
    const interval = setInterval(() => {
      const increment = 2500000; // +25 Lakhs
      setCurrentBid((prev) => {
        const newBid = prev + increment;
        const newBidder = {
          id: `comp-${Date.now()}`,
          bidder: `VIP Collector #${Math.floor(1000 + Math.random() * 9000)}`,
          location: ["London, UK", "Singapore, SG", "Bengaluru, IN", "Geneva, CH"][
            Math.floor(Math.random() * 4)
          ],
          amount: newBid,
          time: "Just now",
        };
        setBids((existing) => [newBidder, ...existing.slice(0, 7)]);
        return newBid;
      });
    }, 45000); // every 45s

    return () => clearInterval(interval);
  }, []);

  const handlePlaceBid = (amount: number) => {
    if (amount <= currentBid) {
      toast.error(`Your bid must exceed the current high bid of ${formatPrice(currentBid)}`);
      return;
    }

    setIsSubmittingBid(true);
    setTimeout(() => {
      setCurrentBid(amount);
      const userBid: Bid = {
        id: `user-${Date.now()}`,
        bidder: "You (VIP Bidder)",
        location: "Verified Atelier Escrow",
        amount,
        time: "Just now",
        isUser: true,
      };

      setBids((prev) => [userBid, ...prev]);
      setIsSubmittingBid(false);
      setIsBidModalOpen(false);
      playHammerChime();
      toast.success(`VIP Bid Confirmed: ${formatPrice(amount)}! You are currently the highest bidder.`);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Hero Header */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Live Collector Salon • Active Floor
          </div>

          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            The Hypercar <span className="text-gradient-gold">Auction Room</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg">
            Acquire strictly limited-production allocations, ultra-rare homologation specials, and 1-of-1 bespoke hypercars with verified provenance and banking escrow protection.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Headliner: Active Live Lot */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-md bg-gold/15 text-gold border border-gold/30 text-xs font-mono font-bold">
                LOT #01 • HEADLINER
              </span>
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Reserve Met • Selling Live</span>
              </div>
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-gold/30 rounded-xl px-4 py-2 self-start sm:self-auto">
              <Clock className="h-4 w-4 text-gold animate-pulse" />
              <span className="text-xs text-slate-400 uppercase tracking-wider">Lot Closes In:</span>
              <span className="font-mono text-base font-bold text-white tracking-widest">
                {String(timeLeft.hours).padStart(2, "0")}h :{" "}
                {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
                {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            </div>
          </div>

          {/* Lot Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visuals & Specs (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-[16/10] shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1600&q=80"
                  alt="Ferrari Daytona SP3 Carbon Atelier"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-6 left-6 right-6">
                  <Badge className="bg-red-500 text-white font-bold text-xs uppercase px-2.5 py-0.5 mb-2">
                    1 of 599 Worldwide
                  </Badge>
                  <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-white">
                    Ferrari Daytona SP3 Carbon Atelier
                  </h2>
                  <p className="text-sm text-slate-300 mt-1">
                    6.5L Naturally Aspirated V12 • 829 HP @ 9,500 RPM • Bianco Fuji Tri-Coat
                  </p>
                </div>
              </div>

              {/* Highlights & Documentation */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Odometer", val: "142 km" },
                  { label: "Year", val: "2024" },
                  { label: "Transmission", val: "7-Speed Dual Clutch" },
                  { label: "Provenance", val: "Ferrari Classiche Cert." },
                ].map((stat, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <p className="text-[11px] text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-sm font-semibold text-white mt-0.5">{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Bidding Console (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="bg-slate-900/90 border-gold/30 p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-slate-400">
                      Current High Bid
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                      <Flame className="h-3.5 w-3.5 text-orange-400" />
                      14 Total Bids Placed
                    </span>
                  </div>
                  <motion.div
                    key={currentBid}
                    initial={{ scale: 0.95, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl sm:text-4xl font-bold text-gradient-gold mt-2 font-mono"
                  >
                    {formatPrice(currentBid)}
                  </motion.div>
                  <p className="text-xs text-slate-500 mt-1">
                    Next minimum bid increment: +₹5,00,000
                  </p>
                </div>

                {/* Quick Bid Increment Buttons */}
                <div className="space-y-3">
                  <p className="text-xs font-medium text-slate-300">Quick Increment Bids:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[500000, 1000000, 2500000].map((inc) => (
                      <Button
                        key={inc}
                        variant="outline"
                        onClick={() => handlePlaceBid(currentBid + inc)}
                        disabled={isSubmittingBid}
                        className="border-slate-800 bg-slate-950/80 hover:border-gold hover:text-gold text-xs h-10 font-mono"
                      >
                        +{formatPrice(inc)}
                      </Button>
                    ))}
                  </div>

                  <Button
                    onClick={() => {
                      setCustomBidAmount(String(currentBid + 500000));
                      setIsBidModalOpen(true);
                    }}
                    className="w-full gradient-gold text-slate-950 hover:opacity-90 font-semibold h-12 text-base shadow-lg"
                  >
                    <Gavel className="mr-2 h-5 w-5" />
                    Place Custom VIP Bid
                  </Button>
                </div>

                {/* Live Bid Ticker Feed */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold uppercase tracking-wider">Live Bid Log</span>
                    <span className="font-mono text-emerald-400">● Streaming</span>
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                    <AnimatePresence initial={false}>
                      {bids.map((b, idx) => (
                        <motion.div
                          key={b.id}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className={`p-2.5 rounded-lg flex items-center justify-between text-xs transition ${
                            idx === 0
                              ? "bg-gold/10 border border-gold/30 text-white"
                              : "bg-slate-950/50 border border-slate-800/80 text-slate-300"
                          } ${b.isUser ? "ring-1 ring-gold" : ""}`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5 font-medium">
                              <span>{b.bidder}</span>
                              {b.isUser && (
                                <Badge className="bg-gold text-slate-950 text-[9px] px-1 py-0 h-3.5 font-bold">
                                  YOU
                                </Badge>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500">{b.location} • {b.time}</span>
                          </div>
                          <span className="font-mono font-bold text-gold">
                            {formatPrice(b.amount)}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                  <Lock className="h-3.5 w-3.5 text-gold" />
                  <span>Escrow secured by Carstore VIP Banking Syndicate</span>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Upcoming Auction Lots */}
        <section className="space-y-8">
          <div>
            <p className="text-xs font-semibold text-gold uppercase tracking-widest">
              Catalog Preview
            </p>
            <h2 className="font-playfair text-3xl font-bold text-white mt-1">
              Upcoming Salon Lots
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: "lot-02",
                title: "Bugatti Chiron Pur Sport",
                spec: "8.0L Quad-Turbo W16 • 1,500 HP • Agility Spec",
                image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80",
                startingBid: 380000000,
                status: "Opens in 2d 14h",
                statusColor: "text-amber-400 bg-amber-400/10 border-amber-400/30",
              },
              {
                id: "lot-03",
                title: "McLaren Senna LM",
                spec: "4.0L Twin-Turbo V8 • 814 HP • 1 of 24 Worldwide",
                image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=800&q=80",
                startingBid: 182000000,
                status: "Opens in 4d 08h",
                statusColor: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
              },
              {
                id: "lot-04",
                title: "Porsche 918 Spyder Weissach",
                spec: "4.6L V8 Hybrid • 887 HP • Liquid Metal Chrome",
                image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
                startingBid: 165000000,
                status: "Sold for ₹19.2 Cr",
                statusColor: "text-slate-400 bg-slate-800 border-slate-700",
              },
            ].map((lot) => (
              <Card
                key={lot.id}
                className="bg-slate-900 border-slate-800 overflow-hidden rounded-2xl hover:border-gold/50 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-slate-800 relative">
                    <img
                      src={lot.image}
                      alt={lot.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className={`absolute top-3 left-3 text-xs border ${lot.statusColor}`}>
                      {lot.status}
                    </Badge>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-playfair text-xl font-bold text-white">
                      {lot.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {lot.spec}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500">Estimate / Starting</span>
                    <p className="font-mono text-sm font-bold text-gold">
                      {formatPrice(lot.startingBid)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info(`Catalog dossier for ${lot.title} sent to your registered VIP email.`)}
                    className="border-slate-800 text-xs hover:border-gold hover:text-gold"
                  >
                    Request Dossier
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* VIP Guarantees & Concierge Services */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 border-t border-slate-800">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 text-gold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-white text-base">Private Banking Escrow</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All deposits and final settlement payments are held securely in RBI/SEBI compliant private banking escrow until vehicle handover.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 text-gold">
              <Award className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-white text-base">150-Point Factory Verification</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every auction entry undergoes forensic chassis, paint-meter, ECU telemetry, and title verification by Maranello or Stuttgart certified master mechanics.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 text-gold">
              <Truck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-white text-base">Enclosed Airfreight Delivery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complimentary white-glove transport in custom climate-controlled hydraulic enclosed transports straight to your private garage or estate.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Place Custom Bid Dialog */}
      <Dialog open={isBidModalOpen} onOpenChange={setIsBidModalOpen}>
        <DialogContent className="bg-slate-950 border-gold/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl font-bold flex items-center gap-2">
              <Gavel className="h-5 w-5 text-gold" />
              Place Confidential VIP Bid
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Lot #01: Ferrari Daytona SP3 Carbon Atelier. All bids placed are legally binding under Carstore Collector Salon terms.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Current High Bid</span>
                <span className="text-white font-mono">{formatPrice(currentBid)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Minimum Bid Required</span>
                <span className="text-gold font-mono font-bold">
                  {formatPrice(currentBid + 500000)}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Your Bid Amount (₹ INR)
              </label>
              <Input
                type="number"
                value={customBidAmount}
                onChange={(e) => setCustomBidAmount(e.target.value)}
                placeholder={String(currentBid + 500000)}
                className="bg-slate-900 border-slate-800 text-white font-mono text-lg h-12 focus-visible:ring-gold"
              />
              {Number(customBidAmount) > 0 && (
                <p className="text-xs text-gold font-mono">
                  Equivalent to: {formatPrice(Number(customBidAmount))}
                </p>
              )}
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed flex items-start gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>
                By placing this bid, your account confirms authorization for a 5% escrow pre-authorization hold should you win this lot.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsBidModalOpen(false)}
              className="w-1/3 border-slate-800 text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handlePlaceBid(Number(customBidAmount))}
              disabled={isSubmittingBid || Number(customBidAmount) <= currentBid}
              className="w-2/3 gradient-gold text-slate-950 font-bold hover:opacity-90 h-11"
            >
              {isSubmittingBid ? "Authenticating..." : "Confirm VIP Bid"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}
