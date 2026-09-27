"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/10 backdrop-blur">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-gold">
              India&apos;s Premium Luxury Car Store
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Drive Your
            <span className="block text-gradient-gold">Dream Car</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Discover the world&apos;s finest luxury automobiles. From Ferrari to
            Rolls-Royce, delivered to your door.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cars">
              <Button
                size="lg"
                className="gradient-gold text-slate-950 hover:opacity-90 font-semibold text-base px-8 h-12"
              >
                Browse Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-slate-950 font-semibold text-base px-8 h-12"
              >
                Book a Showroom Visit
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            {[
              { value: "20+", label: "Luxury Cars" },
              { value: "50+", label: "Happy Clients" },
              { value: "24/7", label: "Support" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-playfair text-3xl md:text-4xl font-bold text-gradient-gold">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}