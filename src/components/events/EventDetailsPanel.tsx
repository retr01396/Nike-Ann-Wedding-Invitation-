"use strict";
"use client";

import React from "react";
import { WeddingEventDetailItem } from "@/types/wedding";
import {
  VenuePinIcon,
  CoatHangerIcon,
} from "./EventIcons";
import {
  Calendar,
  Clock,
  Car,
  Users,
  Info,
  ExternalLink,
  Sparkles,
  Phone,
} from "lucide-react";

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
      {/* Date & Time Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-[#180409]/90 border border-[#caa24d]/20 shadow-inner">
          <Calendar className="w-4 h-4 text-[#e5c57b] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[9.5px] font-serif tracking-[0.2em] text-[#caa24d]/80 uppercase">
              Date
            </span>
            <p className="text-xs sm:text-sm font-serif font-medium text-[#fff0c7]">
              {event.date}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-[#180409]/90 border border-[#caa24d]/20 shadow-inner">
          <Clock className="w-4 h-4 text-[#e5c57b] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[9.5px] font-serif tracking-[0.2em] text-[#caa24d]/80 uppercase">
              Ceremony Time
            </span>
            <p className="text-xs sm:text-sm font-serif font-medium text-[#fff0c7]">
              {event.time}
            </p>
          </div>
        </div>
      </div>

      {/* Venue & Street Address (with VenuePinIcon from reference) */}
      <div className="p-3.5 rounded-lg bg-[#180409]/90 border border-[#caa24d]/20 space-y-1.5 shadow-inner">
        <div className="flex items-center gap-2">
          <VenuePinIcon size={18} className="text-[#e5c57b] shrink-0" />
          <span className="text-[9.5px] font-serif tracking-[0.2em] text-[#caa24d]/80 uppercase">
            Venue &amp; Location
          </span>
        </div>
        <p className="text-sm font-serif font-medium text-[#fff5da]">
          {event.venue}
        </p>
        <p className="text-xs font-sans text-[#d1bfa7] leading-relaxed font-light">
          {event.address}
        </p>

        {/* Map URL button */}
        {event.mapUrl && (
          <div className="pt-2">
            <a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2a060d] border border-[#caa24d]/35 text-[#fcedc7] text-[10.5px] font-serif tracking-wider uppercase hover:border-[#caa24d] hover:bg-[#380912] transition-all shadow-sm"
            >
              <span>View Location on Map</span>
              <ExternalLink className="w-3 h-3 text-[#e5c57b]" />
            </a>
          </div>
        )}
      </div>

      {/* Dress Code & Attire (with CoatHangerIcon directly from reference image) */}
      {event.dressCode && (
        <div className="p-3.5 rounded-lg bg-[#180409]/90 border border-[#caa24d]/20 space-y-1.5 shadow-inner">
          <div className="flex items-center gap-2">
            <CoatHangerIcon size={18} className="text-[#e5c57b] shrink-0" />
            <span className="text-[9.5px] font-serif tracking-[0.2em] text-[#caa24d]/80 uppercase">
              Dress Code &amp; Attire
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#fcedc7] font-serif italic">
            {event.dressCode}
          </p>
        </div>
      )}

      {/* Reception Venue (if present) */}
      {event.receptionVenue && (
        <div className="p-3 rounded-lg bg-[#140307]/90 border border-[#caa24d]/15 space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#e5c57b] shrink-0" />
            <span className="text-[9.5px] font-serif tracking-[0.2em] text-[#caa24d]/70 uppercase">
              Reception Venue
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#fff0c7]">
            {event.receptionVenue}
          </p>
        </div>
      )}

      {/* Parking Notes */}
      {event.parkingNotes && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-[#140307]/90 border border-[#caa24d]/15">
          <Car className="w-4 h-4 text-[#e5c57b] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[9.5px] font-serif tracking-[0.2em] text-[#caa24d]/70 uppercase">
              Parking &amp; Arrival
            </span>
            <p className="text-xs font-sans text-[#d1bfa7] leading-relaxed font-light">
              {event.parkingNotes}
            </p>
          </div>
        </div>
      )}

      {/* Family Notes / Traditions */}
      {event.familyNotes && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-[#140307]/90 border border-[#caa24d]/15">
          <Users className="w-4 h-4 text-[#e5c57b] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[9.5px] font-serif tracking-[0.2em] text-[#caa24d]/70 uppercase">
              Family &amp; Traditions
            </span>
            <p className="text-xs font-sans text-[#d1bfa7] leading-relaxed font-light">
              {event.familyNotes}
            </p>
          </div>
        </div>
      )}

      {/* Additional Instructions */}
      {event.additionalInstructions && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-[#140307]/90 border border-[#caa24d]/15">
          <Info className="w-4 h-4 text-[#e5c57b] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[9.5px] font-serif tracking-[0.2em] text-[#caa24d]/70 uppercase">
              Ceremony Etiquette
            </span>
            <p className="text-xs font-sans text-[#d1bfa7] leading-relaxed font-light">
              {event.additionalInstructions}
            </p>
          </div>
        </div>
      )}

      {/* Special Notes */}
      {event.specialNotes && (
        <div className="p-3 rounded-lg bg-[#20050b]/60 border border-[#caa24d]/20 text-center">
          <p className="font-serif italic text-xs text-[#e5c57b]/90 tracking-wide">
            &ldquo;{event.specialNotes}&rdquo;
          </p>
        </div>
      )}

      {/* Point of Contact */}
      {event.contactInfo && (
        <div className="flex items-center gap-2 pt-1 text-[11px] font-serif tracking-wider text-[#caa24d]/75">
          <Phone className="w-3 h-3 text-[#e5c57b]" />
          <span>Concierge: {event.contactInfo}</span>
        </div>
      )}
    </div>
  );
};
