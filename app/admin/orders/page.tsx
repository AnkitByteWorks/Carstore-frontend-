"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import type { Order } from "@/lib/api/orders";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils/format";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import axios from "axios";

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  SHIPPED: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  DELIVERED: "bg-green-500/20 text-green-400 border-green-500/50",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/50",
};

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders-list"],
    queryFn: () => adminApi.getAllOrders({ page: 0, size: 100 }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminApi.updateOrderStatus(id, status),
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-orders-list"] });
    },
    onError: (error: unknown) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update";
      toast.error(message);
    },
  });

  const handleStatusChange = (id: number, status: string) => {
    setUpdatingId(id);
    updateMutation.mutate(
      { id, status },
      { onSettled: () => setUpdatingId(null) }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-bold text-white">
          Orders
        </h1>
        <p className="text-slate-400 mt-1">
          {data?.totalElements || 0} orders total
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 bg-slate-900 rounded-xl" />
          ))}
        </div>
      )}

      {data?.content && data.content.length === 0 && (
        <Card className="bg-slate-900 border-slate-800 p-12 text-center">
          <p className="text-slate-400">No orders yet</p>
        </Card>
      )}

      {data?.content && data.content.length > 0 && (
        <div className="space-y-3">
          {data.content.map((order: Order) => (
            <Card
              key={order.id}
              className="bg-slate-900 border-slate-800 p-5"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-playfair text-lg font-bold text-white truncate">
                      #{order.id} — {order.carName}
                    </h3>
                    <Badge
                      className={`${statusColors[order.status]} border text-xs`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">
                    {order.customerName} • {order.customerEmail}
                  </p>
                  <p className="text-sm text-slate-500">
                    {order.deliveryCity} — {order.deliveryPincode}
                  </p>
                  <p className="text-lg font-bold text-gradient-gold mt-2">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <Select
                    value={order.status}
                    onValueChange={(v) => handleStatusChange(order.id, v)}
                    disabled={updatingId === order.id}
                  >
                    <SelectTrigger className="w-[160px] bg-slate-950 border-slate-800 text-white">
                      {updatingId === order.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <SelectValue />
                      )}
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
