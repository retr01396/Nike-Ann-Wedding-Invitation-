"use strict";

import React from "react";
import { RSVPConfirmationConfig, RSVPSubmission } from "@/types/wedding";
import { CheckSealIcon, HeartSealIcon } from "./RSVPIcons";

interface RSVPConfirmationProps {
  config: RSVPConfirmationConfig;
  submission: RSVPSubmission;
  onEdit: () => void;
}

export const RSVPConfirmation: React.FC<RSVPConfirmationProps> = ({
  config,
  submission,
  onEdit,
}) => {
  const isAttending = submission.attendance === "yes";

  return (
    <div
      id="rsvp-confirmation-card"
      className="relative w-full max-w-xl mx-auto p-6 sm:p-8 md:p-10 border border-[#caa24d]/40 bg-[#150206] shadow-2xl text-center space-y-6 animate-fadeIn"
    >
      {/* Delicate Gold Corner Brackets */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#caa24d]/70 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#caa24d]/70 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#caa24d]/70 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#caa24d]/70 pointer-events-none" />

      {/* Gold Monogram Wax Seal Medallion */}
      <div className="flex justify-center pt-2">
        <div className="w-14 h-14 rounded-full border border-[#caa24d]/50 bg-gradient-to-b from-[#2a060e] to-[#120205] flex items-center justify-center shadow-[0_0_20px_rgba(202,162,77,0.25)]">
          <span className="font-serif text-lg tracking-widest text-[#fff0c7]">
            N<span className="text-[#caa24d] font-light text-sm">/</span>A
          </span>
        </div>
      </div>

      {/* Badge & Title */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full border border-[#caa24d]/30 bg-[#22040b]">
          <CheckSealIcon className="w-3.5 h-3.5 text-[#caa24d]" />
          <span className="font-sans text-[8.5px] sm:text-[9px] uppercase tracking-[0.3em] text-[#caa24d] font-medium">
            {config.badge}
          </span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-normal tracking-[0.2em] text-[#fff0c7] uppercase pt-1">
          {config.title}
        </h3>

        <div className="flex justify-center pt-1">
          <div className="w-12 h-[1px] bg-[#caa24d]/40" />
        </div>
      </div>

      {/* Guest Name & Personalized Sentiment */}
      <div className="space-y-3 px-2">
        <p className="font-serif text-lg sm:text-xl text-[#caa24d] italic">
          Dear {submission.name},
        </p>

        <p className="font-serif text-sm sm:text-base leading-relaxed text-[#f3e5c8]/90 max-w-md mx-auto">
          {isAttending ? config.attendingMessage : config.declinedMessage}
        </p>
      </div>

      {/* Structured Confirmation Details Card */}
      <div className="p-4 border border-[#caa24d]/20 bg-[#1b0308]/80 text-left space-y-2 text-xs">
        <div className="flex justify-between border-b border-[#caa24d]/15 pb-1.5">
          <span className="text-[#caa24d]/80 uppercase tracking-wider text-[9.5px]">ATTENDANCE</span>
          <span className="text-[#fff0c7] font-serif">
            {isAttending ? "Attending with Pleasure" : "Respectfully Declined"}
          </span>
        </div>

        {isAttending && submission.guestCount && (
          <div className="flex justify-between border-b border-[#caa24d]/15 pb-1.5">
            <span className="text-[#caa24d]/80 uppercase tracking-wider text-[9.5px]">TOTAL GUESTS</span>
            <span className="text-[#fff0c7] font-serif">
              {submission.guestCount} {submission.guestCount === 1 ? "Guest" : "Guests"}
            </span>
          </div>
        )}

        {isAttending && submission.accommodation?.staying && (
          <div className="flex justify-between border-b border-[#caa24d]/15 pb-1.5">
            <span className="text-[#caa24d]/80 uppercase tracking-wider text-[9.5px]">ACCOMMODATION</span>
            <span className="text-[#fff0c7] font-serif">
              Requested ({submission.accommodation.roomsRequired || 1} Room
              {(submission.accommodation.roomsRequired || 1) > 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      {/* Couple's Signoff */}
      <div className="pt-2 space-y-1">
        <p className="font-serif text-sm italic text-[#caa24d] whitespace-pre-line">
          {config.closingNote}
        </p>
        <div className="flex justify-center pt-1 text-[#caa24d]/50">
          <HeartSealIcon className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Edit Response Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center space-x-1.5 px-4 py-2 border border-[#caa24d]/30 text-[#caa24d] hover:border-[#caa24d] hover:text-[#fff0c7] transition-all duration-300 font-sans text-[9.5px] uppercase tracking-[0.2em] focus:outline-none"
        >
          <span>{config.editButtonText}</span>
        </button>
      </div>
    </div>
  );
};
