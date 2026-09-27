import axios from "axios";
import { apiClient } from "./client";
import { API_BASE_URL } from "./config";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  type: string;
  userId: number;
  username: string;
  email: string;
  roles: string[];
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId?: number;
  username?: string;
  email?: string;
  roles?: string[];
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/api/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/api/auth/register", data);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<TokenRefreshResponse> => {
    // Direct call with axios to avoid circular interceptor handling
    const response = await axios.post<TokenRefreshResponse>(
      `${API_BASE_URL}/api/auth/refresh`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  },

  logout: async (refreshToken?: string | null): Promise<void> => {
    if (!refreshToken) return;
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        { refreshToken },
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      console.warn("Backend logout notification failed:", err);
    }
  },
};
