"use client";

import React, { useState } from "react";
import { weddingConfig } from "@/config/wedding";
import { AttendanceOptionValue, RSVPSubmission } from "@/types/wedding";
import { RSVPConfirmation } from "./RSVPConfirmation";
import { AccommodationFields } from "./AccommodationFields";
import { ChevronDown, Plus, Minus, User } from "lucide-react";

export const RSVPForm: React.FC = () => {
  const { rsvp } = weddingConfig;

  // Form State — defaulted to "yes" so full attending suite is immediately visible
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<AttendanceOptionValue | null>("yes");
  const [guestCount, setGuestCount] = useState<number>(1);
  const [staying, setStaying] = useState<"yes" | "no">("no");
  const [stayGuestName, setStayGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [peopleStaying, setPeopleStaying] = useState<number>(1);
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [roomsRequired, setRoomsRequired] = useState<number>(1);
  const [message, setMessage] = useState("");

  // Dropdown open states
  const [attendanceOpen, setAttendanceOpen] = useState(false);

  // UI Flow State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<RSVPSubmission | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = "Please enter your full name.";
    }

    if (!attendance) {
      errs.attendance = "Please indicate whether you will be attending.";
    }

    if (attendance === "yes") {
      if (guestCount < rsvp.minGuests || guestCount > rsvp.maxGuests) {
        errs.guestCount = `Please select between ${rsvp.minGuests} and ${rsvp.maxGuests} guests.`;
      }

      if (staying === "yes") {
        const guestNameToUse = stayGuestName.trim() || name.trim();
        if (!guestNameToUse) {
          errs.stayGuestName = "Please provide the full name for accommodation.";
        }
        if (!phone.trim()) {
          errs.phone = "Please provide your phone number.";
        }
        if (!arrivalDate) {
          errs.arrivalDate = "Please select your check-in date.";
        }
        if (!departureDate) {
          errs.departureDate = "Please select your check-out date.";
        }
        if (arrivalDate && departureDate && departureDate < arrivalDate) {
          errs.dateOrder = "Check-out date cannot precede check-in date.";
        }
        if (peopleStaying < 1) {
          errs.peopleStaying = "Please select at least 1 guest.";
        }
        if (roomsRequired < 1) {
          errs.roomsRequired = "Please select at least 1 room.";
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submission Handler connected to Supabase RSVP API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    const isAttending = attendance === "yes";
    const payload: RSVPSubmission = {
      name: name.trim(),
      attendance: attendance!,
      submittedAt: new Date().toISOString(),
      ...(isAttending && {
        guestCount,
        accommodation: {
          staying: staying === "yes",
          ...(staying === "yes" && {
            stayGuestName: stayGuestName.trim() || name.trim(),
            phone: phone.trim(),
            peopleStaying,
            arrivalDate,
            departureDate,
            roomsRequired,
          }),
        },
      }),
      ...(message.trim() && { message: message.trim() }),
    };

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubmissionError(
          data?.error || "Something went wrong while sending your RSVP. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      setSubmission(payload);
    } catch {
      setSubmissionError(
        "Unable to connect to the RSVP service. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submission) {
    return (
      <RSVPConfirmation
        config={rsvp.confirmation}
        submission={submission}
        onEdit={() => setSubmission(null)}
      />
    );
  }

  const isAttending = attendance === "yes";

  return (
    <form
      id="rsvp-form"
      onSubmit={handleSubmit}
      noValidate
      className="relative w-full text-left space-y-3.5 select-none"
    >
      {/* Inputs Stack */}
      <div className="space-y-3">
        {/* 1. NAME */}
        <div>
          <div className="relative">
            <input
              id="rsvp-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="Your Name"
              autoComplete="name"
              className="w-full pl-3 pr-9 py-2.5 bg-white/[0.045] border border-[#f3e5c8]/15 text-[#fff0c7] text-xs font-serif placeholder-[#caa24d]/45 focus:outline-none focus:border-[#e5c57b]/70 focus:bg-white/[0.07] rounded-md transition-colors backdrop-blur-sm"
            />
            <User className="w-3.5 h-3.5 text-[#caa24d]/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {errors.name && (
            <p className="text-[10px] text-[#e5c57b] font-serif italic pt-0.5" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* 2. ATTENDANCE (Dropdown matching reference) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAttendanceOpen(!attendanceOpen)}
            className="w-full px-3 py-2.5 bg-white/[0.045] border border-[#f3e5c8]/15 text-xs font-serif flex items-center justify-between rounded-md focus:outline-none focus:border-[#e5c57b]/70 focus:bg-white/[0.07] text-left cursor-pointer backdrop-blur-sm"
          >
            <span className={attendance ? "text-[#fff0c7]" : "text-[#caa24d]/50"}>
              {attendance === "yes"
                ? "Yes, I'll be attending"
                : attendance === "no"
                ? "No, I won't be attending"
                : "Will you be attending?"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#caa24d]/70" />
          </button>

          {attendanceOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-[#200510]/95 backdrop-blur-xl border border-[#caa24d]/40 rounded-md shadow-[0_18px_40px_rgba(0,0,0,0.8)] overflow-hidden py-1">
              <button
                type="button"
                onClick={() => {
                  setAttendance("yes");
                  setAttendanceOpen(false);
                  if (errors.attendance) setErrors((prev) => ({ ...prev, attendance: "" }));
                }}
                className="w-full px-3 py-2 text-left text-xs font-serif text-[#fbf6ea] hover:bg-[#caa24d]/20 transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>Yes, I&apos;ll be attending</span>
                {attendance === "yes" && <span className="text-[#e5c57b] text-xs">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAttendance("no");
                  setAttendanceOpen(false);
                  if (errors.attendance) setErrors((prev) => ({ ...prev, attendance: "" }));
                }}
                className="w-full px-3 py-2 text-left text-xs font-serif text-[#fbf6ea] hover:bg-[#caa24d]/20 transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>No, I won&apos;t be attending</span>
                {attendance === "no" && <span className="text-[#e5c57b] text-xs">✓</span>}
              </button>
            </div>
          )}

          {errors.attendance && (
            <p className="text-[10px] text-[#e5c57b] font-serif italic pt-0.5" role="alert">
              {errors.attendance}
            </p>
          )}
        </div>

        {/* ATTENDING-ONLY GUEST FLOW (Items 3, 4, 5) */}
        {isAttending && (
          <>
            {/* 3. NUMBER OF GUESTS */}
            <div className="flex items-center justify-between px-3 py-2 bg-white/[0.045] border border-[#f3e5c8]/15 rounded-md backdrop-blur-sm">
              <span className="text-xs font-serif text-[#caa24d]/70">Number of guests</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.max(rsvp.minGuests, guestCount - 1))}
                  disabled={guestCount <= rsvp.minGuests}
                  className="w-5 h-5 rounded-full border border-[#caa24d]/40 flex items-center justify-center text-[#caa24d] hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                  aria-label="Decrease guest count"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <span className="font-cinzel text-xs text-[#fff0c7] w-4 text-center select-none">
                  {guestCount}
                </span>
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.min(rsvp.maxGuests, guestCount + 1))}
                  disabled={guestCount >= rsvp.maxGuests}
                  className="w-5 h-5 rounded-full border border-[#caa24d]/40 flex items-center justify-center text-[#caa24d] hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                  aria-label="Increase guest count"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* 4. ACCOMMODATION / STAYING */}
            <div className="pt-1 space-y-2">
              <label className="block font-cinzel text-[9px] sm:text-[10px] tracking-[0.25em] text-[#caa24d]/90 uppercase font-medium text-center sm:text-left">
                ARE YOU STAYING FOR THE WEDDING?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStaying("yes");
                    if (!stayGuestName) setStayGuestName(name);
                  }}
                  className={`px-3 py-2.5 text-xs font-serif text-center transition-all cursor-pointer border rounded-md backdrop-blur-sm ${
                    staying === "yes"
                      ? "bg-[#caa24d]/25 border-[#e5c57b] text-[#fff0c7] shadow-[0_0_16px_rgba(202,162,77,0.3)] font-medium"
                      : "bg-white/[0.045] border-[#f3e5c8]/15 text-[#caa24d]/75 hover:border-[#caa24d]/50 hover:text-[#fff0c7]"
                  }`}
                >
                  YES, I&apos;LL BE STAYING
                </button>
                <button
                  type="button"
                  onClick={() => setStaying("no")}
                  className={`px-3 py-2.5 text-xs font-serif text-center transition-all cursor-pointer border rounded-md backdrop-blur-sm ${
                    staying === "no"
                      ? "bg-[#caa24d]/25 border-[#e5c57b] text-[#fff0c7] shadow-[0_0_16px_rgba(202,162,77,0.3)] font-medium"
                      : "bg-white/[0.045] border-[#f3e5c8]/15 text-[#caa24d]/75 hover:border-[#caa24d]/50 hover:text-[#fff0c7]"
                  }`}
                >
                  NO, I WON&apos;T BE STAYING
                </button>
              </div>
            </div>

            {/* 5. CONDITIONAL STAY DETAILS */}
            <AccommodationFields
              config={rsvp.accommodation}
              isExpanded={staying === "yes"}
              stayGuestName={stayGuestName}
              onStayGuestNameChange={setStayGuestName}
              phone={phone}
              onPhoneChange={setPhone}
              peopleStaying={peopleStaying}
              onPeopleStayingChange={setPeopleStaying}
              arrivalDate={arrivalDate}
              onArrivalDateChange={setArrivalDate}
              departureDate={departureDate}
              onDepartureDateChange={setDepartureDate}
              roomsRequired={roomsRequired}
              onRoomsRequiredChange={setRoomsRequired}
              errors={errors}
            />
          </>
        )}

        {/* 7. MESSAGE */}
        <div>
          <textarea
            id="rsvp-message"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="A message for us (optional)"
            className="w-full px-3 py-2 bg-white/[0.045] border border-[#f3e5c8]/15 text-[#fff0c7] text-xs font-serif placeholder-[#caa24d]/45 focus:outline-none focus:border-[#e5c57b]/70 focus:bg-white/[0.07] rounded-md transition-colors resize-none backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Submission Error Banner */}
      {submissionError && (
        <div className="p-2 border border-[#caa24d]/50 bg-[#2d0710] text-[#fff0c7] font-serif text-[11px] text-center rounded-md">
          {submissionError}
        </div>
      )}

      {/* 8. SUBMIT */}
      <div className="pt-2.5 text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-none bg-[#e2be9b] hover:bg-[#edd2b8] text-[#24060c] font-cinzel text-[10.5px] sm:text-[11.5px] tracking-[0.25em] uppercase font-semibold transition-all shadow-[0_4px_15px_rgba(226,190,155,0.2)] disabled:opacity-50 cursor-pointer text-center"
        >
          {isSubmitting ? "SENDING RSVP..." : "SEND RSVP →"}
        </button>

        <p className="mt-2 font-serif italic text-[11px] text-[#caa24d]/85">
          Your response helps us plan a better celebration
        </p>
      </div>
    </form>
  );
};
