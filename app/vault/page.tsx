"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  KeyRound,
  ShieldCheck,
  Crown,
  Lock,
  Unlock,
  Sparkles,
  Plane,
  Award,
  Zap,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils/format";
import {
  playDoorThud,
  playChimeSound,
  playMechanicalClick,
} from "@/lib/utils/audio-feedback";
import { toast } from "sonner";

interface VaultCar {
  id: string;
  name: string;
  builder: string;
  chassis: string;
  production: string;
  engine: string;
  power: string;
  topSpeed: string;
  price: number;
  image: string;
  status: string;
}

const VAULT_HYPERCARS: VaultCar[] = [
  {
    id: "v-01",
    name: "Pagani Huayra R",
    builder: "Horacio Pagani Atelier (San Cesario sul Panaro)",
    chassis: "Chassis #14/30 • Carbo-Titanium HP62 G2",
    production: "1 of 30 Worldwide",
    engine: "6.0L Naturally Aspirated V12 (HWA AG)",
    power: "850 HP @ 9,000 RPM • 750 Nm",
    topSpeed: "380+ km/h (Circuit Aero)",
    price: 350000000,
    image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80",
    status: "Private Allocation Available",
  },
  {
    id: "v-02",
    name: "Koenigsegg Jesko Absolut",
    builder: "Koenigsegg Automotive (Ängelholm, Sweden)",
    chassis: "Chassis #007 • Low-Drag High-Speed Monocoque",
    production: "Strictly Limited Production",
    engine: "5.0L Twin-Turbo Flat-Plane V8 (E85 Capable)",
    power: "1,600 HP • 1,500 Nm • 9-Speed LST",
    topSpeed: "531 km/h (Theoretical Maximum)",
    price: 420000000,
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
    status: "Build Slot #04 Reserved for Delivery",
  },
  {
    id: "v-03",
    name: "Aston Martin Valkyrie AMR Pro",
    builder: "Aston Martin Performance Technologies (Gaydon)",
    chassis: "Chassis #22/40 • Full Carbon Aerocell",
    production: "1 of 40 Worldwide",
    engine: "6.5L Naturally Aspirated Cosworth V12",
    power: "1,000 HP @ 10,500 RPM (LMP1 Downforce)",
    topSpeed: "362 km/h • 3.3G Lateral Cornering",
    price: 385000000,
    image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80",
    status: "Final Chassis Available",
  },
  {
    id: "v-04",
    name: "Bugatti Bolide Track Homologation",
    builder: "Bugatti Atelier (Molsheim, France)",
    chassis: "Chassis #03/40 • FIA LMH Carbon Monocoque",
    production: "1 of 40 Worldwide",
    engine: "8.0L Quad-Turbo W16",
    power: "1,850 HP • 1,850 Nm • 0.67 kg/HP Ratio",
    topSpeed: "500+ km/h (Circuit Config)",
    price: 480000000,
    image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80",
    status: "Allocation Inquire Only",
  },
];

