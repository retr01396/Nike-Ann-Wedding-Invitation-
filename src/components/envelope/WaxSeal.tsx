"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { weddingConfig } from "@/config/wedding";

interface WaxSealProps {
  onClick?: () => void;
  isOpening?: boolean;
  disabled?: boolean;
}

export const WaxSeal = forwardRef<HTMLButtonElement, WaxSealProps>(
  ({ onClick, disabled }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        id="seal-stamp"
        aria-label="Open wedding invitation envelope"
        className="group relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full cursor-pointer focus:outline-none transition-transform active:scale-95 select-none hover:scale-105"
        style={{
          // Single drop-shadow: the second gold one forced an extra
          // filter pass + compositor layer on Android during the opening.
          filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.95))",
        }}
      >
        {/* Crisp photographic wax seal directly extracted from reference */}
        <div className="relative w-full h-full rounded-full overflow-hidden border border-[#caa24d]/40 shadow-inner">
          <Image
            src={weddingConfig.images.hero.waxSeal}
            alt="Burgundy N/A monogram wax seal"
            fill
            sizes="96px"
            className="object-cover object-center"
            priority
            unoptimized
          />
          {/* Subtle gold rim highlight */}
          <div className="absolute inset-0 rounded-full border border-gold-300/30 pointer-events-none group-hover:border-gold-300/60 transition-colors" />
        </div>
      </button>
    );
  }
);

WaxSeal.displayName = "WaxSeal";
