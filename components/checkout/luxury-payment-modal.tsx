"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShieldCheck,
  CreditCard,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Wifi,
  ArrowRight,
  Lock,
  QrCode,
  Smartphone,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { paymentsApi, type PaymentIntentResponse } from "@/lib/api/payments";
import { useOrderEvents } from "@/lib/hooks/use-order-events";
import { toast } from "sonner";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface LuxuryPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intent: PaymentIntentResponse | null;
  orderId: number;
  onSuccess?: () => void;
}

export function LuxuryPaymentModal({
  open,
  onOpenChange,
  intent,
  orderId,
  onSuccess,
}: LuxuryPaymentModalProps) {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8888");
  const [cardHolder, setCardHolder] = useState("VIP CENTURION CLIENT");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("888");

  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [paymentTab, setPaymentTab] = useState<"card" | "upi">("card");
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Real-time SSE listener waiting for ORDER_STATUS_UPDATE -> CONFIRMED
  useOrderEvents({
    orderId,
    enabled: open,
    onStatusUpdate: (updatedOrder) => {
      if (updatedOrder.status === "CONFIRMED") {
        setIsConfirmed(true);
        setIsProcessing(false);
        toast.success(`🎉 Order #${orderId} verified & CONFIRMED via Real-time SSE!`);
        onSuccess?.();
      }
    },
  });

  const handleCopySecret = () => {
    if (intent?.clientSecret) {
      navigator.clipboard.writeText(intent.clientSecret);
      setCopiedSecret(true);
      toast.success("Client Secret copied to clipboard!");
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText("carstore.bespoke@icici");
    setCopiedUpi(true);
    toast.success("UPI ID copied to clipboard!");
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCompletePayment = async () => {
    if (!intent) return;
    setIsProcessing(true);

    try {
      // Step: Trigger webhook with payment_intent.succeeded
      const res = await paymentsApi.triggerWebhook({
        paymentIntentId: intent.paymentIntentId,
        orderId: intent.orderId,
        eventType: "payment_intent.succeeded",
      });

      if (res.received && res.status === "CONFIRMED") {
        // Instant confirm safety fallback if SSE is delayed
        setTimeout(() => {
          setIsConfirmed(true);
          setIsProcessing(false);
        }, 600);
      }
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Payment simulation failed. Try again.";
      toast.error(message);
      setIsProcessing(false);
    }
  };

  const handleViewOrder = () => {
    onOpenChange(false);
    router.push(`/orders/${orderId}`);
  };

  if (!intent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-lg p-0 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sandbox Luxury Gateway</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              SIMULATED TEST MODE
            </span>
          </div>
          <DialogTitle className="font-playfair text-2xl font-bold text-white mt-1">
            Authorize Luxury Payment
          </DialogTitle>
          <p className="text-slate-400 text-xs mt-0.5">
            Order #{orderId} • Encrypted 256-bit Sandbox Terminal
          </p>
        </div>

        <div className="p-6 space-y-6">
          <AnimatePresence mode="wait">
            {isConfirmed ? (
              /* Success confirmation state */
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="py-6 text-center space-y-5"
              >
                <div className="h-20 w-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/10">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                    Payment Succeeded
                  </span>
                  <h3 className="font-playfair text-3xl font-bold text-white mt-1">
                    Order Confirmed!
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Verified via Spring Boot Payment Webhook & Live SSE
                  </p>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Settled:</span>
                    <span className="text-gold font-bold text-sm">
                      {formatPrice(intent.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Intent:</span>
                    <span className="font-mono text-white text-[11px]">
                      {intent.paymentIntentId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Live Status:</span>
                    <span className="text-emerald-400 font-semibold">
                      CONFIRMED (Live Stream Active)
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleViewOrder}
                  className="w-full gradient-gold text-slate-950 font-bold h-12 text-base shadow-lg shadow-gold/10"
                >
                  View Live Order Status
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              /* Payment Card & Form */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Payment Method Switcher Tabs */}
                <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPaymentTab("card")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${
                      paymentTab === "card"
                        ? "bg-gold text-slate-950 shadow-md font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    Black VIP Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentTab("upi")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${
                      paymentTab === "upi"
                        ? "bg-gold text-slate-950 shadow-md font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <QrCode className="h-4 w-4" />
                    Instant UPI QR
                  </button>
                </div>

                {paymentTab === "card" ? (
                  <>
                    {/* Virtual Luxury Black Card */}
                    <div className="relative rounded-2xl p-6 bg-gradient-to-tr from-slate-950 via-zinc-900 to-slate-900 border border-gold/30 shadow-2xl overflow-hidden text-white font-mono">
                      {/* Decorative card glow */}
                      <div className="absolute -top-12 -right-12 w-36 h-36 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-7 rounded bg-amber-400/80 bg-gradient-to-br from-yellow-300 to-amber-600 border border-yellow-200/50 flex items-center justify-center shadow-inner">
                            <div className="w-5 h-4 border border-amber-800/40 rounded-sm opacity-60" />
                          </div>
                          <Wifi className="h-4 w-4 text-slate-400 rotate-90" />
                        </div>
                        <span className="text-xs font-serif font-bold tracking-widest text-gradient-gold">
                          CARSTORE BLACK VIP
                        </span>
                      </div>

                      <p className="text-lg sm:text-xl font-bold tracking-widest text-slate-100 my-4">
                        {cardNumber}
                      </p>

                      <div className="flex justify-between items-end text-xs text-slate-400 uppercase pt-2">
                        <div>
                          <p className="text-[9px] text-slate-500">Cardholder</p>
                          <p className="text-white font-semibold text-xs tracking-wider">
                            {cardHolder}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-500">Expires</p>
                          <p className="text-white font-semibold text-xs">{expiry}</p>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Client Secret Summary */}
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Total Payable:</span>
                        <span className="text-lg font-bold text-gradient-gold font-sans">
                          {formatPrice(intent.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                        <span className="text-slate-400">clientSecret:</span>
                        <div className="flex items-center gap-1.5">
                          <code className="text-[11px] font-mono text-slate-300 max-w-[190px] truncate">
                            {intent.clientSecret}
                          </code>
                          <button
                            type="button"
                            onClick={handleCopySecret}
                            className="text-slate-400 hover:text-gold transition p-1"
                            title="Copy client secret"
                          >
                            {copiedSecret ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Simulated form inputs */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-300">Name on Card</Label>
                        <Input
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="bg-slate-900 border-slate-800 text-white h-9 text-xs font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-300">Expiry (MM/YY)</Label>
                          <Input
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            className="bg-slate-900 border-slate-800 text-white h-9 text-xs font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-300">CVV</Label>
                          <Input
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            className="bg-slate-900 border-slate-800 text-white h-9 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <Lock className="h-3.5 w-3.5 text-gold" />
                      <span>Clicking Complete Payment triggers payment_intent.succeeded webhook simulation.</span>
                    </div>

                    <Button
                      onClick={handleCompletePayment}
                      disabled={isProcessing}
                      className="w-full gradient-gold text-slate-950 font-bold h-12 text-base shadow-lg shadow-gold/10"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Authorizing via Gateway Webhook...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Complete Payment — {formatPrice(intent.amount)}
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Instant UPI QR Code View */}
                    <div className="text-center space-y-4">
                      <div className="bg-white p-4 rounded-2xl mx-auto w-56 shadow-2xl border-2 border-gold/40 flex flex-col items-center">
                        {/* High-contrast crisp SVG QR Code */}
                        <svg
                          viewBox="0 0 200 200"
                          className="w-48 h-48"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width="200" height="200" fill="white" />
                          {/* Top-Left Finder */}
                          <rect x="15" y="15" width="50" height="50" rx="6" fill="#020617" />
                          <rect x="23" y="23" width="34" height="34" rx="4" fill="white" />
                          <rect x="30" y="30" width="20" height="20" rx="3" fill="#D4AF37" />

                          {/* Top-Right Finder */}
                          <rect x="135" y="15" width="50" height="50" rx="6" fill="#020617" />
                          <rect x="143" y="23" width="34" height="34" rx="4" fill="white" />
                          <rect x="150" y="30" width="20" height="20" rx="3" fill="#D4AF37" />

                          {/* Bottom-Left Finder */}
                          <rect x="15" y="135" width="50" height="50" rx="6" fill="#020617" />
                          <rect x="23" y="143" width="34" height="34" rx="4" fill="white" />
                          <rect x="30" y="150" width="20" height="20" rx="3" fill="#D4AF37" />

                          {/* Data Matrix Dots */}
                          <g fill="#020617">
                            <rect x="75" y="20" width="10" height="10" rx="2" />
                            <rect x="95" y="20" width="10" height="10" rx="2" />
                            <rect x="115" y="20" width="10" height="10" rx="2" />
                            <rect x="75" y="40" width="10" height="10" rx="2" />
                            <rect x="105" y="40" width="10" height="10" rx="2" />
                            <rect x="85" y="60" width="10" height="10" rx="2" />
                            <rect x="20" y="75" width="10" height="10" rx="2" />
                            <rect x="40" y="75" width="10" height="10" rx="2" />
                            <rect x="60" y="75" width="10" height="10" rx="2" />
                            <rect x="130" y="75" width="10" height="10" rx="2" />
                            <rect x="150" y="75" width="10" height="10" rx="2" />
                            <rect x="170" y="75" width="10" height="10" rx="2" />

                            <rect x="20" y="95" width="10" height="10" rx="2" />
                            <rect x="40" y="105" width="10" height="10" rx="2" />
                            <rect x="140" y="95" width="10" height="10" rx="2" />
                            <rect x="160" y="105" width="10" height="10" rx="2" />

                            <rect x="75" y="130" width="10" height="10" rx="2" />
                            <rect x="95" y="140" width="10" height="10" rx="2" />
                            <rect x="115" y="130" width="10" height="10" rx="2" />
                            <rect x="75" y="160" width="10" height="10" rx="2" />
                            <rect x="105" y="170" width="10" height="10" rx="2" />
                            <rect x="135" y="150" width="10" height="10" rx="2" />
                            <rect x="155" y="160" width="10" height="10" rx="2" />
                            <rect x="175" y="140" width="10" height="10" rx="2" />
                          </g>

                          {/* Center Crest */}
                          <rect x="80" y="80" width="40" height="40" rx="8" fill="#020617" />
                          <circle cx="100" cy="100" r="14" fill="#D4AF37" />
                          <text
                            x="100"
                            y="104"
                            textAnchor="middle"
                            fill="#020617"
                            fontSize="10"
                            fontWeight="bold"
                            fontFamily="sans-serif"
                          >
                            VIP
                          </text>
                        </svg>

                        <div className="mt-2 text-center">
                          <p className="text-[11px] font-bold text-slate-900 tracking-wider">
                            SCAN WITH ANY UPI APP
                          </p>
                        </div>
                      </div>

                      {/* Supported UPI Apps */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-slate-400">
                        {["GPay", "PhonePe", "Paytm", "CRED UPI", "BHIM"].map((app, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-medium"
                          >
                            {app}
                          </span>
                        ))}
                      </div>

                      {/* UPI ID & Amount */}
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Merchant VPA:</span>
                          <div className="flex items-center gap-1.5">
                            <code className="text-gold font-mono font-semibold">
                              carstore.bespoke@icici
                            </code>
                            <button
                              type="button"
                              onClick={handleCopyUpi}
                              className="text-slate-400 hover:text-gold transition p-1"
                              title="Copy UPI ID"
                            >
                              {copiedUpi ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                          <span className="text-slate-400">Total Settlement:</span>
                          <span className="text-base font-bold text-gradient-gold font-sans">
                            {formatPrice(intent.amount)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Awaiting UPI payment confirmation via Webhook & SSE</span>
                      </div>

                      <Button
                        onClick={handleCompletePayment}
                        disabled={isProcessing}
                        className="w-full gradient-gold text-slate-950 font-bold h-12 text-base shadow-lg shadow-gold/10"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Simulating Bank Approval...
                          </>
                        ) : (
                          <>
                            <Smartphone className="mr-2 h-4 w-4" />
                            Simulate UPI Approval — {formatPrice(intent.amount)}
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
