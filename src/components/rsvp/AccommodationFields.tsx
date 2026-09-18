"use strict";

import React from "react";
import { RSVPAccommodationConfig } from "@/types/wedding";
import {
  BedHotelIcon,
  CalendarDateIcon,
  PhoneIcon,
  CarShuttleIcon,
} from "./RSVPIcons";

interface AccommodationFieldsProps {
  config: RSVPAccommodationConfig;
  isExpanded: boolean;
  stayGuestName: string;
  onStayGuestNameChange: (val: string) => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  peopleStaying: number;
  onPeopleStayingChange: (val: number) => void;
  arrivalDate: string;
  onArrivalDateChange: (val: string) => void;
  departureDate: string;
  onDepartureDateChange: (val: string) => void;
  roomsRequired: number;
  onRoomsRequiredChange: (val: number) => void;
  transportation?: string;
  onTransportationChange?: (val: string) => void;
  transportationOther?: string;
  onTransportationOtherChange?: (val: string) => void;
  specialRequirements: string;
  onSpecialRequirementsChange: (val: string) => void;
  errors?: {
    stayGuestName?: string;
    phone?: string;
    arrivalDate?: string;
    departureDate?: string;
    roomsRequired?: string;
    dateOrder?: string;
  };
}

export const AccommodationFields: React.FC<AccommodationFieldsProps> = ({
  config,
  isExpanded,
  stayGuestName,
  onStayGuestNameChange,
  phone,
  onPhoneChange,
  peopleStaying,
  onPeopleStayingChange,
  arrivalDate,
  onArrivalDateChange,
  departureDate,
  onDepartureDateChange,
  roomsRequired,
  onRoomsRequiredChange,
  specialRequirements,
  onSpecialRequirementsChange,
  errors,
}) => {
  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
        isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
      }`}
      aria-hidden={!isExpanded}
    >
      <div className="overflow-hidden">
        <div className="pt-4 pb-2 border-t border-[#caa24d]/25 space-y-4 text-left">
          {/* Section Header */}
          <div className="flex items-center space-x-2 pb-1 border-b border-[#caa24d]/15">
            <BedHotelIcon className="w-4 h-4 text-[#caa24d]" />
            <span className="font-serif text-xs uppercase tracking-[0.2em] text-[#fff0c7]">
              Guest Stay & Hospitality Details
            </span>
          </div>

          {/* 1. GUEST FULL NAME FOR STAY */}
          <div className="space-y-1.5">
            <label
              htmlFor="rsvp-stay-guest-name"
              className="block font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#caa24d]/90 font-medium"
            >
              Guest Full Name for Stay <span className="text-[#caa24d]">*</span>
            </label>
            <input
              id="rsvp-stay-guest-name"
              type="text"
              value={stayGuestName}
              onChange={(e) => onStayGuestNameChange(e.target.value)}
              placeholder="Full Name of Guest Staying"
              autoComplete="name"
              className="w-full px-3.5 py-2.5 bg-[#1a0308] border border-[#caa24d]/35 text-[#fff0c7] text-xs font-sans placeholder-[#caa24d]/35 focus:outline-none focus:border-[#caa24d] focus:ring-1 focus:ring-[#caa24d]"
            />
            {errors?.stayGuestName && (
              <p className="font-sans text-[11px] text-[#e5c57b] italic pt-0.5" role="alert">
                {errors.stayGuestName}
              </p>
            )}
          </div>

          {/* 2. PHONE NUMBER */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1.5">
              <PhoneIcon className="w-3.5 h-3.5 text-[#caa24d]" />
              <label
                id="phone-label"
                className="block font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#caa24d]/90 font-medium"
              >
                {config.phoneLabel} <span className="text-[#caa24d]">*</span>
              </label>
            </div>
            <input
              id="rsvp-phone"
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder={config.phonePlaceholder}
              autoComplete="tel"
              className="w-full px-3.5 py-2.5 bg-[#1a0308] border border-[#caa24d]/35 text-[#fff0c7] text-xs font-sans placeholder-[#caa24d]/35 focus:outline-none focus:border-[#caa24d] focus:ring-1 focus:ring-[#caa24d]"
            />
            {errors?.phone && (
              <p className="font-sans text-[11px] text-[#e5c57b] italic pt-0.5" role="alert">
                {errors.phone}
              </p>
            )}
          </div>

          {/* 3. DATES GRID (Arrival Date & Departure Date aligned) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            {/* Arrival Date */}
            <div className="space-y-1.5 flex flex-col justify-start">
              <div className="h-6 flex items-center space-x-1.5">
                <CalendarDateIcon className="w-3.5 h-3.5 text-[#caa24d] shrink-0" />
                <label
                  htmlFor="rsvp-arrival-date"
                  id="arrival-date-label"
                  className="block font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#caa24d]/90 font-medium whitespace-nowrap"
                >
                  {config.arrivalDateLabel} <span className="text-[#caa24d]">*</span>
                </label>
              </div>
              <input
                id="rsvp-arrival-date"
                type="date"
                value={arrivalDate}
                onChange={(e) => onArrivalDateChange(e.target.value)}
                className="w-full h-11 px-3.5 py-2.5 bg-[#1a0308] border border-[#caa24d]/35 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d] focus:ring-1 focus:ring-[#caa24d] [color-scheme:dark]"
              />
              {errors?.arrivalDate && (
                <p className="font-sans text-[11px] text-[#e5c57b] italic pt-0.5" role="alert">
                  {errors.arrivalDate}
                </p>
              )}
            </div>

            {/* Departure Date */}
            <div className="space-y-1.5 flex flex-col justify-start">
              <div className="h-6 flex items-center space-x-1.5">
                <CalendarDateIcon className="w-3.5 h-3.5 text-[#caa24d] shrink-0" />
                <label
                  htmlFor="rsvp-departure-date"
                  id="departure-date-label"
                  className="block font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#caa24d]/90 font-medium whitespace-nowrap"
                >
                  {config.departureDateLabel} <span className="text-[#caa24d]">*</span>
                </label>
              </div>
              <input
                id="rsvp-departure-date"
                type="date"
                value={departureDate}
                onChange={(e) => onDepartureDateChange(e.target.value)}
                className="w-full h-11 px-3.5 py-2.5 bg-[#1a0308] border border-[#caa24d]/35 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d] focus:ring-1 focus:ring-[#caa24d] [color-scheme:dark]"
              />
              {errors?.departureDate && (
                <p className="font-sans text-[11px] text-[#e5c57b] italic pt-0.5" role="alert">
                  {errors.departureDate}
                </p>
              )}
            </div>
          </div>

          {/* Date Sequence Error */}
          {errors?.dateOrder && (
            <p className="font-sans text-[11px] text-[#e5c57b] italic" role="alert">
              {errors.dateOrder}
            </p>
          )}

          {/* 4. PEOPLE STAYING & ROOMS REQUIRED GRID (Aligned labels & matching stepper heights) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            {/* People Staying */}
            <div className="space-y-1.5 flex flex-col justify-start">
              <div className="min-h-[26px] sm:min-h-[28px] flex items-center">
                <label className="block font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#caa24d]/90 font-medium leading-tight">
                  {config.peopleStayingLabel}
                </label>
              </div>
              <div className="h-11 flex items-center justify-between border border-[#caa24d]/40 bg-[#190308] px-2 w-full">
                <button
                  type="button"
                  disabled={peopleStaying <= config.minPeople}
                  onClick={() => onPeopleStayingChange(Math.max(config.minPeople, peopleStaying - 1))}
                  className="w-8 h-8 flex items-center justify-center font-serif text-base text-[#fff0c7] hover:bg-[#caa24d]/20 disabled:opacity-30 transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="font-serif text-sm sm:text-base text-[#fff0c7] select-none text-center">
                  {peopleStaying} {peopleStaying === 1 ? "Person" : "People"}
                </span>
                <button
                  type="button"
                  disabled={peopleStaying >= config.maxPeople}
                  onClick={() => onPeopleStayingChange(Math.min(config.maxPeople, peopleStaying + 1))}
                  className="w-8 h-8 flex items-center justify-center font-serif text-base text-[#fff0c7] hover:bg-[#caa24d]/20 disabled:opacity-30 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Rooms Required */}
            <div className="space-y-1.5 flex flex-col justify-start">
              <div className="min-h-[26px] sm:min-h-[28px] flex items-center">
                <label className="block font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#caa24d]/90 font-medium leading-tight">
                  {config.roomsRequiredLabel}
                </label>
              </div>
              <div className="h-11 flex items-center justify-between border border-[#caa24d]/40 bg-[#190308] px-2 w-full">
                <button
                  type="button"
                  disabled={roomsRequired <= config.minRooms}
                  onClick={() => onRoomsRequiredChange(Math.max(config.minRooms, roomsRequired - 1))}
                  className="w-8 h-8 flex items-center justify-center font-serif text-base text-[#fff0c7] hover:bg-[#caa24d]/20 disabled:opacity-30 transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="font-serif text-sm sm:text-base text-[#fff0c7] select-none text-center">
                  {roomsRequired} {roomsRequired === 1 ? "Room" : "Rooms"}
                </span>
                <button
                  type="button"
                  disabled={roomsRequired >= config.maxRooms}
                  onClick={() => onRoomsRequiredChange(Math.min(config.maxRooms, roomsRequired + 1))}
                  className="w-8 h-8 flex items-center justify-center font-serif text-base text-[#fff0c7] hover:bg-[#caa24d]/20 disabled:opacity-30 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
              {errors?.roomsRequired && (
                <p className="font-sans text-[11px] text-[#e5c57b] italic pt-0.5" role="alert">
                  {errors.roomsRequired}
                </p>
              )}
            </div>
          </div>

          {/* 5. SPECIAL REQUIREMENTS */}
          <div className="space-y-1.5 pt-1">
            <label className="block font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#caa24d]/90 font-medium">
              {config.specialRequirementsLabel}
            </label>
            <textarea
              rows={2}
              value={specialRequirements}
              onChange={(e) => onSpecialRequirementsChange(e.target.value)}
              placeholder={config.specialRequirementsPlaceholder}
              className="w-full px-3.5 py-2.5 bg-[#1a0308] border border-[#caa24d]/35 text-[#fff0c7] text-xs font-sans placeholder-[#caa24d]/35 focus:outline-none focus:border-[#caa24d] focus:ring-1 focus:ring-[#caa24d] resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
