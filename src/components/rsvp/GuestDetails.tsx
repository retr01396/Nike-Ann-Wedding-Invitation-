"use strict";

import React from "react";
import { RSVPOption } from "@/types/wedding";
import { ForkPlateIcon } from "./RSVPIcons";

interface GuestDetailsProps {
  guestCountQuestion: string;
  guestCount: number;
  minGuests: number;
  maxGuests: number;
  onGuestCountChange: (count: number) => void;
  dietaryQuestion: string;
  dietaryOptions: RSVPOption[];
  dietaryPreference: string;
  onDietaryChange: (val: string) => void;
  dietaryOther: string;
  onDietaryOtherChange: (val: string) => void;
  dietaryOtherPlaceholder: string;
  errors?: {
    guestCount?: string;
    dietaryPreference?: string;
  };
}

export const GuestDetails: React.FC<GuestDetailsProps> = ({
  guestCountQuestion,
  guestCount,
  minGuests,
  maxGuests,
  onGuestCountChange,
  dietaryQuestion,
  dietaryOptions,
  dietaryPreference,
  onDietaryChange,
  dietaryOther,
  onDietaryOtherChange,
  dietaryOtherPlaceholder,
  errors,
}) => {
  return (
    <div className="space-y-6 pt-3 text-left">
      {/* 1. GUEST COUNT STEPPER */}
      <div className="space-y-2">
        <label
          id="guest-count-label"
          className="block font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#caa24d]/90 font-medium"
        >
          {guestCountQuestion}
        </label>

        <div className="flex items-center space-x-4">
          <div className="inline-flex items-center border border-[#caa24d]/40 bg-[#190308] p-1">
            <button
              type="button"
              disabled={guestCount <= minGuests}
              onClick={() => onGuestCountChange(Math.max(minGuests, guestCount - 1))}
              aria-label="Decrease guest count"
              className="w-10 h-10 flex items-center justify-center font-serif text-lg text-[#fff0c7] hover:bg-[#caa24d]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none"
            >
              −
            </button>

            <span
              className="w-12 text-center font-serif text-lg text-[#fff0c7] select-none"
              aria-live="polite"
            >
              {guestCount}
            </span>

            <button
              type="button"
              disabled={guestCount >= maxGuests}
              onClick={() => onGuestCountChange(Math.min(maxGuests, guestCount + 1))}
              aria-label="Increase guest count"
              className="w-10 h-10 flex items-center justify-center font-serif text-lg text-[#fff0c7] hover:bg-[#caa24d]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none"
            >
              +
            </button>
          </div>

          <span className="font-serif text-xs italic text-[#caa24d]/75">
            {guestCount === 1 ? "1 Guest Attending" : `${guestCount} Guests Attending`}
          </span>
        </div>

        {errors?.guestCount && (
          <p className="font-sans text-[11px] text-[#e5c57b] italic pt-0.5" role="alert">
            {errors.guestCount}
          </p>
        )}
      </div>

      {/* 2. DIETARY PREFERENCES */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <ForkPlateIcon className="w-3.5 h-3.5 text-[#caa24d]" />
          <label
            id="dietary-label"
            className="block font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#caa24d]/90 font-medium"
          >
            {dietaryQuestion}
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {dietaryOptions.map((opt) => {
            const isSelected = dietaryPreference === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onDietaryChange(opt.value)}
                className={`px-3 py-2.5 text-left border rounded-none text-xs transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#caa24d] ${
                  isSelected
                    ? "border-[#caa24d] bg-[#2d0812] text-[#fff0c7] shadow-[0_0_12px_rgba(202,162,77,0.2)]"
                    : "border-[#caa24d]/20 bg-[#180308] text-[#f3e5c8]/70 hover:border-[#caa24d]/45 hover:text-[#fff0c7]"
                }`}
              >
                <span className="font-serif tracking-wide block">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Conditional "Other" Dietary Text Input */}
        {dietaryPreference === "other" && (
          <div className="pt-2 animate-fadeIn">
            <input
              type="text"
              value={dietaryOther}
              onChange={(e) => onDietaryOtherChange(e.target.value)}
              placeholder={dietaryOtherPlaceholder}
              className="w-full px-3.5 py-2.5 bg-[#1a0308] border border-[#caa24d]/35 text-[#fff0c7] text-xs font-sans placeholder-[#caa24d]/35 focus:outline-none focus:border-[#caa24d] focus:ring-1 focus:ring-[#caa24d]"
            />
          </div>
        )}

        {errors?.dietaryPreference && (
          <p className="font-sans text-[11px] text-[#e5c57b] italic pt-0.5" role="alert">
            {errors.dietaryPreference}
          </p>
        )}
      </div>
    </div>
  );
};
