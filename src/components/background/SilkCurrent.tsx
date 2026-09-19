"use client";

import React from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * SilkCurrent — flowing water over the floral scene.
 *
 * Three compositor-driven layers, all screen-blended so only their luminous
 * crests surface over the blooms:
 *   1. WAVE BANDS   — broad sine waves of light rolling diagonally, like
 *                     swells moving across a dark sea
 *   2. CAUSTIC      — a drifting interference-ripple texture, like sunlight
 *                     refracting through shallow flowing water
 *   3. STREAMS      — two vast soft ribbons gliding in opposite directions
 * Pure CSS transforms/animations: guaranteed to animate on every device,
 * near-zero GPU cost, honors prefers-reduced-motion.
 */
export const SilkCurrent: React.FC = () => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden z-[2]"
      aria-hidden="true"
    >
      {/* 1. ROLLING WAVE BANDS — diagonal swells of light crossing the screen */}
      <div
        className="absolute will-change-transform"
        style={{
          width: "200vw",
          height: "240vh",
          left: "-50vw",
          top: "-70vh",
          backgroundImage:
            "repeating-linear-gradient(112deg, transparent 0px, transparent 150px, rgba(120,30,44,0.05) 240px, rgba(150,42,58,0.08) 330px, rgba(120,30,44,0.05) 420px, transparent 510px)",
          mixBlendMode: "screen",
          filter: "blur(14px)",
          animation: "silkWaveRoll 22s linear infinite",
        }}
      />

      {/* 2. CAUSTIC RIPPLES — flowing water interference pattern */}
      <div
        className="absolute will-change-transform"
        style={{
          width: "130vw",
          height: "130vh",
          left: "-15vw",
          top: "-15vh",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 700 700' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012 0.02' numOctaves='2' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 1  0 0 0 0 0.82  0 0 0 0 0.58  0 0 0 1.6 -0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23w)'/%3E%3C/svg%3E")`,
          backgroundSize: "900px 900px",
          mixBlendMode: "screen",
          opacity: 0.3,
          filter: "blur(6px)",
          animation: "silkCausticDrift 38s linear infinite",
        }}
      />

      {/* 3a. STREAM — broad warm current drifting down-right */}
      <div
        className="absolute will-change-transform"
        style={{
          width: "220vw",
          height: "150vh",
          left: "-60vw",
          top: "-25vh",
          transform: "rotate(-24deg)",
          background:
            "linear-gradient(105deg, transparent 0%, transparent 28%, rgba(96,22,36,0.10) 44%, rgba(130,30,46,0.15) 50%, rgba(96,22,36,0.10) 56%, transparent 72%)",
          mixBlendMode: "screen",
          filter: "blur(24px)",
          animation: "silkCurrent1 24s ease-in-out infinite alternate",
        }}
      />

      {/* 3b. STREAM — cooler rose current crossing the opposite way */}
      <div
        className="absolute will-change-transform"
        style={{
          width: "240vw",
          height: "130vh",
          left: "-70vw",
          top: "-15vh",
          transform: "rotate(18deg)",
          background:
            "linear-gradient(80deg, transparent 0%, transparent 34%, rgba(90,20,32,0.08) 48%, rgba(120,26,40,0.12) 54%, transparent 70%)",
          mixBlendMode: "screen",
          filter: "blur(28px)",
          animation: "silkCurrent2 32s ease-in-out infinite alternate",
        }}
      />

      <style>{`
        @keyframes silkWaveRoll {
          0%   { transform: translate3d(0, -4%, 0); }
          100% { transform: translate3d(-14%, 4%, 0); }
        }
        @keyframes silkCausticDrift {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-900px, 300px, 0); }
        }
        @keyframes silkCurrent1 {
          0%   { transform: rotate(-24deg) translate3d(-9%, -6%, 0) scaleX(1);    opacity: 0.4;  }
          50%  { transform: rotate(-24deg) translate3d(4%, 5%, 0)   scaleX(1.08); opacity: 0.62; }
          100% { transform: rotate(-24deg) translate3d(14%, 9%, 0)  scaleX(1.12); opacity: 0.45; }
        }
        @keyframes silkCurrent2 {
          0%   { transform: rotate(18deg) translate3d(11%, 7%, 0)  scaleX(1.1);  opacity: 0.32; }
          50%  { transform: rotate(18deg) translate3d(-3%, -4%, 0) scaleX(1);    opacity: 0.55; }
          100% { transform: rotate(18deg) translate3d(-13%, -8%, 0) scaleX(1.05); opacity: 0.36; }
        }
      `}</style>
    </div>
  );
};
