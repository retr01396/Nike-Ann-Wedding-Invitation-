"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const VelvetOverlay: React.FC = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !spotlightRef.current) return;

    // Extremely subtle breathing light in the center background
    const ctx = gsap.context(() => {
      gsap.to(spotlightRef.current, {
        scale: 1.08,
        opacity: 0.55,
        duration: 8.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Base deep velvet gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#180306] via-[#100204] to-[#080102]" />

      {/* Shifting warm wine/burgundy ambient glow */}
      <div
        ref={spotlightRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[100vh] sm:w-[900px] sm:h-[800px] rounded-full opacity-40 blur-[90px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(88, 17, 28, 0.45) 0%, rgba(45, 7, 13, 0.25) 50%, rgba(8, 1, 2, 0) 75%)",
        }}
      />

      {/* Procedural velvet tactile grain texture */}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle vignette border */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.85)] pointer-events-none" />
    </div>
  );
};
