"use strict";
"use client";

import React from "react";
import { TimelineMilestone } from "@/types/wedding";
import { AlbumPhoto } from "./AlbumPhoto";
import { TimelineNode } from "./TimelineNode";

interface TimelineItemProps {
  milestone: TimelineMilestone;
  index: number;
  isActive: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  milestone,
  index,
  isActive,
}) => {
  const isEven = index % 2 === 0;

  return (
    <div
      data-milestone-index={index}
      className="timeline-item relative py-10 sm:py-16 md:py-20 w-full"
    >
      {/* ============================================================ */}
      {/* DESKTOP / TABLET ALTERNATING LAYOUT (md:flex hidden on mobile) */}
      {/* ============================================================ */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-16 lg:gap-24 items-center relative">
        {/* Central Node Anchor (positioned directly in the middle over the vertical line) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
          <TimelineNode year={milestone.year} isActive={isActive} />

          {/* Left / Right horizontal connector stems */}
          {isEven ? (
            <div
              className={`absolute right-full top-1/2 -translate-y-1/2 h-[1px] w-8 lg:w-12 transition-all duration-700 ${
                isActive
                  ? "bg-gradient-to-l from-[#caa24d] to-[#e5c57b]/40 shadow-[0_0_8px_rgba(202,162,77,0.5)]"
                  : "bg-gradient-to-l from-[#caa24d]/30 to-transparent"
              }`}
            />
          ) : (
            <div
              className={`absolute left-full top-1/2 -translate-y-1/2 h-[1px] w-8 lg:w-12 transition-all duration-700 ${
                isActive
                  ? "bg-gradient-to-r from-[#caa24d] to-[#e5c57b]/40 shadow-[0_0_8px_rgba(202,162,77,0.5)]"
                  : "bg-gradient-to-r from-[#caa24d]/30 to-transparent"
              }`}
            />
          )}
        </div>

        {/* LEFT COLUMN */}
        <div
          className={`timeline-col-left flex flex-col ${
            isEven ? "items-end text-right pr-6 lg:pr-10" : "items-end text-right pr-6 lg:pr-10"
          }`}
        >
          {isEven ? (
            /* Even: Photo on the Left */
            <div className="w-full max-w-[420px]">
              <AlbumPhoto
                src={milestone.image}
                alt={milestone.imageAlt}
                orientation={milestone.orientation}
                location={milestone.location}
                className="transform transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>
          ) : (
            /* Odd: Editorial Text on the Left (aligned right toward center line) */
            <div className="w-full max-w-[420px] space-y-3">
              {milestone.dateTag && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20050a]/90 border border-[#caa24d]/30 text-xs font-serif tracking-[0.2em] text-[#caa24d] uppercase shadow-inner">
                  <span>{milestone.dateTag}</span>
                </div>
              )}
              <h3 className="font-serif text-2xl lg:text-3xl text-[#fff0c7] tracking-wide font-normal">
                {milestone.title}
              </h3>
              {milestone.subtitle && (
                <p className="font-serif italic text-sm lg:text-base text-[#e5c57b]/90 tracking-wide">
                  {milestone.subtitle}
                </p>
              )}
              <p className="font-sans text-sm lg:text-base text-[#d1bfa7] leading-relaxed font-light">
                {milestone.description}
              </p>
              {milestone.location && (
                <p className="font-serif text-xs tracking-widest text-[#caa24d]/70 uppercase pt-1">
                  {milestone.location}
                </p>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div
          className={`timeline-col-right flex flex-col ${
            isEven ? "items-start text-left pl-6 lg:pl-10" : "items-start text-left pl-6 lg:pl-10"
          }`}
        >
          {isEven ? (
            /* Even: Editorial Text on the Right */
            <div className="w-full max-w-[420px] space-y-3">
              {milestone.dateTag && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20050a]/90 border border-[#caa24d]/30 text-xs font-serif tracking-[0.2em] text-[#caa24d] uppercase shadow-inner">
                  <span>{milestone.dateTag}</span>
                </div>
              )}
              <h3 className="font-serif text-2xl lg:text-3xl text-[#fff0c7] tracking-wide font-normal">
                {milestone.title}
              </h3>
              {milestone.subtitle && (
                <p className="font-serif italic text-sm lg:text-base text-[#e5c57b]/90 tracking-wide">
                  {milestone.subtitle}
                </p>
              )}
              <p className="font-sans text-sm lg:text-base text-[#d1bfa7] leading-relaxed font-light">
                {milestone.description}
              </p>
              {milestone.location && (
                <p className="font-serif text-xs tracking-widest text-[#caa24d]/70 uppercase pt-1">
                  {milestone.location}
                </p>
              )}
            </div>
          ) : (
            /* Odd: Photo on the Right */
            <div className="w-full max-w-[420px]">
              <AlbumPhoto
                src={milestone.image}
                alt={milestone.imageAlt}
                orientation={milestone.orientation}
                location={milestone.location}
                className="transform transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE SINGLE-COLUMN LUXURY LAYOUT (< md) */}
      {/* ============================================================ */}
      <div className="md:hidden flex flex-col items-center text-center px-4 relative z-10">
        {/* Node pinned along the center line */}
        <div className="mb-4">
          <TimelineNode year={milestone.year} isActive={isActive} />
        </div>

        {/* Date Tag */}
        {milestone.dateTag && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#20050a]/90 border border-[#caa24d]/35 text-[11px] font-serif tracking-[0.2em] text-[#caa24d] uppercase shadow-md">
            <span>{milestone.dateTag}</span>
          </div>
        )}

        {/* Milestone Album Photo */}
        <div className="w-full max-w-[340px] mb-5">
          <AlbumPhoto
            src={milestone.image}
            alt={milestone.imageAlt}
            orientation={milestone.orientation}
            location={milestone.location}
          />
        </div>

        {/* Story Narrative in Archival Velvet Card (prevents timeline line collision & enhances physical stationery feel) */}
        <div className="w-full max-w-[340px] space-y-2.5 px-4 py-3.5 rounded-xl bg-[#180409]/90 backdrop-blur-sm border border-[#caa24d]/25 shadow-[0_12px_32px_rgba(0,0,0,0.85)]">
          <h3 className="font-serif text-xl text-[#fff0c7] tracking-wide font-normal">
            {milestone.title}
          </h3>
          {milestone.subtitle && (
            <p className="font-serif italic text-xs text-[#e5c57b]/90 tracking-wide">
              {milestone.subtitle}
            </p>
          )}
          <p className="font-sans text-xs sm:text-sm text-[#d1bfa7] leading-relaxed font-light">
            {milestone.description}
          </p>
          {milestone.location && (
            <p className="font-serif text-[10px] tracking-widest text-[#caa24d]/70 uppercase pt-1">
              {milestone.location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
