"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import type { Car } from "@/lib/types/car";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Phone,
  CheckCircle2,
  Sparkles,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

interface TestDriveModalProps {
  car: Car;
}

export function TestDriveModal({ car }: TestDriveModalProps) {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [refCode, setRefCode] = useState("TD-892104");

  // Form State
  const [name, setName] = useState(user?.username || "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("11:00 AM — 01:00 PM");
  const [experienceType, setExperienceType] = useState<"showroom" | "doorstep">("showroom");

  const [minDate] = useState(() => new Date(Date.now() + 86400000).toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !date) {
      toast.error("Please provide your phone number and preferred date.");
      return;
    }

    setRefCode(`TD-${Math.floor(100000 + Math.random() * 900000)}`);
    setIsSubmitted(true);
    toast.success("Test Drive appointment confirmed!");
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className="w-full border-gold text-gold hover:bg-gold hover:text-slate-950 font-semibold h-12 text-base transition-colors"
        >
          <Phone className="mr-2 h-5 w-5" />
          Book a Test Drive
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-lg p-0 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>VIP Experience</span>
          </div>
          <DialogTitle className="font-playfair text-2xl font-bold text-white">
            Book a Private Test Drive
          </DialogTitle>
          <p className="text-slate-400 text-xs mt-1">
            Experience the {car.brand} {car.name} under expert pilot supervision.
          </p>
        </div>

        {isSubmitted ? (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-5">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <h3 className="font-playfair text-2xl font-bold text-white">
                VIP Appointment Reserved
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Ref Code: <span className="font-mono text-gold font-bold">{refCode}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle:</span>
                <span className="text-white font-medium">{car.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="text-white font-medium">{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time Slot:</span>
                <span className="text-white font-medium">{timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-gold font-medium">
                  {experienceType === "doorstep" ? "Chauffeured Doorstep Showcase" : `${car.showroomLocation} Flagship Showroom`}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Our Senior Client Advisor will reach out on {phone} within 2 hours to confirm concierge logistics.
            </p>

            <Button
              onClick={handleReset}
              className="w-full gradient-gold text-slate-950 font-semibold"
            >
              Done
            </Button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Experience Type Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setExperienceType("showroom")}
                className={`py-2 px-3 rounded-lg font-medium transition-all ${
                  experienceType === "showroom"
                    ? "bg-gold text-slate-950 shadow-md font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Flagship Showroom
              </button>
              <button
                type="button"
                onClick={() => setExperienceType("doorstep")}
                className={`py-2 px-3 rounded-lg font-medium transition-all ${
                  experienceType === "doorstep"
                    ? "bg-gold text-slate-950 shadow-md font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Doorstep Showcase
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Your Full Name *</Label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Singhania"
                  className="bg-slate-900 border-slate-800 text-white h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Contact Number *</Label>
                <Input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="bg-slate-900 border-slate-800 text-white h-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Email Address *</Label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@luxurycars.com"
                className="bg-slate-900 border-slate-800 text-white h-10 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Preferred Date *</Label>
                <Input
                  required
                  type="date"
                  min={minDate}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-slate-900 border-slate-800 text-white h-10 text-sm [color-scheme:dark]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Preferred Slot</Label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full h-10 rounded-md bg-slate-900 border border-slate-800 text-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
                >
                  <option value="10:00 AM — 12:00 PM">10:00 AM — 12:00 PM (Morning)</option>
                  <option value="02:00 PM — 04:00 PM">02:00 PM — 04:00 PM (Afternoon)</option>
                  <option value="05:00 PM — 07:00 PM">05:00 PM — 07:00 PM (Sunset Cruise)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-400">
              <Shield className="h-4 w-4 text-gold flex-shrink-0" />
              <span>Full comprehensive transit insurance provided during all test drives.</span>
            </div>

            <Button
              type="submit"
              className="w-full gradient-gold text-slate-950 font-semibold h-11 text-base mt-2"
            >
              Confirm VIP Test Drive Reservation
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
