"use strict";

import React from "react";
import { TravelDestinationItem } from "@/types/wedding";
import { TravelMapPreview } from "./TravelMapPreview";
import { TravelDetailsPanel } from "./TravelDetailsPanel";
import { DirectionsArrowIcon } from "./TravelIcons";

interface TravelCardProps {
  destination: TravelDestinationItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export const TravelCard: React.FC<TravelCardProps> = ({
  destination,
  index,
  isExpanded,
  onToggle,
}) => {
  const {
    id,
    category,
    title,
    subtitle,
    address,
    cityLabel,
    mapUrl,
    directionsButtonText = "GET DIRECTIONS →",
    mapPreviewImage,
    isConfirmed,
  } = destination;

  return (
    <article
      id={`travel-card-${id}`}
      className="travel-card relative w-full max-w-md md:max-w-none mx-auto bg-[#140206]/95 border border-[#caa24d]/30 p-4 sm:p-5 md:p-6 flex flex-col justify-between shadow-2xl transition-all duration-500 hover:border-[#caa24d]/55 group"
    >
      {/* Delicate Double Hairline Accents on Corners */}
      <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t border-l border-[#caa24d]/60 pointer-events-none" />
      <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t border-r border-[#caa24d]/60 pointer-events-none" />
      <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b border-l border-[#caa24d]/60 pointer-events-none" />
      <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b border-r border-[#caa24d]/60 pointer-events-none" />

      {/* Top Half: Luxury Dark Map Preview */}
      <div className="w-full mb-4 sm:mb-5">
        <TravelMapPreview
          title={title}
          cityLabel={cityLabel}
          mapPreviewImage={mapPreviewImage}
          isConfirmed={isConfirmed}
        />
      </div>

      {/* Bottom Half: Destination Metadata & Actions */}
      <div className="flex-1 flex flex-col justify-between text-center space-y-3">
        {/* Category Badge matching Reference */}
        <div>
          <span className="font-sans text-[9px] sm:text-[9.5px] uppercase tracking-[0.3em] text-[#caa24d]/85 font-medium">
            {category}
          </span>
        </div>

        {/* Destination Title & Subtitle */}
        <div className="space-y-1">
          <h3 className="font-serif text-lg sm:text-xl font-normal tracking-[0.1em] text-[#fff0c7] leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="font-serif text-xs italic text-[#e5c57b]/80 font-light">
              {subtitle}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="px-2">
          <p className="font-sans text-[11px] sm:text-[12px] leading-relaxed text-[#f3e5c8]/75 font-light">
            {address}
          </p>
        </div>

        {/* Action Button: GET DIRECTIONS → (Matching Reference Box Button) */}
        <div className="pt-2">
          {mapUrl ? (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full py-2.5 px-4 border border-[#caa24d]/50 bg-[#1b0308] text-[#fff0c7] font-serif text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:bg-[#caa24d] hover:text-[#100104] hover:border-[#caa24d] hover:shadow-[0_0_15px_rgba(202,162,77,0.3)] focus:outline-none focus:ring-1 focus:ring-[#caa24d]"
              aria-label={`Get directions to ${title} on Google Maps`}
            >
              <span>{directionsButtonText.replace(/[→\->]/g, "").trim()}</span>
              <DirectionsArrowIcon className="w-3.5 h-3.5" />
            </a>
          ) : (
            <div
              className="inline-flex items-center justify-center w-full py-2.5 px-4 border border-[#caa24d]/20 bg-[#160206] text-[#e5c57b]/50 font-serif text-xs tracking-[0.2em] uppercase cursor-not-allowed"
            >
              <span>DIRECTIONS PENDING</span>
            </div>
          )}
        </div>

        {/* In-Flow Details Accordion Toggle Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isExpanded}
            aria-controls={`travel-details-${id}`}
            className="group/toggle inline-flex items-center space-x-1.5 text-[10px] sm:text-[10.5px] uppercase tracking-[0.2em] text-[#caa24d]/80 hover:text-[#fff0c7] transition-colors duration-300 py-1 focus:outline-none"
          >
            <span>
              {isExpanded ? "Hide Travel Notes" : "View Logistics & Parking"}
            </span>
            <span
              className={`transform transition-transform duration-300 text-xs text-[#caa24d] ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
            >
              ↓
            </span>
          </button>
        </div>

        {/* In-Flow Expandable Details Panel */}
        <div id={`travel-details-${id}`}>
          <TravelDetailsPanel
            destination={destination}
            isExpanded={isExpanded}
          />
        </div>
      </div>
    </article>
  );
};
