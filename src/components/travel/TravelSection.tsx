"use client";

import React, { useState } from "react";
import Image from "next/image";
import { weddingConfig } from "@/config/wedding";
import { MapPin, ExternalLink, Car, ChevronDown, ChevronUp } from "lucide-react";

export const TravelSection: React.FC = () => {
  const destinations = weddingConfig.travel.destinations;
  const [selectedDestId, setSelectedDestId] = useState<string>(destinations[0]?.id || "church");
  const [showAllInFlow, setShowAllInFlow] = useState(false);

  const selectedDest =
    destinations.find((d) => d.id === selectedDestId) || destinations[0];

  return (
    <div
      id="directions"
      className="relative w-full p-6 sm:p-7 overflow-hidden flex flex-col justify-between scroll-mt-16"
    >
      {/* Fallback anchor for backward compatibility */}
      <span id="travel" className="sr-only" aria-hidden="true" />

      <div className="relative z-10">
        {/* Eyebrow & Title matching reference */}
        <div className="text-center">
          <span className="font-cinzel text-[8.5px] sm:text-[9.5px] tracking-[0.35em] text-[#caa24d] uppercase font-medium">
            {weddingConfig.travel.badge}
          </span>
          <h3 className="mt-1 font-cinzel text-lg sm:text-xl tracking-[0.14em] text-[#fbf6ea] font-normal">
            {weddingConfig.travel.title}
          </h3>
          <div className="w-6 h-[1px] bg-[#caa24d]/60 mx-auto mt-2" />
        </div>

        {/* 3 Location Selector Tabs */}
        <div className="mt-5 grid grid-cols-3 gap-1.5 p-1 bg-[#150206]/80 border border-[#caa24d]/25">
          {destinations.map((dest, idx) => {
            const isActive = dest.id === selectedDest.id;
            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => setSelectedDestId(dest.id)}
                className={`py-1.5 px-1 text-center font-cinzel text-[8.5px] sm:text-[9.5px] tracking-[0.15em] uppercase transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#caa24d]/25 text-[#fff0c7] font-semibold border border-[#caa24d]/60 shadow-inner"
                    : "text-[#d8b257]/70 hover:text-[#fff0c7] hover:bg-[#caa24d]/10 border border-transparent"
                }`}
                aria-pressed={isActive}
              >
                {dest.category}
              </button>
            );
          })}
        </div>

        {/* Editorial Dark Cartography Map Card */}
        <div className="mt-4 relative w-full h-[140px] sm:h-[155px] rounded-none overflow-hidden border border-[#caa24d]/25 shadow-[0_10px_25px_rgba(0,0,0,0.8)] group">
          <Image
            src="/images/wedding/travel/editorial-map-card.jpg"
            alt={`Dark cartography map preview for ${selectedDest.title}`}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover object-center filter contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
            priority
          />

          {/* Map Info Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 bg-black/35">
            <div className="w-7 h-7 rounded-full bg-[#1b0408]/90 border border-[#caa24d]/60 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <MapPin className="w-3.5 h-3.5 text-[#caa24d]" />
            </div>
            <p className="mt-1.5 font-cinzel text-[9.5px] sm:text-[10px] tracking-[0.25em] text-[#fff0c7] uppercase font-medium drop-shadow-md">
              {selectedDest.category} · {selectedDest.cityLabel}
            </p>
          </div>
        </div>

        {/* Active Destination Details */}
        <div className="mt-4 p-3 bg-[#170307]/70 border border-[#caa24d]/20 space-y-1.5 text-left">
          <div className="flex items-center justify-between gap-2">
            <span className="font-cinzel text-[9px] tracking-[0.2em] text-[#caa24d] uppercase font-medium">
              {selectedDest.title}
            </span>
            {selectedDest.estimatedTravelTime && (
              <span className="font-sans text-[10px] text-[#caa24d]/75 shrink-0">
                {selectedDest.estimatedTravelTime}
              </span>
            )}
          </div>
          <p className="font-serif italic text-xs text-[#caa24d]/85">
            {selectedDest.subtitle}
          </p>
          <p className="font-sans text-[11px] text-[#ecd9b8]/85 leading-relaxed font-light">
            {selectedDest.address}
          </p>

          {/* Parking Notes */}
          {selectedDest.parkingInfo && (
            <div className="pt-1.5 border-t border-[#caa24d]/15 flex items-start gap-1.5 text-[10.5px] text-[#ecd9b8]/80 font-sans">
              <Car className="w-3.5 h-3.5 text-[#caa24d] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#caa24d] font-serif uppercase tracking-wider text-[9.5px]">Parking:</strong> {selectedDest.parkingInfo}
              </span>
            </div>
          )}
        </div>

        {/* Action Button: GET DIRECTIONS */}
        <div className="mt-4 flex flex-col items-center">
          <a
            href={selectedDest.mapUrl || "https://maps.google.com/?q=Thrissur+Kerala"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 text-center rounded-none border border-[#caa24d]/50 bg-transparent text-[#e5c57b] font-cinzel text-[9.5px] sm:text-[10px] tracking-[0.25em] uppercase hover:bg-[#caa24d]/10 hover:border-[#caa24d] hover:text-[#fff0c7] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <span>GET DIRECTIONS</span>
            <span className="text-xs">→</span>
          </a>

          {/* Secondary In-flow Toggle to see all 3 destinations without any modal */}
          <button
            type="button"
            onClick={() => setShowAllInFlow(!showAllInFlow)}
            className="mt-3 text-[#caa24d]/75 hover:text-[#fff0c7] font-cinzel text-[8.5px] tracking-[0.2em] uppercase transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>{showAllInFlow ? "HIDE ALL LOCATIONS" : "VIEW ALL 3 LOCATIONS"}</span>
            {showAllInFlow ? (
              <ChevronUp className="w-3 h-3 text-[#caa24d]" />
            ) : (
              <ChevronDown className="w-3 h-3 text-[#caa24d]" />
            )}
          </button>
        </div>
      </div>

      {/* =========================================================================
          IN-FLOW VIEW FOR ALL 3 LOCATIONS
          Purely rendered in-flow with ZERO modal or overlay dialogs
         ========================================================================= */}
      {showAllInFlow && (
        <div className="mt-4 pt-4 border-t border-[#caa24d]/25 space-y-3.5 animate-fade-in text-left">
          {destinations.map((dest, idx) => (
            <div
              key={dest.id}
              className={`p-3 rounded-none border transition-colors ${
                dest.id === selectedDest.id
                  ? "bg-[#1f050b]/90 border-[#caa24d]/50"
                  : "bg-[#140205]/80 border-[#caa24d]/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-cinzel text-[9px] tracking-[0.2em] text-[#caa24d] uppercase font-medium">
                  {idx + 1}. {dest.category}
                </span>
                <a
                  href={dest.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10.5px] text-[#caa24d] hover:text-[#fff0c7] font-cinzel tracking-wider"
                >
                  <span>MAPS</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <h4 className="font-cinzel text-xs text-[#fbf6ea] mt-1">
                {dest.title}
              </h4>
              <p className="font-serif italic text-[11px] text-[#caa24d]/85">
                {dest.subtitle}
              </p>
              <p className="text-[11px] text-[#ecd9b8]/80 font-sans mt-0.5">
                {dest.address}
              </p>
              {dest.parkingInfo && (
                <p className="text-[10.5px] text-[#caa24d]/75 font-sans mt-1">
                  <strong>Parking:</strong> {dest.parkingInfo}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

