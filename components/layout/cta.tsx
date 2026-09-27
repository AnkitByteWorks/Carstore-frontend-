import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative py-24 overflow-hidden border-y border-slate-800">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/10 backdrop-blur mb-6">
          <Calendar className="h-4 w-4 text-gold" />
          <span className="text-xs font-medium text-gold tracking-wider uppercase">
            Book a Showroom Visit
          </span>
        </div>

        <h2 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Ready to Drive Your
          <span className="block text-gradient-gold">Dream Car?</span>
        </h2>

        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
          Book a private test drive at your nearest showroom. Our concierge team
          will handle every detail — from paperwork to home delivery.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <Button
              size="lg"
              className="gradient-gold text-slate-950 hover:opacity-90 font-semibold text-base px-10 h-14"
            >
              Book a Test Drive
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/cars">
            <Button
              size="lg"
              variant="outline"
              className="border-gold/50 text-gold hover:bg-gold hover:text-slate-950 font-semibold text-base px-10 h-14"
            >
              Browse All Cars
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
