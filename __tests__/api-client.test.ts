import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth-store";

vi.mock("axios", async () => {
  const actual = await vi.importActual<typeof import("axios")>("axios");
  const mockAxiosInstance = {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    defaults: { headers: { common: {} } },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };
  return {
    ...actual,
    default: {
      ...actual,
      create: vi.fn(() => mockAxiosInstance),
      post: vi.fn(),
    },
  };
});

describe("API Client & Error Handling Interceptor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useAuthStore.setState({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  });

  it("stores and clears authentication tokens in localStorage and Zustand store", () => {
    const store = useAuthStore.getState();

    // Login action
    store.login("jwt-access-token", "jwt-refresh-token", {
      id: 1,
      username: "testuser",
      email: "test@luxury.com",
      roles: ["USER"],
    });

    expect(localStorage.getItem("token")).toBe("jwt-access-token");
    expect(localStorage.getItem("refreshToken")).toBe("jwt-refresh-token");
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().isAdmin()).toBe(false);

    // Logout action
    useAuthStore.getState().logout();

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("correctly identifies admin roles in auth store", () => {
    const store = useAuthStore.getState();

    store.login("jwt-token", "jwt-refresh", {
      id: 2,
      username: "admin_user",
      email: "admin@luxury.com",
      roles: ["ADMIN", "USER"],
    });

    expect(useAuthStore.getState().isAdmin()).toBe(true);
  });

  it("updates tokens without clearing user profile", () => {
    const store = useAuthStore.getState();

    store.login("old-token", "old-refresh", {
      id: 10,
      username: "vip_client",
      email: "vip@luxury.com",
      roles: ["USER"],
    });

    store.updateTokens("new-rotated-token", "new-rotated-refresh");

    expect(localStorage.getItem("token")).toBe("new-rotated-token");
    expect(localStorage.getItem("refreshToken")).toBe("new-rotated-refresh");
    expect(useAuthStore.getState().user?.username).toBe("vip_client");
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
