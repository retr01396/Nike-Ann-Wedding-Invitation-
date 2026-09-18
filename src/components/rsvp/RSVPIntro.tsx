"use strict";
"use client";

import React, { useRef, useLayoutEffect } from "react";
import { weddingConfig } from "@/config/wedding";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export const RSVPIntro: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const { rsvp } = weddingConfig;

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
      className="text-center max-w-xl mx-auto mb-8 sm:mb-12 space-y-2 relative z-10 px-4"
    >
      {/* Reference Eyebrow: KINDLY */}
      <div ref={badgeRef}>
        <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.35em] text-[#caa24d]/85 uppercase font-medium">
          {rsvp.badge}
        </span>
      </div>

      {/* Reference Main Title: RSVP */}
      <h2
        ref={headingRef}
        className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-[0.2em] text-[#fff0c7] uppercase leading-tight"
      >
        {rsvp.title}
      </h2>

      {/* Reference Delicate Hairline Divider */}
      <div ref={dividerRef} className="pt-1.5 flex justify-center items-center">
        <div className="w-12 sm:w-16 h-[1px] bg-[#caa24d]/40" />
      </div>

      {/* Subtitle / Invitation Copy */}
      {rsvp.subtitle && (
        <p
          ref={subtitleRef}
          className="font-serif text-xs sm:text-sm italic text-[#e5c57b]/80 pt-2 max-w-md mx-auto leading-relaxed"
        >
          {rsvp.subtitle}
        </p>
      )}

      {/* Deadline Note */}
      {rsvp.deadlineNote && (
        <p className="font-sans text-[9px] sm:text-[9.5px] uppercase tracking-[0.25em] text-[#caa24d]/60 font-light pt-1">
          {rsvp.deadlineNote}
        </p>
      )}
    </div>
  );
};
