"use strict";
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RSVPRow } from "@/types/database";
import { weddingConfig } from "@/config/wedding";
import { EditRSVPModal } from "@/components/admin/EditRSVPModal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";

export default function RSVPDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [rsvp, setRsvp] = useState<RSVPRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeletingModalOpen, setIsDeletingModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { rsvp: rsvpConfig } = weddingConfig;

  useEffect(() => {
    async function loadRsvp() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const res = await fetch(`/api/admin/rsvps/${params.id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setErrorMessage(data?.error || "Unable to load RSVP record.");
          setIsLoading(false);
          return;
        }

        setRsvp(data.rsvp);
      } catch {
        setErrorMessage("Network error while connecting to administrative service.");
      } finally {
        setIsLoading(false);
      }
    }

    loadRsvp();
  }, [params.id]);

  const handleDeleteConfirm = async () => {
    if (!rsvp) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/admin/rsvps/${rsvp.id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setDeleteError(data?.error || "Failed to delete RSVP record.");
        setIsDeleting(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setDeleteError("Network error while deleting record. Please check your connection.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getDietaryLabel = (slug: string) => {
    return (
      rsvpConfig.dietaryOptions.find((o) => o.value === slug)?.label ||
      slug ||
      "None"
    );
  };

  const getTransitLabel = (slug: string | null) => {
    if (!slug || slug === "none") return "No transportation required";
    return (
      rsvpConfig.accommodation.transportationOptions.find((o) => o.value === slug)?.label ||
      slug
    );
  };

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
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 border border-[#caa24d]/25 bg-[#140206] text-center space-y-3 animate-pulse">
        <p className="font-serif text-xl text-[#caa24d] italic">Loading RSVP Details...</p>
        <p className="font-sans text-[10px] uppercase tracking-widest text-[#caa24d]/60">
          Retrieving guest record
        </p>
      </div>
    );
  }

  if (errorMessage || !rsvp) {
    return (
      <div className="p-12 border border-[#caa24d]/25 bg-[#140206] text-center space-y-4">
        <p className="font-serif text-xl text-[#fff0c7] italic">{errorMessage || "Not found."}</p>
        <p className="font-serif text-xs text-[#caa24d]/75">
          The requested RSVP record could not be found or has been removed.
        </p>
        <div className="pt-2">
          <Link
            href="/admin"
            className="px-4 py-2 border border-[#caa24d]/40 text-xs font-sans uppercase tracking-wider text-[#caa24d] hover:text-[#fff0c7]"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isAttending = rsvp.attendance === "attending";

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      {/* Back Link */}
      <div>
        <Link
          href="/admin"
          className="text-xs font-sans uppercase tracking-wider text-[#caa24d]/80 hover:text-[#fff0c7] transition-colors inline-flex items-center space-x-1"
        >
          <span>←</span>
          <span>Back to All RSVPs</span>
        </Link>
      </div>

      {/* Main Dossier Card */}
      <div className="relative p-6 sm:p-10 border border-[#caa24d]/35 bg-[#140206] shadow-2xl space-y-6">
        {/* Delicate Corner Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#caa24d]/70 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#caa24d]/70 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#caa24d]/70 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#caa24d]/70 pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#caa24d]/20 pb-5 gap-3">
          <div>
            <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#caa24d] font-medium block">
              Guest Record
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#fff0c7] uppercase tracking-wide mt-1">
              {rsvp.name}
            </h1>
            {rsvp.phone && (
              <p className="font-sans text-xs text-[#caa24d]/90 mt-1">
                Contact: {rsvp.phone}
              </p>
            )}
          </div>

          <span
            className={`inline-flex items-center px-3 py-1.5 text-xs font-sans uppercase tracking-wider font-medium border shrink-0 ${
              isAttending
                ? "border-[#caa24d]/60 bg-[#280710] text-[#e5c57b]"
                : "border-red-900/50 bg-red-950/30 text-red-300"
            }`}
          >
            {isAttending ? "Attending with Pleasure" : "Respectfully Declined"}
          </span>
        </div>

        {/* Dossier Grid */}
        <div className="space-y-6 text-xs font-serif divide-y divide-[#caa24d]/15">
          {/* Section 1: Guest Count & Dietary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-3.5 border border-[#caa24d]/15 bg-[#180308]">
              <span className="block font-sans text-[9px] uppercase tracking-wider text-[#caa24d]/75">
                Total Guests Attending
              </span>
              <span className="text-[#fff0c7] text-base mt-0.5 block">
                {isAttending ? `${rsvp.guest_count} Person` : "0 (Declined)"}
              </span>
            </div>

            <div className="p-3.5 border border-[#caa24d]/15 bg-[#180308]">
              <span className="block font-sans text-[9px] uppercase tracking-wider text-[#caa24d]/75">
                Dietary Preference
              </span>
              <span className="text-[#fff0c7] text-base mt-0.5 block">
                {isAttending ? getDietaryLabel(rsvp.dietary_preference) : "—"}
              </span>
              {isAttending && rsvp.dietary_other && (
                <p className="text-[11px] text-[#e5c57b] italic mt-1">
                  Allergy Notes: {rsvp.dietary_other}
                </p>
              )}
            </div>
          </div>

          {/* Section 2: Accommodation & Hospitality */}
          <div className="pt-6 space-y-3">
            <span className="font-sans text-[9.5px] uppercase tracking-[0.2em] text-[#caa24d] font-medium block">
              Accommodation & Stay Coordination
            </span>

            {isAttending && rsvp.accommodation_required ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3 border border-[#caa24d]/15 bg-[#180308]">
                  <span className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/75">
                    Rooms Required
                  </span>
                  <span className="text-[#fff0c7] text-sm">
                    {rsvp.rooms_required || 1} Room{(rsvp.rooms_required || 1) > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="p-3 border border-[#caa24d]/15 bg-[#180308]">
                  <span className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/75">
                    People Lodging
                  </span>
                  <span className="text-[#fff0c7] text-sm">
                    {rsvp.people_staying || 1} Person{(rsvp.people_staying || 1) > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="p-3 border border-[#caa24d]/15 bg-[#180308]">
                  <span className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/75">
                    Arrival Schedule
                  </span>
                  <span className="text-[#fff0c7] text-sm">
                    {formatDate(rsvp.arrival_date)}
                  </span>
                </div>

                <div className="p-3 border border-[#caa24d]/15 bg-[#180308]">
                  <span className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/75">
                    Departure Schedule
                  </span>
                  <span className="text-[#fff0c7] text-sm">
                    {formatDate(rsvp.departure_date)}
                  </span>
                </div>

                <div className="col-span-1 sm:col-span-2 p-3 border border-[#caa24d]/15 bg-[#180308]">
                  <span className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/75">
                    Transportation Assistance
                  </span>
                  <span className="text-[#fff0c7] text-sm block mt-0.5">
                    {getTransitLabel(rsvp.transportation)}
                  </span>
                  {rsvp.transportation_other && (
                    <p className="text-[#caa24d]/80 italic mt-1 text-[11px]">
                      Travel Coordinates: {rsvp.transportation_other}
                    </p>
                  )}
                </div>

                {rsvp.special_requirements && (
                  <div className="col-span-1 sm:col-span-2 p-3 border border-[#caa24d]/15 bg-[#180308]">
                    <span className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/75">
                      Special Requirements & Accessibility
                    </span>
                    <p className="text-[#f3e5c8]/90 italic mt-0.5 text-xs">
                      {rsvp.special_requirements}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 border border-[#caa24d]/15 bg-[#180308] text-[#caa24d]/70 italic">
                {isAttending
                  ? "Guest is arranging their own independent lodging."
                  : "No accommodation requested."}
              </div>
            )}
          </div>

          {/* Section 3: Couple's Message */}
          <div className="pt-6 space-y-2">
            <span className="font-sans text-[9.5px] uppercase tracking-[0.2em] text-[#caa24d] font-medium block">
              Personal Message for Nike & Ann
            </span>
            {rsvp.message ? (
              <div className="p-4 border border-[#caa24d]/25 bg-[#1c040a] text-sm font-serif italic text-[#fff0c7] leading-relaxed">
                &ldquo;{rsvp.message}&rdquo;
              </div>
            ) : (
              <p className="text-[#caa24d]/50 italic text-xs">No message was left with this RSVP.</p>
            )}
          </div>

          {/* Section 4: Timestamps & Meta */}
          <div className="pt-6 flex flex-col sm:flex-row justify-between text-[11px] text-[#caa24d]/60 font-serif italic gap-2">
            <div>Submitted: {formatTimestamp(rsvp.created_at)}</div>
            <div>Last Updated: {formatTimestamp(rsvp.updated_at)}</div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-[#caa24d]/20">
          <button
            type="button"
            onClick={() => {
              setDeleteError(null);
              setIsDeletingModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-sans uppercase tracking-wider border border-red-900/50 text-red-300 hover:border-red-600 transition-colors"
          >
            Delete Response
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-5 py-2 text-xs font-sans uppercase tracking-wider border border-[#caa24d] bg-[#24050d] text-[#fff0c7] hover:bg-[#caa24d] hover:text-[#100104] transition-all"
            >
              Edit RSVP
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditRSVPModal
        rsvp={rsvp}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={(updated) => setRsvp(updated)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        rsvp={rsvp}
        isOpen={isDeletingModalOpen}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeletingModalOpen(false);
          setDeleteError(null);
        }}
      />
    </div>
  );
}
