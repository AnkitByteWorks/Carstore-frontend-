"use client";

import { useEffect, useState, useRef } from "react";
import { getApiBaseUrl } from "@/lib/api/config";
import type { Order } from "@/lib/api/orders";

interface UseOrderEventsOptions {
  orderId: number | null | undefined;
  onStatusUpdate?: (order: Order) => void;
  enabled?: boolean;
}

export function useOrderEvents({
  orderId,
  onStatusUpdate,
  enabled = true,
}: UseOrderEventsOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [liveOrder, setLiveOrder] = useState<Order | null>(null);
  const [lastEventTime, setLastEventTime] = useState<Date | null>(null);
  const onStatusUpdateRef = useRef(onStatusUpdate);
  onStatusUpdateRef.current = onStatusUpdate;

  useEffect(() => {
    const numericOrderId = Number(orderId);
    if (!enabled || !orderId || isNaN(numericOrderId)) return;

    let isMounted = true;
    let abortController: AbortController | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connectToSSE = async () => {
      if (!isMounted) return;

      abortController = new AbortController();
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const baseUrl = (getApiBaseUrl() || "http://localhost:8080").replace(/\/$/, "");

      try {
        const response = await fetch(`${baseUrl}/api/orders/${numericOrderId}/events`, {
          signal: abortController.signal,
          headers: {
            Accept: "text/event-stream",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error(`SSE connection failed with status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("No response body received from SSE stream");
        }

        if (isMounted) {
          setIsConnected(true);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (isMounted) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const part of parts) {
            if (!part.trim()) continue;

            const lines = part.split("\n");
            let eventType = "";
            let dataStr = "";

            for (const line of lines) {
              if (line.startsWith("event:")) {
                eventType = line.slice(6).trim();
              } else if (line.startsWith("data:")) {
                dataStr = line.slice(5).trim();
              }
            }

            if (dataStr) {
              try {
                const parsed = JSON.parse(dataStr);
                if (isMounted) {
                  setLastEventTime(new Date());
                }

                if (eventType === "ORDER_STATUS_UPDATE" || (parsed.id && parsed.status)) {
                  const updatedOrder = parsed as Order;
                  if (isMounted) {
                    setLiveOrder(updatedOrder);
                  }
                  onStatusUpdateRef.current?.(updatedOrder);
                }
              } catch (e) {
                // Ignore unparseable or raw text ping
              }
            }
          }
        }
      } catch (err: unknown) {
        if (!abortController.signal.aborted) {
          console.warn("SSE stream interrupted, reconnecting in 3s...", err);
          if (isMounted) {
            setIsConnected(false);
            reconnectTimeout = setTimeout(connectToSSE, 3000);
          }
        }
      } finally {
        if (isMounted && abortController.signal.aborted) {
          setIsConnected(false);
        }
      }
    };

    connectToSSE();

    return () => {
      isMounted = false;
      if (abortController) {
        abortController.abort();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      setIsConnected(false);
    };
  }, [orderId, enabled]);

  return { isConnected, liveOrder, lastEventTime };
}
