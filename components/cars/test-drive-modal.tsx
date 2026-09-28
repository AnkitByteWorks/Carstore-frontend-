"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import type { Car } from "@/lib/types/car";
import { testDrivesApi, type TestDriveResponse } from "@/lib/api/test-drives";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone,
  CheckCircle2,
  Sparkles,
  Shield,
  Loader2,
  Copy,
  Check,
  Calendar,
  Clock,
  Car as CarIcon,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface TestDriveModalProps {
  car: Car;
}

export function TestDriveModal({ car }: TestDriveModalProps) {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<TestDriveResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState(user?.username || "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [preferredDate, setPreferredDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 12:00 PM");
  const [experienceType, setExperienceType] = useState<"SHOWROOM" | "DOORSTEP">("SHOWROOM");
  const [notes, setNotes] = useState("");

  const [minDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split("T")[0];
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !email.trim() || !preferredDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await testDrivesApi.book({
        carId: car.id,
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        preferredDate,
        timeSlot,
        experienceType,
        notes: notes.trim() || undefined,
      });

      setBookingResult(response);
      toast.success("VIP Test Drive appointment confirmed!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error("⚠️ Slot Unavailable: This VIP appointment slot was just reserved by another client under concurrent demand. Please select another slot.");
      } else {
        const message =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Failed to book test drive. Please check details and try again.";
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (bookingResult?.referenceCode) {
      navigator.clipboard.writeText(bookingResult.referenceCode);
      setCopied(true);
      toast.success("Reference code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setBookingResult(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className="w-full border-gold/70 text-gold hover:bg-gold hover:text-slate-950 font-semibold h-12 text-base shadow-lg shadow-gold/5 transition-all group"
        >
          <Sparkles className="mr-2 h-4 w-4 text-gold group-hover:text-slate-950 transition-colors" />
          Book VIP Test Drive
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 relative">
          <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Exclusive Concierge Experience</span>
          </div>
          <DialogTitle className="font-playfair text-2xl font-bold text-white">
            Book VIP Test Drive
          </DialogTitle>
          <p className="text-slate-400 text-xs mt-1">
            Experience the <span className="text-white font-medium">{car.brand} {car.name}</span> with personal concierge and track pilot supervision.
          </p>
        </div>

        {bookingResult ? (
          /* Confirmation Screen */
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                Reservation Confirmed
              </span>
              <h3 className="font-playfair text-2xl font-bold text-white mt-1">
                VIP Appointment Reserved
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Keep your private booking reference code handy
              </p>
            </div>

            {/* Reference Code Card */}
            <div className="p-4 bg-slate-900/90 rounded-xl border border-gold/30 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-left">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                  Reference Code
                </p>
                <p className="font-mono text-xl sm:text-2xl text-gold font-bold tracking-wider">
                  {bookingResult.referenceCode}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="border-slate-700 hover:border-gold text-slate-200 hover:text-gold text-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>

            {/* Summary Grid */}
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/80 text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <CarIcon className="h-3.5 w-3.5 text-gold" /> Vehicle
                </span>
                <span className="text-white font-medium">
                  {bookingResult.carBrand} {bookingResult.carName}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gold" /> Preferred Date
                </span>
                <span className="text-white font-medium">
                  {bookingResult.preferredDate}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gold" /> Time Slot
                </span>
                <span className="text-white font-medium">
                  {bookingResult.timeSlot}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-gold" /> Experience Type
                </span>
                <span className="text-gold font-medium">
                  {bookingResult.experienceType === "DOORSTEP"
                    ? "Chauffeured Doorstep Showcase"
                    : "Flagship Showroom Experience"}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/30 p-3 rounded-lg border border-slate-800">
              Our Senior Client Advisor will reach out on <span className="text-white font-medium">{bookingResult.phone}</span> within 2 hours to confirm concierge logistics and custom route planning.
            </p>

            <Button
              onClick={handleClose}
              className="w-full gradient-gold text-slate-950 font-bold h-11"
            >
              Done
            </Button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Experience Type Radio Buttons */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-300 font-medium">
                Select Experience Type *
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setExperienceType("SHOWROOM")}
                  className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                    experienceType === "SHOWROOM"
                      ? "bg-gold/10 border-gold shadow-md shadow-gold/5"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">
                      Flagship Showroom
                    </span>
                    <input
                      type="radio"
                      name="experienceType"
                      value="SHOWROOM"
                      checked={experienceType === "SHOWROOM"}
                      onChange={() => setExperienceType("SHOWROOM")}
                      className="accent-amber-400 h-4 w-4"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Visit {car.showroomLocation} with private salon & lounge
                  </p>
                </label>

                <label
                  onClick={() => setExperienceType("DOORSTEP")}
                  className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                    experienceType === "DOORSTEP"
                      ? "bg-gold/10 border-gold shadow-md shadow-gold/5"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">
                      Doorstep Showcase
                    </span>
                    <input
                      type="radio"
                      name="experienceType"
                      value="DOORSTEP"
                      checked={experienceType === "DOORSTEP"}
                      onChange={() => setExperienceType("DOORSTEP")}
                      className="accent-amber-400 h-4 w-4"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Delivered directly to your residence or office
                  </p>
                </label>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="customerName" className="text-xs text-slate-300">
                  Customer Name *
                </Label>
                <Input
                  id="customerName"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Vikram Singhania"
                  className="bg-slate-900 border-slate-800 text-white h-10 text-sm focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs text-slate-300">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="bg-slate-900 border-slate-800 text-white h-10 text-sm focus:border-gold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-slate-300">
                Email Address *
              </Label>
              <Input
                id="email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@luxurycars.com"
                className="bg-slate-900 border-slate-800 text-white h-10 text-sm focus:border-gold"
              />
            </div>

            {/* Date & Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="preferredDate" className="text-xs text-slate-300">
                  Preferred Date *
                </Label>
                <Input
                  id="preferredDate"
                  required
                  type="date"
                  min={minDate}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="bg-slate-900 border-slate-800 text-white h-10 text-sm focus:border-gold [color-scheme:dark]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="timeSlot" className="text-xs text-slate-300">
                  Time Slot *
                </Label>
                <select
                  id="timeSlot"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full h-10 rounded-md bg-slate-900 border border-slate-800 text-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM (Morning)</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon)</option>
                  <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM (Sunset Cruise)</option>
                </select>
              </div>
            </div>

            {/* Optional Notes */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="notes" className="text-xs text-slate-300">
                  Optional Notes / Special Requests
                </Label>
                <span className="text-[10px] text-slate-500">Optional</span>
              </div>
              <Textarea
                id="notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Preferred driving route, chauffeur instructions, or personalized concierge requests..."
                className="bg-slate-900 border-slate-800 text-white text-xs resize-none focus:border-gold"
              />
            </div>

            {/* Insurance Note */}
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-400">
              <Shield className="h-4 w-4 text-gold flex-shrink-0" />
              <span>Full comprehensive transit & personal pilot insurance included on every test drive.</span>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gradient-gold text-slate-950 font-bold h-12 text-base mt-2 shadow-lg shadow-gold/10"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reserving VIP Appointment...
                </>
              ) : (
                <>Confirm VIP Test Drive</>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
