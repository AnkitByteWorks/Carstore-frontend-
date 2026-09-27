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
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) => {
        // Also store in localStorage for axios interceptor
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        set({ token: null, user: null, isAuthenticated: false });
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
