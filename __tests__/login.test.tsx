import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/(auth)/login/page";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { toast } from "sonner";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock authApi
vi.mock("@/lib/api/auth", () => ({
  authApi: {
    login: vi.fn(),
  },
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("LoginPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  });

  it("renders login form elements with username and password inputs", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("displays validation error messages when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const submitBtn = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    expect(authApi.login).not.toHaveBeenCalled();
  });

  it("successfully logs in, updates auth store, and redirects to home", async () => {
    const user = userEvent.setup();
    const mockAuthResponse = {
      token: "mock-jwt-token-xyz",
      refreshToken: "mock-refresh-token-abc",
      type: "Bearer",
      userId: 1,
      username: "sterling",
      email: "sterling@mayfair.luxury",
      roles: ["USER"],
    };

    vi.mocked(authApi.login).mockResolvedValueOnce(mockAuthResponse);

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/username/i), "sterling");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        username: "sterling",
        password: "secret123",
      });
    });

    await waitFor(() => {
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.token).toBe("mock-jwt-token-xyz");
      expect(state.user?.username).toBe("sterling");
      expect(toast.success).toHaveBeenCalledWith("Welcome back, sterling!");
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("handles login failure and displays error toast notification", async () => {
    const user = userEvent.setup();
    const axiosError = {
      isAxiosError: true,
      response: {
        data: {
          message: "Bad credentials. Invalid username or password.",
        },
      },
    };

    vi.mocked(authApi.login).mockRejectedValueOnce(axiosError);

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/username/i), "wronguser");
    await user.type(screen.getByLabelText(/password/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
