"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const VelvetOverlay: React.FC = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !spotlightRef.current) return;

    // Near-invisible slow breath — presence only, adds no visible glow
    const ctx = gsap.context(() => {
      gsap.to(spotlightRef.current, {
        scale: 1.05,
        opacity: 0.16,
        duration: 9.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-[3]">
      {/* Velvet colour grading — near-black burgundy tones over the canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#16050a]/[0.22] via-transparent to-[#080204]/[0.30] pointer-events-none" />

      {/* Deep wine ambient breath — no center glow: the hero centre must
          stay one of the DARKEST zones; this is presence, not light */}
      <div
        ref={spotlightRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[100vh] sm:w-[900px] sm:h-[800px] rounded-full opacity-[0.06] blur-[110px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(48, 9, 16, 0.30) 0%, rgba(24, 4, 9, 0.18) 50%, rgba(6, 1, 3, 0) 75%)",
        }}
      />

      {/* Procedural velvet tactile grain texture */}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette border — deep wine instead of pure black */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(24,2,7,0.72)] pointer-events-none" />
    </div>
  );
};
