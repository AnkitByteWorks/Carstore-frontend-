import { apiClient } from "./client";

export interface TestDriveRequest {
  carId: number;
  customerName: string;
  phone: string;
  email: string;
  preferredDate: string; // YYYY-MM-DD
  timeSlot: string;
  experienceType: "SHOWROOM" | "DOORSTEP";
  notes?: string;
}

export interface TestDriveResponse {
  id: number;
  carId: number;
  carName: string;
  carBrand: string;
  customerName: string;
  phone: string;
  email: string;
  preferredDate: string;
  timeSlot: string;
  experienceType: "SHOWROOM" | "DOORSTEP";
  referenceCode: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export const testDrivesApi = {
  book: async (data: TestDriveRequest): Promise<TestDriveResponse> => {
    const response = await apiClient.post<TestDriveResponse>("/api/test-drives", data);
    return response.data;
  },

  getByReferenceCode: async (referenceCode: string): Promise<TestDriveResponse> => {
    const response = await apiClient.get<TestDriveResponse>(`/api/test-drives/ref/${referenceCode}`);
    return response.data;
  },
};
