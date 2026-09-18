"use client";

import React from "react";
import { VelvetOverlay } from "./VelvetOverlay";
import { FloralFraming } from "./FloralFraming";
import { GoldenEmbers } from "./GoldenEmbers";

export const LivingBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* 1. Deep velvet fabric & shifting warm ambient spotlight */}
      <VelvetOverlay />

      {/* 2. Living dark romantic florals with independent micro-sways */}
      <FloralFraming />

      {/* 3. Atmospheric floating golden micro-embers */}
      <GoldenEmbers />
    </div>
  );
};
