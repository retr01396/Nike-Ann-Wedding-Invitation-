"use client";

import React, { useState, useEffect } from "react";
import { weddingConfig } from "@/config/wedding";
import { WeddingEventDetailItem } from "@/types/wedding";
import { EventDetailsPanel } from "./EventDetailsPanel";
import { X, ExternalLink } from "lucide-react";

const RingsIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 28 20" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
    <circle cx="9" cy="11" r="6.5" />
    <circle cx="19" cy="9" r="6.5" />
  </svg>
);

const PinIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const HangerIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
    <path d="M12 3a2.5 2.5 0 0 1 2.5 2.5c0 1.2-.8 2-1.8 2.5L2 16h20L13.3 8" />
    <path d="M2 16v2h20v-2" />
  </svg>
);

export const EventsSection: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<WeddingEventDetailItem | null>(null);

  const primaryEvent = weddingConfig.events.events[0];
  const allEvents = weddingConfig.events.events;

  // Prevent background scrolling while dossier modal is open
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedEvent]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedEvent(null);
      }
    };
    if (selectedEvent) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedEvent]);

  return (
    <div
      id="events"
      className="relative w-full p-6 sm:p-7 overflow-hidden flex flex-col justify-between scroll-mt-16"
    >
      <div className="relative z-10">
        {/* Eyebrow & Title */}
        <div className="text-center">
          <span className="font-cinzel text-[8.5px] sm:text-[9.5px] tracking-[0.35em] text-[#caa24d] uppercase font-medium">
            {weddingConfig.events.badge}
          </span>
          <h3 className="mt-1 font-cinzel text-lg sm:text-xl tracking-[0.14em] text-[#fbf6ea] font-normal">
            {weddingConfig.events.title}
          </h3>
          <div className="w-6 h-[1px] bg-[#caa24d]/60 mx-auto mt-2" />
        </div>

        {/* Elegant Detail Rows matching reference */}
        <div className="mt-6 space-y-5">
          {/* Row 1: Wedding Ceremony */}
          <div
            onClick={() => setSelectedEvent(primaryEvent)}
            className="flex items-start gap-4 p-2 rounded-sm hover:bg-[#caa24d]/5 transition-colors cursor-pointer group"
          >
            <div className="text-[#caa24d] mt-0.5 group-hover:scale-105 transition-transform">
              <RingsIcon className="w-6 h-6 text-[#caa24d]" />
            </div>
            <div>
              <h4 className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.25em] text-[#fbf6ea] uppercase font-medium">
                WEDDING
              </h4>
              <p className="mt-0.5 font-serif text-xs text-[#ecd9b8]">
                {weddingConfig.date.formatted}
              </p>
              <p className="font-serif italic text-[11px] text-[#caa24d]/85">
                {primaryEvent.time || "Time to be confirmed"}
              </p>
            </div>
          </div>

          {/* Row 2: Venue */}
          <div
            onClick={() => setSelectedEvent(primaryEvent)}
            className="flex items-start gap-4 p-2 rounded-sm hover:bg-[#caa24d]/5 transition-colors cursor-pointer group"
          >
            <div className="text-[#caa24d] mt-0.5 group-hover:scale-105 transition-transform">
              <PinIcon className="w-5 h-5 text-[#caa24d]" />
            </div>
            <div>
              <h4 className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.25em] text-[#fbf6ea] uppercase font-medium">
                VENUE
              </h4>
              <p className="mt-0.5 font-serif text-xs text-[#ecd9b8]">
                {weddingConfig.location.display}
              </p>
              <p className="font-serif italic text-[11px] text-[#caa24d]/85">
                Venue details to follow
              </p>
            </div>
          </div>

          {/* Row 3: Dress Code */}
          <div
            onClick={() => setSelectedEvent(primaryEvent)}
            className="flex items-start gap-4 p-2 rounded-sm hover:bg-[#caa24d]/5 transition-colors cursor-pointer group"
          >
            <div className="text-[#caa24d] mt-0.5 group-hover:scale-105 transition-transform">
              <HangerIcon className="w-5 h-5 text-[#caa24d]" />
            </div>
            <div>
              <h4 className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.25em] text-[#fbf6ea] uppercase font-medium">
                DRESS CODE
              </h4>
              <p className="mt-0.5 font-serif text-xs text-[#ecd9b8]">
                {primaryEvent.dressCode || "Elegant Celebration"}
              </p>
              <p className="font-serif italic text-[11px] text-[#caa24d]/85">
                Details to follow
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expand/Schedule Note */}
      <div className="relative z-10 pt-4 text-center">
        <button
          type="button"
          onClick={() => setSelectedEvent(primaryEvent)}
          className="text-[#caa24d]/80 hover:text-[#fff0c7] font-cinzel text-[8.5px] sm:text-[9.5px] tracking-[0.25em] uppercase transition-colors cursor-pointer"
        >
          VIEW CELEBRATION DOSSIER →
        </button>
      </div>

      {/* =========================================================================
          INTERACTIVE FULL CELEBRATION DOSSIER MODAL
          Preserves complete 9-field event dossier with multi-event tabs
         ========================================================================= */}
      {selectedEvent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Celebration Dossier"
          onClick={() => setSelectedEvent(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] rounded-none bg-gradient-to-b from-[#1c0409] via-[#120205] to-[#0a0103] border border-[#caa24d]/50 shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#caa24d]/25 flex items-center justify-between bg-[#180306]">
              <div>
                <span className="font-cinzel text-[8.5px] tracking-[0.3em] text-[#caa24d] uppercase font-medium">
                  THE CELEBRATION DOSSIER
                </span>
                <h3 className="font-cinzel text-lg sm:text-xl text-[#fbf6ea] tracking-[0.1em] font-normal">
                  WEDDING DETAILS &amp; PROTOCOLS
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-full text-[#caa24d] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close celebration dossier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Tabs Switcher */}
            <div className="px-6 pt-3 pb-2 border-b border-[#caa24d]/20 bg-[#140205] flex items-center gap-2 overflow-x-auto">
              {allEvents.map((ev, idx) => {
                const isActive = selectedEvent.id === ev.id;
                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setSelectedEvent(ev)}
                    className={`px-3 py-1.5 font-cinzel text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase transition-all whitespace-nowrap cursor-pointer border ${
                      isActive
                        ? "bg-[#caa24d]/20 border-[#caa24d] text-[#fff0c7] font-medium"
                        : "bg-transparent border-[#caa24d]/20 text-[#caa24d]/70 hover:border-[#caa24d]/50 hover:text-[#e5c57b]"
                    }`}
                  >
                    {idx + 1}. {ev.title.replace("The ", "")}
                  </button>
                );
              })}
            </div>

            {/* Modal Scrollable Content: EventDetailsPanel */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="mb-2">
                <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#caa24d] uppercase">
                  {selectedEvent.badge}
                </span>
                <h4 className="font-cinzel text-base sm:text-lg text-[#fbf6ea] tracking-wide mt-0.5">
                  {selectedEvent.title}
                </h4>
                {selectedEvent.subtitle && (
                  <p className="font-serif italic text-xs text-[#caa24d]/80 mt-0.5">
                    {selectedEvent.subtitle}
                  </p>
                )}
                {selectedEvent.description && (
                  <p className="mt-2 font-serif text-xs sm:text-sm text-[#ecd9b8]/90 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                )}
              </div>

              {/* Comprehensive Event Details: Date, Time, Venue, Attire, Parking, Traditions, Etiquette, Concierge */}
              <EventDetailsPanel event={selectedEvent} />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-[#caa24d]/25 bg-[#120205] flex items-center justify-between">
              {selectedEvent.mapUrl ? (
                <a
                  href={selectedEvent.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#caa24d] hover:text-[#fff0c7] font-cinzel tracking-wider"
                >
                  <span>OPEN IN GOOGLE MAPS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-1.5 rounded-none border border-[#caa24d]/40 text-[#caa24d] hover:bg-[#caa24d]/10 hover:text-[#fff0c7] text-xs font-cinzel tracking-wider uppercase transition-colors cursor-pointer"
              >
                CLOSE DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