export default function SecretVaultPage() {
  const [passcode, setPasscode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedCar, setSelectedCar] = useState<VaultCar | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Check persisted unlock in session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("carstore_vault_unlocked");
      if (saved === "true") {
        setIsUnlocked(true);
      }
    }
  }, []);

  const handleUnlock = (codeToTest?: string) => {
    const code = (codeToTest || passcode).trim().toUpperCase();
    if (
      code === "CARSTOREVIP" ||
      code === "CENTURION" ||
      code === "BLACKCARD" ||
      code === "VIP"
    ) {
      playDoorThud();
      setTimeout(() => playChimeSound(), 250);
      setIsUnlocked(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("carstore_vault_unlocked", "true");
      }
      toast.success("Welcome, Distinguished Centurion", {
        description: "Carstore Private Secret Vault Unlocked.",
      });
    } else {
      toast.error("Invalid VIP Passcode", {
        description: "Access is reserved for verified Black Card & Centurion members.",
      });
    }
  };

  const handleInquire = (car: VaultCar) => {
    playMechanicalClick();
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const submitInquiry = () => {
    if (!contactName || !contactPhone) {
      toast.error("Please enter your name and contact phone number");
      return;
    }
    setIsModalOpen(false);
    playChimeSound();
    toast.success("Confidential Dossier Dispatched", {
      description: `Managing Director of VIP Client Relations will contact ${contactName} within 60 minutes.`,
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          /* Gated Vault Lock Screen */
          <motion.div
            key="lock-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="max-w-3xl mx-auto px-4 py-24 sm:py-32 text-center space-y-8"
          >
            <div className="relative w-24 h-24 mx-auto">
              <div className="w-24 h-24 rounded-full bg-gold/10 border-2 border-gold/40 flex items-center justify-center text-gold shadow-[0_0_50px_rgba(212,175,55,0.25)]">
                <Lock className="h-10 w-10 animate-pulse" />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-gold font-mono font-semibold">
                Classified Atelier Access • Invitation Only
              </span>
              <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-white tracking-tight">
                The Secret <span className="text-gradient-gold">VIP Vault</span>
              </h1>
              <p className="max-w-lg mx-auto text-slate-400 text-sm leading-relaxed">
                Contains ultra-limited 1-of-1 hypercar build slots, track-only homologation prototypes, and factory-exclusive allocations not cataloged for the public floor.
              </p>
            </div>

            <Card className="bg-slate-900/90 border-gold/30 p-8 rounded-2xl max-w-md mx-auto space-y-5 shadow-2xl">
              <div className="space-y-2 text-left">
                <label className="text-xs text-slate-300 font-medium">
                  Enter Centurion Passcode
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    type="password"
                    placeholder="e.g. CARSTOREVIP"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                    className="pl-10 bg-slate-950 border-slate-800 text-white font-mono text-center tracking-widest uppercase focus-visible:ring-gold h-12 text-sm"
                  />
                </div>
              </div>

              <Button
                onClick={() => handleUnlock()}
                className="w-full gradient-gold text-slate-950 font-bold h-12 text-base shadow-lg shadow-gold/10"
              >
                <Unlock className="mr-2 h-4 w-4" />
                Unlock Private Vault
              </Button>

              <div className="pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setPasscode("CARSTOREVIP");
                    handleUnlock("CARSTOREVIP");
                  }}
                  className="text-xs text-gold/80 hover:text-gold underline transition font-mono"
                >
                  ⚡ Instant VIP Demo Passcode (Click to Auto-Unlock)
                </button>
              </div>
            </Card>
          </motion.div>
        ) : (
          /* Unlocked Private Salon */
          <motion.div
            key="unlocked-vault"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
          >
            {/* VIP Status Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-950 via-slate-900 to-zinc-950 border border-gold/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0 shadow-inner">
                  <Crown className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase text-gold tracking-widest">
                      MEMBERSHIP STATUS: TIER 1 CENTURION
                    </span>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                      VERIFIED ACCESS
                    </Badge>
                  </div>
                  <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-white mt-0.5">
                    The Confidential Atelier Collection
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    sessionStorage.removeItem("carstore_vault_unlocked");
                    setIsUnlocked(false);
                    playDoorThud();
                    toast.info("Vault locked securely");
                  }}
                  className="border-slate-800 text-xs text-slate-400 hover:text-white"
                >
                  <Lock className="mr-1.5 h-3.5 w-3.5" />
                  Lock Salon
                </Button>
              </div>
            </div>

            {/* Hypercar Allocations Grid */}
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-gold font-mono font-bold">
                  Bespoke 1-of-1 Build Slots
                </p>
                <h3 className="font-playfair text-3xl font-bold text-white mt-1">
                  Active Private Allocations
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {VAULT_HYPERCARS.map((car) => (
                  <Card
                    key={car.id}
                    className="bg-slate-900/90 border-slate-800 rounded-2xl overflow-hidden hover:border-gold/50 transition duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                        <Badge className="absolute top-4 left-4 bg-slate-950/90 text-gold border-gold/40 text-xs font-mono">
                          {car.production}
                        </Badge>
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-xs text-slate-300 font-mono">{car.builder}</p>
                          <h4 className="font-playfair text-2xl font-bold text-white">
                            {car.name}
                          </h4>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <p className="text-xs text-slate-400 font-mono">{car.chassis}</p>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                            <span className="text-[10px] text-slate-500 uppercase block">Engine</span>
                            <span className="font-semibold text-white">{car.engine}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                            <span className="text-[10px] text-slate-500 uppercase block">Power</span>
                            <span className="font-semibold text-gold">{car.power}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2">
                          <span className="text-slate-400">Status:</span>
                          <span className="text-emerald-400 font-semibold">{car.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-slate-500">Confidential Price</span>
                        <p className="font-mono text-xl font-bold text-gradient-gold">
                          {formatPrice(car.price)}
                        </p>
                      </div>

                      <Button
                        onClick={() => handleInquire(car)}
                        className="gradient-gold text-slate-950 font-bold px-5 h-11 shadow-md"
                      >
                        Acquire Allocation
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Exclusive VIP Atelier Privileges */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-gold font-mono font-bold">
                  Bespoke Client Privileges
                </p>
                <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white mt-1">
                  The Centurion Experience Suite
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                    <Plane className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Private Aviation Handover</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Private jet charter directly to Ängelholm or Maranello for factory floor handover with the company founders.
                  </p>
                </div>

                <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                    <Award className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Private Track Pit Crew</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Exclusive telemetry engineer and dedicated tire technician support for your private track days at BIC or Yas Marina.
                  </p>
                </div>

                <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm">1-of-1 Coachbuilding</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Custom composite fiber weaves, 24-karat gold leaf emblems, and tailored acoustic exhausts certified by factory homologation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Allocation Inquiry Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-950 border-gold/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl font-bold flex items-center gap-2">
              <Crown className="h-5 w-5 text-gold" />
              Confidential Dossier Request
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Vehicle: {selectedCar?.name}. Your inquiry is routed directly to the Managing Director of VIP Client Relations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Allocation Price:</span>
                <span className="font-mono text-gold font-bold">
                  {selectedCar ? formatPrice(selectedCar.price) : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Production Run:</span>
                <span className="text-white font-mono">{selectedCar?.production}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Your Full Name</label>
              <Input
                placeholder="e.g. Ankit Singh"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white h-11 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Direct Telephone / Mobile</label>
              <Input
                placeholder="+91 98765 43210"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white h-11 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="w-1/3 border-slate-800 text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={submitInquiry}
              className="w-2/3 gradient-gold text-slate-950 font-bold hover:opacity-90 h-11"
            >
              Dispatch VIP Dossier
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}
