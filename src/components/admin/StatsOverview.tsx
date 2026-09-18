"use strict";

import React from "react";
import { RSVPRow } from "@/types/database";

interface StatsOverviewProps {
  rsvps: RSVPRow[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ rsvps }) => {
  const totalResponses = rsvps.length;
  const attendingRsvps = rsvps.filter((r) => r.attendance === "attending");
  const declinedRsvps = rsvps.filter((r) => r.attendance === "declined");

  // Only count attending guests toward guest totals!
  const totalAttendingGuests = attendingRsvps.reduce((acc, r) => acc + (r.guest_count || 1), 0);

  const accommodationRequests = attendingRsvps.filter((r) => r.accommodation_required);
  const totalRoomsRequired = accommodationRequests.reduce(
    (acc, r) => acc + (r.rooms_required || 1),
    0
  );
  const totalPeopleStaying = accommodationRequests.reduce(
    (acc, r) => acc + (r.people_staying || 1),
    0
  );

  const transportationRequests = attendingRsvps.filter(
    (r) => r.transportation && r.transportation !== "none"
  ).length;

  if (totalResponses === 0) {
    return (
      <div className="p-6 border border-[#caa24d]/25 bg-[#140206] text-center space-y-2">
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#caa24d]/80 font-medium">
          Guest Overview
        </p>
        <p className="font-serif text-lg text-[#fff0c7] italic">
          No RSVPs yet.
        </p>
        <p className="font-serif text-xs text-[#f3e5c8]/70">
          Submissions received through the public invitation website will appear here in real time.
        </p>
      </div>
    );
  }

  const statCards = [
    {
      label: "TOTAL RSVPs",
      value: totalResponses,
      sublabel: `${attendingRsvps.length} Attending · ${declinedRsvps.length} Declined`,
    },
    {
      label: "ATTENDING RESPONSES",
      value: attendingRsvps.length,
      sublabel: `${totalResponses ? Math.round((attendingRsvps.length / totalResponses) * 100) : 0}% Acceptance`,
    },
    {
      label: "DECLINED RESPONSES",
      value: declinedRsvps.length,
      sublabel: "Regretfully declining",
    },
    {
      label: "TOTAL ATTENDING GUESTS",
      value: totalAttendingGuests,
      sublabel: "Excluding declined guests",
      highlight: true,
    },
    {
      label: "ACCOMMODATION REQUESTS",
      value: accommodationRequests.length,
      sublabel: `${totalPeopleStaying} Guests Staying`,
    },
    {
      label: "ROOMS REQUIRED",
      value: totalRoomsRequired,
      sublabel: "Hospitality allotment",
    },
    {
      label: "PEOPLE STAYING",
      value: totalPeopleStaying,
      sublabel: "Need lodging",
    },
    {
      label: "TRANSPORTATION REQUESTS",
      value: transportationRequests,
      sublabel: "Airport / station / shuttle",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statCards.map((stat, i) => (
        <div
          key={i}
          className={`p-4 border transition-all ${
            stat.highlight
              ? "border-[#caa24d] bg-[#22040b] shadow-[0_0_15px_rgba(202,162,77,0.15)]"
              : "border-[#caa24d]/25 bg-[#140206]"
          }`}
        >
          <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#caa24d]/85 font-medium">
            {stat.label}
          </p>
          <p className="font-serif text-2xl sm:text-3xl text-[#fff0c7] mt-1 mb-0.5">
            {stat.value}
          </p>
          <p className="font-serif text-[11px] text-[#f3e5c8]/65 italic">
            {stat.sublabel}
          </p>
        </div>
      ))}
    </div>
  );
};
