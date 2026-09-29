"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { carsApi } from "@/lib/api/cars";
import { ordersApi } from "@/lib/api/orders";
import { useAuthStore } from "@/lib/store/auth-store";
import { toast } from "sonner";
import { getCarFallbackImage } from "@/lib/utils/car-images";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { motion } from "framer-motion";
import Link from "next/link";
import { paymentsApi, type PaymentIntentResponse } from "@/lib/api/payments";
import { LuxuryPaymentModal } from "@/components/checkout/luxury-payment-modal";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email required"),
  customerPhone: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Phone must be 10-15 digits"),
  deliveryAddress: z.string().min(10, "Full address required"),
  deliveryCity: z.string().min(2, "City required"),
  deliveryPincode: z.string().min(5, "Pincode required"),
  paymentMethod: z.string().min(1, "Choose payment method"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

function CheckoutContent({
  params,
}: {
  params: Promise<{ carId: string }>;
}) {
  const { carId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentResponse | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const customPriceParam = searchParams.get("customPrice");
  const optionsParam = searchParams.get("options");
  const customPrice = customPriceParam ? Number(customPriceParam) : null;
  const bespokeOptions = optionsParam ? optionsParam.split(", ").filter(Boolean) : [];

  const { data: car, isLoading } = useQuery({
    queryKey: ["car", carId],
    queryFn: () => carsApi.getById(Number(carId)),
  });

  const displayPrice = customPrice || (car ? car.price : 0);
  const bespokeUpgradeCost = customPrice && car ? Math.max(0, customPrice - car.price) : 0;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    mode: "onSubmit",
    defaultValues: {
      customerEmail: user?.email || "",
      customerName: user?.username || "",
      paymentMethod: "",
    },
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to place an order");
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    try {
      const finalAddress = bespokeOptions.length > 0
        ? `${data.deliveryAddress} [Bespoke Spec: ${optionsParam}]`
        : data.deliveryAddress;

      const order = await ordersApi.placeOrder({
        carId: Number(carId),
        quantity: 1,
        ...data,
        deliveryAddress: finalAddress,
      });

      toast.success("Order placed successfully! Initializing luxury payment...");

      // Sandbox Luxury Payment Intent creation
      try {
        const intent = await paymentsApi.createIntent(order.id, data.paymentMethod || "CARD");
        setPaymentIntent(intent);
        setCreatedOrderId(order.id);
        setShowPaymentModal(true);
      } catch (paymentErr) {
        console.warn("Payment intent initialization skipped:", paymentErr);
        router.push(`/orders/${order.id}`);
      }
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to place order";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-20">
          <Skeleton className="h-96 w-full bg-slate-900 rounded-2xl" />
        </div>
      </main>
    );
  }

  if (!car) {
    return (
      <main className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="font-playfair text-3xl text-white">Car not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href={`/cars/${carId}`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-gold transition mb-6 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to car details
        </Link>

        <div className="mb-8">
          <p className="text-sm font-medium text-gold mb-2 tracking-widest uppercase">
            Secure Checkout
          </p>
          <h1 className="font-playfair text-4xl font-bold text-white">
            Complete Your Order
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form (3/5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Customer Info */}
              <Card className="bg-slate-900 border-slate-800 p-6">
                <h2 className="font-playfair text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-gold" />
                  Customer Information
                </h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Full Name</Label>
                    <Input
                      {...register("customerName")}
                      placeholder="Ankit Sharma"
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                    {errors.customerName && (
                      <p className="text-xs text-red-400">
                        {errors.customerName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          {...register("customerEmail")}
                          type="email"
                          placeholder="ankit@example.com"
                          className="pl-10 bg-slate-950 border-slate-800 text-white"
                        />
                      </div>
                      {errors.customerEmail && (
                        <p className="text-xs text-red-400">
                          {errors.customerEmail.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          {...register("customerPhone")}
                          placeholder="9876543210"
                          className="pl-10 bg-slate-950 border-slate-800 text-white"
                        />
                      </div>
                      {errors.customerPhone && (
                        <p className="text-xs text-red-400">
                          {errors.customerPhone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Delivery Address */}
              <Card className="bg-slate-900 border-slate-800 p-6">
                <h2 className="font-playfair text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gold" />
                  Delivery Address
                </h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Full Address</Label>
                    <Input
                      {...register("deliveryAddress")}
                      placeholder="123 Marine Drive, Apartment 4B"
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                    {errors.deliveryAddress && (
                      <p className="text-xs text-red-400">
                        {errors.deliveryAddress.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">City</Label>
                      <Input
                        {...register("deliveryCity")}
                        placeholder="Mumbai"
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                      {errors.deliveryCity && (
                        <p className="text-xs text-red-400">
                          {errors.deliveryCity.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Pincode</Label>
                      <Input
                        {...register("deliveryPincode")}
                        placeholder="400001"
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                      {errors.deliveryPincode && (
                        <p className="text-xs text-red-400">
                          {errors.deliveryPincode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="bg-slate-900 border-slate-800 p-6">
                <h2 className="font-playfair text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-gold" />
                  Payment Method
                </h2>

                <div className="space-y-2">
                  <Label className="text-slate-300">Choose an option</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={(v) => setValue("paymentMethod", v)}
                  >
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      {(car.paymentOptions ? car.paymentOptions.split(",") : []).map((pm, i) => (
                        <SelectItem key={i} value={pm.trim()}>
                          {pm.trim()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && (
                    <p className="text-xs text-red-400">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-4">
                  🔒 Your payment information is secure. No payment will be
                  charged until order confirmation.
                </p>
              </Card>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full gradient-gold text-slate-950 hover:opacity-90 font-semibold h-14 text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Placing order...
                  </>
                ) : (
                  <>Place Order — {formatPrice(displayPrice)}</>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Order Summary (2/5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-900 border-slate-800 overflow-hidden sticky top-24">
              <div className="aspect-[16/10] overflow-hidden bg-slate-800">
                <img
                  src={
                    car.brand?.toLowerCase() === "bugatti" || car.name?.toLowerCase().includes("chiron")
                      ? getCarFallbackImage(car.id, car.brand)
                      : (car.imageUrl && !car.imageUrl.includes("localhost") && !car.imageUrl.includes("placeholder")
                          ? car.imageUrl
                          : getCarFallbackImage(car.id, car.brand))
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

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-playfair text-xl font-bold text-white">
                    {car.name}
                  </h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                    {car.brand}
                  </p>
                </div>

                <Separator className="bg-slate-800" />

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Price</span>
                    <span className="text-white font-medium">
                      {formatPrice(car.price)}
                    </span>
                  </div>

                  {bespokeUpgradeCost > 0 && (
                    <div className="flex justify-between text-gold">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Sparkles className="h-3.5 w-3.5" />
                        Bespoke Customization
                      </span>
                      <span className="font-semibold">
                        +{formatPrice(bespokeUpgradeCost)}
                      </span>
                    </div>
                  )}

                  {bespokeOptions.length > 0 && (
                    <div className="pt-1 pb-1">
                      <p className="text-xs text-slate-400 mb-1.5">Configured Options:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {bespokeOptions.map((opt, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20"
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-slate-400">White-Glove Delivery</span>
                    <span className="text-emerald-400 font-medium">
                      Complimentary
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Estimated Delivery
                    </span>
                    <span className="text-slate-300 text-xs">
                      {car.deliveryDays} business days ({car.showroomLocation})
                    </span>
                  </div>
                </div>

                <Separator className="bg-slate-800" />

                <div className="flex justify-between items-center pt-2">
                  <div>
                    <span className="text-slate-400">Total Investment</span>
                    {bespokeUpgradeCost > 0 && (
                      <p className="text-[10px] text-gold font-mono">Bespoke Spec Included</p>
                    )}
                  </div>
                  <span className="text-2xl font-bold text-gradient-gold">
                    {formatPrice(displayPrice)}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {paymentIntent && createdOrderId && (
        <LuxuryPaymentModal
          open={showPaymentModal}
          onOpenChange={(isOpen) => {
            setShowPaymentModal(isOpen);
            if (!isOpen) {
              router.push(`/orders/${createdOrderId}`);
            }
          }}
          intent={paymentIntent}
          orderId={createdOrderId}
          onSuccess={() => {
            // modal handles redirect to orders
          }}
        />
      )}

      <Footer />
    </main>
  );
}

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ carId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-gold animate-spin" />
        </main>
      }
    >
      <CheckoutContent params={params} />
    </Suspense>
  );
}
