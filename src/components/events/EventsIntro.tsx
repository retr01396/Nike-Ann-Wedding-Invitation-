"use strict";
"use client";

import React, { useRef, useLayoutEffect } from "react";
import { weddingConfig } from "@/config/wedding";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export const EventsIntro: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  const { events } = weddingConfig;

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const elements = [badgeRef.current, headingRef.current, dividerRef.current].filter(Boolean);

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
      {/* Reference Supertitle: THE CELEBRATION */}
      <div ref={badgeRef}>
        <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.35em] text-[#caa24d]/85 uppercase font-medium">
          {events.badge}
        </span>
      </div>

      {/* Reference Main Title: EVENT DETAILS */}
      <h2
        ref={headingRef}
        className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-[0.2em] text-[#fff0c7] uppercase leading-tight"
      >
        {events.title}
      </h2>

      {/* Reference Delicate Hairline Divider */}
      <div ref={dividerRef} className="pt-2 flex justify-center items-center">
        <div className="w-12 sm:w-16 h-[1px] bg-[#caa24d]/40" />
      </div>
    </div>
  );
};
