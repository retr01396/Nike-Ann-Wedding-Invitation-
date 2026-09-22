"use strict";
"use client";

import React, { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { weddingConfig } from "@/config/wedding";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export const StoryIntro: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { storyIntro } = weddingConfig;

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Subtle parallax & reveal for the portrait
      if (portraitRef.current) {
        gsap.fromTo(
          portraitRef.current,
          { opacity: 0.2, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "center 50%",
              scrub: 1,
            },
          }
        );
      }

      // Editorial text reveal
      if (contentRef.current) {
        const textElements = contentRef.current.querySelectorAll(".editorial-reveal");
        gsap.fromTo(
          textElements,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              end: "center 45%",
              scrub: 1,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story-intro"
      ref={containerRef}
      className="relative min-h-[90vh] py-20 sm:py-28 md:py-36 px-4 sm:px-6 flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full pointer-events-none opacity-25"
        style={{
          background:
            "radial-gradient(circle, rgba(202, 162, 77, 0.2) 0%, rgba(58, 8, 16, 0.4) 50%, rgba(20, 3, 6, 0) 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center relative z-10">
        {/* Fine-art portrait column */}
        <div
          ref={portraitRef}
          className="md:col-span-5 flex justify-center order-2 md:order-1"
        >
          <div
            className="relative w-full max-w-[320px] sm:max-w-[360px] p-3 rounded-lg"
            style={{
              background: "linear-gradient(145deg, #24060c 0%, #120205 100%)",
              boxShadow:
                "0 25px 60px -15px rgba(0,0,0,0.9), 0 0 35px rgba(202,162,77,0.15)",
            }}
          >
            {/* Gold foil borders */}
            <div className="absolute inset-0 rounded-lg border border-[#caa24d]/30 pointer-events-none" />
            <div className="absolute inset-1 rounded-[6px] border border-[#caa24d]/15 border-dashed pointer-events-none" />

            {/* Corner filigree accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#fcedc7]/60 pointer-events-none" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#fcedc7]/60 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#fcedc7]/60 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#fcedc7]/60 pointer-events-none" />

            {/* Image frame */}
            <div className="relative aspect-[4/5] rounded overflow-hidden bg-[#0d0104]">
              <Image
                src={storyIntro.portraitImage}
                alt={storyIntro.portraitAlt}
                fill
                sizes="(max-width: 768px) 85vw, 360px"
                className="object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-[#caa24d]/20 pointer-events-none" />
            </div>

            {storyIntro.portraitCaption && (
              <p className="pt-2 text-center font-serif italic text-xs text-[#e5c57b]/80 tracking-widest uppercase">
                {storyIntro.portraitCaption}
              </p>
            )}
          </div>
        </div>

        {/* Editorial Text column */}
        <div
          ref={contentRef}
          className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left space-y-6 order-1 md:order-2"
        >
          {/* Badge */}
          <div className="editorial-reveal inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#20050a]/90 border border-[#caa24d]/30 text-[11px] font-serif tracking-[0.25em] text-[#caa24d] uppercase shadow-md">
            <span className="w-1 h-1 rounded-full bg-[#e5c57b]" />
            <span>{storyIntro.badge}</span>
            <span className="w-1 h-1 rounded-full bg-[#e5c57b]" />
          </div>

          {/* Headline: "TWO SOULS, A SHARED JOURNEY" */}
          <div className="editorial-reveal space-y-1">
            {storyIntro.headline.map((line, idx) => (
              <h2
                key={idx}
                className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#fff0c7] via-[#f7e6b5] to-[#caa24d] leading-[1.15]"
              >
                {line}
              </h2>
            ))}
          </div>

          {/* Subheading */}
          <p className="editorial-reveal font-serif italic text-base sm:text-lg text-[#e5c57b]/90 max-w-xl font-light">
            {storyIntro.subheading}
          </p>

          {/* Golden hairline divider */}
          <div className="editorial-reveal w-24 h-[1px] bg-gradient-to-r from-transparent via-[#caa24d]/60 to-transparent my-2" />

          {/* Romantic Quote */}
          <div className="editorial-reveal relative max-w-lg pl-4 sm:pl-6 border-l-2 border-[#caa24d]/40 py-1">
            <blockquote className="font-serif italic text-sm sm:text-base text-[#fff5da]/90 leading-relaxed font-light">
              &ldquo;{storyIntro.quote}&rdquo;
            </blockquote>
            {storyIntro.quoteAuthor && (
              <cite className="block mt-2 font-sans text-xs tracking-widest text-[#caa24d]/70 uppercase not-italic font-normal">
                &mdash; {storyIntro.quoteAuthor}
              </cite>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
