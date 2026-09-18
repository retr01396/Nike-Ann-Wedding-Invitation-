"use strict";

import React from "react";
import { TravelDestinationItem } from "@/types/wedding";
import {
  CarParkingIcon,
  ClockDistanceIcon,
  TransitBusIcon,
  LandmarkIcon,
  CompassRoseIcon,
  InfoNoticeIcon,
} from "./TravelIcons";

interface TravelDetailsPanelProps {
  destination: TravelDestinationItem;
  isExpanded: boolean;
}

export const TravelDetailsPanel: React.FC<TravelDetailsPanelProps> = ({
  destination,
  isExpanded,
}) => {
  const {
    landmark,
    distance,
    estimatedTravelTime,
    parkingInfo,
    taxiNotes,
    publicTransportNotes,
    pickupInfo,
    shuttleInfo,
    specialInstructions,
    travelNotes,
    isConfirmed,
    placeholderNotice,
  } = destination;

  // Collect configured logistics fields to render only non-empty ones
  const logisticsFields = [
    landmark && {
      icon: <LandmarkIcon className="w-3.5 h-3.5 text-[#caa24d]" />,
      label: "LANDMARK & WAYPOINT",
      value: landmark,
    },
    (distance || estimatedTravelTime) && {
      icon: <ClockDistanceIcon className="w-3.5 h-3.5 text-[#caa24d]" />,
      label: "DISTANCE & TRANSIT TIME",
      value: [distance, estimatedTravelTime].filter(Boolean).join(" · "),
    },
    parkingInfo && {
      icon: <CarParkingIcon className="w-3.5 h-3.5 text-[#caa24d]" />,
      label: "PARKING & VALET ASSISTANCE",
      value: parkingInfo,
    },
    taxiNotes && {
      icon: <CompassRoseIcon className="w-3.5 h-3.5 text-[#caa24d]" />,
      label: "TAXI & AUTO-RICKSHAW",
      value: taxiNotes,
    },
    (publicTransportNotes || shuttleInfo || pickupInfo) && {
      icon: <TransitBusIcon className="w-3.5 h-3.5 text-[#caa24d]" />,
      label: "PUBLIC TRANSIT & SHUTTLES",
      value: [publicTransportNotes, shuttleInfo, pickupInfo]
        .filter(Boolean)
        .join(" "),
    },
    (specialInstructions || travelNotes) && {
      icon: <CompassRoseIcon className="w-3.5 h-3.5 text-[#caa24d]" />,
      label: "SPECIAL TRAVEL NOTES",
      value: [travelNotes, specialInstructions].filter(Boolean).join(" "),
    },
  ].filter(Boolean) as Array<{
    icon: React.ReactNode;
    label: string;
    value: string;
  }>;

  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
        isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
      }`}
      aria-hidden={!isExpanded}
    >
      <div className="overflow-hidden">
        <div className="pt-3 pb-2 border-t border-[#caa24d]/20 space-y-3.5 text-left">
          {/* Unconfirmed / Tentative Placeholder Notice */}
          {!isConfirmed && (
            <div className="p-2.5 rounded-none border border-[#caa24d]/30 bg-[#20040a]/70 flex items-start space-x-2.5">
              <InfoNoticeIcon className="w-4 h-4 text-[#e5c57b] shrink-0 mt-0.5" />
              <p className="font-sans text-[10px] sm:text-[11px] leading-relaxed text-[#e5c57b]/90 italic">
                {placeholderNotice ||
                  "Tentative placeholder details — exact confirmed location and arrival guidelines will be updated upon final venue confirmation."}
              </p>
            </div>
          )}

          {/* Structured Logistics Field Grid */}
          <div className="space-y-3">
            {logisticsFields.map((field, idx) => (
              <div key={idx} className="flex items-start space-x-2.5">
                <div className="shrink-0 mt-0.5 p-1 rounded bg-[#1c040a] border border-[#caa24d]/20">
                  {field.icon}
                </div>
                <div className="space-y-0.5">
                  <span className="block font-sans text-[8.5px] sm:text-[9px] uppercase tracking-[0.2em] text-[#caa24d]/80 font-medium">
                    {field.label}
                  </span>
                  <p className="font-sans text-[11px] sm:text-[12px] leading-relaxed text-[#f3e5c8]/90 font-light">
                    {field.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
