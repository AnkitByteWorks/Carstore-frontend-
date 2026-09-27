"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import axios from "axios";

const carSchema = z.object({
  name: z.string().min(2, "Name required"),
  brand: z.string().min(1, "Brand required"),
  price: z.number().min(1, "Price must be > 0"),
  description: z.string().optional(),
  colorOptions: z.string().optional(),
  showroomLocation: z.string().min(1, "Location required"),
  deliveryDays: z.number().min(1, "Delivery days required"),
  paymentOptions: z.string().optional(),
});

type CarForm = z.infer<typeof carSchema>;

export default function NewCarPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CarForm>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      deliveryDays: 30,
      paymentOptions: "Bank Transfer, EMI, Crypto",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CarForm) => adminApi.createCar(data),
    onSuccess: (car) => {
      toast.success("Car created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-cars-list"] });
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      router.push(`/admin/cars/${car.id}/edit`);
    },
    onError: (error: unknown) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to create car";
      toast.error(message);
    },
  });

  return (
    <div className="space-y-6">
      <Link
        href="/admin/cars"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-gold transition text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cars
      </Link>

      <div>
        <h1 className="font-playfair text-3xl font-bold text-white">
          Add New Car
        </h1>
        <p className="text-slate-400 mt-1">
          Fill in the details below to add a car to inventory
        </p>
      </div>

      <form
        onSubmit={handleSubmit((data: CarForm) => mutation.mutate(data))}
        className="space-y-6"
      >
        <Card className="bg-slate-900 border-slate-800 p-6 space-y-5">
          <h2 className="font-playfair text-xl font-bold text-white">
            Basic Info
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Car Name *</Label>
              <Input
                {...register("name")}
                placeholder="Porsche 911 Turbo S"
                className="bg-slate-950 border-slate-800 text-white"
              />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Brand *</Label>
              <Input
                {...register("brand")}
                placeholder="Porsche"
                className="bg-slate-950 border-slate-800 text-white"
              />
              {errors.brand && (
                <p className="text-xs text-red-400">{errors.brand.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Price (INR) *</Label>
            <Input
              {...register("price", { valueAsNumber: true })}
              type="number"
              placeholder="28500000"
              className="bg-slate-950 border-slate-800 text-white"
            />
            {errors.price && (
              <p className="text-xs text-red-400">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Description</Label>
            <Textarea
              {...register("description")}
              placeholder="Iconic German sports car..."
              className="bg-slate-950 border-slate-800 text-white min-h-[100px]"
            />
          </div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-6 space-y-5">
          <h2 className="font-playfair text-xl font-bold text-white">
            Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Color Options</Label>
              <Input
                {...register("colorOptions")}
                placeholder="Red, Black, Silver"
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Showroom Location *</Label>
              <Input
                {...register("showroomLocation")}
                placeholder="Mumbai"
                className="bg-slate-950 border-slate-800 text-white"
              />
              {errors.showroomLocation && (
                <p className="text-xs text-red-400">
                  {errors.showroomLocation.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Delivery Days *</Label>
              <Input
                {...register("deliveryDays", { valueAsNumber: true })}
                type="number"
                className="bg-slate-950 border-slate-800 text-white"
              />
              {errors.deliveryDays && (
                <p className="text-xs text-red-400">
                  {errors.deliveryDays.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Payment Options</Label>
              <Input
                {...register("paymentOptions")}
                placeholder="Bank Transfer, EMI"
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="gradient-gold text-slate-950 font-semibold h-12 px-8"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Car
              </>
            )}
          </Button>
          <Link href="/admin/cars">
            <Button
              type="button"
              variant="outline"
              className="border-slate-800 text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
