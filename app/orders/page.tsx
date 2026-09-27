"use client";

import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";
import { useAuthStore } from "@/lib/store/auth-store";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils/format";
import { getCarFallbackImage } from "@/lib/utils/car-images";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { DownloadInvoiceButton } from "@/components/orders/download-invoice-button";

export default function MyOrdersPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders", user?.email],
    queryFn: () => ordersApi.getMyOrders(user!.email),
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const statusColors = {
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <p className="text-sm font-medium text-gold mb-2 tracking-widest uppercase">
            Account
          </p>
          <h1 className="font-playfair text-4xl font-bold text-white">
            My Orders
          </h1>
          <p className="text-slate-400 mt-2">
            Track all your luxury car purchases
          </p>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 bg-slate-900 rounded-xl" />
            ))}
          </div>
        )}

        {orders && orders.length === 0 && (
          <Card className="bg-slate-900 border-slate-800 p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-slate-600" />
            </div>
            <h2 className="font-playfair text-2xl font-bold text-white mb-2">
              No orders yet
            </h2>
            <p className="text-slate-400 mb-6">
              Start your luxury journey by browsing our collection
            </p>
            <Link href="/cars">
              <Button className="gradient-gold text-slate-950">
                Browse Cars
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Card>
        )}

        {orders && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/orders/${order.id}`}>
                  <Card className="bg-slate-900 border-slate-800 hover:border-gold/50 transition-all duration-300 overflow-hidden cursor-pointer group">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-48 aspect-[16/10] md:aspect-square overflow-hidden bg-slate-800 flex-shrink-0">
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
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-playfair text-lg font-bold text-white group-hover:text-gold transition">
                              {order.carName}
                            </h3>
                            <Badge
                              className={
                                statusColors[order.status] +
                                " border text-xs px-3 py-1 flex-shrink-0"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">
                            Order #{order.id} •{" "}
                            {new Date(order.orderedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-end justify-between gap-3 mt-4 pt-3 border-t border-slate-800/60">
                          <div>
                            <p className="text-xs text-slate-500 uppercase">
                              Total Amount
                            </p>
                            <p className="text-xl font-bold text-gradient-gold">
                              {formatPrice(order.totalAmount)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <DownloadInvoiceButton
                              orderId={order.id}
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs border-slate-700 hover:border-gold text-slate-300 hover:text-gold"
                            />
                            <span className="text-xs text-gold flex items-center gap-1 font-medium">
                              View Details
                              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
