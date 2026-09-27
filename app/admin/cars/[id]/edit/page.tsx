"use client";

import { use, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { carsApi } from "@/lib/api/cars";
import { adminApi } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, Save, Upload, Image as ImageIcon } from "lucide-react";
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

export default function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: car, isLoading } = useQuery({
    queryKey: ["car", id],
    queryFn: () => carsApi.getById(Number(id)),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CarForm>({
    resolver: zodResolver(carSchema),
  });

  useEffect(() => {
    if (car) {
      reset({
        name: car.name,
        brand: car.brand,
        price: car.price,
        description: car.description || "",
        colorOptions: car.colorOptions || "",
        showroomLocation: car.showroomLocation,
        deliveryDays: car.deliveryDays,
        paymentOptions: car.paymentOptions || "",
      });
    }
  }, [car, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: CarForm) => adminApi.updateCar(Number(id), data),
    onSuccess: () => {
      toast.success("Car updated!");
      queryClient.invalidateQueries({ queryKey: ["admin-cars-list"] });
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["car", id] });
    },
    onError: (error: unknown) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update";
      toast.error(message);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await adminApi.uploadImage(Number(id), file);
      toast.success("Image uploaded!");
      queryClient.invalidateQueries({ queryKey: ["car", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-cars-list"] });
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Upload failed";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading || !car) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-96 bg-slate-900 rounded-xl" />
      </div>
    );
  }

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
          Edit Car
        </h1>
        <p className="text-slate-400 mt-1">
          Update {car.name}
        </p>
      </div>

      {/* Image Upload */}
      <Card className="bg-slate-900 border-slate-800 p-6">
        <h2 className="font-playfair text-xl font-bold text-white mb-4">
          Car Image
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 aspect-[16/10] rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center">
            {car.hasImage ? (
              <img
                src={carsApi.getImageUrl(car.id)}
                alt={car.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="h-12 w-12 text-slate-600" />
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button
                type="button"
                disabled={isUploading}
                className="gradient-gold text-slate-950 cursor-pointer"
                asChild
              >
                <span>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      {car.hasImage ? "Replace Image" : "Upload Image"}
                    </>
                  )}
                </span>
              </Button>
            </label>
            <p className="text-xs text-slate-500 mt-3">
              JPG, PNG • Max 5MB
            </p>
          </div>
        </div>
      </Card>

      {/* Form */}
      <form
        onSubmit={handleSubmit((data: CarForm) => updateMutation.mutate(data))}
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
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Showroom Location *</Label>
              <Input
                {...register("showroomLocation")}
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
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="gradient-gold text-slate-950 font-semibold h-12 px-8"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
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
