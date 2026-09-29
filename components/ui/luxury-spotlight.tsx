"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function LuxurySpotlight() {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!isClient) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-500 overflow-hidden"
      style={{
        background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.045), transparent 80%)`,
      }}
    />
  );
}
