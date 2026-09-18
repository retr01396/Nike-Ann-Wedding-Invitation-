"use client";

import React from "react";
import { FluidSilkBackground } from "./FluidSilkBackground";
import { VelvetOverlay } from "./VelvetOverlay";
import { FloralFraming } from "./FloralFraming";
import { GoldenEmbers } from "./GoldenEmbers";

export const LivingBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* 0. Continuous WebGL liquid velvet/silk flow spanning the whole page */}
      <FluidSilkBackground className="z-0" />

      {/* 1. Deep velvet fabric vignette & tactile micro-grain overlay */}
      <VelvetOverlay />

      {/* 2. Living dark romantic florals */}
      <FloralFraming />

      {/* 3. Atmospheric floating golden micro-embers */}
      <GoldenEmbers />
    </div>
  );
};
