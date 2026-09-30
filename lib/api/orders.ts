import { apiClient } from "./client";

export interface OrderRequest {
  carId: number;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPincode: string;
  paymentMethod: string;
  monogramText?: string;
  monogramColor?: string;
}

export type OrderStatusType =
  | "PENDING"
  | "PROCESSING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface Order {
  id: number;
  carId: number;
  carName: string;
  carImageUrl: string | null;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPincode: string;
  paymentMethod: string;
  monogramText?: string;
  monogramColor?: string;
  status: OrderStatusType;
  orderedAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const ordersApi = {
  placeOrder: async (data: OrderRequest): Promise<Order> => {
    const response = await apiClient.post("/api/orders", data);
    return response.data;
  },

  getAll: async (params?: {
    page?: number;
    size?: number;
  }): Promise<PageResponse<Order>> => {
    const response = await apiClient.get("/api/orders", { params });
    return response.data;
  },

  getById: async (id: number): Promise<Order> => {
    const response = await apiClient.get(`/api/orders/${id}`);
    return response.data;
  },

  getMyOrders: async (email: string): Promise<Order[]> => {
    const response = await apiClient.get("/api/orders/customer", {
      params: { email },
    });
    return response.data;
  },

  cancel: async (id: number): Promise<Order> => {
    const response = await apiClient.put(`/api/orders/${id}/cancel`);
    return response.data;
  },

  downloadInvoice: async (id: number): Promise<void> => {
    const response = await apiClient.get(`/api/orders/${id}/invoice`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `Carstore-Invoice-ORD-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },
};
