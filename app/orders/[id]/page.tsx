"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils/format";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Package,
  MapPin,
  User,
  CreditCard,
  ArrowRight,
  Home,
} from "lucide-react";

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20">
          <Skeleton className="h-96 w-full bg-slate-900 rounded-2xl" />
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="font-playfair text-3xl text-white">Order not found</h1>
        </div>
      </main>
    );
  }

  const statusColors = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    SHIPPED: "bg-purple-500/20 text-purple-400 border-purple-500/50",
    DELIVERED: "bg-green-500/20 text-green-400 border-green-500/50",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/50",
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="font-playfair text-4xl font-bold text-white mb-3">
            Order Confirmed!
          </h1>
          <p className="text-slate-400">
            Thank you for your purchase. Order #{order.id}
          </p>
        </motion.div>

        <Card className="bg-slate-900 border-slate-800 overflow-hidden">
          {/* Image */}
          {order.carImageUrl && (
            <div className="aspect-[16/9] overflow-hidden bg-slate-800">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${order.carImageUrl}`}
                alt={order.carName}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Car + Status */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-white">
                  {order.carName}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Order placed on{" "}
                  {new Date(order.orderedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <Badge
                className={
                  statusColors[order.status] + " border text-xs px-3 py-1"
                }
              >
                {order.status}
              </Badge>
            </div>

            <Separator className="bg-slate-800" />

            {/* Price breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Unit Price</span>
                <span className="text-white">
                  {formatPrice(order.unitPrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Quantity</span>
                <span className="text-white">{order.quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Delivery</span>
                <span className="text-white">Free</span>
              </div>
              <Separator className="bg-slate-800 my-2" />
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-300 font-medium">Total</span>
                <span className="text-2xl font-bold text-gradient-gold">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

            <Separator className="bg-slate-800" />

            {/* Details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-gold" />
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                    Customer
                  </h3>
                </div>
                <p className="text-white font-medium">{order.customerName}</p>
                <p className="text-sm text-slate-500">
                  {order.customerEmail}
                </p>
                <p className="text-sm text-slate-500">
                  {order.customerPhone}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-gold" />
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                    Delivery
                  </h3>
                </div>
                <p className="text-white">{order.deliveryAddress}</p>
                <p className="text-sm text-slate-500">
                  {order.deliveryCity} — {order.deliveryPincode}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-4 w-4 text-gold" />
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                    Payment
                  </h3>
                </div>
                <p className="text-white">{order.paymentMethod}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-gold" />
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </h3>
                </div>
                <p className="text-white">{order.status}</p>
                <p className="text-sm text-slate-500">
                  Last updated{" "}
                  {new Date(order.updatedAt).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/orders" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-gold text-gold hover:bg-gold hover:text-slate-950"
            >
              View My Orders
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-slate-800 text-slate-400 hover:border-gold hover:text-gold"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
