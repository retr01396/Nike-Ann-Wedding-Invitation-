"use client";

import React from "react";
import { FluidSilkBackground } from "./FluidSilkBackground";
import { SilkCurrent } from "./SilkCurrent";
import { VelvetOverlay } from "./VelvetOverlay";
import { FloralFraming } from "./FloralFraming";
import { GoldenEmbers } from "./GoldenEmbers";

export const LivingBackground: React.FC = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* 1. High-res photographic floral backdrop — the background itself */}
      <FloralFraming />

      {/* 2. Living liquid-silk light flowing over the photograph (screen blend,
          resolution-capped on mobile — invisible cost, visible life) */}
      <FluidSilkBackground className="z-[2]" />

      {/* 2.6 Flowing water streams — luminous currents gliding through the
          blooms on every device (compositor-driven, near-zero cost) */}
      <SilkCurrent />

      {/* 3. Velvet colour grading & tactile micro-grain */}
      <VelvetOverlay />

      {/* 4. Atmospheric floating golden micro-embers */}
      <GoldenEmbers />
    </div>
  );
};
