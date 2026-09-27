"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { carsApi } from "@/lib/api/cars";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Clock,
  Palette,
  CreditCard,
  Shield,
  Truck,
  ArrowLeft,
  ShoppingCart,
  Phone,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import Link from "next/link";
import { motion } from "framer-motion";

interface CarDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CarDetailPage({ params }: CarDetailPageProps) {
  const { id } = use(params);

  const { data: car, isLoading, error } = useQuery({
    queryKey: ["car", id],
    queryFn: () => carsApi.getById(Number(id)),
    enabled: !!id,
  });

  // Similar cars (same brand)
  const { data: similar } = useQuery({
    queryKey: ["similar", car?.brand],
    queryFn: () => carsApi.getByBrand(car!.brand),
    enabled: !!car?.brand,
  });

  const otherCars = similar?.filter((c) => c.id !== car?.id).slice(0, 3) || [];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <Skeleton className="h-[600px] w-full bg-slate-900 rounded-2xl" />
        </div>
      </main>
    );
  }

  if (error || !car) {
    return (
      <main className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="font-playfair text-4xl font-bold text-white mb-4">
            Car not found
          </h1>
          <Link href="/cars">
            <Button variant="outline" className="border-gold text-gold">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cars
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-gold transition mb-6 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all cars
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Image (60%) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
              {car.hasImage ? (
                <img
                  src={carsApi.getImageUrl(car.id)}
                  alt={car.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-700">
                  No image available
                </div>
              )}
              <Badge className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-sm text-gold border-gold/50 text-sm px-3 py-1">
                {car.brand}
              </Badge>
            </div>
          </motion.div>

          {/* Right: Info (40%) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Title + Price */}
            <div>
              <h1 className="font-playfair text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
                {car.name}
              </h1>
              <p className="text-4xl md:text-5xl font-bold text-gradient-gold">
                {formatPrice(car.price)}
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Ex-showroom price • Inclusive of taxes
              </p>
            </div>

            <Separator className="bg-slate-800" />

            {/* Description */}
            <div>
              <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
                About this car
              </h2>
              <p className="text-slate-300 leading-relaxed">
                {car.description}
              </p>
            </div>

            <Separator className="bg-slate-800" />

            {/* Quick Facts */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Showroom</p>
                  <p className="text-sm text-white font-medium">
                    {car.showroomLocation}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Delivery</p>
                  <p className="text-sm text-white font-medium">
                    {car.deliveryDays} days
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-800" />

            {/* Color Options */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Palette className="h-4 w-4 text-gold" />
                <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  Colors Available
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {(car.colorOptions ? car.colorOptions.split(",") : []).map((color, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:border-gold hover:text-gold"
                  >
                    {color.trim()}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-slate-800" />

            {/* Payment Options */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="h-4 w-4 text-gold" />
                <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  Payment Options
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {(car.paymentOptions ? car.paymentOptions.split(",") : []).map((pm, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="border-slate-700 text-slate-300"
                  >
                    {pm.trim()}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-slate-800" />

            {/* CTA Buttons */}
            <div className="space-y-4 pt-4">
              <Link href={`/checkout/${car.id}`} className="block">
                <Button
                  size="lg"
                  className="w-full gradient-gold text-slate-950 hover:opacity-90 font-semibold h-12 text-base"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Buy This Car
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="w-full border-gold text-gold hover:bg-gold hover:text-slate-950 font-semibold h-12 text-base"
              >
                <Phone className="mr-2 h-5 w-5" />
                Book a Test Drive
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 py-12 border-y border-slate-800">
          {[
            {
              icon: Shield,
              title: "Verified Quality",
              desc: "Every car inspected & certified",
            },
            {
              icon: Truck,
              title: "Free Home Delivery",
              desc: "Anywhere in India, fully insured",
            },
            {
              icon: CreditCard,
              title: "Flexible EMI",
              desc: "From 5% down payment",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Similar Cars */}
        {otherCars.length > 0 && (
          <section className="mt-16">
            <div className="mb-8">
              <p className="text-sm font-medium text-gold mb-2 tracking-widest uppercase">
                You might also like
              </p>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white">
                More from {car.brand}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherCars.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Link href={`/cars/${c.id}`}>
                    <div className="group rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-gold/50 transition-all duration-300 cursor-pointer">
                      <div className="aspect-[16/10] overflow-hidden bg-slate-800">
                        {c.hasImage ? (
                          <img
                            src={carsApi.getImageUrl(c.id)}
                            alt={c.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-playfair text-lg font-bold text-white group-hover:text-gold transition line-clamp-1">
                          {c.name}
                        </h3>
                        <p className="text-lg font-bold text-gradient-gold mt-2">
                          {formatPrice(c.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
