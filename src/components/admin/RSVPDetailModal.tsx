"use strict";

import React from "react";
import { RSVPRow } from "@/types/database";

interface RSVPDetailModalProps {
  rsvp: RSVPRow | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (rsvp: RSVPRow) => void;
  onDelete: (rsvp: RSVPRow) => void;
}

export const RSVPDetailModal: React.FC<RSVPDetailModalProps> = ({
  rsvp,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !rsvp) return null;

  const isAttending = rsvp.attendance === "attending";

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl my-8 p-6 sm:p-8 border border-[#caa24d]/40 bg-[#150206] shadow-2xl text-left space-y-6">
        {/* Delicate Corner Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#caa24d]/70 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#caa24d]/70 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#caa24d]/70 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#caa24d]/70 pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#caa24d]/20 pb-4">
          <div>
            <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#caa24d] font-medium block">
              Guest Response Dossier
            </span>
            <h3 className="font-serif text-2xl text-[#fff0c7] uppercase tracking-wide mt-1">
              {rsvp.name}
            </h3>
          </div>

          <span
            className={`inline-flex items-center px-2.5 py-1 text-[10px] font-sans uppercase tracking-wider font-medium border shrink-0 ${
              isAttending
                ? "border-[#caa24d]/60 bg-[#280710] text-[#e5c57b]"
                : "border-red-900/50 bg-red-950/30 text-red-300"
            }`}
          >
            {isAttending ? "Attending with Pleasure" : "Respectfully Declined"}
          </span>
        </div>

        {/* Details Grid */}
        <div className="space-y-4 text-xs font-serif divide-y divide-[#caa24d]/15">
          {/* Section 1: Guest Attendance & Count */}
          <div className="pt-2">
            <div>
              <span className="block font-sans text-[9px] uppercase tracking-wider text-[#caa24d]/75">
                Total Guests
              </span>
              <span className="text-[#fff0c7] text-sm">
                {isAttending ? `${rsvp.guest_count} Person` : "—"}
              </span>
            </div>
          </div>

          {/* Section 2: Stay & Accommodation */}
          <div className="pt-4 space-y-3">
            <span className="block font-sans text-[9px] uppercase tracking-wider text-[#caa24d] font-medium">
              Guest Stay & Hospitality
            </span>

            {isAttending && rsvp.accommodation_required ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <span className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/75">
                    Guest Name for Stay
                  </span>
                  <span className="text-[#fff0c7] font-sans text-xs font-medium">
                    {rsvp.stay_guest_name || rsvp.name}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/75">
                    Contact Phone Number
                  </span>
                  <span className="text-[#fff0c7] font-sans text-xs">
                    {rsvp.phone || "—"}
                  </span>
                </div>

                <div>
                  <span className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/75">
                    Rooms & Guests
                  </span>
                  <span className="text-[#fff0c7]">
                    {rsvp.rooms_required || 1} Room · {rsvp.people_staying || 1} Guest
                    {(rsvp.people_staying || 1) > 1 ? "s" : ""}
                  </span>
                </div>

                <div>
                  <span className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/75">
                    Arrival Date
                  </span>
                  <span className="text-[#fff0c7]">
                    {formatDate(rsvp.arrival_date)}
                  </span>
                </div>

                <div>
                  <span className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/75">
                    Departure Date
                  </span>
                  <span className="text-[#fff0c7]">
                    {formatDate(rsvp.departure_date)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-[#caa24d]/60 italic text-xs">
                {isAttending
                  ? "Guest is arranging their own stay."
                  : "No accommodation requested (declined attendance)."}
              </p>
            )}
          </div>

          {/* Section 3: Note for the Couple */}
          <div className="pt-4 space-y-1">
            <span className="block font-sans text-[9px] uppercase tracking-wider text-[#caa24d] font-medium">
              Note for Nike & Ann
            </span>
            {rsvp.message ? (
              <div className="p-3 border border-[#caa24d]/20 bg-[#1a0409] text-xs font-serif italic text-[#fff0c7] leading-relaxed">
                &ldquo;{rsvp.message}&rdquo;
              </div>
            ) : (
              <p className="text-[#caa24d]/50 italic text-xs">No personal note included.</p>
            )}
          </div>

          {/* Section 4: Timestamps */}
          <div className="pt-4 flex flex-col sm:flex-row justify-between text-[10.5px] text-[#caa24d]/60 font-serif italic">
            <span>Submitted: {formatTimestamp(rsvp.created_at)}</span>
            <span>Last Updated: {formatTimestamp(rsvp.updated_at)}</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#caa24d]/20">
          <button
            type="button"
            onClick={() => onDelete(rsvp)}
            className="px-3.5 py-1.5 text-xs font-sans uppercase tracking-wider border border-red-900/50 text-red-300 hover:border-red-600 transition-colors"
          >
            Delete Response
          </button>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={() => onEdit(rsvp)}
              className="px-4 py-1.5 text-xs font-sans uppercase tracking-wider border border-[#caa24d] bg-[#24050d] text-[#fff0c7] hover:bg-[#caa24d] hover:text-[#100104] transition-all"
            >
              Edit RSVP
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-sans uppercase tracking-wider border border-[#caa24d]/30 text-[#caa24d] hover:text-[#fff0c7] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
