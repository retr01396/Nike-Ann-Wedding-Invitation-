"use client";

import React from "react";
import { WeddingEventDetailItem } from "@/types/wedding";
import {
  VenuePinIcon,
  SuitTuxedoIcon,
  EveningDressIcon,
} from "./EventIcons";
import {
  Calendar,
  Clock,
  ExternalLink,
  Phone,
} from "lucide-react";
import { CleanDate } from "@/components/ui/CleanDate";

interface EventDetailsPanelProps {
  event: WeddingEventDetailItem;
  className?: string;
}

export const EventDetailsPanel: React.FC<EventDetailsPanelProps> = ({
  event,
  className = "",
}) => {
  return (
    <div
      className={`pt-5 border-t border-[#caa24d]/20 mt-5 space-y-4 text-left ${className}`}
    >
      {/* Date & Time Row — improved contrast, weight, and clean modern lining numerals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-[#180409]/90 border border-[#caa24d]/20 shadow-inner">
          <Calendar className="w-4 h-4 text-[#e5c57b] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="block text-[9.5px] font-cinzel tracking-[0.18em] text-[#caa24d]/80 uppercase">
              Date
            </span>
            <p className="text-base sm:text-lg font-serif font-semibold text-[#fff7e6] leading-snug tracking-tight">
              <CleanDate value={event.date} />
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-[#180409]/90 border border-[#caa24d]/20 shadow-inner">
          <Clock className="w-4 h-4 text-[#e5c57b] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="block text-[9.5px] font-cinzel tracking-[0.18em] text-[#caa24d]/80 uppercase">
              Time
            </span>
            <p className="text-sm sm:text-base font-serif font-semibold text-[#fff7e6] leading-snug tracking-tight">
              <CleanDate value={event.time} />
            </p>
          </div>
        </div>
      </div>

      {/* Venue & Street Address */}
      <div className="p-3.5 rounded-lg bg-[#180409]/90 border border-[#caa24d]/20 space-y-2 shadow-inner">
        <div className="flex items-center gap-2">
          <VenuePinIcon size={18} className="text-[#e5c57b] shrink-0" />
          <span className="text-[9.5px] font-cinzel tracking-[0.18em] text-[#caa24d]/80 uppercase">
            Venue &amp; Location
          </span>
        </div>
        <div>
          <p className="text-[15px] font-serif font-semibold text-[#fff5da] leading-snug">
            {event.venue}
          </p>
          <p className="text-xs font-sans text-[#d1bfa7] leading-relaxed font-normal mt-1">
            {event.address}
          </p>
        </div>

        {/* Phone if available */}
        {event.phone && (
          <div className="flex items-center gap-2 pt-1 text-[12px] font-sans text-[#e5c57b]/90">
            <Phone className="w-3.5 h-3.5 text-[#caa24d]" />
            <CleanDate value={event.phone} />
          </div>
        )}

        {/* Map URL button */}
        {event.mapUrl && (
          <div className="pt-2">
            <a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2a060d] border border-[#caa24d]/35 text-[#fcedc7] text-[10.5px] font-cinzel tracking-wider uppercase hover:border-[#caa24d] hover:bg-[#380912] transition-all shadow-sm"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3 text-[#e5c57b]" />
            </a>
          </div>
        )}
      </div>

      {/* Dress Code & Attire */}
      <div className="p-3.5 rounded-lg bg-[#180409]/90 border border-[#caa24d]/20 space-y-2 shadow-inner">
        <div className="flex items-center gap-2">
          <SuitTuxedoIcon size={18} className="text-[#e5c57b] shrink-0" />
          <span className="text-[9.5px] font-cinzel tracking-[0.18em] text-[#caa24d]/80 uppercase">
            Dress Code &amp; Attire
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex items-center gap-2.5 p-2 rounded bg-[#130206]/80 border border-[#caa24d]/15">
            <SuitTuxedoIcon size={20} className="text-[#caa24d] shrink-0" />
            <div>
              <span className="block font-cinzel text-[8.5px] sm:text-[9px] tracking-[0.2em] text-[#caa24d]/85 uppercase font-medium">
                MEN
              </span>
              <span className="block font-serif text-xs text-[#fff0c7] font-medium">
                Suit Up
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded bg-[#130206]/80 border border-[#caa24d]/15">
            <EveningDressIcon size={20} className="text-[#caa24d] shrink-0" />
            <div>
              <span className="block font-cinzel text-[8.5px] sm:text-[9px] tracking-[0.2em] text-[#caa24d]/85 uppercase font-medium">
                LADIES
              </span>
              <span className="block font-serif text-xs text-[#fff0c7] font-medium">
                Elegant Evening Wear
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
