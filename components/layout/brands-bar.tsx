import Link from "next/link";

const brands = [
  "Bugatti",
  "Koenigsegg",
  "Ferrari",
  "Lamborghini",
  "Porsche",
  "Rolls-Royce",
  "McLaren",
  "Bentley",
  "Aston Martin",
  "Mercedes-AMG",
];

export function BrandsBar() {
  return (
    <section className="py-8 border-y border-white/[0.06] bg-[#050505] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] uppercase tracking-[0.35em] text-amber-400/70 font-semibold mb-5">
          Curated Provenance · World&apos;s Finest Marques
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-3">
          {brands.map((brand) => (
            <Link
              key={brand}
              href={`/cars?brand=${encodeURIComponent(brand)}`}
              className="font-playfair text-sm sm:text-base md:text-lg text-slate-400 hover:text-amber-300 transition-all duration-300 tracking-wide hover:scale-105"
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
