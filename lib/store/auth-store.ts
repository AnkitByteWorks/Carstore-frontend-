"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string | null | undefined, user: User) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      login: (token, refreshToken, user) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
          }
          localStorage.setItem("user", JSON.stringify(user));
        }
        set({
          token,
          refreshToken: refreshToken || null,
          user,
          isAuthenticated: true,
        });
      },

      updateTokens: (accessToken, refreshToken) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
        }
        set({
          token: accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },

      isAdmin: () => {
        const user = get().user;
        return user?.roles?.includes("ADMIN") ?? false;
      },
    }),
    {
      name: "carstore-auth", // localStorage key
    }
  )
);
