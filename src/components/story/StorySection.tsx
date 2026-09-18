"use client";

import React, { useState } from "react";
import Image from "next/image";
import { weddingConfig } from "@/config/wedding";
import { MapPin } from "lucide-react";

export const StorySection: React.FC = () => {
  const [showTimelineInFlow, setShowTimelineInFlow] = useState(false);

  return (
    <section
      id="our-story"
      aria-label="Our Story"
      className="relative w-full py-8 sm:py-14 px-4 sm:px-8 max-w-6xl mx-auto z-20 select-none scroll-mt-16"
    >
      {/* Anchor alias for #story */}
      <span id="story" className="sr-only" aria-hidden="true" />

      {/* Editorial 3-Part Magazine Spread matching reference */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch">
        {/* =========================================================================
            COLUMN 1 (LEFT): EDITORIAL TEXT PANEL
           ========================================================================= */}
        <div className="relative rounded-none bg-gradient-to-b from-[#1b0408]/90 via-[#130306]/95 to-[#0b0103]/95 p-6 sm:p-7 flex flex-col justify-between border border-[#caa24d]/25 shadow-[0_15px_35px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Subtle floral watermark in background */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 opacity-20 pointer-events-none">
            <Image
              src="/images/wedding/story/story-edge-left.jpg"
              alt=""
              width={160}
              height={160}
              className="object-cover rounded-full filter blur-[1px]"
            />
          </div>

          <div className="relative z-10">
            {/* Eyebrow */}
            <span className="font-cinzel text-[8.5px] sm:text-[9.5px] tracking-[0.35em] text-[#caa24d] uppercase font-medium block">
              OUR STORY
            </span>
            <div className="w-5 h-[1px] bg-[#caa24d]/60 mt-1 mb-3" />

            {/* Headline */}
            <h2 className="font-cinzel text-xl sm:text-2xl min-[1100px]:text-[24px] tracking-[0.12em] text-[#fbf6ea] leading-snug font-normal">
              TWO SOULS,
              <br />
              A SHARED JOURNEY
            </h2>

            {/* Narrative Body Copy */}
            <p className="mt-4 font-serif text-xs sm:text-[13.5px] text-[#e8d5bc]/90 leading-relaxed font-light">
              What started as conversations, grew into friendship, and turned into a love we never saw coming. Here&apos;s to everything that led us here.
            </p>
          </div>

          {/* Outlined In-flow Action Button */}
          <div className="relative z-10 pt-6">
            <button
              type="button"
              onClick={() => setShowTimelineInFlow(!showTimelineInFlow)}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-none border border-[#caa24d]/50 bg-transparent text-[#e5c57b] font-cinzel text-[9px] sm:text-[10px] tracking-[0.25em] uppercase hover:bg-[#caa24d]/10 hover:border-[#caa24d] hover:text-[#fff0c7] transition-all cursor-pointer shadow-sm"
              aria-expanded={showTimelineInFlow}
              aria-label={showTimelineInFlow ? "Collapse milestone timeline" : "View full milestone chapters"}
            >
              <span>{showTimelineInFlow ? "HIDE CHAPTERS" : "OUR CHAPTERS"}</span>
              <span className="text-xs transition-transform duration-300">
                {showTimelineInFlow ? "↑" : "↓"}
              </span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            COLUMN 2 (CENTER): PHOTOGRAPHIC PANEL (HANDS & RING)
           ========================================================================= */}
        <div className="relative rounded-none overflow-hidden border border-[#caa24d]/25 bg-[#120205] shadow-[0_15px_35px_rgba(0,0,0,0.85)] min-h-[260px] sm:min-h-[300px] flex items-center justify-center group">
          {/* Main Hand & Ring Photograph */}
          <div className="relative w-full h-full min-h-[260px] sm:min-h-[300px]">
            <Image
              src="/images/wedding/story/hands-ring-card.jpg"
              alt="Hands holding with sparkling engagement ring"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover object-center filter contrast-105 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              priority
            />
            {/* Subtle photographic vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0104]/50 via-transparent to-[#0d0104]/20 pointer-events-none" />
          </div>
        </div>

        {/* =========================================================================
            COLUMN 3 (RIGHT): FLORAL & SCRIPT QUOTE PANEL ("Better Together Always")
           ========================================================================= */}
        <div className="relative rounded-none overflow-hidden border border-[#caa24d]/25 bg-[#140306] shadow-[0_15px_35px_rgba(0,0,0,0.8)] min-h-[260px] sm:min-h-[300px] flex items-center justify-center">
          {/* Background image of floral artwork and calligraphy quote */}
          <div className="relative w-full h-full min-h-[260px] sm:min-h-[300px]">
            <Image
              src="/images/wedding/story/story-right-floral-card.jpg"
              alt="Floral bouquet and 'Better Together Always' calligraphy with diamond crystal"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover object-center"
              priority
            />
            {/* Delicate overlay to ensure atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#130306]/15 to-[#0c0103]/40 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          IN-FLOW MILESTONE TIMELINE CHAPTERS
          Pushes page content down naturally with NO fixed modal overlay
         ========================================================================= */}
      {showTimelineInFlow && (
        <div className="mt-6 sm:mt-8 p-6 sm:p-8 rounded-none bg-gradient-to-b from-[#1b0408]/95 via-[#130306]/98 to-[#0b0103]/95 border border-[#caa24d]/30 shadow-[0_20px_45px_rgba(0,0,0,0.85)] transition-all">
          <div className="flex items-center justify-between border-b border-[#caa24d]/25 pb-4 mb-6">
            <div>
              <span className="font-cinzel text-[8.5px] sm:text-[9.5px] tracking-[0.3em] text-[#caa24d] uppercase font-medium">
                {weddingConfig.storyTimeline.badge}
              </span>
              <h3 className="font-cinzel text-lg sm:text-xl text-[#fbf6ea] tracking-[0.1em] font-normal">
                {weddingConfig.storyTimeline.title}
              </h3>
              <p className="font-serif italic text-xs text-[#caa24d]/80 mt-0.5">
                {weddingConfig.storyTimeline.subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowTimelineInFlow(false)}
              className="px-3 py-1 text-[#caa24d] hover:text-[#fff0c7] border border-[#caa24d]/30 hover:border-[#caa24d] text-[9.5px] font-cinzel tracking-wider uppercase transition-colors cursor-pointer"
            >
              COLLAPSE ↑
            </button>
          </div>

          {/* In-flow Milestone Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {weddingConfig.storyTimeline.milestones.map((m) => (
              <div
                key={m.id}
                className="relative p-5 rounded-none bg-[#160307]/80 border border-[#caa24d]/20 space-y-2 hover:border-[#caa24d]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-[#caa24d]/15 border border-[#caa24d]/30 text-[#e5c57b] font-cinzel text-[9.5px] tracking-[0.2em]">
                    {m.year} · {m.dateTag || m.year}
                  </span>
                  <div className="flex items-center gap-1 text-[#caa24d]/75 text-[10.5px] font-sans">
                    <MapPin className="w-3 h-3 text-[#caa24d]" />
                    <span>{m.location}</span>
                  </div>
                </div>
                <h4 className="font-cinzel text-sm sm:text-[15px] text-[#fbf6ea] tracking-wide pt-1">
                  {m.title}
                </h4>
                <p className="font-serif italic text-xs text-[#caa24d]/90">
                  {m.subtitle}
                </p>
                <p className="font-serif text-xs sm:text-[13px] text-[#ecd9b8]/90 leading-relaxed pt-1">
                  {m.description}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Quote */}
          {weddingConfig.storyTimeline.closingQuote && (
            <div className="mt-6 pt-4 border-t border-[#caa24d]/20 text-center">
              <p className="font-serif italic text-xs sm:text-sm text-[#d8b257]/85">
                {weddingConfig.storyTimeline.closingQuote.line1}
              </p>
              <p className="font-cinzel text-[10px] tracking-[0.2em] text-[#caa24d]/70 mt-1 uppercase">
                {weddingConfig.storyTimeline.closingQuote.line2}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

