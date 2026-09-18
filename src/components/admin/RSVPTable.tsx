"use strict";

import React from "react";
import { RSVPRow } from "@/types/database";
import { weddingConfig } from "@/config/wedding";

interface RSVPTableProps {
  rsvps: RSVPRow[];
  onView: (rsvp: RSVPRow) => void;
  onEdit: (rsvp: RSVPRow) => void;
  onDelete: (rsvp: RSVPRow) => void;
}

export const RSVPTable: React.FC<RSVPTableProps> = ({
  rsvps,
  onView,
  onEdit,
  onDelete,
}) => {
  const { rsvp } = weddingConfig;

  const getDietaryLabel = (slug: string) => {
    return (
      rsvp.dietaryOptions.find((o) => o.value === slug)?.label ||
      slug ||
      "None"
    );
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
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
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (rsvps.length === 0) {
    return (
      <div className="p-10 border border-[#caa24d]/25 bg-[#140206] text-center space-y-2">
        <p className="font-serif text-lg text-[#fff0c7] italic">
          No guests found matching the selected criteria.
        </p>
        <p className="font-serif text-xs text-[#caa24d]/75">
          Try adjusting or clearing your search term and filters above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ========================================================= */}
      {/* 1. DESKTOP VIEW: High-Density Table (>=1024px) */}
      {/* ========================================================= */}
      <div className="hidden lg:block overflow-x-auto border border-[#caa24d]/25 bg-[#140206]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#caa24d]/25 bg-[#190308] text-[#caa24d] font-sans text-[9px] uppercase tracking-[0.2em]">
              <th className="py-3.5 px-4 font-medium">Guest Name</th>
              <th className="py-3.5 px-3 font-medium">Attendance</th>
              <th className="py-3.5 px-3 font-medium">Guests</th>
              <th className="py-3.5 px-3 font-medium">Dietary</th>
              <th className="py-3.5 px-3 font-medium">Stay & Lodging</th>
              <th className="py-3.5 px-3 font-medium">Arrival / Departure</th>
              <th className="py-3.5 px-3 font-medium">Submitted</th>
              <th className="py-3.5 px-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#caa24d]/15">
            {rsvps.map((row) => {
              const isAttending = row.attendance === "attending";
              return (
                <tr
                  key={row.id}
                  className="hover:bg-[#1f050d]/80 transition-colors group cursor-pointer"
                  onClick={() => onView(row)}
                >
                  {/* Guest Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-serif text-sm text-[#fff0c7] font-medium group-hover:text-[#e5c57b]">
                      {row.name}
                    </div>
                    {row.phone && (
                      <div className="font-sans text-[10px] text-[#caa24d]/75 mt-0.5">
                        {row.phone}
                      </div>
                    )}
                  </td>

                  {/* Attendance */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-none font-sans text-[9px] uppercase tracking-wider font-medium border ${
                        isAttending
                          ? "border-[#caa24d]/60 bg-[#280710] text-[#e5c57b]"
                          : "border-red-900/50 bg-red-950/30 text-red-300"
                      }`}
                    >
                      {isAttending ? "Attending" : "Declined"}
                    </span>
                  </td>

                  {/* Guest Count */}
                  <td className="py-3.5 px-3 font-serif text-xs text-[#fff0c7]">
                    {isAttending ? `${row.guest_count || 1}` : "—"}
                  </td>

                  {/* Dietary */}
                  <td className="py-3.5 px-3 font-serif text-xs text-[#f3e5c8]/85 max-w-[160px] truncate">
                    {isAttending
                      ? row.dietary_preference === "other"
                        ? row.dietary_other || "Other"
                        : getDietaryLabel(row.dietary_preference)
                      : "—"}
                  </td>

                  {/* Accommodation */}
                  <td className="py-3.5 px-3">
                    {isAttending && row.accommodation_required ? (
                      <div className="space-y-0.5">
                        <span className="inline-block px-1.5 py-0.5 border border-[#caa24d]/40 bg-[#2a060e] text-[9.5px] text-[#fff0c7] uppercase tracking-wider font-sans">
                          {row.rooms_required || 1} Room
                          {(row.rooms_required || 1) > 1 ? "s" : ""}
                        </span>
                        <div className="text-[10px] text-[#caa24d]/75 italic font-serif truncate max-w-[120px]">
                          {row.people_staying || 1} Staying
                          {row.stay_guest_name && row.stay_guest_name !== row.name ? ` (${row.stay_guest_name})` : ""}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[#caa24d]/40 text-xs">—</span>
                    )}
                  </td>

                  {/* Dates */}
                  <td className="py-3.5 px-3 font-serif text-[11px] text-[#f3e5c8]/80">
                    {isAttending && row.accommodation_required ? (
                      <div>
                        <div>Arr: {formatDate(row.arrival_date)}</div>
                        <div className="text-[#caa24d]/70">Dep: {formatDate(row.departure_date)}</div>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Submitted Timestamp */}
                  <td className="py-3.5 px-3 font-serif text-[11px] text-[#caa24d]/70 whitespace-nowrap">
                    {formatTimestamp(row.created_at)}
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3.5 px-4 text-right space-x-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => onView(row)}
                      className="px-2 py-1 text-[10px] font-sans uppercase tracking-wider border border-[#caa24d]/30 text-[#caa24d] hover:border-[#caa24d] hover:text-[#fff0c7] transition-all"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(row)}
                      className="px-2 py-1 text-[10px] font-sans uppercase tracking-wider border border-[#caa24d]/30 text-[#fff0c7] hover:border-[#caa24d] transition-all"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(row)}
                      className="px-2 py-1 text-[10px] font-sans uppercase tracking-wider border border-red-900/40 text-red-300 hover:border-red-600 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================================================= */}
      {/* 2. MOBILE VIEW: Stacked Responsive Cards (<1024px) */}
      {/* ========================================================= */}
      <div className="lg:hidden space-y-3">
        {rsvps.map((row) => {
          const isAttending = row.attendance === "attending";
          return (
            <div
              key={row.id}
              onClick={() => onView(row)}
              className="p-4 border border-[#caa24d]/25 bg-[#140206] space-y-3 text-left transition-all hover:border-[#caa24d]/50 cursor-pointer"
            >
              {/* Card Header: Name + Attendance Status Badge */}
              <div className="flex items-start justify-between gap-2 border-b border-[#caa24d]/15 pb-2.5">
                <div>
                  <h4 className="font-serif text-base text-[#fff0c7] font-medium leading-tight">
                    {row.name}
                  </h4>
                  {row.phone && (
                    <p className="font-sans text-[10px] text-[#caa24d]/80 mt-0.5">
                      {row.phone}
                    </p>
                  )}
                </div>

                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-none font-sans text-[9px] uppercase tracking-wider font-medium border shrink-0 ${
                    isAttending
                      ? "border-[#caa24d]/60 bg-[#280710] text-[#e5c57b]"
                      : "border-red-900/50 bg-red-950/30 text-red-300"
                  }`}
                >
                  {isAttending ? "Attending" : "Declined"}
                </span>
              </div>

              {/* Card Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-serif">
                {isAttending && (
                  <div>
                    <span className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/75">
                      Guests
                    </span>
                    <span className="text-[#fff0c7]">
                      {row.guest_count} {row.guest_count === 1 ? "Person" : "People"}
                    </span>
                  </div>
                )}

                {isAttending && (
                  <div>
                    <span className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/75">
                      Dietary
                    </span>
                    <span className="text-[#f3e5c8]/90 truncate block">
                      {row.dietary_preference === "other"
                        ? row.dietary_other || "Other"
                        : getDietaryLabel(row.dietary_preference)}
                    </span>
                  </div>
                )}

                {isAttending && row.accommodation_required && (
                  <div>
                    <span className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/75">
                      Lodging
                    </span>
                    <span className="text-[#fff0c7]">
                      {row.rooms_required || 1} Room · {row.people_staying || 1} Guest
                      {(row.people_staying || 1) > 1 ? "s" : ""}
                    </span>
                  </div>
                )}

                {isAttending && row.accommodation_required && row.arrival_date && (
                  <div>
                    <span className="block font-sans text-[8.5px] uppercase tracking-wider text-[#caa24d]/75">
                      Dates
                    </span>
                    <span className="text-[#f3e5c8]/90 text-[11px]">
                      {formatDate(row.arrival_date)} – {formatDate(row.departure_date)}
                    </span>
                  </div>
                )}
              </div>

              {/* Optional Message Preview */}
              {row.message && (
                <div className="p-2 border border-[#caa24d]/15 bg-[#1a0409] text-[11px] font-serif italic text-[#f3e5c8]/80 line-clamp-2">
                  &ldquo;{row.message}&rdquo;
                </div>
              )}

              {/* Card Footer Actions */}
              <div
                className="flex items-center justify-between pt-2 border-t border-[#caa24d]/15"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="font-serif text-[10px] text-[#caa24d]/60 italic">
                  {formatTimestamp(row.created_at)}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => onView(row)}
                    className="px-2.5 py-1 text-[10px] font-sans uppercase tracking-wider border border-[#caa24d]/40 text-[#caa24d] hover:text-[#fff0c7]"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(row)}
                    className="px-2.5 py-1 text-[10px] font-sans uppercase tracking-wider border border-[#caa24d]/40 text-[#fff0c7] hover:border-[#caa24d]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(row)}
                    className="px-2.5 py-1 text-[10px] font-sans uppercase tracking-wider border border-red-900/40 text-red-300 hover:border-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
