"use client";

import React, { forwardRef } from "react";
import { WaxSeal } from "./WaxSeal";
import { InvitationCard } from "./InvitationCard";
import { EnvelopeAnimationState } from "@/types/wedding";

interface EnvelopeProps {
  state: EnvelopeAnimationState;
  onOpen: () => void;
  flapRef: React.RefObject<HTMLDivElement>;
  sealRef: React.RefObject<HTMLButtonElement>;
  cardRef: React.RefObject<HTMLDivElement>;
  cardHeaderRef: React.RefObject<HTMLDivElement>;
  cardNamesRef: React.RefObject<HTMLDivElement>;
  cardDetailsRef: React.RefObject<HTMLDivElement>;
  cardCtaRef: React.RefObject<HTMLDivElement>;
  onEnterWedding?: () => void;
}

export const Envelope = forwardRef<HTMLDivElement, EnvelopeProps>(
  (
    {
      state,
      onOpen,
      flapRef,
      sealRef,
      cardRef,
      cardHeaderRef,
      cardNamesRef,
      cardDetailsRef,
      cardCtaRef,
      onEnterWedding,
    },
    ref
  ) => {
    const isClosed = state === "CLOSED";
    const isOpening = state !== "CLOSED";

    return (
      <div
        ref={ref}
        className="relative w-[clamp(310px,86vw,380px)] sm:w-[clamp(440px,56vw,540px)] md:w-[clamp(480px,50vw,640px)] aspect-[460/310] select-none mx-auto"
        style={{
          perspective: "1400px",
        }}
      >
        {/* =========================================================================
            LAYER 1: ENVELOPE BACKBOARD (z-10)
            Dark velvet structural backing
           ========================================================================= */}
        <div
          className="absolute inset-0 rounded-sm bg-gradient-to-b from-[#24050a] via-[#170306] to-[#0c0103] z-10 border border-[#58111d]/50"
          style={{
            boxShadow:
              "0 25px 65px -10px rgba(0,0,0,0.98), 0 10px 30px rgba(26,3,7,0.85)",
          }}
        />

        {/* =========================================================================
            LAYER 2: ENVELOPE INTERIOR CAVITY LINING (z-11)
            Rich dark burgundy velvet interior revealed when flap flips open
           ========================================================================= */}
        <div className="absolute inset-1 rounded-sm bg-gradient-to-b from-[#350812] via-[#1f0308] to-[#100104] z-[11] overflow-hidden border border-[#caa24d]/20">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 30%, rgba(212,175,55,0.45) 0%, transparent 65%), radial-gradient(#d4af37 0.75px, transparent 0.75px)`,
              backgroundSize: "100% 100%, 18px 18px",
            }}
          />
        </div>

        {/* =========================================================================
            LAYER 3: INVITATION CARD (Direct child of Envelope for authentic stacking)
            - Proportional sizing: strictly 74% width on desktop, 80% on mobile.
            - In CLOSED state: seated at bottom: 20px, y: 0, visibility: hidden, opacity: 0, z-20.
            - When emerging: rises vertically from inside the pocket (z-20 behind pocket z-30).
            - When clearing: transitions forward to z-40 in front of pocket.
            - When settled: rests at y: -70px with rich stationery drop shadow.
           ========================================================================= */}
        <div
          ref={cardRef}
          className="absolute left-1/2 -translate-x-1/2 w-[80%] sm:w-[74%] aspect-[320/430] pointer-events-auto"
          style={{
            bottom: "16px",
            zIndex: isClosed ? 20 : 40,
            opacity: isClosed ? 0 : 1,
            visibility: isClosed ? "hidden" : "visible",
            pointerEvents: isClosed ? "none" : "auto",
            willChange: "transform, opacity, z-index",
          }}
        >
          <InvitationCard
            headerRef={cardHeaderRef}
            namesRef={cardNamesRef}
            detailsRef={cardDetailsRef}
            ctaRef={cardCtaRef}
            onEnterWedding={onEnterWedding}
          />
        </div>

        {/* =========================================================================
            LAYER 4: ENVELOPE FRONT POCKET (z-30)
            Folded side and bottom triangles meeting at center (230, 155).
            Forms a physical pouch that contains and supports the card.
           ========================================================================= */}
        <div
          className="absolute inset-0 z-30 pointer-events-none rounded-b-sm overflow-hidden"
          style={{
            filter: "drop-shadow(0 -4px 10px rgba(0,0,0,0.85))",
          }}
        >
          <svg
            viewBox="0 0 460 310"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="pocket-front-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#2c070e" />
                <stop offset="60%" stopColor="#1e0409" />
                <stop offset="100%" stopColor="#100204" />
              </linearGradient>

              <linearGradient id="pocket-seam-gold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="25%" stopColor="#caa24d" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#fff0c7" stopOpacity="0.75" />
                <stop offset="75%" stopColor="#caa24d" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>

            {/* Bottom & Side Pocket Folds meeting at center (230, 155) */}
            <path
              d="M 0 0 L 230 155 L 460 0 L 460 310 L 0 310 Z"
              fill="url(#pocket-front-grad)"
            />

            {/* Diagonal Seam Hairlines (Left fold & Right fold) */}
            <path
              d="M 0 310 L 230 155 L 460 310"
              stroke="url(#pocket-seam-gold)"
              strokeWidth="0.8"
              opacity="0.6"
              fill="none"
            />

            {/* Top V Seam Hairline */}
            <path
              d="M 0 0 L 230 155 L 460 0"
              stroke="url(#pocket-seam-gold)"
              strokeWidth="0.8"
              opacity="0.5"
              fill="none"
            />
          </svg>
        </div>

        {/* =========================================================================
            LAYER 5: ENVELOPE TOP FLAP (Starts at z-35, folds backward 180deg to z-12)
            Triangular flap hinged strictly to the top edge (transform-origin: top center).
            - Front Face: visible when closed, points down to center (230, 156).
            - Back Face: reveals interior lining when rotated 180deg backward, pointing up.
           ========================================================================= */}
        <div
          ref={flapRef}
          className="absolute top-0 left-0 right-0 z-[35]"
          style={{
            height: "50.32%",
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            transform: "rotateX(0deg)",
            willChange: "transform, z-index",
          }}
        >
          {/* FRONT FACE OF FLAP (Visible when closed, rotateX: 0deg) */}
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <svg
              viewBox="0 0 460 156"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.92)]"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="flap-front-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#350811" />
                  <stop offset="60%" stopColor="#25050b" />
                  <stop offset="100%" stopColor="#180306" />
                </linearGradient>

                <linearGradient id="flap-gold-rim" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="25%" stopColor="#caa24d" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#fff0c7" stopOpacity="0.8" />
                  <stop offset="75%" stopColor="#caa24d" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>

              {/* Triangle Top Flap pointing down to (230, 156) */}
              <path
                d="M 0 0 L 230 156 L 460 0 Z"
                fill="url(#flap-front-grad)"
              />

              {/* Flap Gold Rim */}
              <path
                d="M 0 0 L 230 156 L 460 0"
                stroke="url(#flap-gold-rim)"
                strokeWidth="1.1"
                fill="none"
              />
            </svg>
          </div>

          {/* BACK FACE OF FLAP (Lining revealed when folded backward 180deg) */}
          <div
            className="absolute inset-0"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <svg
              viewBox="0 0 460 156"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="flap-back-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#380914" />
                  <stop offset="60%" stopColor="#23040a" />
                  <stop offset="100%" stopColor="#150205" />
                </linearGradient>
              </defs>

              <path
                d="M 0 0 L 230 156 L 460 0 Z"
                fill="url(#flap-back-grad)"
              />

              {/* Delicate Gold Rim on open back face */}
              <path
                d="M 0 0 L 230 156 L 460 0"
                stroke="#caa24d"
                strokeWidth="0.8"
                opacity="0.4"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* =========================================================================
            LAYER 6: WAX SEAL (z-36 initially)
            Positioned exactly over the apex of the flap (top: 50.32%, left: 50%).
           ========================================================================= */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-[36] pointer-events-auto"
          style={{
            top: "50.32%",
          }}
        >
          <WaxSeal
            ref={sealRef}
            onClick={onOpen}
            isOpening={isOpening}
            disabled={!isClosed}
          />
        </div>
      </div>
    );
  }
);

Envelope.displayName = "Envelope";

