import { apiClient } from "./client";

export interface CustomerInteractionRequest {
  customerIdentifier?: string;
  customerName?: string;
  actionType: string;
  carModel?: string;
  carId?: number;
  eventMetadata?: Record<string, unknown>;
}

export interface CustomerAuditLog {
  id: string;
  customerIdentifier: string;
  customerName: string;
  actionType: string;
  carModel: string;
  carId: number;
  eventMetadata: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
}

export interface VehicleTelemetryLog {
  id: string;
  orderId: number;
  carrierId: string;
  speedKmH: number;
  gForce: number;
  rpm: number;
  cabinTempCelsius: number;
  batteryTempCelsius: number;
  gpsLatitude: number;
  gpsLongitude: number;
  currentWaypoint: string;
  recordedAt: string;
}

export const analyticsApi = {
  logInteraction: async (
    data: CustomerInteractionRequest
  ): Promise<{ status: string; id: string }> => {
    try {
      const response = await apiClient.post<{ status: string; id: string }>(
        "/api/analytics/interaction",
        data
      );
      return response.data;
    } catch {
      // Non-blocking telemetry
      return { status: "FALLBACK_DISPATCHED", id: "" };
    }
  },

  getCustomerAudit: async (customerIdentifier: string): Promise<CustomerAuditLog[]> => {
    const response = await apiClient.get<CustomerAuditLog[]>("/api/analytics/customer-audit", {
      params: { identifier: customerIdentifier },
    });
    return response.data;
  },

  getVehicleTelemetry: async (orderId: number): Promise<VehicleTelemetryLog[]> => {
    const response = await apiClient.get<VehicleTelemetryLog[]>(
      `/api/analytics/telemetry/${orderId}`
    );
    return response.data;
  },
};
