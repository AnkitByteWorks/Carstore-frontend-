import { apiClient } from "./client";
import type { Car } from "@/lib/types/car";
import type { Order, PageResponse } from "./orders";

export interface CarCreateRequest {
  name: string;
  brand: string;
  price: number;
  description?: string;
  colorOptions?: string;
  showroomLocation?: string;
  deliveryDays?: number;
  paymentOptions?: string;
}

export const adminApi = {
  // ─── CAR CRUD ───
  createCar: async (data: CarCreateRequest): Promise<Car> => {
    const response = await apiClient.post("/api/cars", data);
    return response.data;
  },

  updateCar: async (id: number, data: CarCreateRequest): Promise<Car> => {
    const response = await apiClient.put(`/api/cars/${id}`, data);
    return response.data;
  },

  deleteCar: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/cars/${id}`);
  },

  uploadImage: async (id: number, file: File): Promise<Car> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post(`/api/cars/${id}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // ─── ORDERS ───
  getAllOrders: async (params?: {
    page?: number;
    size?: number;
  }): Promise<PageResponse<Order>> => {
    const response = await apiClient.get("/api/orders", { params });
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string): Promise<Order> => {
    const response = await apiClient.put(
      `/api/orders/${id}/status?value=${status}`
    );
    return response.data;
  },
};
