"use strict";
"use client";

import React from "react";
import { WeddingEventDetailItem } from "@/types/wedding";
import {
  WeddingRingsIcon,
  ChurchCrossIcon,
  TharavaduIcon,
} from "./EventIcons";
import { EventArtwork } from "./EventArtwork";
import { EventDetailsPanel } from "./EventDetailsPanel";
import { ChevronDown } from "lucide-react";

interface EventCardProps {
  event: WeddingEventDetailItem;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isExpanded,
  onToggle,
  index,
}) => {
  // Select matching line-art icon directly corresponding to the reference image
  const renderEventIcon = () => {
    switch (event.type) {
      case "church":
        return <ChurchCrossIcon size={32} className="text-[#caa24d] shrink-0" />;
      case "grooms-house":
        return <TharavaduIcon size={32} className="text-[#caa24d] shrink-0" />;
      case "wedding":
      default:
        return <WeddingRingsIcon size={32} className="text-[#caa24d] shrink-0" />;
    }
  };

  return (
    <article
      data-event-id={event.id}
      className={`event-card relative w-full max-w-xl mx-auto rounded-xl p-5 sm:p-6 transition-all duration-700 ${
        isExpanded
          ? "bg-gradient-to-b from-[#1c0409] via-[#140206] to-[#0d0104] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_30px_rgba(202,162,77,0.18)]"
          : "bg-gradient-to-b from-[#180308] to-[#0f0104] hover:bg-[#1c040a] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.85),0_0_15px_rgba(202,162,77,0.06)]"
      }`}
    >
      {/* Outer gold archival border matching reference hairlines */}
      <div className="absolute inset-0 rounded-xl border border-[#caa24d]/25 pointer-events-none" />
      <div className="absolute inset-1 rounded-[8px] border border-[#caa24d]/10 border-dashed pointer-events-none" />

      {/* Decorative corner accents */}
      <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#e5c57b]/50 pointer-events-none" />
      <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#e5c57b]/50 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[#e5c57b]/50 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#e5c57b]/50 pointer-events-none" />

      {/* ============================================================ */}
      {/* COLLAPSED HEADER: EXACT MATCH TO REFERENCE IMAGE COMPOSITION */}
      {/* ============================================================ */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-expanded={isExpanded}
        aria-label={`Toggle details for ${event.title}`}
        className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none text-left w-full group/header"
      >
        {/* Left: Line-Art Icon + Editorial Typography block */}
        <div className="flex items-start gap-4 sm:gap-5 w-full">
          {/* Custom line-art icon */}
          <div className="mt-0.5 p-2 rounded-full bg-[#20050b]/80 border border-[#caa24d]/25 shadow-inner transition-transform duration-500 group-hover/header:scale-105">
            {renderEventIcon()}
          </div>

          {/* Typography block matching reference */}
          <div className="space-y-1 flex-1">
            {event.badge && (
              <span className="font-sans text-[8.5px] sm:text-[9px] tracking-[0.28em] text-[#caa24d]/80 uppercase block font-medium">
                {event.badge}
              </span>
            )}

            <h3 className="font-serif text-lg sm:text-xl font-normal tracking-[0.16em] text-[#fff0c7] uppercase group-hover/header:text-white transition-colors">
              {event.title}
            </h3>

            <p className="font-serif text-xs sm:text-sm text-[#fcedc7]/90 font-light">
              {event.date}
            </p>

            <p className="font-serif italic text-xs text-[#e5c57b]/80 font-light">
              {event.venue} &bull; {event.time}
            </p>
          </div>
        </div>

        {/* Right: Elegant disclosure trigger matching reference fine aesthetic */}
        <div className="self-end sm:self-center shrink-0">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-serif tracking-widest uppercase transition-all duration-500 ${
              isExpanded
                ? "bg-[#2c0812] border-[#caa24d]/50 text-[#fff0c7]"
                : "bg-[#180308]/90 border-[#caa24d]/25 text-[#caa24d]/80 group-hover/header:border-[#caa24d]/60 group-hover/header:text-[#fcedc7]"
            }`}
          >
            <span>{isExpanded ? "Close" : "Details"}</span>
            <ChevronDown
              className={`w-3 h-3 text-[#e5c57b] transition-transform duration-500 ease-out ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* IN-FLOW EXPANDABLE PHYSICAL STATIONERY DOSSIER */}
      {/* ============================================================ */}
      <div
        className={`grid w-full transition-all duration-700 ease-in-out ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100 mt-4"
            : "grid-rows-[0fr] opacity-0 mt-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          {/* Subtle narrative description */}
          {event.description && (
            <p className="font-sans text-xs text-[#d1bfa7] leading-relaxed font-light pt-3 text-left">
              {event.description}
            </p>
          )}

          {/* Compact Artistic Illustration Vignette */}
          <div className="pt-4 pb-1">
            <EventArtwork src={event.image} alt={event.imageAlt} />
          </div>

          {/* Full rich details breakdown with reference icons */}
          <EventDetailsPanel event={event} />

          {/* Bottom collapse action */}
          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={onToggle}
              className="px-4 py-1.5 rounded-full border border-[#caa24d]/30 bg-[#20050b]/80 text-[10px] font-serif tracking-[0.2em] uppercase text-[#caa24d]/90 hover:text-white hover:border-[#caa24d]/60 transition-all cursor-pointer"
            >
              Close Details &uarr;
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
