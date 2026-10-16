import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "@/components/layout/navbar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useAuthStore } from "@/lib/store/auth-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { carsApi } from "@/lib/api/cars";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/admin",
}));

// Mock audio
vi.mock("@/lib/utils/audio-feedback", () => ({
  playMechanicalClick: vi.fn(),
}));

// Mock carsApi for CommandSearch
vi.mock("@/lib/api/cars", () => ({
  carsApi: {
    getAll: vi.fn(),
  },
}));

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

describe("Authorization-Sensitive UI States", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
    vi.mocked(carsApi.getAll).mockResolvedValue({ content: [] } as any);
  });

  describe("Navbar Component", () => {
    it("renders Sign In button when unauthenticated", () => {
      renderWithClient(<Navbar />);

      expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
      expect(screen.queryByText(/admin dashboard/i)).not.toBeInTheDocument();
    });

    it("renders user avatar and hides Sign In button when authenticated as standard user", () => {
      useAuthStore.setState({
        token: "user-jwt",
        refreshToken: "user-refresh",
        user: {
          id: 10,
          username: "collector_vip",
          email: "collector@mayfair.luxury",
          roles: ["USER"],
        },
        isAuthenticated: true,
      });

      renderWithClient(<Navbar />);

      expect(screen.queryByRole("button", { name: /sign in/i })).not.toBeInTheDocument();
      // Avatar with initials 'CO'
      expect(screen.getByText("CO")).toBeInTheDocument();
    });

    it("displays Admin Dashboard menu option ONLY for ADMIN role", async () => {
      const user = userEvent.setup();

      useAuthStore.setState({
        token: "admin-jwt",
        refreshToken: "admin-refresh",
        user: {
          id: 1,
          username: "admin_boss",
          email: "admin@luxurycars.com",
          roles: ["ADMIN", "USER"],
        },
        isAuthenticated: true,
      });

      renderWithClient(<Navbar />);

      // Click avatar to open dropdown menu
      const avatarTrigger = screen.getByText("AD");
      await user.click(avatarTrigger);

      expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
    });

    it("does NOT display Admin Dashboard menu option for standard non-admin users", async () => {
      const user = userEvent.setup();

      useAuthStore.setState({
        token: "standard-jwt",
        refreshToken: "standard-refresh",
        user: {
          id: 2,
          username: "regular_joe",
          email: "joe@luxurycars.com",
          roles: ["USER"],
        },
        isAuthenticated: true,
      });

      renderWithClient(<Navbar />);

      const avatarTrigger = screen.getByText("RE");
      await user.click(avatarTrigger);

      expect(screen.queryByText(/admin dashboard/i)).not.toBeInTheDocument();
    });
  });

  describe("AdminSidebar Component", () => {
    it("renders full administrative navigation panel", () => {
      render(<AdminSidebar />);

      expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /cars/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /orders/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /users/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /settings/i })).toBeInTheDocument();
    });
  });
});
