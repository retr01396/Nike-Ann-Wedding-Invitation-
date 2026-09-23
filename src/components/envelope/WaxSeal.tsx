"use client";

import React, { forwardRef } from "react";
import { weddingConfig } from "@/config/wedding";

interface WaxSealProps {
  onClick?: () => void;
  isOpening?: boolean;
  disabled?: boolean;
}

/**
 * WaxSeal — the closed-envelope N/A monogram seal.
 *
 * Sharpness fix: the previous implementation displayed a 70×70 JPEG at up to
 * 96 CSS px (≈288 physical px on a 3× phone) — a ~4× upscale that rendered
 * visibly soft on Android. The SAME design is now drawn as pure vector/text
 * (identical to the intro monogram, which is already crisp): burgundy wax
 * body, gold rim, centered 45° slash, N upper-left / A lower-right. No raster
 * asset is involved, so it stays sharp at every device pixel ratio.
 */
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
        {/* Vector wax body: burgundy disc with subtle inner shading */}
        <div className="relative w-full h-full rounded-full overflow-hidden border border-[#caa24d]/40 shadow-inner bg-[radial-gradient(circle_at_38%_32%,#5a1020_0%,#3f0a16_45%,#2a050e_100%)]">
          {/* Gold rim ring */}
          <div
            className="absolute inset-[5%] rounded-full pointer-events-none"
            style={{
              border: "1.5px solid rgba(202,162,77,0.75)",
              boxShadow:
                "inset 0 0 10px rgba(212,175,55,0.22), 0 0 6px rgba(212,175,55,0.18)",
            }}
          />

          {/* Centered 45° gold slash (matches the wax-seal reference) */}
          <div
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{
              width: "2px",
              height: "38%",
              transform: "translate(-50%, -50%) rotate(45deg)",
              background:
                "linear-gradient(to bottom, #fdf4d8 0%, #d4af37 50%, #997528 100%)",
              opacity: 0.9,
            }}
          />

          {/* N (upper-left) — real text, rendered at native size, never scaled up */}
          <span
            className="absolute font-cinzel select-none pointer-events-none"
            style={{
              top: "17%",
              left: "17%",
              fontSize: "1.55em",
              lineHeight: 1,
              background:
                "linear-gradient(to bottom, #fff6de 0%, #d4af37 55%, #997528 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {weddingConfig.couple.groom.charAt(0)}
          </span>

          {/* A (lower-right) */}
          <span
            className="absolute font-cinzel select-none pointer-events-none"
            style={{
              bottom: "17%",
              right: "17%",
              fontSize: "1.55em",
              lineHeight: 1,
              background:
                "linear-gradient(to bottom, #fff6de 0%, #d4af37 55%, #997528 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {weddingConfig.couple.bride.charAt(0)}
          </span>
        </div>
      </button>
    );
  }
);

WaxSeal.displayName = "WaxSeal";
