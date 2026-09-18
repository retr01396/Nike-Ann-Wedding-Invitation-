"use strict";
"use client";

import React, { useRef, useLayoutEffect } from "react";
import { weddingConfig } from "@/config/wedding";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export const TravelIntro: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const { travel } = weddingConfig;

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const elements = [
        badgeRef.current,
        headingRef.current,
        dividerRef.current,
        subtitleRef.current,
      ].filter(Boolean);

      gsap.fromTo(
        elements,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            end: "top 60%",
            scrub: 0.6,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="text-center max-w-xl mx-auto mb-10 sm:mb-14 md:mb-16 space-y-2 relative z-10 px-4"
    >
      {/* Reference Supertitle: TRAVEL */}
      <div ref={badgeRef}>
        <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.35em] text-[#caa24d]/85 uppercase font-medium">
          {travel.badge}
        </span>
      </div>

      {/* Reference Main Title: GETTING THERE */}
      <h2
        ref={headingRef}
        className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-[0.2em] text-[#fff0c7] uppercase leading-tight"
      >
        {travel.title}
      </h2>

      {/* Reference Delicate Hairline Divider */}
      <div ref={dividerRef} className="pt-2 flex justify-center items-center">
        <div className="w-12 sm:w-16 h-[1px] bg-[#caa24d]/40" />
      </div>

      {/* Subtitle / Narrative Guide */}
      {travel.subtitle && (
        <p
          ref={subtitleRef}
          className="font-serif text-xs sm:text-sm italic text-[#e5c57b]/75 pt-2 max-w-md mx-auto leading-relaxed"
        >
          {travel.subtitle}
        </p>
      )}
    </div>
  );
};
