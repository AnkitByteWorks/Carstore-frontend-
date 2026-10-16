import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/(auth)/register/page";
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
    register: vi.fn(),
  },
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("RegisterPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  });

  it("renders registration form fields correctly", () => {
    render(<RegisterPage />);

    expect(screen.getByRole("heading", { name: /^create account$/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("displays validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });

    expect(authApi.register).not.toHaveBeenCalled();
  });

  it("shows validation error when passwords do not match", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/full name/i), "Lord Sterling");
    await user.type(screen.getByLabelText(/username/i), "sterling");
    await user.type(screen.getByLabelText(/^email$/i), "sterling@luxury.com");
    await user.type(screen.getByLabelText(/^password$/i), "secret123");
    await user.type(screen.getByLabelText(/confirm password/i), "differentpass");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });

    expect(authApi.register).not.toHaveBeenCalled();
  });

  it("successfully registers new collector, stores credentials, and redirects", async () => {
    const user = userEvent.setup();
    const mockAuthResponse = {
      token: "new-user-token-789",
      refreshToken: "new-refresh-token-456",
      type: "Bearer",
      userId: 42,
      username: "sterling",
      email: "sterling@luxury.com",
      roles: ["USER"],
    };

    vi.mocked(authApi.register).mockResolvedValueOnce(mockAuthResponse);

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/full name/i), "Lord Sterling");
    await user.type(screen.getByLabelText(/username/i), "sterling");
    await user.type(screen.getByLabelText(/^email$/i), "sterling@luxury.com");
    await user.type(screen.getByLabelText(/^password$/i), "secret123");
    await user.type(screen.getByLabelText(/confirm password/i), "secret123");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith({
        fullName: "Lord Sterling",
        username: "sterling",
        email: "sterling@luxury.com",
        password: "secret123",
      });
    });

    await waitFor(() => {
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.token).toBe("new-user-token-789");
      expect(state.user?.id).toBe(42);
      expect(toast.success).toHaveBeenCalledWith("Account created! Welcome to Carstore.");
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("handles duplicate registration and displays error message toast", async () => {
    const user = userEvent.setup();
    const axiosError = {
      isAxiosError: true,
      response: {
        data: {
          message: "Username already taken",
        },
      },
    };

    vi.mocked(authApi.register).mockRejectedValueOnce(axiosError);

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/full name/i), "Existing User");
    await user.type(screen.getByLabelText(/username/i), "existinguser");
    await user.type(screen.getByLabelText(/^email$/i), "existing@luxury.com");
    await user.type(screen.getByLabelText(/^password$/i), "secret123");
    await user.type(screen.getByLabelText(/confirm password/i), "secret123");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Username already taken");
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
