"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { ordersApi } from "@/lib/api/orders";
import { toast } from "sonner";
import axios from "axios";

interface DownloadInvoiceButtonProps {
  orderId: number;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
}

export function DownloadInvoiceButton({
  orderId,
  variant = "outline",
  size = "default",
  className = "",
  label = "📄 Download Tax Invoice (PDF)",
}: DownloadInvoiceButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setDownloading(true);
    const toastId = toast.loading(`Generating Tax Invoice for Order #${orderId}...`);

    try {
      await ordersApi.downloadInvoice(orderId);
      toast.success(`Tax invoice for Order #${orderId} downloaded successfully!`, {
        id: toastId,
      });
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to download tax invoice. Please ensure you are logged in.";
      toast.error(message, { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={downloading}
      className={className}
    >
      {downloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-gold" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4 text-gold flex-shrink-0" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
}
