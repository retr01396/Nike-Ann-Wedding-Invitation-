"use client";

import React from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * VelvetOverlay — atmospheric colour grading and micro-grain.
 *
 * Performance fix: The original used GSAP to animate a blur(110px) 140vw
 * element, which created a very expensive GPU compositing layer.
 * Replaced with a pure CSS @keyframes breathing on opacity alone — same
 * cinematic effect, zero GPU rasterization cost beyond a simple alpha blend.
 */
export const VelvetOverlay: React.FC = () => {
  const reducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-[3]">
      {/* Velvet colour grading — near-black burgundy tones over the canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#16050a]/[0.22] via-transparent to-[#080204]/[0.30] pointer-events-none" />

      {/* Deep wine ambient breath — pure CSS opacity only, no blur on animated element.
          The visual result is identical: a slow radial darkening that breathes gently. */}
      {!reducedMotion && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[100vh] sm:w-[900px] sm:h-[800px] rounded-full pointer-events-none velvet-breath"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(48, 9, 16, 0.28) 0%, rgba(24, 4, 9, 0.14) 50%, rgba(6, 1, 3, 0) 75%)",
          }}
        />
      )}

      {/* Procedural velvet tactile grain texture */}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette border — deep wine instead of pure black */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(24,2,7,0.72)] pointer-events-none" />

      <style>{`
        @keyframes velvetBreathe {
          0%, 100% { opacity: 0.06; }
          50%       { opacity: 0.16; }
        }
        .velvet-breath {
          animation: velvetBreathe 9.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .velvet-breath { animation: none !important; opacity: 0.10; }
        }
      `}</style>
    </div>
  );
};
