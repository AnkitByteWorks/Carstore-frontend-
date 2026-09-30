import { apiClient } from "./client";

export type ExperienceType = "SHOWROOM" | "DOORSTEP" | "TRACK";

export type TestDriveStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CONCIERGE_ASSIGNED"
  | "CARRIER_DISPATCHED"
  | "COMPLETED"
  | "CANCELLED";

export interface TestDriveRequest {
  carId: number;
  customerName: string;
  phone: string;
  email: string;
  preferredDate: string; // YYYY-MM-DD
  timeSlot: string;
  experienceType: ExperienceType;
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
  experienceType: ExperienceType;
  referenceCode: string;
  status: TestDriveStatus;
  createdAt: string;
}

export interface TrackingStep {
  stepNumber: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
  timestamp: string | null;
}

export interface ConciergeInfo {
  name: string;
  title: string;
  phone: string;
  badge: string;
}

export interface LogisticsInfo {
  carrierId: string;
  transporterType: string;
  driverName: string;
  currentCheckpoint: string;
  climateControlTemp: string;
  estimatedArrival: string;
}

export interface TestDriveTrackingDTO {
  referenceCode: string;
  carId: number;
  carName: string;
  carBrand: string;
  customerName: string;
  preferredDate: string;
  timeSlot: string;
  experienceType: string;
  currentStatus: TestDriveStatus;
  currentStep: number;
  steps: TrackingStep[];
  concierge: ConciergeInfo;
  logistics: LogisticsInfo;
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

  getTracking: async (referenceCode: string): Promise<TestDriveTrackingDTO> => {
    const response = await apiClient.get<TestDriveTrackingDTO>(`/api/test-drives/${referenceCode}/tracking`);
    return response.data;
  },
};
