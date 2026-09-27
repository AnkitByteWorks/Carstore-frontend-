const brands = [
  "Ferrari",
  "Lamborghini",
  "Porsche",
  "Bugatti",
  "Rolls-Royce",
  "McLaren",
  "Bentley",
  "Koenigsegg",
  "Aston Martin",
  "Mercedes-AMG",
];

export function BrandsBar() {
  return (
    <section className="py-10 border-y border-slate-800 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-slate-500 font-medium mb-6">
          Trusted by the World&apos;s Finest Marques
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {brands.map((brand) => (
            <span
              key={brand}
              className="font-playfair text-base md:text-lg text-slate-500 hover:text-gold transition-colors duration-300 cursor-default tracking-wide"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
