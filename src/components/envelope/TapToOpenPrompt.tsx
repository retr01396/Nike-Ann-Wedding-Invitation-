"use client";

import React, { forwardRef } from "react";
import { weddingConfig } from "@/config/wedding";

interface TapToOpenPromptProps {
  onClick?: () => void;
  disabled?: boolean;
}

export const TapToOpenPrompt = forwardRef<HTMLButtonElement, TapToOpenPromptProps>(
  ({ onClick, disabled }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="group relative flex flex-col items-center justify-center text-center cursor-pointer focus:outline-none transition-all duration-300 select-none py-1"
        aria-label="Tap to open the wedding invitation"
      >
        <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.35em] text-[#caa24d] group-hover:text-[#fff0c7] uppercase font-light transition-colors">
          {weddingConfig.teaser.openButtonText || "TAP TO OPEN"}
        </span>
        <span className="w-6 h-[1px] bg-[#caa24d]/60 mt-1.5 group-hover:w-10 group-hover:bg-[#d4af37] transition-all duration-300" />
      </button>
    );
  }
);

TapToOpenPrompt.displayName = "TapToOpenPrompt";

