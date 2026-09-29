"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { carsApi } from "@/lib/api/cars";
import { adminApi } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils/format";
import { getCarFallbackImage } from "@/lib/utils/car-images";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function AdminCarsPage() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-cars-list"],
    queryFn: () => carsApi.getAll({ page: 0, size: 100, sortBy: "id" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteCar(id),
    onSuccess: () => {
      toast.success("Car deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-cars-list"] });
    },
    onError: (error: unknown) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to delete";
      toast.error(message);
    },
  });

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    setDeletingId(id);
    deleteMutation.mutate(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-white">
            Cars
          </h1>
          <p className="text-slate-400 mt-1">
            {data?.totalElements || 0} cars in inventory
          </p>
        </div>
        <Link href="/admin/cars/new">
          <Button className="gradient-gold text-slate-950">
            <Plus className="mr-2 h-4 w-4" />
            Add Car
          </Button>
        </Link>
      </div>

      {/* List */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 bg-slate-900 rounded-xl" />
          ))}
        </div>
      )}

      {data?.content && (
        <div className="space-y-3">
          {data.content.map((car) => (
            <Card
              key={car.id}
              className="bg-slate-900 border-slate-800 hover:border-slate-700 transition overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                {/* Image */}
                <div className="w-full md:w-24 aspect-[16/10] md:aspect-square rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                  <img
                    src={
                      car.imageUrl && !car.imageUrl.includes("localhost") && !car.imageUrl.includes("placeholder")
                        ? car.imageUrl
                        : getCarFallbackImage(car.id, car.brand)
                    }
                    alt={car.name}
                    onError={(e) => {
                      const fallback = getCarFallbackImage(car.id, car.brand);
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-playfair text-lg font-bold text-white truncate">
                      {car.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className="border-slate-700 text-slate-400 text-xs"
                    >
                      {car.brand}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">
                    {car.showroomLocation} • {car.deliveryDays} days delivery
                  </p>
                  <p className="text-lg font-bold text-gradient-gold mt-1">
                    {formatPrice(car.price)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <Link href={`/admin/cars/${car.id}/edit`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700 text-slate-300 hover:border-gold hover:text-gold"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(car.id, car.name)}
                    disabled={deletingId === car.id}
                    className="border-slate-700 text-red-400 hover:border-red-500 hover:bg-red-500/10"
                  >
                    {deletingId === car.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
