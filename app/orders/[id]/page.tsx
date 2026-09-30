"use client";

import { use, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi, type Order, type OrderStatusType } from "@/lib/api/orders";
import { paymentsApi, type PaymentIntentResponse } from "@/lib/api/payments";
import { useOrderEvents } from "@/lib/hooks/use-order-events";
import { OrderTrackingStepper } from "@/components/orders/order-tracking-stepper";
import { EnclosedCarrierMap } from "@/components/orders/enclosed-carrier-map";
import { BespokeKeyPresentationBox } from "@/components/orders/bespoke-key-presentation-box";
import { DownloadInvoiceButton } from "@/components/orders/download-invoice-button";
import { LuxuryPaymentModal } from "@/components/checkout/luxury-payment-modal";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils/format";
import { getCarFallbackImage } from "@/lib/utils/car-images";
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
  Printer,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const orderId = Number(id);

  const [currentStatus, setCurrentStatus] = useState<OrderStatusType>("PENDING");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentResponse | null>(null);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.getById(orderId),
    enabled: !!id,
  });

  // Sync initial status from fetch
  useEffect(() => {
    if (order?.status) {
      setCurrentStatus(order.status);
    }
  }, [order?.status]);

  // Connect to SSE stream: GET http://localhost:8080/api/orders/{id}/events
  const { isConnected } = useOrderEvents({
    orderId,
    enabled: !!orderId,
    onStatusUpdate: (updatedOrder: Order) => {
      if (updatedOrder.status) {
        setCurrentStatus(updatedOrder.status);
        queryClient.setQueryData(["order", id], updatedOrder);
        toast.info(`🔔 Order Status Update: ${updatedOrder.status}`, {
          description: `Live update received for Order #${orderId}`,
        });
      }
    },
  });

  const handleOpenPayment = async () => {
    setIsInitializingPayment(true);
    try {
      const intent = await paymentsApi.createIntent(orderId, order?.paymentMethod || "CARD");
      setPaymentIntent(intent);
      setShowPaymentModal(true);
    } catch (err: unknown) {
      toast.error("Failed to initialize payment gateway. Please try again.");
    } finally {
      setIsInitializingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <Skeleton className="h-96 w-full bg-slate-900 rounded-2xl" />
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="font-playfair text-3xl text-white">Order not found</h1>
        </div>
      </main>
    );
  }

  const statusColors: Record<OrderStatusType, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    PROCESSING: "bg-amber-500/20 text-amber-400 border-amber-500/50",
    CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    SHIPPED: "bg-purple-500/20 text-purple-400 border-purple-500/50",
    DELIVERED: "bg-green-500/20 text-green-400 border-green-500/50",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/50",
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <span className="text-xs uppercase tracking-widest text-gold font-semibold">
            Order Reference #{order.id}
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white mt-1">
            {currentStatus === "CONFIRMED"
              ? "Order Confirmed & Allocated"
              : currentStatus === "DELIVERED"
              ? "Vehicle Handed Over"
              : currentStatus === "CANCELLED"
              ? "Order Cancelled"
              : "Order Placed Successfully"}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Thank you for choosing Carstore. Live tracking updates are active below.
          </p>
        </motion.div>

        {/* Real-time SSE Live Order Tracking Stepper */}
        <OrderTrackingStepper status={currentStatus} isConnected={isConnected} />

        {/* Pending Payment Callout (if order is still PENDING) */}
        {currentStatus === "PENDING" && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Sandbox Payment Ready</span>
              </div>
              <p className="text-sm font-medium text-white mt-0.5">
                Complete your checkout simulation to trigger immediate vehicle allocation
              </p>
              <p className="text-xs text-slate-400">
                Amount payable: <span className="text-gold font-semibold">{formatPrice(order.totalAmount)}</span>
              </p>
            </div>
            <Button
              onClick={handleOpenPayment}
              disabled={isInitializingPayment}
              className="gradient-gold text-slate-950 font-bold px-6 shadow-md shadow-gold/20 flex-shrink-0"
            >
              {isInitializingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Now (Sandbox)
                </>
              )}
            </Button>
          </div>
        )}

        {/* Order Details Card */}
        <Card className="bg-slate-900 border-slate-800 overflow-hidden">
          {/* Vehicle Header */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="aspect-[16/10] md:aspect-auto overflow-hidden bg-slate-800">
              <img
                src={
                  order.carImageUrl
                    ? `${process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "production" ? "https://project-luxury-carstore-production.up.railway.app" : "http://localhost:8080")}${order.carImageUrl}`
                    : getCarFallbackImage(order.carId)
                }
                alt={order.carName}
                onError={(e) => {
                  const fallback = getCarFallbackImage(order.carId);
                  if (e.currentTarget.src !== fallback) {
                    e.currentTarget.src = fallback;
                  }
                }}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 md:col-span-2 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-playfair text-2xl font-bold text-white">
                      {order.carName}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Placed on{" "}
                      {new Date(order.orderedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge
                    className={`${statusColors[currentStatus]} border text-xs px-3 py-1 font-semibold`}
                  >
                    {currentStatus}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 uppercase">Unit Price</span>
                    <p className="text-white font-medium">{formatPrice(order.unitPrice)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase">Quantity</span>
                    <p className="text-white font-medium">{order.quantity}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase">Transit Logistics</span>
                    <p className="text-white font-medium">Free Covered Transport</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase">Total Settled</span>
                    <p className="text-xl font-bold text-gradient-gold">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-800" />

          {/* Delivery & Customer Info Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-gold" />
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Client Concierge
                </h3>
              </div>
              <p className="text-white font-medium">{order.customerName}</p>
              <p className="text-xs text-slate-400 mt-0.5">{order.customerEmail}</p>
              <p className="text-xs text-slate-400">{order.customerPhone}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gold" />
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Delivery Destination
                </h3>
              </div>
              <p className="text-white font-medium">{order.deliveryAddress}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {order.deliveryCity} — {order.deliveryPincode}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-gold" />
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Payment Method
                </h3>
              </div>
              <p className="text-white font-medium">{order.paymentMethod}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Updated {new Date(order.updatedAt).toLocaleTimeString("en-IN")}
              </p>
            </div>
          </div>
        </Card>

        {/* Handcrafted Bespoke Presentation Box & Monogrammed Key Fob */}
        <BespokeKeyPresentationBox
          carName={order.carName}
          carBrand={order.carName.split(" ")[0]}
          clientName={order.customerName}
          monogramText={order.monogramText || order.customerName.split(" ").map((w) => w[0]).join("") || "CS"}
          orderId={order.id}
          carImage={order.carImageUrl || `/cars/${order.carName}.jpg`}
        />

        {/* Live GPS Enclosed Carrier Radar */}
        <EnclosedCarrierMap
          orderId={order.id}
          deliveryCity={order.deliveryCity}
          status={currentStatus}
        />

        {/* Primary Actions: Download PDF Tax Invoice */}
        <div className="space-y-4 print:hidden">
          <DownloadInvoiceButton
            orderId={order.id}
            variant="default"
            size="lg"
            className="w-full gradient-gold text-slate-950 font-bold h-13 text-base shadow-xl shadow-gold/10 hover:opacity-90"
            label="📄 Download Tax Invoice (PDF)"
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/orders" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-slate-700 text-slate-300 hover:border-gold hover:text-gold h-11"
              >
                <Package className="mr-2 h-4 w-4" />
                View All Orders
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={() => window.print()}
              className="flex-1 border-slate-800 text-slate-400 hover:text-white h-11"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>

            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-slate-800 text-slate-400 hover:text-white h-11"
              >
                <Home className="mr-2 h-4 w-4" />
                Return to Showroom
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Luxury Payment Modal */}
      {paymentIntent && (
        <LuxuryPaymentModal
          open={showPaymentModal}
          onOpenChange={setShowPaymentModal}
          intent={paymentIntent}
          orderId={orderId}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["order", id] });
          }}
        />
      )}

      <Footer />
    </main>
  );
}
