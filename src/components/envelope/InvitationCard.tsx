"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { weddingConfig } from "@/config/wedding";

interface InvitationCardProps {
  onEnterWedding?: () => void;
  headerRef?: React.RefObject<HTMLDivElement>;
  namesRef?: React.RefObject<HTMLDivElement>;
  detailsRef?: React.RefObject<HTMLDivElement>;
  ctaRef?: React.RefObject<HTMLDivElement>;
}

export const InvitationCard = forwardRef<HTMLDivElement, InvitationCardProps>(
  ({ onEnterWedding, headerRef, namesRef, detailsRef, ctaRef }, ref) => {
    return (
      <div
        ref={ref}
        className="relative w-full h-full rounded-none bg-gradient-to-b from-[#24060d] via-[#1a0409] to-[#100205] p-3 sm:p-5 md:p-6 select-none backface-hidden overflow-hidden"
        style={{
          boxShadow:
            "0 30px 70px -10px rgba(0, 0, 0, 0.98), 0 0 40px rgba(0, 0, 0, 0.9)",
        }}
      >
        {/* Subtle velvet/cardstock tactile texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Top-Right Authentic Dark Crimson Dahlia (Clean crop with smooth radial fade mask) */}
        <div
          className="absolute -top-3 -right-3 w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 pointer-events-none overflow-hidden opacity-90"
          style={{
            maskImage: "radial-gradient(circle at 100% 0%, black 50%, transparent 95%)",
            WebkitMaskImage: "radial-gradient(circle at 100% 0%, black 50%, transparent 95%)",
          }}
        >
          <Image
            src="/images/wedding/envelope/card-floral-clean-top.jpg"
            alt=""
            width={192}
            height={192}
            className="object-contain object-top-right filter brightness-105"
            priority
          />
        </div>

        {/* Bottom-Left Authentic Floral Petals (Clean crop with smooth radial fade mask) */}
        <div
          className="absolute -bottom-4 -left-4 w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 pointer-events-none overflow-hidden opacity-85 transform scale-x-[-1] scale-y-[-1]"
          style={{
            maskImage: "radial-gradient(circle at 100% 0%, black 50%, transparent 95%)",
            WebkitMaskImage: "radial-gradient(circle at 100% 0%, black 50%, transparent 95%)",
          }}
        >
          <Image
            src="/images/wedding/envelope/card-floral-clean-top.jpg"
            alt=""
            width={192}
            height={192}
            className="object-contain object-top-right filter brightness-105"
            priority
          />
        </div>

        {/* Top-Left Corner Subtitle matching reference */}
        <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 md:top-4 md:left-4 text-left z-10 pointer-events-none">
          <span className="font-cinzel text-[6px] sm:text-[7px] md:text-[8.5px] tracking-[0.26em] text-[#caa24d] block leading-tight">
            A
          </span>
          <span className="font-cinzel text-[6px] sm:text-[7px] md:text-[8.5px] tracking-[0.26em] text-[#caa24d] block leading-tight">
            BRIGHTER
          </span>
          <span className="font-cinzel text-[6px] sm:text-[7px] md:text-[8.5px] tracking-[0.26em] text-[#caa24d] block leading-tight">
            CHAPTER
          </span>
          <span className="font-cinzel text-[6px] sm:text-[7px] md:text-[8.5px] tracking-[0.26em] text-[#caa24d] block leading-tight">
            TOGETHER
          </span>
          <div className="w-3.5 sm:w-4.5 md:w-5 h-[0.75px] bg-[#caa24d]/70 mt-1" />
        </div>

        {/* Card Content Layout */}
        <div className="relative z-10 flex flex-col items-center justify-between h-full text-center py-1 sm:py-2 md:py-3">
          {/* Header Tag & Families Invite (Positioned with generous clearance below top-left subtitle) */}
          <div ref={headerRef} className="pt-9 sm:pt-11 md:pt-12 flex flex-col items-center">
            <p className="font-cinzel text-[8px] sm:text-[9.5px] md:text-[11.5px] tracking-[0.28em] text-[#e5c57b] uppercase font-light">
              TOGETHER WITH OUR FAMILIES
            </p>
            <p className="font-cinzel text-[7.5px] sm:text-[8.5px] md:text-[10.5px] tracking-[0.24em] text-[#e5c57b]/80 uppercase mt-0.5 font-light">
              WE INVITE YOU TO THE WEDDING OF
            </p>
          </div>

          {/* Couple Names Section (Refined Luxury Serif + Cursive Script - Comfortably Readable) */}
          <div ref={namesRef} className="my-0.5 sm:my-1 flex flex-col items-center">
            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-[54px] tracking-[0.35em] text-[#fbf6ea] font-normal leading-tight pl-2">
              NIKE
            </h1>

            <div className="font-script text-2xl sm:text-3xl md:text-4xl text-[#d8b257] italic my-0 sm:my-0.5 font-normal">
              and
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-[54px] tracking-[0.35em] text-[#fbf6ea] font-normal leading-tight pl-2">
              ANN
            </h1>
          </div>

          {/* Date & Location Section */}
          <div ref={detailsRef} className="flex flex-col items-center">
            <p className="font-cinzel text-[9px] sm:text-[11px] md:text-[12.5px] tracking-[0.28em] text-[#fbf6ea] uppercase font-medium">
              SUNDAY, 15 NOVEMBER 2026
            </p>
            <p className="font-cinzel text-[8.5px] sm:text-[10px] md:text-[11.5px] tracking-[0.25em] text-[#e5c57b] uppercase mt-0.5 font-normal">
              THRISSUR, KERALA
            </p>
            <div className="w-8 sm:w-12 md:w-16 h-[1px] bg-[#caa24d]/60 mx-auto my-1.5 sm:my-2 md:my-2.5" />

            {/* Presence Note */}
            <div className="font-cinzel text-[8px] sm:text-[9.5px] md:text-[11px] tracking-[0.22em] text-[#fbf6ea]/90 uppercase leading-relaxed font-normal">
              <p>YOUR PRESENCE</p>
              <p>WILL MAKE OUR DAY</p>
              <p>EVEN MORE SPECIAL</p>
            </div>
          </div>

          {/* Outlined Action Button matching reference */}
          <div ref={ctaRef} className="pt-0.5 pb-0.5">
            <button
              type="button"
              onClick={onEnterWedding}
              className="px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-2.5 rounded-none border border-[#caa24d] bg-[#1a0307]/60 text-[#fbf6ea] font-cinzel text-[8.5px] sm:text-[10px] md:text-[11.5px] tracking-[0.25em] uppercase hover:bg-[#caa24d]/25 hover:border-[#fff0c7] hover:text-white transition-all cursor-pointer shadow-md"
              aria-label="Enter our wedding invitation website"
            >
              ENTER OUR WEDDING →
            </button>
          </div>
        </div>
      </div>
    );
  }
);

InvitationCard.displayName = "InvitationCard";

