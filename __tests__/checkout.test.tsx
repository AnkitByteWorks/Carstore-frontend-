import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CheckoutPage from "@/app/checkout/[carId]/page";
import { ordersApi } from "@/lib/api/orders";
import { carsApi } from "@/lib/api/cars";
import { paymentsApi, type PaymentIntentResponse } from "@/lib/api/payments";
import { useAuthStore } from "@/lib/store/auth-store";
import { toast } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: (_key: string) => null,
  }),
}));

// Mock APIs
vi.mock("@/lib/api/orders", () => ({
  ordersApi: {
    placeOrder: vi.fn(),
  },
}));

vi.mock("@/lib/api/cars", () => ({
  carsApi: {
    getById: vi.fn(),
    getAll: vi.fn(),
  },
}));

vi.mock("@/lib/api/payments", () => ({
  paymentsApi: {
    createIntent: vi.fn(),
  },
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock audio
vi.mock("@/lib/utils/audio-feedback", () => ({
  playMechanicalClick: vi.fn(),
}));

const mockCar = {
  id: 1,
  name: "Pagani Huayra R",
  brand: "Pagani",
  price: 280000000,
  hasImage: true,
  description: "6.0L V12 Track Monster",
  colorOptions: "Rosso, Bianco",
  showroomLocation: "Monaco",
  deliveryDays: 14,
  paymentOptions: "Card, UPI, Crypto",
};

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

function createParams(carId: string = "1"): Promise<{ carId: string }> {
  const data = { carId };
  const p = Promise.resolve(data);
  (p as any).status = "fulfilled";
  (p as any).value = data;
  return p;
}

describe("CheckoutPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      token: "valid-token",
      refreshToken: "refresh-token",
      user: {
        id: 1,
        username: "collector_vip",
        email: "collector@sanctuary.luxury",
        roles: ["USER"],
      },
      isAuthenticated: true,
    });

    vi.mocked(carsApi.getById).mockResolvedValue(mockCar as any);
    vi.mocked(carsApi.getAll).mockResolvedValue({ content: [] } as any);
  });

  it("redirects unauthenticated users to /login", async () => {
    useAuthStore.setState({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });

    renderWithClient(<CheckoutPage params={createParams("1")} />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please sign in to place an order");
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("renders checkout form with car summary and customer details for authenticated user", async () => {
    renderWithClient(<CheckoutPage params={createParams("1")} />);

    await waitFor(() => {
      expect(screen.getByText("Pagani Huayra R")).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/full address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^city$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/pincode/i)).toBeInTheDocument();
    });
  });

  it("validates required fields on submission", async () => {
    const user = userEvent.setup();
    renderWithClient(<CheckoutPage params={createParams("1")} />);

    await waitFor(() => {
      expect(screen.getByText("Pagani Huayra R")).toBeInTheDocument();
    });

    // Clear pre-populated fields to trigger validation
    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);

    const submitBtn = screen.getByRole("button", { name: /place order/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/full address required/i)).toBeInTheDocument();
      expect(screen.getByText(/city required/i)).toBeInTheDocument();
      expect(screen.getByText(/pincode required/i)).toBeInTheDocument();
    });

    expect(ordersApi.placeOrder).not.toHaveBeenCalled();
  });

  it("submits order successfully and creates payment intent", async () => {
    const user = userEvent.setup();
    const createdOrder = {
      id: 99,
      carId: 1,
      carName: "Pagani Huayra R",
      customerName: "Lord Sterling",
      totalAmount: 280000000,
      status: "PENDING_PAYMENT",
    };

    const paymentIntent: PaymentIntentResponse = {
      paymentIntentId: "pi_mock_123",
      orderId: 99,
      amount: 280000000,
      currency: "INR",
      clientSecret: "pi_secret_mock_123",
      status: "REQUIRES_PAYMENT",
    };

    vi.mocked(ordersApi.placeOrder).mockResolvedValueOnce(createdOrder as any);
    vi.mocked(paymentsApi.createIntent).mockResolvedValueOnce(paymentIntent);

    renderWithClient(<CheckoutPage params={createParams("1")} />);

    await waitFor(() => {
      expect(screen.getByText("Pagani Huayra R")).toBeInTheDocument();
    });

    await user.clear(screen.getByLabelText(/full name/i));
    await user.type(screen.getByLabelText(/full name/i), "Lord Sterling");
    await user.type(screen.getByLabelText(/phone/i), "9876543210");
    await user.type(screen.getByLabelText(/full address/i), "Mayfair Palace, Apt 4B");
    await user.type(screen.getByLabelText(/^city$/i), "London");
    await user.type(screen.getByLabelText(/pincode/i), "400001");

    // Select payment method from Radix dropdown
    const selectTrigger = screen.getByRole("combobox");
    await user.click(selectTrigger);
    const cardOption = await screen.findByRole("option", { name: "Card" });
    await user.click(cardOption);

    const submitBtn = screen.getByRole("button", { name: /place order/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(ordersApi.placeOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          carId: 1,
          customerName: "Lord Sterling",
          customerPhone: "9876543210",
          deliveryAddress: "Mayfair Palace, Apt 4B",
          deliveryCity: "London",
          deliveryPincode: "400001",
          paymentMethod: "Card",
        })
      );
    });

    await waitFor(() => {
      expect(paymentsApi.createIntent).toHaveBeenCalledWith(99, "Card");
      expect(toast.success).toHaveBeenCalledWith("Order placed successfully! Initializing luxury payment...");
    });
  });

  it("handles checkout API error and notifies customer", async () => {
    const user = userEvent.setup();
    const axiosError = {
      isAxiosError: true,
      response: {
        data: {
          message: "Selected vehicle allocation is no longer available in showroom",
        },
      },
    };

    vi.mocked(ordersApi.placeOrder).mockRejectedValueOnce(axiosError);

    renderWithClient(<CheckoutPage params={createParams("1")} />);

    await waitFor(() => {
      expect(screen.getByText("Pagani Huayra R")).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/phone/i), "9876543210");
    await user.type(screen.getByLabelText(/full address/i), "Mayfair Palace, Apt 4B");
    await user.type(screen.getByLabelText(/^city$/i), "London");
    await user.type(screen.getByLabelText(/pincode/i), "400001");

    const selectTrigger = screen.getByRole("combobox");
    await user.click(selectTrigger);
    const cardOption = await screen.findByRole("option", { name: "Card" });
    await user.click(cardOption);

    const submitBtn = screen.getByRole("button", { name: /place order/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Selected vehicle allocation is no longer available in showroom");
    });
  });
});
