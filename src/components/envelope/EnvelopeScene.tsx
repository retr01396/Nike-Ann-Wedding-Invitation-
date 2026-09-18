"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { weddingConfig } from "@/config/wedding";
import { animationConfig } from "@/config/animations";
import { EnvelopeAnimationState } from "@/types/wedding";
import { Envelope } from "./Envelope";
import { TapToOpenPrompt } from "./TapToOpenPrompt";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { RotateCcw, Lock } from "lucide-react";

export const EnvelopeScene: React.FC = () => {
  const [state, setState] = useState<EnvelopeAnimationState>("CLOSED");
  const isBusyRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Element Refs for GSAP
  const sceneContainerRef = useRef<HTMLDivElement>(null);
  const topHeaderRef = useRef<HTMLDivElement>(null);
  const teaserCtaRef = useRef<HTMLDivElement>(null);
  const envelopeContainerRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardHeaderRef = useRef<HTMLDivElement>(null);
  const cardNamesRef = useRef<HTMLDivElement>(null);
  const cardDetailsRef = useRef<HTMLDivElement>(null);
  const cardCtaRef = useRef<HTMLDivElement>(null);
  const quotePanelRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  // Reset / Initial Setup
  const setupInitialState = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    isBusyRef.current = false;
    setState("CLOSED");

    if (topHeaderRef.current) gsap.set(topHeaderRef.current, { opacity: 1, y: 0, pointerEvents: "auto" });
    if (teaserCtaRef.current) gsap.set(teaserCtaRef.current, { opacity: 1, y: 0, scale: 1, pointerEvents: "auto" });
    if (envelopeContainerRef.current) gsap.set(envelopeContainerRef.current, { y: 0 });
    if (flapRef.current) gsap.set(flapRef.current, { rotateX: 0, zIndex: 35 });
    if (sealRef.current) gsap.set(sealRef.current, { opacity: 1, scale: 1, pointerEvents: "auto" });
    if (quotePanelRef.current) gsap.set(quotePanelRef.current, { opacity: 0, x: 20 });

    if (cardRef.current) {
      gsap.set(cardRef.current, {
        yPercent: 0,
        y: 0,
        scale: 1,
        zIndex: 20,
        rotateX: 0,
        boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
      });
    }

    // Keep typography elements ready at full opacity
    if (cardHeaderRef.current) gsap.set(cardHeaderRef.current, { opacity: 1, y: 0 });
    if (cardNamesRef.current) gsap.set(cardNamesRef.current, { opacity: 1, filter: "none", scale: 1 });
    if (cardDetailsRef.current) gsap.set(cardDetailsRef.current, { opacity: 1, y: 0 });
    if (cardCtaRef.current) gsap.set(cardCtaRef.current, { opacity: 1, y: 0 });
  }, []);

  useEffect(() => {
    setupInitialState();
    return () => {
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [setupInitialState]);

  // Master Physical Envelope Opening Sequence
  const handleOpen = useCallback(() => {
    if (isBusyRef.current || state !== "CLOSED") return;
    isBusyRef.current = true;
    setState("OPENING");

    // Reduced Motion Fallback
    if (reducedMotion) {
      if (flapRef.current) gsap.set(flapRef.current, { rotateX: 180, zIndex: 12 });
      if (sealRef.current) gsap.set(sealRef.current, { opacity: 0, pointerEvents: "none" });
      if (teaserCtaRef.current) gsap.set(teaserCtaRef.current, { opacity: 0, pointerEvents: "none" });
      if (topHeaderRef.current) gsap.set(topHeaderRef.current, { opacity: 0, pointerEvents: "none" });
      if (envelopeContainerRef.current) gsap.set(envelopeContainerRef.current, { y: 0 });
      if (cardRef.current) {
        gsap.set(cardRef.current, {
          yPercent: -15,
          y: 0,
          scale: 1.0,
          zIndex: 40,
          boxShadow: "0 30px 80px -10px rgba(0,0,0,0.98), 0 0 35px rgba(212,175,55,0.18)",
        });
      }
      if (cardHeaderRef.current) gsap.set(cardHeaderRef.current, { opacity: 1, y: 0 });
      if (cardNamesRef.current) gsap.set(cardNamesRef.current, { opacity: 1, filter: "none", scale: 1 });
      if (cardDetailsRef.current) gsap.set(cardDetailsRef.current, { opacity: 1, y: 0 });
      if (cardCtaRef.current) gsap.set(cardCtaRef.current, { opacity: 1, y: 0 });
      if (quotePanelRef.current) gsap.set(quotePanelRef.current, { opacity: 1, x: 0 });
      setState("OPENED");
      isBusyRef.current = false;
      return;
    }

    // Full Cinematic GSAP Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setState("OPENED");
        isBusyRef.current = false;
        if (cardRef.current) {
          cardRef.current.style.zIndex = "40";
        }
      },
    });
    timelineRef.current = tl;

    // 1. Teaser CTA button dissolves & seal reacts subtly
    tl.to(teaserCtaRef.current, {
      opacity: 0,
      y: -6,
      duration: 0.22,
      ease: "power2.out",
    })
      .to(
        sealRef.current,
        {
          scale: 1.08,
          duration: animationConfig.timings.sealReaction,
          ease: "power2.out",
          boxShadow: "0 0 25px rgba(212,175,55,0.7)",
        },
        "<"
      )

      // 2. Seal releases & fades away
      .to(sealRef.current, {
        opacity: 0,
        scale: 0.85,
        duration: animationConfig.timings.sealRelease,
        ease: "power2.in",
        pointerEvents: "none",
      })

      // 3. Top Flap unfolds in 3D perspective around top hinge (0deg -> 180deg)
      .call(() => setState("FLAP_OPEN"))
      .to(flapRef.current, {
        rotateX: 180,
        duration: animationConfig.timings.flapOpen,
        ease: animationConfig.easings.flapUnfold,
        onUpdate: function () {
          if (flapRef.current) {
            const rot = gsap.getProperty(flapRef.current, "rotateX") as number;
            if (rot > 90) {
              flapRef.current.style.zIndex = "12";
            } else {
              flapRef.current.style.zIndex = "35";
            }
          }
        },
      })

      // 4. Teaser header dissolves as card begins to emerge
      .to(
        topHeaderRef.current,
        {
          opacity: 0,
          y: -8,
          duration: 0.35,
          ease: "power2.out",
          pointerEvents: "none",
        },
        "-=0.3"
      )

      // 5. Card emerges vertically from inside the pocket
      // Starts seated at yPercent: 0, zIndex: 20 behind front pocket (z-30)
      .call(() => {
        setState("CARD_EMERGING");
        if (cardRef.current) {
          cardRef.current.style.zIndex = "20";
        }
      })
      .to(
        cardRef.current,
        {
          yPercent: -58,
          duration: animationConfig.timings.cardEmergence,
          ease: animationConfig.easings.cardExtract,
          onUpdate: function () {
            if (cardRef.current) {
              const currentYP = gsap.getProperty(cardRef.current, "yPercent") as number;
              // Lower body stays masked behind pocket (z-20) until it clears the pocket apex (at -50%)
              if (currentYP <= -50) {
                cardRef.current.style.zIndex = "40";
              } else {
                cardRef.current.style.zIndex = "20";
              }
            }
          },
        },
        "-=0.1"
      )

      // 6. CARD SETTLES TOWARD THE VIEWER (Resting gracefully in front of pocket)
      .call(() => setState("CARD_SETTLING"))
      .to(cardRef.current, {
        yPercent: -15,
        scale: 1.0,
        duration: animationConfig.timings.cardSettling,
        ease: animationConfig.easings.cardSettle,
        boxShadow:
          "0 30px 80px -10px rgba(0, 0, 0, 0.98), 0 0 35px rgba(212, 175, 55, 0.18)",
      })

      // 7. Subtle luminescence on golden names as it settles
      .fromTo(
        cardNamesRef.current,
        { filter: "brightness(1.2)" },
        {
          filter: "brightness(1)",
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.2"
      )

      // 8. Editorial Quote Panel reveals on right
      .to(
        quotePanelRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "<"
      );
  }, [state, reducedMotion]);

  const handleEnterWedding = useCallback(() => {
    const target = document.getElementById("stationery-nav");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <main
      ref={sceneContainerRef}
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center px-4 py-6 sm:py-8 safe-area-top safe-area-bottom z-10 overflow-hidden select-none bg-[#100205]"
    >
      {/* =========================================================================
          HERO PHOTOGRAPHIC FLORAL & VELVET BACKDROP
          Authentic crops placed on left and right without duplicate envelopes
         ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Left Side: Dahlia, Baby's Breath & Velvet */}
        <div className="absolute top-0 left-0 w-[220px] sm:w-[300px] md:w-[360px] h-[500px] sm:h-[650px] md:h-[750px] pointer-events-none opacity-85">
          <Image
            src="/images/wedding/hero/hero-bg-left.jpg"
            alt=""
            fill
            sizes="360px"
            className="object-cover object-left-top filter contrast-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#100205]/40 to-[#100205] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#100205] pointer-events-none" />
        </div>

        {/* Right Side: Plate, Diamond Crystal & Baby's Breath */}
        <div className="absolute top-0 right-0 w-[220px] sm:w-[300px] md:w-[360px] h-[500px] sm:h-[650px] md:h-[750px] pointer-events-none opacity-85">
          <Image
            src="/images/wedding/hero/hero-bg-right.jpg"
            alt=""
            fill
            sizes="360px"
            className="object-cover object-right-top filter contrast-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#100205]/40 to-[#100205] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#100205] pointer-events-none" />
        </div>

        {/* Velvet Vignette Shadow Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_#0d0104_95%)] pointer-events-none" />
      </div>

      {/* Replay Button */}
      {state === "OPENED" && (
        <button
          type="button"
          onClick={setupInitialState}
          className="fixed top-4 left-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold-400/30 bg-[#150306]/85 text-gold-300 text-[9px] tracking-[0.2em] uppercase backdrop-blur-sm hover:border-gold-300 hover:text-white transition-all cursor-pointer shadow-lg"
          aria-label="Replay envelope animation"
        >
          <RotateCcw className="w-3 h-3 text-gold-300" />
          <span>Replay</span>
        </button>
      )}

      {/* TOP HEADER: Center Title & Right Private Invitation Badge (matching reference) */}
      <div
        ref={topHeaderRef}
        className="absolute top-4 sm:top-6 md:top-8 left-0 right-0 w-full flex flex-col sm:flex-row items-center justify-center px-4 sm:px-8 z-30 pointer-events-auto"
      >
        {/* TOP RIGHT: 🔒 PRIVATE INVITATION */}
        <div className="sm:absolute sm:top-0 sm:right-6 md:right-10 flex items-center gap-1.5 text-[#caa24d]/85 font-cinzel text-[7.5px] sm:text-[9.5px] tracking-[0.25em] uppercase font-light mb-1.5 sm:mb-0">
          <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#caa24d]" />
          <span>PRIVATE INVITATION</span>
        </div>

        {/* TOP CENTER: "A BRIGHTER / CHAPTER / TOGETHER" */}
        <div className="flex flex-col items-center text-center">
          <h2 className="font-cinzel text-xs sm:text-sm tracking-[0.35em] text-[#e5c57b] uppercase font-medium leading-relaxed">
            A BRIGHTER
            <br />
            CHAPTER
            <br />
            TOGETHER
          </h2>
          <div className="w-6 h-[1px] bg-[#caa24d]/60 mt-1.5" />
        </div>
      </div>

      {/* =========================================================================
          MASTER ENVELOPE STAGE: Visual center of the Hero
          Envelope and Teaser Prompt centered gracefully in the viewport
         ========================================================================= */}
      <div className="relative w-full max-w-5xl flex flex-col items-center justify-center z-20 my-auto">

        {/* CENTER: PHYSICAL HORIZONTAL ENVELOPE */}
        <div
          ref={envelopeContainerRef}
          className="relative flex items-center justify-center w-full"
        >
          <Envelope
            state={state}
            onOpen={handleOpen}
            flapRef={flapRef}
            sealRef={sealRef}
            cardRef={cardRef}
            cardHeaderRef={cardHeaderRef}
            cardNamesRef={cardNamesRef}
            cardDetailsRef={cardDetailsRef}
            cardCtaRef={cardCtaRef}
            onEnterWedding={handleEnterWedding}
          />
        </div>

        {/* BOTTOM: YOU'RE INVITED & TAP TO OPEN PROMPT */}
        <div
          ref={teaserCtaRef}
          className="w-full max-w-[340px] flex flex-col items-center text-center mt-3 sm:mt-5 z-20 pointer-events-auto min-h-[44px]"
        >
          {state === "CLOSED" && (
            <div className="flex flex-col items-center">
              <span className="font-cinzel text-[8.5px] sm:text-[9.5px] tracking-[0.3em] text-[#caa24d]/85 uppercase font-light">
                YOU&apos;RE INVITED
              </span>
              <div className="mt-2">
                <TapToOpenPrompt onClick={handleOpen} />
              </div>
            </div>
          )}
        </div>

        {/* Right Editorial Quote Panel matching reference */}
        <div
          ref={quotePanelRef}
          className="hidden xl:flex absolute -right-6 lg:right-2 top-1/2 -translate-y-1/2 flex-col items-center justify-center text-center p-6 text-[#e5c57b]/85 space-y-1.5 select-none pointer-events-none opacity-0"
        >
          <p className="font-cinzel text-[10px] tracking-[0.35em]">LOVE</p>
          <p className="font-cinzel text-[10px] tracking-[0.35em]">PEOPLE</p>
          <p className="font-cinzel text-[10px] tracking-[0.35em]">GOOD FOOD</p>
          <p className="font-cinzel text-[10px] tracking-[0.35em]">GREAT TIMES</p>
          <div className="w-5 h-[1px] bg-[#caa24d]/50 my-2.5 mx-auto" />
          <p className="font-cinzel text-sm tracking-[0.3em] text-[#d8b257] font-medium">N / A</p>
        </div>
      </div>
    </main>
  );
};
