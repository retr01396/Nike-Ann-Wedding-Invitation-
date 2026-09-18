"use strict";

import React, { useState, useEffect } from "react";
import { RSVPRow, RSVPUpdate } from "@/types/database";
import { weddingConfig } from "@/config/wedding";

interface EditRSVPModalProps {
  rsvp: RSVPRow | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: RSVPRow) => void;
}

export const EditRSVPModal: React.FC<EditRSVPModalProps> = ({
  rsvp,
  isOpen,
  onClose,
  onSave,
}) => {
  const { rsvp: config } = weddingConfig;

  // Form State
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<"attending" | "declined">("attending");
  const [guestCount, setGuestCount] = useState(1);
  const [dietaryPreference, setDietaryPreference] = useState("no-preference");
  const [dietaryOther, setDietaryOther] = useState("");
  const [accommodationRequired, setAccommodationRequired] = useState(false);
  const [phone, setPhone] = useState("");
  const [peopleStaying, setPeopleStaying] = useState(1);
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [roomsRequired, setRoomsRequired] = useState(1);
  const [transportation, setTransportation] = useState("none");
  const [transportationOther, setTransportationOther] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [message, setMessage] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (rsvp) {
      setName(rsvp.name || "");
      setAttendance(rsvp.attendance);
      setGuestCount(rsvp.guest_count || 1);
      setDietaryPreference(rsvp.dietary_preference || "no-preference");
      setDietaryOther(rsvp.dietary_other || "");
      setAccommodationRequired(rsvp.accommodation_required || false);
      setPhone(rsvp.phone || "");
      setPeopleStaying(rsvp.people_staying || 1);
      setArrivalDate(rsvp.arrival_date || "");
      setDepartureDate(rsvp.departure_date || "");
      setRoomsRequired(rsvp.rooms_required || 1);
      setTransportation(rsvp.transportation || "none");
      setTransportationOther(rsvp.transportation_other || "");
      setSpecialRequirements(rsvp.special_requirements || "");
      setMessage(rsvp.message || "");
      setFormError(null);
    }
  }, [rsvp]);

  if (!isOpen || !rsvp) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("Guest name cannot be empty.");
      return;
    }

    if (attendance === "attending" && accommodationRequired) {
      if (!phone.trim()) {
        setFormError("Phone number is required when accommodation is requested.");
        return;
      }
      if (!arrivalDate || !departureDate) {
        setFormError("Both arrival and departure dates are required.");
        return;
      }
      if (departureDate < arrivalDate) {
        setFormError("Departure date cannot precede arrival date.");
        return;
      }
      if (!roomsRequired || roomsRequired < 1) {
        setFormError("Rooms required must be at least 1.");
        return;
      }
      if (!peopleStaying || peopleStaying < 1) {
        setFormError("Number of guests staying must be at least 1.");
        return;
      }
    }

    setIsSaving(true);

    const updatePayload: RSVPUpdate = {
      name: name.trim(),
      attendance,
      guest_count: attendance === "attending" ? guestCount : 1,
      dietary_preference: attendance === "attending" ? dietaryPreference : "no-preference",
      dietary_other: attendance === "attending" && dietaryOther.trim() ? dietaryOther.trim() : null,
      accommodation_required: attendance === "attending" ? accommodationRequired : false,
      phone: attendance === "attending" && accommodationRequired ? phone.trim() : null,
      people_staying: attendance === "attending" && accommodationRequired ? peopleStaying : null,
      arrival_date: attendance === "attending" && accommodationRequired ? arrivalDate : null,
      departure_date: attendance === "attending" && accommodationRequired ? departureDate : null,
      rooms_required: attendance === "attending" && accommodationRequired ? roomsRequired : null,
      transportation: attendance === "attending" && accommodationRequired ? transportation : null,
      transportation_other:
        attendance === "attending" && accommodationRequired && transportationOther.trim()
          ? transportationOther.trim()
          : null,
      special_requirements:
        attendance === "attending" && accommodationRequired && specialRequirements.trim()
          ? specialRequirements.trim()
          : null,
      message: message.trim() ? message.trim() : null,
    };

    try {
      const res = await fetch(`/api/admin/rsvps/${rsvp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setFormError(data?.error || "Failed to save updates.");
        setIsSaving(false);
        return;
      }

      onSave(data.rsvp);
      onClose();
    } catch {
      setFormError("Network error while saving updates.");
    } finally {
      setIsSaving(false);
    }
  };

  const isAttending = attendance === "attending";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl my-8 p-6 sm:p-8 border border-[#caa24d]/40 bg-[#150206] shadow-2xl text-left space-y-5">
        {/* Corner Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#caa24d]/70 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#caa24d]/70 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#caa24d]/70 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#caa24d]/70 pointer-events-none" />

        <div className="border-b border-[#caa24d]/20 pb-3">
          <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#caa24d] font-medium block">
            Administrative Record Edit
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#fff0c7] uppercase tracking-wide mt-0.5">
            Modify RSVP: {rsvp.name}
          </h3>
        </div>

        {formError && (
          <div
            className="p-3 border border-red-800/60 bg-red-950/40 text-red-200 font-serif text-xs italic text-center"
            role="alert"
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-serif">
          {/* Guest Name & Attendance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-sans text-[9px] uppercase tracking-wider text-[#caa24d]/90 font-medium">
                Guest Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#190308] border border-[#caa24d]/30 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d]"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-sans text-[9px] uppercase tracking-wider text-[#caa24d]/90 font-medium">
                Attendance Status *
              </label>
              <select
                value={attendance}
                onChange={(e) => setAttendance(e.target.value as "attending" | "declined")}
                className="w-full px-3 py-2 bg-[#190308] border border-[#caa24d]/30 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d]"
              >
                <option value="attending">Attending with Pleasure</option>
                <option value="declined">Respectfully Declined</option>
              </select>
            </div>
          </div>

          {/* Conditional Attending Fields */}
          {isAttending && (
            <div className="space-y-4 pt-2 border-t border-[#caa24d]/15 animate-fadeIn">
              {/* Guests Count & Dietary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-sans text-[9px] uppercase tracking-wider text-[#caa24d]/90 font-medium">
                    Total Attending Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-[#190308] border border-[#caa24d]/30 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-sans text-[9px] uppercase tracking-wider text-[#caa24d]/90 font-medium">
                    Dietary Preference
                  </label>
                  <select
                    value={dietaryPreference}
                    onChange={(e) => setDietaryPreference(e.target.value)}
                    className="w-full px-3 py-2 bg-[#190308] border border-[#caa24d]/30 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d]"
                  >
                    {config.dietaryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {dietaryPreference === "other" && (
                <div className="space-y-1">
                  <label className="block font-sans text-[9px] uppercase tracking-wider text-[#caa24d]/90 font-medium">
                    Dietary Details / Allergies
                  </label>
                  <input
                    type="text"
                    value={dietaryOther}
                    onChange={(e) => setDietaryOther(e.target.value)}
                    placeholder="Specify allergy notes..."
                    className="w-full px-3 py-2 bg-[#190308] border border-[#caa24d]/30 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d]"
                  />
                </div>
              )}

              {/* Accommodation Toggle */}
              <div className="pt-2">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accommodationRequired}
                    onChange={(e) => setAccommodationRequired(e.target.checked)}
                    className="w-4 h-4 accent-[#caa24d] cursor-pointer"
                  />
                  <span className="font-sans text-[10px] uppercase tracking-wider text-[#fff0c7] font-medium">
                    Guest requested stay / lodging accommodation
                  </span>
                </label>
              </div>

              {/* Accommodation Details */}
              {accommodationRequired && (
                <div className="space-y-3 p-3.5 border border-[#caa24d]/20 bg-[#1a0308] animate-fadeIn">
                  <div className="space-y-1">
                    <label className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/90">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 Mobile Number"
                      className="w-full px-3 py-2 bg-[#120205] border border-[#caa24d]/30 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/90">
                        Arrival Date *
                      </label>
                      <input
                        type="date"
                        value={arrivalDate}
                        onChange={(e) => setArrivalDate(e.target.value)}
                        className="w-full px-3 py-2 bg-[#120205] border border-[#caa24d]/30 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/90">
                        Departure Date *
                      </label>
                      <input
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className="w-full px-3 py-2 bg-[#120205] border border-[#caa24d]/30 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/90">
                        Rooms Allotted
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={roomsRequired}
                        onChange={(e) => setRoomsRequired(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 bg-[#120205] border border-[#caa24d]/30 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/90">
                        People Staying
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={peopleStaying}
                        onChange={(e) => setPeopleStaying(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 bg-[#120205] border border-[#caa24d]/30 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/90">
                      Transportation Assistance
                    </label>
                    <select
                      value={transportation}
                      onChange={(e) => setTransportation(e.target.value)}
                      className="w-full px-3 py-2 bg-[#120205] border border-[#caa24d]/30 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d]"
                    >
                      {config.accommodation.transportationOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Personal Note */}
          <div className="space-y-1 pt-1">
            <label className="block font-sans text-[9px] uppercase tracking-wider text-[#caa24d]/90 font-medium">
              Guest Note / Message
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Guest note..."
              className="w-full px-3 py-2 bg-[#190308] border border-[#caa24d]/30 text-[#fff0c7] text-xs font-sans focus:outline-none focus:border-[#caa24d] resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#caa24d]/20">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="px-4 py-2 text-xs font-sans uppercase tracking-wider border border-[#caa24d]/30 text-[#caa24d] hover:text-[#fff0c7] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-sans uppercase tracking-wider border border-[#caa24d] bg-gradient-to-r from-[#caa24d] via-[#fff0c7] to-[#e5c57b] text-[#120206] font-medium transition-all hover:brightness-110 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
