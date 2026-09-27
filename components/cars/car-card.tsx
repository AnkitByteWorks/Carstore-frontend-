import Link from "next/link";
import { Car, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Car as CarType } from "@/lib/types/car";
import { carsApi } from "@/lib/api/cars";
import { formatPrice } from "@/lib/utils/format";

interface CarCardProps {
    car: CarType;
}

export function CarCard({ car }: CarCardProps) {
    return (
        <Link href={`/cars/${car.id}`}>
            <Card className="group overflow-hidden bg-slate-900 border border-slate-800 hover:border-gold/50 transition-all duration-500 hover:shadow-2xl hover:shadow-gold/20 hover:-translate-y-1 cursor-pointer">
                {/* Image */}
                <div className="relative aspect-[16/10] max-h-[220px] overflow-hidden bg-slate-800">
                    {car.hasImage ? (
                        <img
                            src={carsApi.getImageUrl(car.id)}
                            alt={car.name}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                            <Car className="h-16 w-16 text-slate-700" />
                        </div>
                    )}

                    {/* Gradient overlay at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

                    <Badge className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm text-gold border-gold/50">
                        {car.brand}
                    </Badge>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div>
                        <h3 className="font-playfair text-2xl font-bold text-white group-hover:text-gold transition line-clamp-2 min-h-[2.5rem]">
                            {car.name}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-2 mt-2">
                            {car.description}
                        </p>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {car.showroomLocation}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {car.deliveryDays} days
                        </span>
                    </div>

                    {/* Price + CTA */}
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                        <p className="text-2xl font-bold text-gradient-gold">
                            {formatPrice(car.price)}
                        </p>
                        <span className="text-xs text-gold font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details →
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
    );
}