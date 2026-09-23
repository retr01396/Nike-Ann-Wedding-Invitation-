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
            LAYER 3: INVITATION CARD (Initially z-20, emerges, clears pocket, flips to z-40)
            - Proportional sizing: strictly 65% on desktop, 72% on mobile, aspect-[290/300].
            - Seated inside the pocket at bottom: 4px, y: 0.
            - In CLOSED state: Flap (z-35) and FrontPocket (z-30) physically cover the card.
              The card is at opacity: 1, visibility: visible, with zero peek.
            - Emergence: Glides up from y: 0 to y: -190. While currentY > -155, stays at z-20
              behind FrontPocket (z-30) so the front pocket physically occludes its lower body.
            - Once cleared (currentY <= -155), flips to z-40 and settles to y: -75 in front of pocket.
           - FINAL PRESENTATION: once the card has fully emerged and settled (state === OPENED),
             it switches to a viewport-aware presentation width so the invitation reads large on
             mobile (~80-88% of viewport on 375/390/414) while remaining framed, readable, and
             free of horizontal overflow. The physical emergence animation itself is unchanged.
           ========================================================================= */}
        <div
          ref={cardRef}
          className="absolute left-0 right-0 mx-auto w-[61%] aspect-[273/296] pointer-events-auto z-20"
          style={{
            bottom: "5px",
            pointerEvents: isClosed ? "none" : "auto",
            // transform only: box-shadow/z-index in will-change forced an
            // oversized always-on Android compositor layer on the card.
            willChange: "transform",
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

