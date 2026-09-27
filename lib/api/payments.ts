import { apiClient } from "./client";

export interface PaymentIntentRequest {
  orderId: number;
  paymentMethod?: string;
}

export interface PaymentIntentResponse {
  paymentIntentId: string;
  orderId: number;
  amount: number;
  currency: string;
  clientSecret: string;
  status: string;
  checkoutUrl?: string;
}

export interface PaymentWebhookRequest {
  paymentIntentId: string;
  orderId: number;
  eventType: string;
  signature?: string;
}

export interface PaymentWebhookResponse {
  received: boolean;
  status: string;
}

export const paymentsApi = {
  createIntent: async (orderId: number, paymentMethod: string = "CARD"): Promise<PaymentIntentResponse> => {
    const response = await apiClient.post<PaymentIntentResponse>("/api/payments/create-intent", {
      orderId,
      paymentMethod,
    });
    return response.data;
  },

  triggerWebhook: async (data: PaymentWebhookRequest): Promise<PaymentWebhookResponse> => {
    const response = await apiClient.post<PaymentWebhookResponse>("/api/payments/webhook", data);
    return response.data;
  },
};
