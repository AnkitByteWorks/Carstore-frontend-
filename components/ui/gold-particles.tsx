"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function GoldParticles({ count = 20 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const p: Particle[] = [];
    for (let i = 0; i < count; i++) {
      p.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 12 + 10,
        delay: Math.random() * 5,
      });
    }
    setParticles(p);
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10 opacity-70">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/40 blur-[0.5px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: ["0%", "-30%", "0%"],
            x: ["0%", "15%", "-15%", "0%"],
            opacity: [0.1, 0.7, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
