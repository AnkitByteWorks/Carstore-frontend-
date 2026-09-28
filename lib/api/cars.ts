import { apiClient } from "./client";
import type { Car, PageResponse } from "@/lib/types/car";

export const carsApi = {
  // Get paginated cars
  getAll: async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: string;
  }): Promise<PageResponse<Car>> => {
    const { data } = await apiClient.get("/api/cars", { params });
    return data;
  },

  // Get single car
  getById: async (id: number): Promise<Car> => {
    const { data } = await apiClient.get(`/api/cars/${id}`);
    return data;
  },

  // Get featured (top 5 expensive)
  getFeatured: async (): Promise<Car[]> => {
    const { data } = await apiClient.get("/api/cars/featured");
    return data;
  },

  // Advanced search with multiple filters
  search: async (
    params:
      | {
          keyword?: string;
          brand?: string;
          minPrice?: number;
          maxPrice?: number;
          location?: string;
        }
      | string
  ): Promise<Car[]> => {
    const queryParams = typeof params === "string" ? { keyword: params } : params;
    const { data } = await apiClient.get("/api/cars/search", { params: queryParams });
    return data;
  },

  // Filter by brand
  getByBrand: async (brand: string): Promise<Car[]> => {
    const { data } = await apiClient.get("/api/cars/brand", {
      params: { name: brand },
    });
    return data;
  },

  // Filter by price range
  getByPrice: async (min: number, max: number): Promise<Car[]> => {
    const { data } = await apiClient.get("/api/cars/price", {
      params: { min, max },
    });
    return data;
  },

  // Filter by location
  getByLocation: async (city: string): Promise<Car[]> => {
    const { data } = await apiClient.get("/api/cars/location", {
      params: { city },
    });
    return data;
  },

  // Get trending cars (backed by Redis Sorted Sets)
  getTrending: async (): Promise<Car[]> => {
    const { data } = await apiClient.get("/api/cars/trending");
    return data;
  },

  // Record a view for analytics & trending score in Redis
  recordView: async (id: number): Promise<void> => {
    await apiClient.post(`/api/cars/${id}/view`);
  },

  // Image URL helper
  getImageUrl: (id: number): string => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://project-luxury-carstore-production.up.railway.app"
        : "http://localhost:8080");
    return `${baseUrl}/api/cars/${id}/image`;
  },
};