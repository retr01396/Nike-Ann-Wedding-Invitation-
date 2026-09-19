"use client";

import React from "react";
import { weddingConfig } from "@/config/wedding";
import { RSVPForm } from "./RSVPForm";
import { GoldGlowFrame } from "@/components/ui/GoldGlowFrame";

/* ==========================================================================
   KINDLY RSVP — SMOKED BURGUNDY LIQUID GLASS PANEL
   Per the reference: KINDLY / RSVP / "Your response means the world to us."
   with generous vertical breathing room so the panel reads as a tall slab
   of smoked glass. The RSVPForm flow, fields, validation, Supabase
   submission and confirmation remain completely intact.
   ========================================================================== */
export const RSVPSection: React.FC = () => {
  const { rsvp } = weddingConfig;

  return (
    <GoldGlowFrame id="rsvp" className="h-full scroll-mt-16">
      <div className="px-5 py-10 sm:px-8 sm:py-12 flex flex-col h-full">
        {/* Panel header per the reference: KINDLY / RSVP / divider / subtitle */}
        <div className="text-center">
          <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.42em] text-[#e5c57b]/90 uppercase font-medium">
            {rsvp.badge}
          </span>
          <h3 className="mt-1.5 font-cinzel text-2xl sm:text-[26px] tracking-[0.3em] text-[#fff0c7] font-normal">
            {rsvp.title}
          </h3>
          <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-[#caa24d]/70 to-transparent mx-auto mt-3" />
          <p className="mt-3 font-serif italic text-[12px] sm:text-[13px] text-[#d9c5a3]/90">
            Your response means the world to us.
          </p>
        </div>

        {/* The form (logic untouched) with generous top spacing */}
        <div className="mt-8 flex-1">
          <RSVPForm />
        </div>
      </div>
    </GoldGlowFrame>
  );
};
