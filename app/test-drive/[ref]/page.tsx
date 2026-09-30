"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  testDrivesApi,
  type TestDriveTrackingDTO,
} from "@/lib/api/test-drives";
import { Button } from "@/components/ui/button";
import { BespokeKeyPresentationBox } from "@/components/orders/bespoke-key-presentation-box";
import {
  CheckCircle2,
  Clock,
  Car,
  Compass,
  Phone,
  ShieldCheck,
  Truck,
  Thermometer,
  MapPin,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Database,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export default function TestDriveTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const referenceCode = params?.ref as string;

  const [data, setData] = useState<TestDriveTrackingDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async (isManual = false) => {
    if (!referenceCode) return;
    if (isManual) setRefreshing(true);
    try {
      const result = await testDrivesApi.getTracking(referenceCode);
      setData(result);
      setError(null);
      if (isManual) toast.success("Telemetry & logistics synced with central vault");
    } catch {
      setError("Unable to locate reservation in the Carstore registry.");
      if (isManual) toast.error("Failed to refresh status.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(() => {
      fetchTracking();
    }, 15000);
    return () => clearInterval(interval);
  }, [referenceCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
          <Car className="w-6 h-6 text-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 font-mono text-sm text-gold tracking-widest uppercase">
          Querying Diplomatic Logistics Dispatch...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
          <MapPin className="w-8 h-8" />
        </div>
        <h1 className="font-playfair text-2xl font-bold text-white mb-2">
          Reservation Record Not Found
        </h1>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          We could not locate reference <span className="font-mono text-gold">{referenceCode}</span>. Please verify your reference identifier or contact your personal concierge.
        </p>
        <Button
          onClick={() => router.push("/cars")}
          className="gradient-gold text-slate-950 font-bold px-6"
        >
          Explore Hypercar Collection
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/cars"
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Showroom Fleet</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-gold/10 border border-gold/30 text-gold font-bold">
              {data.referenceCode}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchTracking(true)}
              disabled={refreshing}
              className="border-slate-800 text-slate-300 hover:text-gold hover:border-gold/50 text-xs h-8"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin text-gold" : ""}`}
              />
              Live Sync
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Hero Section */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-gold/20 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -z-10" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold font-semibold mb-2">
                <Sparkles className="w-4 h-4" />
                <span>White-Glove VIP Experience Live Tracker</span>
              </div>
              <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {data.carBrand} {data.carName}
              </h1>
              <p className="text-slate-400 text-sm mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>Reserved for <strong className="text-white">{data.customerName}</strong></span>
                <span className="text-slate-600">•</span>
                <span>Scheduled: <strong className="text-gold">{data.preferredDate}</strong> ({data.timeSlot})</span>
                <span className="text-slate-600">•</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  {data.experienceType}
                </span>
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Current Pipeline Status</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-emerald-400 tracking-wide text-sm">
                  {data.currentStatus.replace("_", " ")}
                </span>
              </div>
              <span className="text-xs text-slate-500 mt-1">Step {data.currentStep} of 5 Active</span>
            </div>
          </div>
        </div>

        {/* Amazon-Style 5-Step Order / Logistics Tracker */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="font-playfair text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-gold" />
              Concierge Dispatch & Telemetry Pipeline
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Real-time updates synced via Spring Boot & Redis
            </span>
          </div>

          {/* Stepper Timeline */}
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {data.steps.map((step) => {
              const isPast = step.completed;
              const isCurrent = step.active;

              return (
                <div key={step.stepNumber} className="relative group">
                  {/* Step Marker Dot */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? "bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20 shadow-md shadow-emerald-500/30"
                        : isCurrent
                        ? "bg-gold text-slate-950 ring-4 ring-gold/30 shadow-lg shadow-gold/20 animate-pulse"
                        : "bg-slate-800 text-slate-500 border border-slate-700"
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    ) : (
                      step.stepNumber
                    )}
                  </div>

                  {/* Step Content Card */}
                  <div
                    className={`p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? "bg-slate-900/90 border-gold/40 shadow-lg shadow-gold/5"
                        : isPast
                        ? "bg-slate-900/40 border-slate-800/90 text-slate-300"
                        : "bg-slate-950/40 border-slate-800/40 text-slate-500 opacity-60"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3
                        className={`text-base font-semibold ${
                          isCurrent ? "text-gold" : isPast ? "text-white" : "text-slate-400"
                        }`}
                      >
                        {step.title}
                      </h3>
                      {step.timestamp && (
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {new Date(step.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {step.description}
                    </p>

                    {isCurrent && (
                      <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gold/10 border border-gold/20 text-gold text-[11px] font-medium">
                        <Sparkles className="w-3 h-3" />
                        <span>Active Stage: Concierge team currently executing protocols</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column Grid: Concierge Specialist & Carrier Logistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Concierge Specialist Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-gold font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-gold" /> Assigned VIP Host
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {data.concierge.badge}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gold to-amber-200 text-slate-950 font-playfair font-bold text-xl flex items-center justify-center shadow-lg shadow-gold/20">
                  {data.concierge.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{data.concierge.name}</h3>
                  <p className="text-xs text-slate-400">{data.concierge.title}</p>
                  <p className="text-xs font-mono text-gold mt-1">{data.concierge.phone}</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-4 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                Your dedicated specialist oversees private circuit bookings, high-security vehicle handling, and personal driver telemetry synchronization.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={`tel:${data.concierge.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gold/40 text-gold hover:bg-gold hover:text-slate-950 transition-colors text-xs font-bold"
              >
                <Phone className="w-3.5 h-3.5" /> Call Concierge
              </a>
              <Button
                variant="outline"
                onClick={() =>
                  toast.info(
                    `Encrypted dispatch ping sent to ${data.concierge.name}. Expect an immediate callback.`
                  )
                }
                className="border-slate-800 text-slate-300 hover:text-gold text-xs h-10"
              >
                Send VIP Ping
              </Button>
            </div>
          </div>

          {/* White-Glove Logistics & Transporter Telemetry */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-400" /> Carrier Telemetry & Escort
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {data.logistics.carrierId}
                </span>
              </div>

              <div className="space-y-3 mt-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-gold" /> Transporter Unit
                  </span>
                  <span className="text-white font-medium">
                    {data.logistics.transporterType}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gold" /> Current Staging
                  </span>
                  <span className="text-white font-medium">
                    {data.logistics.currentCheckpoint}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Thermometer className="w-3.5 h-3.5 text-blue-400" /> Climate Regulation
                  </span>
                  <span className="text-blue-300 font-mono font-medium">
                    {data.logistics.climateControlTemp}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Armed Escort Lead
                  </span>
                  <span className="text-emerald-300 font-medium">
                    {data.logistics.driverName}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Target Appointment</span>
              <span className="text-gold font-mono font-semibold">
                {data.logistics.estimatedArrival}
              </span>
            </div>
          </div>
        </div>

        {/* Handcrafted Bespoke Presentation Box & Monogrammed Key Fob */}
        <BespokeKeyPresentationBox
          carName={`${data.carBrand} ${data.carName}`}
          carBrand={data.carBrand}
          clientName={data.customerName}
          monogramText={data.customerName.split(" ").map(w => w[0]).join("") || "VIP"}
          orderId={data.referenceCode}
          carImage={`/cars/${data.carName}.jpg`}
        />

        {/* Learning Architecture Callout: MongoDB Polyglot Persistence */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-gold/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/30 text-gold mt-1">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-gold">
                  Under the Hood: Polyglot Architecture
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Docker MongoDB 7.0 Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                This VIP reservation generated relational records in <strong>MySQL 8</strong>, real-time booking slots in <strong>Redis 7</strong>, and unstructured clickstream analytics in <strong>MongoDB</strong>. Inspect the live audit collection in Mongo Express at <code className="text-gold">localhost:8081</code>.
              </p>
            </div>
          </div>

          <a
            href="http://localhost:8081"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors whitespace-nowrap"
          >
            <span>Open Mongo Express</span>
            <ExternalLink className="w-3.5 h-3.5 text-gold" />
          </a>
        </div>
      </div>
    </div>
  );
}
