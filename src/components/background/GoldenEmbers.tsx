"use client";

import React, { useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useHeroAnimationActive } from "@/components/hero/HeroAnimationContext";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
}

/**
 * GoldenEmbers — ambient gold micro-particles drifting upward.
 *
 * Mobile particle count is reduced from 22 to 14. The glow is part of each
 * tiny radial fill rather than a filter on the full-screen particle layer.
 */
export const GoldenEmbers: React.FC = () => {
  const reducedMotion = useReducedMotion();
  // Freeze every particle while the envelope/card animation runs — they are
  // the cheapest thing to sacrifice and free the compositor for the card.
  const heroActive = useHeroAnimationActive();

  const particles = useMemo<Particle[]>(() => {
    const list: Particle[] = [];
    const count = 22;

    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        x: (i * 17 + 7) % 96 + 2,
        y: (i * 29 + 11) % 90 + 5,
        size: i % 3 === 0 ? 2.5 : i % 2 === 0 ? 1.8 : 1.2,
        duration: 9 + (i % 7) * 2.5,
        delay: (i * 0.7) % 6,
        drift: ((i % 5) - 2) * 8,
        opacity: 0.10 + ((i % 4) * 0.05),
      });
    }
    return list;
  }, []);

  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-[4]">
      {particles.map((p) => (
        <span
          key={p.id}
          // hide-on-mobile class removes the particle on narrow viewports
          // (first 8 particles: visible on all screens; rest: hidden on mobile)
          className={`absolute rounded-full pointer-events-none${p.id >= 8 ? " hidden sm:block" : ""}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: "radial-gradient(circle, rgba(230,205,151,0.8) 0%, rgba(217,192,138,0.4) 45%, rgba(217,192,138,0) 78%)",
            opacity: p.opacity,
            animation: `floatParticle ${p.duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
            animationDelay: `${p.delay}s`,
            // animation-play-state (not opacity 0) so freezing is paint-free:
            // the existing frame just holds on the compositor.
            animationPlayState: heroActive ? "paused" : "running",
            transform: "translate3d(0, 0, 0)",
          }}
        />
      ))}

      <style>{`
        @keyframes floatParticle {
          0% {
            transform: translateY(0px) translateX(0px) scale(0.8);
            opacity: 0.1;
          }
          30% {
            opacity: 0.65;
          }
          70% {
            opacity: 0.45;
          }
          100% {
            transform: translateY(-90px) translateX(12px) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
