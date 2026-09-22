"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { weddingConfig } from "@/config/wedding";
import { animationConfig } from "@/config/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MonogramIntroProps {
  onComplete: () => void;
}

export const MonogramIntro: React.FC<MonogramIntroProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const crestRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const hasDismissedRef = useRef(false);
  const reducedMotion = useReducedMotion();

  const handleDismiss = () => {
    if (hasDismissedRef.current) return;
    hasDismissedRef.current = true;

    if (containerRef.current) {
      gsap.killTweensOf([
        containerRef.current,
        crestRef.current,
        ringRef.current,
        textRef.current,
        sheenRef.current,
      ]);
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: 0.45,
        ease: "power2.out",
        onComplete: () => onComplete(),
      });
    } else {
      onComplete();
    }
  };

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (!hasDismissedRef.current) {
            hasDismissedRef.current = true;
            onComplete();
          }
        },
      });

      // Initial state
      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set(crestRef.current, { opacity: 0, scale: 0.92, y: 10 });
      gsap.set(ringRef.current, { rotation: -25 });
      gsap.set(textRef.current, { opacity: 0, y: 8 });
      gsap.set(sheenRef.current, { x: "-120%", opacity: 0 });

      // 1. Crest & Ring entrance
      tl.to(crestRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: animationConfig.timings.introFadeIn,
        ease: "power3.out",
      })
        .to(
          ringRef.current,
          {
            rotation: 0,
            duration: 2.2,
            ease: "power2.out",
          },
          "<"
        )
        .to(
          textRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
          },
          "-=0.7"
        )
        // 2. Golden sheen sweep
        .to(sheenRef.current, {
          opacity: 0.85,
          x: "120%",
          duration: 1.4,
          ease: "power2.inOut",
        })
        // 3. Hold luxury monogram
        .to({}, { duration: animationConfig.timings.introHold })
        // 4. Elegant dissolve
        .to(containerRef.current, {
          opacity: 0,
          scale: 1.05,
          filter: "blur(6px)",
          duration: animationConfig.timings.introFadeOut,
          ease: "power2.inOut",
        });
    });

    return () => ctx.revert();
  }, [reducedMotion, onComplete]);

  return (
    <div
      ref={containerRef}
      onClick={handleDismiss}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0104]/95 backdrop-blur-md cursor-pointer select-none px-6"
      role="button"
      aria-label="Skip opening monogram"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleDismiss();
      }}
    >
      <div
        ref={crestRef}
        className="relative flex flex-col items-center justify-center p-8 max-w-[340px] text-center"
      >
        {/* Decorative Ring Crest */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
          <svg
            ref={ringRef}
            viewBox="0 0 200 200"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <defs>
              <linearGradient id="crest-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fdf4d8" />
                <stop offset="35%" stopColor="#d4af37" />
                <stop offset="70%" stopColor="#997528" />
                <stop offset="100%" stopColor="#fae7b8" />
              </linearGradient>
            </defs>
            {/* Outer concentric thin circle */}
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="url(#crest-gold)"
              strokeWidth="1"
              strokeOpacity="0.45"
            />
            {/* Inner beaded circle */}
            <circle
              cx="100"
              cy="100"
              r="84"
              fill="none"
              stroke="url(#crest-gold)"
              strokeWidth="1.2"
              strokeDasharray="2.5 4"
            />
            {/* Fine inner border */}
            <circle
              cx="100"
              cy="100"
              r="76"
              fill="none"
              stroke="url(#crest-gold)"
              strokeWidth="0.8"
              strokeOpacity="0.6"
            />
          </svg>

          {/* N / A Authentic Wax Seal Monogram Treatment */}
          <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center overflow-hidden">
            {/* Center Diagonal Divider Line matching wax seal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[1.5px] h-14 sm:h-18 bg-gradient-to-b from-[#fdf4d8] via-[#d4af37] to-[#997528] transform rotate-45 opacity-85 shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
            </div>

            {/* Upper-left 'N' */}
            <span className="absolute top-3 left-4 sm:top-4 sm:left-6 font-cinzel text-3xl sm:text-4xl tracking-normal text-transparent bg-clip-text bg-gradient-to-b from-[#fff6de] via-[#d4af37] to-[#997528] drop-shadow-[0_2px_10px_rgba(212,175,55,0.45)] select-none">
              {weddingConfig.couple.groom.charAt(0)}
            </span>

            {/* Lower-right 'A' */}
            <span className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 font-cinzel text-3xl sm:text-4xl tracking-normal text-transparent bg-clip-text bg-gradient-to-b from-[#fff6de] via-[#d4af37] to-[#997528] drop-shadow-[0_2px_10px_rgba(212,175,55,0.45)] select-none">
              {weddingConfig.couple.bride.charAt(0)}
            </span>

            {/* Sweep sheen bar */}
            <div
              ref={sheenRef}
              className="absolute inset-0 w-full h-full pointer-events-none bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg]"
            />
          </div>
        </div>

        {/* Caption Names & Tag */}
        <div ref={textRef} className="mt-6 flex flex-col items-center gap-1.5">
          <p className="font-sans text-[11px] sm:text-xs tracking-[0.35em] text-gold-300/85 uppercase">
            {weddingConfig.couple.groom} &amp; {weddingConfig.couple.bride}
          </p>
          <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent my-1" />
          <p className="font-serif italic text-xs sm:text-sm text-gold-200/60 tracking-wider">
            {weddingConfig.date.year}
          </p>
        </div>

        <p className="mt-8 text-[9px] text-gold-200/30 uppercase tracking-[0.25em]">
          Tap anywhere to skip
        </p>
      </div>
    </div>
  );
};
