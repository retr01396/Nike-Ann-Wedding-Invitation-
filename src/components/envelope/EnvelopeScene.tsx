"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { weddingConfig } from "@/config/wedding";
import { animationConfig } from "@/config/animations";
import { EnvelopeAnimationState } from "@/types/wedding";
import { Envelope } from "./Envelope";
import { TapToOpenPrompt } from "./TapToOpenPrompt";
import { WeddingCountdown } from "@/components/countdown/WeddingCountdown";
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
      if (topHeaderRef.current) gsap.set(topHeaderRef.current, { opacity: 0, pointerEvents: "none" });
      if (envelopeContainerRef.current) gsap.set(envelopeContainerRef.current, { y: 0 });
      if (cardRef.current) {
        const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
        const targetYP = isMobile ? -23 : -15;
        gsap.set(cardRef.current, {
          yPercent: targetYP,
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
      if (teaserCtaRef.current) gsap.set(teaserCtaRef.current, { opacity: 1, y: 0, pointerEvents: "auto" });
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
        if (teaserCtaRef.current) {
          gsap.to(teaserCtaRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
        }
      },
    });
    timelineRef.current = tl;
    if (typeof window !== "undefined") {
      (window as any).__envelopeTl = tl;
    }

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
                setState((prev) => (prev !== "CARD_CLEARING" ? "CARD_CLEARING" : prev));
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
        yPercent: typeof window !== "undefined" && window.innerWidth < 640 ? -23 : -15,
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
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.2"
      )

      // 8. CARD EXPANDING: post-emergence resize to the large presentation width.
      // The card's width is set by the .card-presented rule (viewport-aware clamp);
      // the animation itself only needs to clear the transform so the CSS width wins,
      // so the scale target is 1.0 on every device — the presentation width is already
      // ~80-88% of the mobile viewport and framed on desktop.
      .call(() => setState("CARD_EXPANDING"))
      .to(cardRef.current, {
        scale: 1.0,
        duration: 0.65,
        ease: "power2.out",
      });
  }, [state, reducedMotion]);

  const handleEnterWedding = useCallback(() => {
    const target = document.getElementById("our-story") || document.getElementById("story");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <main
      ref={sceneContainerRef}
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center px-4 py-6 sm:py-8 safe-area-top safe-area-bottom z-10 overflow-hidden select-none bg-transparent"
    >
      {/* =========================================================================
          HERO PHOTOGRAPHIC FLORAL FRAMING
          Authentic crops placed on left and right framing the living fluid silk
         ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Layer 1: Left Side Floral Framing (Dahlia, Baby's Breath & Velvet) */}
        <div
          className="absolute top-0 left-0 w-[220px] sm:w-[300px] md:w-[360px] h-[500px] sm:h-[650px] md:h-[750px] pointer-events-none opacity-70 z-[1]"
          style={{
            WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 98%), linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
            maskImage: "linear-gradient(to right, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 98%), linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
            WebkitMaskComposite: "destination-in",
            maskComposite: "intersect",
          }}
        >
          <Image
            src={weddingConfig.images.hero.floralLeft}
            alt=""
            fill
            sizes="360px"
            className="object-cover object-left-top filter brightness-[0.78] saturate-[0.92] contrast-105"
            priority
          />
        </div>

        {/* Layer 2: Right Side Floral Framing (Plate, Crystal & Baby's Breath) */}
        <div
          className="absolute top-0 right-0 w-[220px] sm:w-[300px] md:w-[360px] h-[500px] sm:h-[650px] md:h-[750px] pointer-events-none opacity-70 z-[1]"
          style={{
            WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 98%), linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
            maskImage: "linear-gradient(to left, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 98%), linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
            WebkitMaskComposite: "destination-in",
            maskComposite: "intersect",
          }}
        >
          <Image
            src={weddingConfig.images.hero.floralRight}
            alt=""
            fill
            sizes="360px"
            className="object-cover object-right-top filter brightness-[0.78] saturate-[0.92] contrast-105"
            priority
          />
        </div>

        {/* Layer 3: Velvet Vignette Shadow Overlays — edges and corners fall
            to near-black; the centre behind the envelope stays DARK */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(8,2,4,0.45)_0%,_rgba(6,1,3,0.72)_58%,_#050102_95%)] pointer-events-none z-[2]" />
      </div>

      {/* Replay Button matching reference style */}
      {state === "OPENED" && (
        <button
          type="button"
          onClick={setupInitialState}
          className="absolute top-4 sm:top-6 left-4 sm:left-8 z-30 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#caa24d]/35 bg-[#170408]/85 text-[#e5c57b] font-cinzel text-[8.5px] sm:text-[9.5px] tracking-[0.2em] uppercase backdrop-blur-md hover:border-[#caa24d] hover:text-[#fff0c7] transition-all cursor-pointer shadow-lg"
          aria-label="Replay envelope animation"
        >
          <RotateCcw className="w-3 h-3 text-[#caa24d]" />
          <span>REPLAY</span>
        </button>
      )}

      {/* Left Editorial: TWO SOULS ONE BEAUTIFUL JOURNEY */}
      <div className="hidden lg:flex flex-col items-start absolute left-8 xl:left-14 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div className="w-[1px] h-14 bg-gradient-to-b from-[#caa24d]/70 to-[#caa24d]/10 mb-4" />
        <p className="font-cinzel text-[10px] xl:text-[11px] tracking-[0.35em] text-[#e5c57b]/80 uppercase leading-[2.2]">
          {"TWO\nSOULS\nONE\nBEAUTIFUL\nJOURNEY"
            .split("\n")
            .map((word, i) => (
              <span key={i} className="block">
                {word}
              </span>
            ))}
        </p>
      </div>

      {/* Right Editorial Calligraphy: Perhaps It Was Grace */}
      <div className="hidden lg:flex flex-col items-center absolute right-8 xl:right-16 top-1/3 -translate-y-1/2 z-20 pointer-events-none">
        <p className="font-script text-3xl xl:text-4xl text-[#e5c57b]/90 -rotate-12 origin-center leading-tight drop-shadow-[0_2px_14px_rgba(202,162,77,0.3)]">
          Perhaps
          <br />
          It Was
          <br />
          Grace
        </p>
      </div>

      {/* TOP HEADER: Right Private Invitation Badge */}
      <div
        ref={topHeaderRef}
        className="absolute top-4 sm:top-6 md:top-8 left-0 right-0 w-full flex items-center justify-end px-4 sm:px-8 z-30 pointer-events-auto"
      >
        {/* TOP RIGHT: 🔒 PRIVATE INVITATION */}
        <div className="flex items-center gap-1.5 text-[#caa24d]/85 font-cinzel text-[7.5px] sm:text-[9.5px] tracking-[0.25em] uppercase font-light">
          <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#caa24d]" />
          <span>PRIVATE INVITATION</span>
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

        {/* BOTTOM: YOU'RE INVITED & TAP TO OPEN PROMPT OR LIVE WEDDING COUNTDOWN */}
        <div
          ref={teaserCtaRef}
          className="w-full max-w-[420px] flex flex-col items-center text-center mt-3 sm:mt-5 z-20 pointer-events-auto min-h-[50px]"
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

          {state === "OPENED" && (
            <div className="w-full flex justify-center animate-fadeIn">
              <WeddingCountdown />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Scroll Indicator: SCROLL TO BEGIN (matching reference) */}
      <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex flex-col items-center justify-center z-20 pointer-events-none opacity-80">
        <div className="w-3.5 h-6 rounded-full border border-[#caa24d]/50 flex items-start justify-center p-0.5 mb-1">
          <div className="w-0.5 h-1.5 bg-[#e5c57b] rounded-full animate-bounce" />
        </div>
        <span className="font-cinzel text-[7.5px] sm:text-[8.5px] tracking-[0.35em] text-[#caa24d]/85 uppercase font-light">
          SCROLL TO BEGIN
        </span>
      </div>
    </main>
  );
};
