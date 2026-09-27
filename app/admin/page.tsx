"use client";

import { useQuery } from "@tanstack/react-query";
import { carsApi } from "@/lib/api/cars";
import { adminApi } from "@/lib/api/admin";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/format";
import Link from "next/link";
import {
  Car,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { data: carsData } = useQuery({
    queryKey: ["admin-cars"],
    queryFn: () => carsApi.getAll({ page: 0, size: 100 }),
  });

  const { data: ordersData } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => adminApi.getAllOrders({ page: 0, size: 100 }),
  });

  const totalCars = carsData?.totalElements || 0;
  const totalOrders = ordersData?.totalElements || 0;
  const totalRevenue =
    ordersData?.content
      ?.filter((o) => o.status !== "CANCELLED")
      ?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0;

  const stats = [
    {
      label: "Total Cars",
      value: totalCars,
      icon: Car,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "text-gold",
      bg: "bg-gold/10",
    },
    {
      label: "Conversion",
      value: totalCars > 0 ? `${((totalOrders / totalCars) * 100).toFixed(1)}%` : "0%",
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-gold mb-2 tracking-widest uppercase">
          Admin Panel
        </p>
        <h1 className="font-playfair text-4xl font-bold text-white">
          Dashboard
        </h1>
        <p className="text-slate-400 mt-2">
          Manage your luxury car inventory and orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="bg-slate-900 border-slate-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}
                  >
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/cars">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 hover:border-gold/50 transition-all p-8 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-playfair text-2xl font-bold text-white mb-2">
                  Manage Cars
                </h3>
                <p className="text-slate-400 text-sm">
                  Add, edit, delete cars and images
                </p>
              </div>
              <ArrowRight className="h-6 w-6 text-gold group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>

        <Link href="/admin/orders">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 hover:border-gold/50 transition-all p-8 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-playfair text-2xl font-bold text-white mb-2">
                  Manage Orders
                </h3>
                <p className="text-slate-400 text-sm">
                  View orders, update status
                </p>
              </div>
              <ArrowRight className="h-6 w-6 text-gold group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
